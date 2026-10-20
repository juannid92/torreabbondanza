export type ContactFormData = {
  name: string;
  phone: string;
  kind: string;
  date: string;
  guests: string;
  message: string;
  website: string;
};

// Mirrors OCCASIONS in src/components/VisitSection.tsx — kept here so the
// builder is self-contained and testable without pulling in the form.
const KIND_LABELS: Record<string, string> = {
  matrimonio: "Matrimonio",
  cerimonia: "Cerimonia",
  battesimo: "Battesimo",
  compleanno: "Compleanno",
  "festa-privata": "Festa privata",
  "esperienza-equestre": "Esperienza equestre",
  altro: "Altro",
};

const MAX_MESSAGE_CHARS = 800;

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function labelFor(kind: string): string {
  return KIND_LABELS[kind] ?? kind;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}

export function buildWhatsAppUrl(phone: string, data: ContactFormData): string {
  const lines: string[] = [];

  lines.push(`Ciao, sono ${data.name}.`);
  lines.push("Vorrei organizzare un'occasione da voi.");
  lines.push("");

  const kindLabel = labelFor(data.kind);
  lines.push(`Occasione: ${kindLabel}`);

  if (data.date) {
    lines.push(`Data indicativa: ${data.date}`);
  }

  if (data.guests) {
    lines.push(`Numero ospiti: ${data.guests}`);
  }

  lines.push("");

  const trimmedMessage = data.message.trim();
  if (trimmedMessage) {
    lines.push(truncate(trimmedMessage, MAX_MESSAGE_CHARS));
    lines.push("");
  }

  lines.push("Contatti:");
  lines.push(`Telefono: ${data.phone}`);

  const body = lines.join("\n");
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(body)}`;
}
