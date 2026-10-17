import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { WalkInTable } from "@/components/sections/WalkInTable";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { services, walkInImages } from "@/lib/content/services";

export function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  return pageMetadata(params, "services", "/services");
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Services");
  const tw = await getTranslations("WalkIn");

  const tnav = await getTranslations("Nav");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tnav("home"), path: "/" },
          { name: tnav("services"), path: "/services" },
        ])}
      />
      <JsonLd data={services.map((s) => serviceJsonLd(s, t(`items.${s.id}.title`), locale))} />
      <Container size="wide" className="pb-16 pt-32 md:pt-44">
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
        <p className="mt-6 font-display text-2xl italic text-maroon">{t("functionsNote")}</p>
      </Container>

      {services.map((service, i) => (
        <ServiceDetail key={service.id} service={service} flip={i % 2 === 1} />
      ))}

      <section id="walk-in" aria-labelledby="walk-in-title" className="scroll-mt-24 bg-paper-deep py-16 md:py-24">
        <Container size="wide" className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>{tw("eyebrow")}</Eyebrow>
            <h2 id="walk-in-title" className="mt-4 text-4xl font-light md:text-5xl">
              {tw("title")}
            </h2>
            <p className="mt-5 text-lg text-muted">{tw("intro")}</p>
            <p className="mt-2 text-muted">{tw("extras")}</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {walkInImages.map((id) => (
                <Photo key={id} id={id} className="aspect-square" sizes="(min-width: 768px) 20vw, 50vw" />
              ))}
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <WalkInTable />
          </div>
        </Container>
      </section>

      <EnquiryCta />
    </>
  );
}
