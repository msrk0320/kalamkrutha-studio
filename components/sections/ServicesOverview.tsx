import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { services } from "@/lib/content/services";
import { priceLabel } from "@/lib/format";

export async function ServicesOverview() {
  const t = await getTranslations("Home");
  const ts = await getTranslations("Services.items");
  const tc = await getTranslations("Common");
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-labelledby="services-heading" className="border-t border-line py-20 md:py-32">
      <Container size="wide">
        <SectionHeading id="services-heading" eyebrow={t("servicesEyebrow")} title={t("servicesTitle")} intro={t("servicesIntro")} />
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-20 md:gap-x-6 lg:grid-cols-4">
          {services.map((s, i) => {
            const price = priceLabel(s.priceFrom, locale);
            return (
              <li key={s.id}>
                <Reveal delay={(i % 4) * 0.08}>
                  <Link href={`/services#${s.id}`} className="group block">
                    <Photo
                      id={s.image}
                      className="aspect-[4/5]"
                      imgClassName="group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                    <h3 className="mt-4 text-2xl leading-tight md:text-[1.7rem]">{ts(`${s.id}.title`)}</h3>
                    {price && <p className="mt-1 text-sm text-muted">{tc("from", { price })}</p>}
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="mt-14">
          <Link href="/services" className={buttonClasses("outline", "lg")}>
            {tc("allServices")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
