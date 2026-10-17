import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { serviceOptions } from "@/lib/validations/contact";

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const ts = await getTranslations("Services.items");
  const tw = await getTranslations("WalkIn.items");
  const tf = await getTranslations("Form");
  const serviceLabels = Object.fromEntries(
    serviceOptions.map((s) => [
      s,
      s === "other" ? tf("other") : ts.has(`${s}.title` as never) ? ts(`${s}.title` as never) : tw(`${s}.title` as never),
    ]),
  ) as Record<(typeof serviceOptions)[number], string>;

  return (
    <>
      <Container size="wide" className="pb-12 pt-32 md:pt-44">
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      </Container>

      <Container size="wide" className="grid gap-16 pb-8 lg:grid-cols-12">
        <section aria-labelledby="enquiry-form" className="lg:col-span-7">
          <h2 id="enquiry-form" className="text-3xl font-light md:text-4xl">
            {t("formTitle")}
          </h2>
          <div className="mt-8">
            <ContactForm serviceLabels={serviceLabels} />
          </div>
        </section>
        <section aria-labelledby="studio-details" className="lg:col-span-4 lg:col-start-9">
          <h2 id="studio-details" className="text-3xl font-light md:text-4xl">
            {t("detailsTitle")}
          </h2>
          <div className="mt-6">
            <ContactDetails />
          </div>
        </section>
      </Container>

      <Container size="wide" className="py-16">
        <MapEmbed />
      </Container>
    </>
  );
}
