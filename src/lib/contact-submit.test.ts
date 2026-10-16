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
