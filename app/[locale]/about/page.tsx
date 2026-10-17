import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";

export function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  return pageMetadata(params, "about", "/about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const paragraphs = t.raw("storyBody") as string[];

  const tnav = await getTranslations("Nav");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tnav("home"), path: "/" },
          { name: tnav("about"), path: "/about" },
        ])}
      />
      <Container size="wide" className="pb-16 pt-32 md:pt-44">
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      </Container>

      <section aria-labelledby="what-we-do" className="pb-20 md:pb-28">
        <Container size="wide" className="grid gap-12 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-6">
            <Photo id="svcTraditionalVideo" eager className="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 100vw" />
          </Reveal>
          <div className="md:col-span-5 md:col-start-8">
            <h2 id="what-we-do" className="text-4xl font-light md:text-5xl">
              {t("storyTitle")}
            </h2>
            <div className="mt-6 space-y-4 text-lg text-muted">
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6">
              <span className="block text-xs uppercase tracking-[0.22em] text-muted">{t("paymentsTitle")}</span>
              {t("payments")}
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="visit" className="border-t border-line py-20 md:py-28">
        <Container size="wide" className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 id="visit" className="text-4xl font-light md:text-5xl">
              {t("visitTitle")}
            </h2>
            <div className="mt-8">
              <ContactDetails />
            </div>
          </div>
          <MapEmbed />
        </Container>
      </section>

      <EnquiryCta />
    </>
  );
}
