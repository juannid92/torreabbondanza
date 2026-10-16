import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { ContactFormData } from "@/lib/contact-message";

const VALID_KINDS = new Set([
  "matrimonio", "cerimonia", "battesimo", "compleanno",
  "festa-privata", "esperienza-equestre", "altro",
]);

export type ValidatedInput = Omit<ContactFormData, "website" | "guests" | "date"> & {
  date: string | null;
  guests: number | null;
};

/** Pure validation. Exported for tests. */
export function validateContactInput(
  raw: Partial<ContactFormData>
): { ok: true; value: ValidatedInput } | { ok: false; reason: string } {
  if (!raw.name || raw.name.trim().length < 2) return { ok: false, reason: "name" };
  if (!raw.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw.email))
    return { ok: false, reason: "email" };
  if (!raw.phone || raw.phone.replace(/\D/g, "").length < 6)
    return { ok: false, reason: "phone" };
  if (!raw.kind || !VALID_KINDS.has(raw.kind))
    return { ok: false, reason: "kind" };
  if (!raw.message || raw.message.trim().length < 5)
    return { ok: false, reason: "message" };
  return {
    ok: true,
    value: {
      name: raw.name.trim(),
      email: raw.email.trim(),
      phone: raw.phone.trim(),
      kind: raw.kind,
      date: raw.date && raw.date !== "" ? raw.date : null,
      guests: raw.guests && raw.guests !== "" ? Number(raw.guests) : null,
      message: raw.message.trim(),
    },
  };
}

/** Increments a sliding-window counter in Cloudflare KV. */
async function bumpRateLimit(
  kv: KVNamespace | undefined,
  ip: string,
  envTag: string
): Promise<{ allowed: boolean; remaining: number }> {
  if (!kv) return { allowed: true, remaining: 999 };
  const key = `kl:contact:${envTag}:${ip}`;
  const current = Number((await kv.get(key)) ?? "0");
  if (current >= 3) return { allowed: false, remaining: 0 };
  // 1-hour TTL window. The window is "any 1 hour" not "current hour", which is
  // good enough for the threat model (spam, not coordinated abuse).
  await kv.put(key, String(current + 1), { expirationTtl: 3600 });
  return { allowed: true, remaining: 2 - current };
}

async function sendAutoReply(
  env: Record<string, string | undefined>,
  data: ValidatedInput
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = env["RESEND_API_KEY"];
  const from = env["MAIL_FROM"] ?? "Masseria Torre Abbondanza <info@torreabbondanza.com>";
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not set" };

  const subject = "Grazie per averci scritto — Masseria Torre Abbondanza";
  const text = [
    `Ciao ${data.name.split(" ")[0]},`,
    "",
    "abbiamo ricevuto la tua richiesta. Ti rispondiamo entro 24 ore con una proposta.",
    "",
    "Se preferisci parlarci subito: +39 338 483 4318 (WhatsApp).",
    "",
    "— Masseria Torre Abbondanza",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: data.email,
        subject,
        text,
        reply_to: "info@torreabbondanza.com",
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

const inputSchema = z.object({
  data: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    kind: z.string(),
    date: z.string().optional().default(""),
    guests: z.string().optional().default(""),
    message: z.string(),
    website: z.string().optional().default(""),
  }),
  ip: z.string().optional().default(""),
  userAgent: z.string().optional().default(""),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator(inputSchema)
  .handler(async ({ data, request }: { data: z.infer<typeof inputSchema>; request?: Request }) => {
    // Pull the platform env (Workers binding + secrets)
    // cloudflare-specific: globalThis.env cast, process.env fallback is intentional for dual runtime
    const env = (globalThis as any).env ?? process.env;
    // cloudflare-specific KV binding
    const kv: KVNamespace | undefined = env["RATE_LIMIT"];

    const envTag = env["ENV_TAG"] ?? "prod";
    const ip = data.ip || (request?.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "0.0.0.0";

    // 1. Rate limit FIRST so honeypot traffic can't burn Supabase writes.
    const rl = await bumpRateLimit(kv, ip, envTag);
    if (!rl.allowed) {
      return { ok: false as const, rateLimited: true as const };
    }

    // 2. Validate
    const v = validateContactInput(data.data);
    if (!v.ok) return { ok: false as const, rateLimited: false as const, error: v.reason };

    const honeypot = Boolean(data.data.website);

    // 3. Persist (always — honeypot traffic is logged for review)
    const { error: sbError } = await supabaseAdmin.from("contact_submissions").insert({
      name: v.value.name,
      email: v.value.email,
      phone: v.value.phone,
      kind: v.value.kind,
      date: v.value.date,
      guests: v.value.guests,
      message: v.value.message,
      ip: ip || null,
      user_agent: data.userAgent || null,
      honeypot,
      source: "web",
    });
    if (sbError) {
      return { ok: false as const, rateLimited: false as const, error: "persist" };
    }

    // 4. Auto-reply (only if not honeypot). We do NOT await the WhatsApp open
    //    — that happens client-side in Task 5.
    let emailError: string | null = null;
    let emailSent = false;
    if (!honeypot) {
      const r = await sendAutoReply(env, v.value);
      emailSent = r.ok;
      emailError = r.error ?? null;
    }
    // Update the row to reflect email outcome (best-effort, ignore errors)
    await supabaseAdmin
      .from("contact_submissions")
      .update({ email_sent: emailSent, email_error: emailError })
      .eq("ip", ip)
      .order("created_at", { ascending: false })
      .limit(1);

    return {
      ok: true as const,
      rateLimited: false as const,
      honeypot,
    };
  });
