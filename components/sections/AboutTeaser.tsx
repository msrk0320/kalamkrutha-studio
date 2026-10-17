import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Link } from "@/i18n/navigation";

export async function AboutTeaser() {
  const t = await getTranslations("Home");
  return (
    <section aria-labelledby="about-heading" className="py-20 md:py-32">
      <Container size="wide" className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
        <Reveal>
          <Photo id="svcAlbum" className="aspect-[3/2]" sizes="(min-width: 768px) 50vw, 100vw" />
        </Reveal>
        <div className="max-w-xl">
          <Eyebrow>{t("aboutEyebrow")}</Eyebrow>
          <h2 id="about-heading" className="mt-4 text-4xl font-light md:text-5xl">
            {t("aboutTitle")}
          </h2>
          <p className="mt-6 text-lg text-muted">{t("aboutBody")}</p>
          <Link
            href="/about"
            className="mt-8 inline-flex min-h-11 items-center text-sm uppercase tracking-[0.2em] text-maroon underline-offset-4 hover:underline"
          >
            {t("aboutLink")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
