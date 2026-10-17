import "server-only";
import { Resend } from "resend";
import { adminEmailHtml, customerEmailHtml } from "./email-templates";
import type { Enquiry } from "./enquiry";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL);
}

// Without a verified domain Resend only sends from onboarding@resend.dev to the account owner.
const fallbackFrom = "Kalamkrutha Website <onboarding@resend.dev>";

export async function sendAdminEmail(e: Enquiry): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || fallbackFrom,
    to: process.env.ADMIN_EMAIL!,
    replyTo: e.email,
    subject: `New enquiry: ${e.name} – ${e.serviceLabel}`,
    html: adminEmailHtml(e),
  });
  if (error) throw new Error(`Resend admin email failed: ${error.message}`);
}

/** Only with a sender on a verified domain; failures here never fail the enquiry. */
export async function sendCustomerEmail(e: Enquiry): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from || !e.email) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from,
    to: e.email,
    subject: "Thank you, your message has been received – Kalamkrutha Digital Studio",
    html: customerEmailHtml(e),
  });
  if (error) console.error("Resend customer email failed:", error.message);
}
