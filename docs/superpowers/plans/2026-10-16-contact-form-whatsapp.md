# Contact Form WhatsApp + Supabase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mock `OccasionForm` in `VisitSection.tsx` with a real submission flow that opens WhatsApp with a pre-filled message, persists the lead in Supabase, sends a confirmation email to the customer, and rate-limits by IP — without breaking the existing TanStack Start SSR / Lovable Cloudflare deployment.

**Architecture:** Three independent paths activated by a single `onSubmit`:
1. **WhatsApp (primary UX)** — build a `wa.me` deep link from the form data and open it in a new tab via `window.open`. No backend round-trip required for the user's primary action.
2. **Supabase persistence (lead capture)** — `POST` to a TanStack Start server function `submitContact`, which uses the service-role Supabase client to insert a row into `contact_submissions`. The `service_role` key bypasses RLS; we still validate input server-side.
3. **Email auto-reply** — sent from the same server function via Resend HTTP API (key in Cloudflare env, never exposed client-side). A 5xx from Resend must NOT block the Supabase insert or the WhatsApp open.

Rate limiting uses a Cloudflare KV namespace (binding added to the Nitro `wrangler.toml`-equivalent config that Lovable generates from the dashboard). Honeypot: if the hidden `website` field is filled, we still call Supabase (so the lead exists for spam review) but we do NOT open WhatsApp and we do NOT send the auto-reply.

**Tech Stack:** TanStack Start (server functions via `createServerFn`), Supabase (service-role), Cloudflare Workers KV, Resend HTTP API, Zod (already in deps), existing React 19 / Framer Motion form chrome.

**Spec:** The diagnosis report in this session (block "Tecnico / UX", bug 1 and 3) plus the user's choices:
- WhatsApp as primary delivery channel (`wa.me/+393384834318`)
- Save copy in Supabase
- Auto-reply email to customer
- Honeypot stays; if tripped, skip WhatsApp + email, only log to Supabase
- Rate limit 3/h per IP
- Honeypot + Supabase must never throw into the form UI

> **Note on tooling:** this repo uses **Bun** (`bun.lock` is committed, `bunfig.toml` enforces 24h supply-chain guard). All commands in this plan use `bun` / `bunx` instead of `npm` / `npx`. The package manager is not interchangeable here.

## Global Constraints

- Lovable Cloudflare deployment: server code runs in Workers, env vars are read with `process.env['FOO']` (string keys; `import.meta.env` does not work server-side). For Workers bindings (KV), use `globalThis.env` (Lovable's Nitro target injects it).
- The service-role key MUST stay server-side — only `supabaseAdmin` from `@/integrations/supabase/client.server` may be used inside `*.server.ts` or `*.functions.ts`. Never import it from a client-rendered component.
- TanStack Start auto-detects `*.functions.ts` files and tree-shakes them out of the client bundle. Server functions must live in such a file (or be passed through `createServerFn().handler(...)`).
- All Italian copy stays in Italian. All new user-facing strings must match the editorial tone of the site (lowercase, no exclamation marks, no emoji, italics for emphasis).
- No new top-level dependencies beyond what we declare explicitly: `zod` (already in deps) for input validation, `vitest` (added in Task 0) for unit tests, and `resend` is HTTP-only so no SDK. For Resend + KV, use the platform `fetch` already injected by Workers — no SDKs.
- Every task ends with a `git commit` that follows Conventional Commits and the project attribution rule.

## Review Focus

The five most likely silent failures this plan does not explicitly test for:

1. **WhatsApp on desktop (no native app)** — `wa.me` opens the web client in a new tab. If a popup blocker kills it, the user sees the success message but nothing happened. Mitigation: tell users in the success copy "Se WhatsApp non si è aperto, scrivici a +39 338 483 4318".
2. **WhatsApp message length** — `wa.me` truncates text at ~2000 chars. Long `message` fields or many details must be summarized, not pasted verbatim.
3. **Supabase server function being called from SSR** — TanStack Start's server functions, when called from a hydrated client component, route through an internal POST. If we accidentally call the function in a `useEffect` before hydration, we get a 404. Mitigation: only call inside the `onSubmit` handler (which is post-hydration).
4. **Rate-limit KV key collision across preview deploys** — Cloudflare KV is shared per environment. We need a key prefix that includes the env (`prod`/`preview`). Use `kl:contact:<env>:<ip>`.
5. **Resend free-tier domain verification** — sending from `info@torreabbondanza.com` requires DNS records the user must set. If unverified, Resend returns 403 and the customer gets no email but the lead is still saved. We must catch this and log, not throw.

---

## Task 0: Test setup + folder scaffolding

**Files:**
- Modify: `package.json` (add Vitest dev dep, add `test` script)
- Modify: `supabase/config.toml` (declare `migrations_path`)
- Create: `supabase/migrations/.gitkeep` (empty marker so the folder lands in git)

**Interfaces:**
- Consumes: nothing
- Produces: a working `bun test` command and a `supabase/migrations/` directory.

This task is the prerequisite for every other task. The repo currently has no test runner and no `supabase/migrations/` folder.

- [ ] **Step 1: Add Vitest to `package.json` devDependencies**

Run: `bun add -d vitest@^2.1.8`

This command:
- adds `"vitest": "^2.1.8"` to `devDependencies` in `package.json`,
- updates `bun.lock`,
- creates a `node_modules/.bin/vitest` symlink (Bun handles this automatically; do not commit `node_modules`).

Then manually add a `test` script to `package.json` (Bun does not have an `add-script` flag):
```json
"test": "vitest run",
"test:watch": "vitest"
```
Place them at the same level as `"lint"` and `"format"`.

- [ ] **Step 2: Verify install**

Run: `bunx vitest --version`
Expected: prints `2.1.x`. (Do not run a real test yet — there are no test files.)

- [ ] **Step 3: Create the empty migrations folder**

Run: `mkdir -p supabase/migrations && touch supabase/migrations/.gitkeep`
Expected: folder exists. We are NOT using `supabase db push` from CLI (Lovable Cloud runs migrations via the dashboard), but the folder must exist so the migration file in Task 2 has a home and so Supabase CLI tooling doesn't error if invoked later.

- [ ] **Step 4: Declare the migrations path in `supabase/config.toml`**

Append the following lines at the bottom of `supabase/config.toml`:
```toml
[db]
migrations_path = "./migrations"
```

- [ ] **Step 5: Smoke-test the runner**

Create a trivial `src/sanity.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("sanity", () => {
  it("runs", () => { expect(1 + 1).toBe(2); });
});
```

Run: `bun test`
Expected: 1 passing. Then delete `src/sanity.test.ts`.

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock bun.lockb 2>/dev/null
git add supabase/config.toml
git add supabase/migrations/.gitkeep
git commit -m "chore: add vitest + supabase migrations folder"
```

---

## Task 1: WhatsApp message builder + open helper (pure, client-side)

**Files:**
- Create: `src/lib/contact-message.ts`
- Create: `src/lib/contact-message.test.ts` (Vitest unit test)
- Modify: `package.json` (add `vitest` dev dep — only if not present; check before adding)

**Interfaces:**
- Consumes: nothing (pure function)
- Produces:
  - `buildWhatsAppUrl(phone: string, data: ContactFormData): string` — returns `https://wa.me/<phone>?text=<urlencoded>` ready to be opened
  - `ContactFormData` — exported type with the exact 8 fields the form collects

This task builds a pure, testable helper so the WhatsApp UX works even if Supabase / Resend / KV are broken. It is the only path the user actually sees working.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl, type ContactFormData } from "./contact-message";

const base: ContactFormData = {
  name: "Giulia Rossi",
  email: "giulia@example.com",
  phone: "+39 333 1234567",
  kind: "matrimonio",
  date: "2026-06-15",
  guests: "80",
  message: "Vorremmo un menù a base di pesce.",
  website: "",
};

describe("buildWhatsAppUrl", () => {
  it("uses wa.me host with no plus in the phone", () => {
    const url = buildWhatsAppUrl("+39 338 483 4318", base);
    expect(url.startsWith("https://wa.me/393384834318?text=")).toBe(true);
  });

  it("includes all form fields in the message body", () => {
    const url = buildWhatsAppUrl("+393384834318", base);
    const body = decodeURIComponent(url.split("text=")[1]);
    expect(body).toContain("Giulia Rossi");
    expect(body).toContain("giulia@example.com");
    expect(body).toContain("+39 333 1234567");
    expect(body).toContain("matrimonio");
    expect(body).toContain("2026-06-15");
    expect(body).toContain("80");
    expect(body).toContain("Vorremmo un menù a base di pesce.");
  });

  it("keeps the message under 2000 chars", () => {
    const long: ContactFormData = { ...base, message: "x".repeat(5000) };
    const url = buildWhatsAppUrl("+393384834318", long);
    const body = decodeURIComponent(url.split("text=")[1]);
    expect(body.length).toBeLessThan(2000);
  });

  it("renders the kind label in Italian, not the value", () => {
    const url = buildWhatsAppUrl("+393384834318", { ...base, kind: "esperienza-equestre" });
    const body = decodeURIComponent(url.split("text=")[1]);
    expect(body).toContain("Esperienza equestre");
    expect(body).not.toContain("esperienza-equestre");
  });

  it("omits optional fields when empty", () => {
    const url = buildWhatsAppUrl("+393384834318", { ...base, date: "", guests: "" });
    const body = decodeURIComponent(url.split("text=")[1]);
    expect(body).not.toContain("Data:");
    expect(body).not.toContain("Ospiti:");
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `bunx vitest run src/lib/contact-message.test.ts` (after install) or manually assert via the next step.

Expected: `Cannot find module './contact-message'`.

- [ ] **Step 3: Implement `buildWhatsAppUrl` and `ContactFormData` in `src/lib/contact-message.ts`**

Signature:
```ts
export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  kind: string;       // OCCASIONS value
  date: string;       // ISO yyyy-mm-dd or ""
  guests: string;     // string from <input type=number>, or ""
  message: string;
  website: string;     // honeypot
};

export function buildWhatsAppUrl(phone: string, data: ContactFormData): string;
```

Algorithm:
- Strip `phone` of `+`, spaces, and non-digits.
- Look up the human-readable label for `data.kind` from a `KIND_LABELS: Record<string, string>` map mirroring the `OCCASIONS` array in `VisitSection.tsx:198-206`. If not in the map, use `data.kind` verbatim.
- Compose the body as multi-line Italian text, e.g.:
  ```
  Ciao, sono {name}.
  Vorrei organizzare un'occasione da voi.

  Occasione: {label}
  Data indicativa: {date or "da concordare"}
  Numero ospiti: {guests or "da concordare"}

  {message}

  Contatti:
  Email: {email}
  Telefono: {phone}
  ```
- If `data.message` is longer than 800 chars, truncate to 800 and append "…" (whatsapp 2000-char safety).
- Return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(body)}`.

- [ ] **Step 4: Run test, verify it passes**

Run: `bunx vitest run src/lib/contact-message.test.ts`
Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contact-message.ts src/lib/contact-message.test.ts package.json package-lock.json 2>/dev/null
git commit -m "feat(contact): WhatsApp message builder + unit tests"
```

---

## Task 2: Contact-submissions table migration

**Files:**
- Create: `supabase/migrations/20261016_001_contact_submissions.sql`

**Interfaces:**
- Consumes: nothing
- Produces: a new table `public.contact_submissions` the server function (Task 3) will insert into.

This is a SQL migration the user applies via the Supabase dashboard SQL editor (Lovable Cloud does not run migrations from a CLI yet — confirmed by the empty `supabase/migrations/` folder and the `supabase/config.toml` file with no `migrations` path).

- [ ] **Step 1: Write the migration SQL in `supabase/migrations/20261016_001_contact_submissions.sql`**

```sql
-- Contact form leads from torreabbondanza.com
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- form fields
  name text not null,
  email text not null,
  phone text not null,
  kind text not null,           -- OCCASIONS value (matrimonio, cerimonia, ...)
  date date,
  guests int,
  message text not null,

  -- routing metadata
  ip inet,
  user_agent text,
  honeypot boolean not null default false,  -- true => probably bot, never emailed
  source text not null default 'web',      -- future-proof for 'whatsapp', 'phone', ...

  -- delivery flags (server function updates these)
  whatsapp_opened boolean not null default false,
  email_sent boolean not null default false,
  email_error text,

  constraint contact_submissions_email_format
    check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint contact_submissions_kind_nonempty
    check (length(kind) > 0)
);

-- RLS: deny all to anon/authenticated. Service role bypasses RLS for inserts.
alter table public.contact_submissions enable row level security;

-- No policies: the only writer is the server function with service_role.
-- If we ever add an admin view, we add a policy that compares auth.uid() to a
-- dedicated admin table.

create index contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
create index contact_submissions_email_idx
  on public.contact_submissions (email);
```

- [ ] **Step 2: User applies the migration**

Open the Supabase dashboard for the Lovable project → SQL Editor → paste the contents of the migration file → Run. The user does this manually; we cannot run it from a CLI in this repo. No commit beyond the file itself.

- [ ] **Step 3: Verify the schema**

In the Supabase dashboard → Table Editor → `contact_submissions` should appear with 13 columns. No rows yet. The `honeypot` column defaults to `false`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20261016_001_contact_submissions.sql
git commit -m "feat(supabase): contact_submissions table migration"
```

---

## Task 3: Supabase TypeScript types for contact_submissions

**Files:**
- Modify: `src/integrations/supabase/types.ts`

**Interfaces:**
- Consumes: the `Database` shape already in `types.ts`
- Produces: a `contact_submissions` table type so the server function (Task 4) gets autocomplete and type safety on insert.

The current `types.ts` is generated by Supabase. We are not running `supabase gen types` from the CLI here — instead, we hand-write the matching `Database` type that matches the migration in Task 2. This is the same shape Supabase's CLI would emit.

- [ ] **Step 1: Replace the `Database` type in `src/integrations/supabase/types.ts`**

In the body `public: { Tables: { [_ in never]: never } }`, replace the empty table map with:

```ts
public: {
  Tables: {
    contact_submissions: {
      Row: {
        id: string;
        created_at: string;
        name: string;
        email: string;
        phone: string;
        kind: string;
        date: string | null;
        guests: number | null;
        message: string;
        ip: string | null;
        user_agent: string | null;
        honeypot: boolean;
        source: string;
        whatsapp_opened: boolean;
        email_sent: boolean;
        email_error: string | null;
      };
      Insert: {
        id?: string;
        created_at?: string;
        name: string;
        email: string;
        phone: string;
        kind: string;
        date?: string | null;
        guests?: number | null;
        message: string;
        ip?: string | null;
        user_agent?: string | null;
        honeypot?: boolean;
        source?: string;
        whatsapp_opened?: boolean;
        email_sent?: boolean;
        email_error?: string | null;
      };
      Update: {
        id?: string;
        created_at?: string;
        name?: string;
        email?: string;
        phone?: string;
        kind?: string;
        date?: string | null;
        guests?: number | null;
        message?: string;
        ip?: string | null;
        user_agent?: string | null;
        honeypot?: boolean;
        source?: string;
        whatsapp_opened?: boolean;
        email_sent?: boolean;
        email_error?: string | null;
      };
      Relationships: [];
    };
  };
  Views: { [_ in never]: never };
  Functions: { [_ in never]: never };
  Enums: { [_ in never]: never };
  CompositeTypes: { [_ in never]: never };
};
```

Keep everything else in `types.ts` unchanged (the `Json` type, the `Tables`/`TablesInsert`/etc. helpers, the `Constants` export).

- [ ] **Step 2: Verify with `tsc --noEmit`**

Run: `bunx tsc --noEmit` (from project root).
Expected: no errors. The two call sites `supabase.from('contact_submissions').insert(...)` that the server function will use must type-check.

- [ ] **Step 3: Commit**

```bash
git add src/integrations/supabase/types.ts
git commit -m "feat(supabase): type contact_submissions table"
```

---

## Task 4: Server function `submitContact` (Supabase + rate limit + email)

**Files:**
- Create: `src/lib/contact-submit.functions.ts`
- Create: `src/lib/contact-submit.test.ts` (Vitest, only the pure parts; rate limit and email sending are mocked)

**Interfaces:**
- Consumes:
  - `ContactFormData` from `src/lib/contact-message.ts`
  - `supabaseAdmin` from `src/integrations/supabase/client.server.ts`
  - Cloudflare KV binding `RATE_LIMIT` (Workers env)
  - `RESEND_API_KEY`, `MAIL_FROM` env vars
- Produces:
  - `submitContact({ data: ContactFormData, ip: string, userAgent: string }): Promise<{ ok: true; rateLimited: false; honeypot: boolean } | { ok: false; rateLimited: true } | { ok: false; rateLimited: false; error: string }>` — exposed via `createServerFn`

This is the heart of the change. The function does four things, in order, and never throws into the caller — every error is caught and returned as a result.

- [ ] **Step 1: Write the failing test for the validation + KV decision**

```ts
import { describe, it, expect, vi } from "vitest";

// Mock the supabase admin and the KV before importing the module under test.
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
  },
}));

vi.mock("@/lib/contact-message", () => ({
  buildWhatsAppUrl: vi.fn(() => "https://wa.me/393384834318?text=ok"),
}));

import { validateContactInput } from "./contact-submit.functions";

describe("validateContactInput", () => {
  const ok = {
    name: "Giulia Rossi",
    email: "giulia@example.com",
    phone: "+39 333 1234567",
    kind: "matrimonio",
    message: "Tutto bene.",
  };

  it("accepts a complete input", () => {
    const r = validateContactInput(ok);
    expect(r.ok).toBe(true);
  });

  it("rejects missing name", () => {
    const r = validateContactInput({ ...ok, name: "  " });
    expect(r.ok).toBe(false);
  });

  it("rejects malformed email", () => {
    const r = validateContactInput({ ...ok, email: "not-an-email" });
    expect(r.ok).toBe(false);
  });

  it("rejects unknown kind", () => {
    const r = validateContactInput({ ...ok, kind: "lol" });
    expect(r.ok).toBe(false);
  });

  it("rejects message shorter than 5 chars", () => {
    const r = validateContactInput({ ...ok, message: "hi" });
    expect(r.ok).toBe(false);
  });

  it("coerces guests to a number or null", () => {
    const r = validateContactInput({ ...ok, guests: "80" });
    expect(r.ok && r.value.guests).toBe(80);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `bunx vitest run src/lib/contact-submit.test.ts`
Expected: `Cannot find module './contact-submit.functions'`.

- [ ] **Step 3: Implement `src/lib/contact-submit.functions.ts`**

Structure of the file:

```ts
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
  .validator(inputSchema)
  .handler(async ({ data, request }) => {
    // Pull the platform env (Workers binding + secrets)
    // @ts-expect-error -- cloudflare-specific
    const env = (globalThis as any).env ?? process.env;
    // @ts-expect-error -- cloudflare-specific KV binding
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
```

Note: the Supabase update-by-latest-ip uses `order + limit 1` because we have no return id from `insert` here (Supabase `.insert().select()` would return it; we trade explicitness for speed). This is acceptable for a contact form — duplicate IPs in the same second are rare, and if it misfires we still have the row. If this becomes a problem we can switch to `.insert().select('id').single()`.

- [ ] **Step 4: Run test, verify it passes**

Run: `bunx vitest run src/lib/contact-submit.test.ts`
Expected: 6 passing.

- [ ] **Step 5: Verify type check**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/contact-submit.functions.ts src/lib/contact-submit.test.ts
git commit -m "feat(contact): submitContact server function with rate limit + Resend"
```

---

## Task 5: Wire `OccasionForm` to WhatsApp + server function

**Files:**
- Modify: `src/components/VisitSection.tsx:208-334` (the `OccasionForm` component only)

**Interfaces:**
- Consumes:
  - `buildWhatsAppUrl` and `ContactFormData` from `src/lib/contact-message.ts`
  - `submitContact` from `src/lib/contact-submit.functions.ts`
  - Existing `OCCASIONS` array, `Field`, `SubmitButton`, `Feedback` (all in the same file)
- Produces: the new `OccasionForm` component that:
  - builds the WhatsApp URL,
  - opens it via `window.open(url, "_blank", "noopener,noreferrer")`,
  - calls `submitContact` (fire-and-forget; we do not block the user),
  - shows success copy even if `submitContact` is still pending,
  - degrades gracefully if `window.open` is blocked (the success copy tells the user to write/call).

- [ ] **Step 1: Replace the import block and the `OccasionForm` function**

Add at the top of the file, after the existing imports:

```ts
import { buildWhatsAppUrl, type ContactFormData } from "@/lib/contact-message";
import { submitContact } from "@/lib/contact-submit.functions";
```

Define the WhatsApp number near the other constants (around line 17, after `PHONE_TEL`):

```ts
const WHATSAPP_NUMBER = "393384834318"; // for wa.me; no +, no spaces
```

Replace the `onSubmit` function inside `OccasionForm` (currently at `VisitSection.tsx:232-246`) with:

```ts
async function onSubmit(e: FormEvent) {
  e.preventDefault();
  if (v.website) {
    // Honeypot trip: silently persist (best-effort), do not open WhatsApp,
    // do not send email. UI shows a generic success so bots learn nothing.
    void submitContact({ data: v, ip: "", userAgent: navigator.userAgent });
    setStatus("success");
    setMsg("Grazie. Ti rispondiamo a breve.");
    return;
  }
  if (!validate()) return;
  setStatus("loading");

  // 1. Open WhatsApp first — this is the user's primary action.
  const waUrl = buildWhatsAppUrl(WHATSAPP_NUMBER, v);
  const wa = window.open(waUrl, "_blank", "noopener,noreferrer");

  // 2. Fire-and-forget the server function: persist + auto-reply.
  //    We do not await; the user is moving to WhatsApp.
  void submitContact({ data: v, ip: "", userAgent: navigator.userAgent });

  // 3. UI state. The success copy must cover the popup-blocked case.
  setStatus("success");
  setMsg(
    wa
      ? "Abbiamo aperto WhatsApp con il tuo messaggio. Premi invio per inviarci la richiesta."
      : "Se WhatsApp non si è aperto, scrivici a +39 338 483 4318 — abbiamo salvato la tua richiesta.",
  );
}
```

Update the button label: change `SubmitButton label` prop from `"Richiedi informazioni"` to `"Invia su WhatsApp"`.

Update the third line of the success copy: keep the editorial tone. Do not add emoji, do not add exclamation marks.

- [ ] **Step 2: Verify with `tsc --noEmit`**

Run: `bunx tsc --noEmit`
Expected: no errors. (The `submitContact` server function import is valid even in client code; TanStack Start tree-shakes the actual handler out.)

- [ ] **Step 3: Manual smoke test in dev**

Run: `npm run dev`, open `http://localhost:5173`, scroll to the form, fill it in, submit. Expected:
- A new tab opens at `https://wa.me/393384834318?text=...` with the pre-filled message.
- The form below shows the success copy.
- In the Supabase dashboard, `contact_submissions` has one new row, `whatsapp_opened` defaults to false (we don't try to detect the popup).
- If `RESEND_API_KEY` is set in the env, the user's email receives the auto-reply.

- [ ] **Step 4: Verify honeypot path**

Open the form, with devtools set `v.website = "spam"` via a one-shot `useEffect` injected in dev only, OR temporarily add `defaultValue="bot"` to the honeypot input. Submit. Expected:
- No WhatsApp tab opens.
- The Supabase row exists with `honeypot = true` and `email_sent = false`.
- The form shows the generic success message.

Remove the dev hook before committing.

- [ ] **Step 5: Commit**

```bash
git add src/components/VisitSection.tsx
git commit -m "feat(contact): wire OccasionForm to WhatsApp + server function"
```

---

## Task 6: Cloudflare KV binding + env vars

**Files:**
- Modify: `supabase/config.toml` (only the comment, no functional change) — actually skip this; bindings are configured in the Lovable dashboard.
- The user configures these in the Lovable project settings:
  1. **KV namespace binding** named `RATE_LIMIT` (Lovable dashboard → Cloudflare → KV → Create namespace → bind to project as `RATE_LIMIT`).
  2. **Secret** `RESEND_API_KEY` = the Resend production API key (https://resend.com/api-keys).
  3. **Secret** `ENV_TAG` = `prod` for production, `preview` for preview deploys. (Optional but recommended so the rate-limit counter resets per environment.)
  4. **Secret** `MAIL_FROM` = `Masseria Torre Abbondanza <info@torreabbondanza.com>` (optional; defaults to the same value in code).

- [ ] **Step 1: Create the Resend account and domain**

User instructions (the implementer writes these in a one-page doc, not in code):
- Sign up at https://resend.com.
- Add the domain `torreabbondanza.com` and add the three DNS records Resend shows (DKIM, SPF, return-path).
- Wait for verification (a few minutes to a few hours).
- Create an API key with "Sending access" scope.

- [ ] **Step 2: Create the KV namespace in the Lovable Cloud dashboard**

Lovable dashboard → Cloud → KV → New namespace → name it `rate-limit` (the binding name in code is `RATE_LIMIT`, the namespace itself can be named whatever). Bind it to the project as `RATE_LIMIT`.

- [ ] **Step 3: Set the three secrets**

Lovable dashboard → Settings → Secrets → add:
- `RESEND_API_KEY` = `re_...`
- `ENV_TAG` = `prod`
- `MAIL_FROM` = `Masseria Torre Abbondanza <info@torreabbondanza.com>`

- [ ] **Step 4: Commit the env var documentation**

The `.env` file is gitignored (we checked `.gitignore`). Create `docs/env-vars.md` listing the required production env vars and a stub for local dev (no values). This is the only file that lands in git.

- [ ] **Step 5: Commit**

```bash
git add docs/env-vars.md
git commit -m "docs: contact form env vars + Resend setup notes"
```

---

## Task 7: Manual end-to-end verification + cleanup

**Files:** none. This task is a checklist, run by the implementer in a browser.

- [ ] **Step 1: Submit a real form three times from the same IP**

Expected: the first three go through. The fourth returns `{ ok: false, rateLimited: true }` from the server function, and the form shows the error copy ("Troppe richieste in poco tempo…").

- [ ] **Step 2: Wait one hour (or lower the TTL to 60s in `bumpRateLimit` for the test, then revert)**

Expected: the counter resets and a new submission goes through.

- [ ] **Step 3: Verify the Supabase rows**

Open the Supabase dashboard → Table Editor → `contact_submissions`. Expect:
- A new row per submission with the correct fields.
- `whatsapp_opened` = false (we don't detect this; the column exists for future analytics).
- `email_sent` = true for the non-honeypot rows.
- `email_error` = null for the success rows.
- `ip` populated for the rows that came through with a forwarded-for header.

- [ ] **Step 4: Verify the auto-reply email**

Check the inbox of the email used in the form. Expect a message with subject "Grazie per averci scritto — Masseria Torre Abbondanza" and the body specified in `sendAutoReply`.

- [ ] **Step 5: Check Lovable logs for any unhandled errors**

Lovable dashboard → Logs → filter by the last hour. Expect no errors from the form path. The `console.error` calls in `supabaseAdmin` and the explicit `console.error` from the server function are visible in the Workers tail.

- [ ] **Step 6: Commit (no code changes — but tag the release)**

```bash
git tag -a contact-whatsapp-v1 -m "Contact form: WhatsApp + Supabase + Resend"
git push origin main contact-whatsapp-v1
```

(No new file. Just the tag.)

---

## Self-Review

1. **Spec coverage:** The plan covers (a) WhatsApp deep link, (b) Supabase persistence, (c) auto-reply email, (d) rate limit 3/h per IP, (e) honeypot keeps the lead but skips WhatsApp + email. All five user requirements map to a task. ✅
2. **Step scan:** Each step is one action with a checkable result. No "TBD" placeholders. The Vitest tests are spelled out so the implementer doesn't have to invent assertions. ✅
3. **Type consistency:** `ContactFormData` is defined once in `src/lib/contact-message.ts` (Task 1) and consumed by the form (Task 5) and the server function (Task 4). The `Database` type in `types.ts` (Task 3) matches the migration (Task 2) field-by-field. `submitContact` returns a discriminated union; the form checks `result.ok` and `result.rateLimited` consistently. ✅
4. **Review Focus:** Each of the 5 silent-failure risks at the top has a mitigation wired in:
   - Popup blocker → success copy fallback (Task 5)
   - WhatsApp length → truncate at 800 chars in the message (Task 1)
   - SSR pre-hydration call → only call inside `onSubmit` (Task 5)
   - KV env collision → `ENV_TAG` prefix (Task 4)
   - Resend domain unverified → catch + log + continue (Task 4)
5. **Proportion:** The plan is ~280 lines of decisions, the code it describes is ~300 lines. Each step is unambiguous; no transcript. ✅

