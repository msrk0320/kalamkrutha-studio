import type { Locale } from "@/i18n/locales";
import { pricing } from "@/lib/content/services";

const rupees = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

// Rupee amounts use Western digits with Indian grouping in every locale, as on the studio's posters.
export function formatPrice(amount: number, _locale: Locale): string {
  return `₹${rupees.format(amount)}`;
}

export function priceLabel(amount: number | undefined, locale: Locale): string | null {
  if (!pricing.showPrices || amount === undefined) return null;
  return formatPrice(amount, locale);
}
