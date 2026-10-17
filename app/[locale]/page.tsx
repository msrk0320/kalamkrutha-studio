import { pageMetadata } from "@/lib/seo/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { AlbumSpread } from "@/components/sections/AlbumSpread";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { HeroSlideshow } from "@/components/sections/HeroSlideshow";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { WalkInStrip } from "@/components/sections/WalkInStrip";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { stories } from "@/lib/content/stories";
import { whatsappUrl } from "@/lib/whatsapp";

export function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  return pageMetadata(params, "home", "/");
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Hero");
  const th = await getTranslations("Home");
  const tc = await getTranslations("Common");

  return (
    <>
      <HeroSlideshow slides={["hero1", "hero2", "hero3"]}>
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/85">{t("eyebrow")}</p>
          <h1 className="mt-4 text-[clamp(3rem,10vw,7.5rem)] font-light leading-[0.95]">{t("title")}</h1>
          <p className="mt-6 max-w-xl text-lg text-white/90 md:text-xl">{t("subtitle")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl(tc("whatsappMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("whatsapp", "lg", "max-sm:hidden")}
            >
              <WhatsAppIcon /> {tc("whatsappUs")}
            </a>
            <Link href="/stories" className={buttonClasses("light", "lg")}>
              {tc("seeStories")}
            </Link>
          </div>
        </div>
      </HeroSlideshow>

      <section aria-labelledby="stories-heading" className="pt-20 md:pt-32">
        <Container size="wide">
          <SectionHeading id="stories-heading" eyebrow={th("storiesEyebrow")} title={th("storiesTitle")} intro={th("storiesIntro")} />
        </Container>
        {stories.map((story, i) => (
          <AlbumSpread key={story.slug} story={story} align={i % 2 === 0 ? "left" : "right"} />
        ))}
      </section>

      <ServicesOverview />
      <WalkInStrip />
      <AboutTeaser />
      <EnquiryCta />
    </>
  );
}
