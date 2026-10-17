"use server";

import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import te from "@/messages/te.json";
import type { Enquiry } from "@/lib/server/enquiry";
import { emailConfigured, sendAdminEmail, sendCustomerEmail } from "@/lib/server/notify-email";
import { sendWhatsAppAlert, whatsappApiConfigured } from "@/lib/server/notify-whatsapp";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { contactSchema, type ServiceOption } from "@/lib/validations/contact";
import { whatsappUrl } from "@/lib/whatsapp";

export type ContactResult =
  | { status: "ok" }
  | { status: "invalid"; fieldErrors: Record<string, string> }
  | { status: "rate-limited" }
  | { status: "captcha-failed" }
  | { status: "no-channel"; whatsappUrl: string }
  | { status: "error"; whatsappUrl: string };

const FIELDS = ["name", "phone", "email", "service", "eventDate", "message", "website"] as const;

const messages = { en, te, hi };

function serviceLabel(service: ServiceOption, locale: Locale): string {
  const m = messages[locale];
  if (service === "other") return m.Form.other;
  if (service in m.Services.items) return m.Services.items[service as keyof typeof m.Services.items].title;
  return m.WalkIn.items[service as keyof typeof m.WalkIn.items].title;
}

function prefilledWhatsApp(e: Enquiry): string {
  return whatsappUrl(
    [`Hi Kalamkrutha Digital Studio, I am ${e.name} (${e.phone}).`, `Service: ${e.serviceLabel}`, e.eventDate ? `Date: ${e.eventDate}` : "", e.message]
      .filter(Boolean)
      .join("\n"),
  );
}

export async function submitContact(_prev: ContactResult | null, formData: FormData): Promise<ContactResult> {
  const raw = Object.fromEntries(FIELDS.map((f) => [f, String(formData.get(f) ?? "")]));
  const localeRaw = String(formData.get("locale") ?? "");
  const locale = hasLocale(routing.locales, localeRaw) ? localeRaw : routing.defaultLocale;

  // Bots that fill the hidden field get a normal-looking success and nothing is sent.
  if (raw.website) return { status: "ok" };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 }).allowed) return { status: "rate-limited" };

  if (!(await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "captcha-failed" };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "invalid", fieldErrors };
  }

  const enquiry: Enquiry = { ...parsed.data, serviceLabel: serviceLabel(parsed.data.service, locale) };
  const fallback = prefilledWhatsApp(enquiry);

  const sends: Promise<void>[] = [];
  if (emailConfigured()) sends.push(sendAdminEmail(enquiry));
  if (whatsappApiConfigured()) sends.push(sendWhatsAppAlert(enquiry));
  if (sends.length === 0) return { status: "no-channel", whatsappUrl: fallback };

  const results = await Promise.allSettled(sends);
  for (const r of results) if (r.status === "rejected") console.error("Enquiry notification failed:", r.reason);
  if (!results.some((r) => r.status === "fulfilled")) return { status: "error", whatsappUrl: fallback };

  if (emailConfigured()) await sendCustomerEmail(enquiry).catch((err) => console.error(err));
  return { status: "ok" };
}
