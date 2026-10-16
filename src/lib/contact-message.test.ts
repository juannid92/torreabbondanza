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
    expect(body).toContain("Matrimonio");
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
