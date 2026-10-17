import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { walkIn } from "@/lib/content/services";
import { priceLabel } from "@/lib/format";

export async function WalkInTable() {
  const t = await getTranslations("WalkIn");
  const tc = await getTranslations("Common");
  const locale = (await getLocale()) as Locale;

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{t("title")}</caption>
      <thead>
        <tr className="border-b border-ink/30 text-xs uppercase tracking-[0.22em] text-muted">
          <th scope="col" className="py-3 font-medium">
            {t("service")}
          </th>
          <th scope="col" className="py-3 text-right font-medium">
            {t("price")}
          </th>
        </tr>
      </thead>
      <tbody>
        {walkIn.map((item) => (
          <tr key={item.id} className="border-b border-line">
            <th scope="row" className="py-4 pr-4 font-normal">
              <span className="block text-lg">{t(`items.${item.id}.title`)}</span>
              <span className="block text-sm text-muted">{t(`items.${item.id}.detail`)}</span>
            </th>
            <td className="py-4 text-right font-display text-2xl">{priceLabel(item.price, locale) ?? tc("askOnWhatsapp")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
