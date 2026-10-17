import { getTranslations } from "next-intl/server";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { business } from "@/lib/content/business";
import { whatsappUrl } from "@/lib/whatsapp";

export async function EnquiryCta({
  titleKey = "ctaTitle",
  bodyKey = "ctaBody",
}: {
  titleKey?: "ctaTitle";
  bodyKey?: "ctaBody";
}) {
  const t = await getTranslations("Home");
  const tc = await getTranslations("Common");

  return (
    <section aria-labelledby="cta-heading" className="border-t border-line py-20 md:py-28">
      <Container className="text-center">
        <Eyebrow>{t("ctaEyebrow")}</Eyebrow>
        <h2 id="cta-heading" className="mx-auto mt-4 max-w-3xl text-4xl font-light md:text-6xl">
          {t(titleKey)}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">{t(bodyKey)}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl(tc("whatsappMessage"))}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp", "lg", "max-sm:hidden")}
          >
            <WhatsAppIcon /> {tc("whatsappUs")}
          </a>
          <a href={`tel:${business.phoneE164}`} className={buttonClasses("outline", "lg")}>
            <PhoneIcon /> {business.phoneDisplay}
          </a>
          <Link href="/contact" className={buttonClasses("ghost", "lg")}>
            {t("ctaForm")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
