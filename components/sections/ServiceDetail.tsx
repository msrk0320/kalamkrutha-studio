import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";
import type { Locale } from "@/i18n/routing";
import type { Service } from "@/lib/content/services";
import { priceLabel } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

export async function ServiceDetail({ service, flip }: { service: Service; flip: boolean }) {
  const t = await getTranslations("Services");
  const tc = await getTranslations("Common");
  const locale = (await getLocale()) as Locale;
  const title = t(`items.${service.id}.title`);
  const includes = t.raw(`items.${service.id}.includes`) as string[];
  const price = priceLabel(service.priceFrom, locale);

  return (
    <section id={service.id} aria-labelledby={`${service.id}-title`} className="scroll-mt-24 border-t border-line py-16 md:py-24">
      <Container size="wide" className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
        <Reveal className={`md:col-span-6 ${flip ? "md:order-2 md:col-start-7" : ""}`}>
          <Photo id={service.image} className="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 100vw" />
        </Reveal>
        <div className={`md:col-span-5 ${flip ? "md:order-1" : "md:col-start-8"}`}>
          <h2 id={`${service.id}-title`} className="text-4xl font-light md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-lg text-muted">{t(`items.${service.id}.summary`)}</p>
          <h3 className="mt-8 font-sans text-xs font-medium uppercase tracking-[0.22em] text-muted">{t("includes")}</h3>
          <ul className="mt-3 space-y-2">
            {includes.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-maroon" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            {price && (
              <p>
                <span className="block text-xs uppercase tracking-[0.22em] text-muted">{t("priceFrom")}</span>
                <span className="font-display text-3xl">{tc("from", { price })}</span>
              </p>
            )}
            <a
              href={whatsappUrl(`${tc("whatsappMessage")} (${title})`)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("whatsapp")}
            >
              <WhatsAppIcon /> {tc("askOnWhatsapp")}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
