import { z } from "zod";
import type { ServiceId, WalkInId } from "@/lib/content/services";

export const serviceOptions = [
  "wedding-photography",
  "traditional-videography",
  "candid-photography",
  "cinematic-videography",
  "pre-wedding",
  "post-wedding",
  "functions",
  "album-design",
  "passport",
  "studio-sitting",
  "matching-photos",
  "other",
] as const satisfies readonly (ServiceId | WalkInId | "other")[];

export type ServiceOption = (typeof serviceOptions)[number];

/** Accepts the ways people write Indian mobile numbers and returns +91XXXXXXXXXX, or null. */
export function normaliseIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

// Error messages are keys under Form.errors in the message files.
export const contactSchema = z.object({
  name: z.string({ error: "name" }).trim().min(2, { error: "name" }).max(80, { error: "name" }),
  phone: z.string({ error: "phone" }).transform((value, ctx) => {
    const phone = normaliseIndianMobile(value);
    if (!phone) {
      ctx.addIssue({ code: "custom", message: "phone" });
      return z.NEVER;
    }
    return phone;
  }),
  email: z.preprocess(emptyToUndefined, z.email({ error: "email" }).trim().max(120, { error: "email" }).optional()),
  service: z.enum(serviceOptions, { error: "service" }),
  eventDate: z.preprocess(
    emptyToUndefined,
    z.iso.date({ error: "eventDate" }).optional(),
  ),
  message: z.string({ error: "message" }).trim().min(10, { error: "message" }).max(2000, { error: "message" }),
  website: z.string().max(0, { error: "website" }).default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
