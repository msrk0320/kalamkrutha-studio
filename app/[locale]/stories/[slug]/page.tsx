import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { StoryCard } from "@/components/sections/StoryCard";
import { FilmStrip } from "@/components/sliders/FilmStrip";
import { Container } from "@/components/ui/Container";
import { CoupleNames } from "@/components/ui/CoupleNames";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { routing, type Locale } from "@/i18n/routing";
import { images } from "@/lib/content/images";
import { getStory, stories } from "@/lib/content/stories";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => stories.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  const t = await getTranslations({ locale, namespace: "Meta.story" });
  const tk = await getTranslations({ locale, namespace: "Stories.kinds" });
  const values = { a: story.coupleA, b: story.coupleB, place: story.place, kind: tk(story.kind) };
  return buildMetadata({
    locale,
    path: `/stories/${story.slug}`,
    title: t("title", values),
    description: t("description", values),
  });
}

// Album page: the cover full width, then remaining prints paired at mixed sizes.
const printLayout = [
  "md:col-span-5 aspect-[3/4]",
  "md:col-span-6 md:col-start-7 md:mt-32 aspect-[3/4]",
  "md:col-span-7 md:col-start-3 aspect-[3/2]",
  "md:col-span-4 md:col-start-2 aspect-square",
];

export default async function StoryPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const story = getStory(slug);
  if (!story) notFound();

  const t = await getTranslations("Stories");
  const tc = await getTranslations("Common");
  const others = stories.filter((s) => s.slug !== story.slug);
  const cover = images[story.cover];
  const portraitCover = cover.height > cover.width;

  const tnav = await getTranslations("Nav");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tnav("home"), path: "/" },
          { name: tnav("stories"), path: "/stories" },
          { name: `${story.coupleA} & ${story.coupleB}`, path: `/stories/${story.slug}` },
        ])}
      />
      <article>
        <header className="pt-32 md:pt-44">
          <Container size="wide">
            <Eyebrow>
              {t(`kinds.${story.kind}`)} · {story.place} · {t(`dates.${story.kind}`)}
            </Eyebrow>
            <h1 className="mt-4">
              <CoupleNames as="span" a={story.coupleA} b={story.coupleB} className="block text-6xl md:text-8xl lg:text-9xl" />
            </h1>
            <p className="mt-6 text-sm text-muted">{tc("sampleNotice")}</p>
          </Container>
          <Container size="wide" className="mt-10 md:mt-14">
            {portraitCover ? (
              <Photo
                id={story.cover}
                eager
                className="aspect-[4/5] md:ml-auto md:w-7/12"
                sizes="(min-width: 768px) 58vw, 100vw"
              />
            ) : (
              <Photo id={story.cover} eager className="aspect-[4/5] md:aspect-[16/9]" sizes="(min-width: 1440px) 1376px, 100vw" />
            )}
          </Container>
        </header>

        <Container size="wide" className="py-16 md:py-28">
          <div className="grid gap-4 md:grid-cols-12 md:gap-6">
            {story.images.map((id, i) => (
              <Reveal key={id} delay={(i % 2) * 0.1} className={printLayout[i % printLayout.length]}>
                <Photo id={id} className="h-full w-full" sizes="(min-width: 768px) 50vw, 100vw" />
              </Reveal>
            ))}
          </div>
        </Container>

        <Container className="pb-8">
          <h2 className="mb-6 text-3xl md:text-4xl">{t("albumLabel")}</h2>
          <FilmStrip slides={[story.cover, ...story.images]} label={t("albumLabel")} />
        </Container>
      </article>

      <section aria-labelledby="more-stories" className="border-t border-line py-20">
        <Container size="wide">
          <h2 id="more-stories" className="mb-10 text-3xl md:text-4xl">
            {t("moreStories")}
          </h2>
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
            {others.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <EnquiryCta />
    </>
  );
}
