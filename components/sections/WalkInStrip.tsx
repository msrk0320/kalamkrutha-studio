import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { walkIn } from "@/lib/content/services";
import { priceLabel } from "@/lib/format";

/** Quiet band for the everyday counter services, kept visually below the wedding work. */
export async function WalkInStrip() {
  const t = await getTranslations("WalkIn");
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-labelledby="walkin-heading" className="bg-paper-deep py-16 md:py-20">
      <Container size="wide" className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 id="walkin-heading" className="mt-3 text-3xl md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted">{t("intro")}</p>
          <p className="mt-2 text-muted">{t("extras")}</p>
          <Link
            href="/services#walk-in"
            className="mt-6 inline-flex min-h-11 items-center text-sm uppercase tracking-[0.2em] text-maroon underline-offset-4 hover:underline"
          >
            {t("eyebrow")} →
          </Link>
        </div>
        <dl className="divide-y divide-line border-y border-line">
          {walkIn.map((item) => {
            const price = priceLabel(item.price, locale);
            return (
              <div key={item.id} className="flex items-baseline justify-between gap-4 py-3.5">
                <dt>
                  <span className="block">{t(`items.${item.id}.title`)}</span>
                  <span className="block text-sm text-muted">{t(`items.${item.id}.detail`)}</span>
                </dt>
                <dd className="shrink-0 font-display text-2xl">{price ?? "—"}</dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
