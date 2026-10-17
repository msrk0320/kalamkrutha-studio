import "server-only";
import { enquiryLines, type Enquiry } from "./enquiry";

export function whatsappApiConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.ADMIN_WHATSAPP_NUMBER,
  );
}

export function whatsappAlertText(e: Enquiry): string {
  return `New Inquiry\n\n${enquiryLines(e)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")}`;
}

export async function sendWhatsAppAlert(e: Enquiry): Promise<void> {
  const res = await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: process.env.ADMIN_WHATSAPP_NUMBER,
      type: "text",
      text: { preview_url: false, body: whatsappAlertText(e) },
    }),
  });
  if (!res.ok) throw new Error(`WhatsApp alert failed: HTTP ${res.status}`);
}
