import { business } from "@/lib/content/business";

export function whatsappUrl(text: string): string {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
}
