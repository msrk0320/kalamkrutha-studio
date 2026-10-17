import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { StoryCard } from "@/components/sections/StoryCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { stories } from "@/lib/content/stories";

export default async function StoriesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Stories");
  const tc = await getTranslations("Common");

  return (
    <>
      <Container size="wide" className="pb-12 pt-32 md:pt-44">
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
        <p className="mt-4 text-sm text-muted">{tc("sampleNotice")}</p>
      </Container>
      <Container size="wide">
        <ul className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <li key={story.slug}>
              <StoryCard story={story} />
            </li>
          ))}
        </ul>
      </Container>
      <EnquiryCta />
    </>
  );
}
