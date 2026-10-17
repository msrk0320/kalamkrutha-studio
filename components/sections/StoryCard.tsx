import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { CoupleNames } from "@/components/ui/CoupleNames";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Link } from "@/i18n/navigation";
import type { Story } from "@/lib/content/stories";

export async function StoryCard({ story, headingLevel = "h2" }: { story: Story; headingLevel?: "h2" | "h3" }) {
  const t = await getTranslations("Stories");
  const Heading = headingLevel;
  return (
    <Reveal>
      <Link href={`/stories/${story.slug}`} className="group block">
        <Photo
          id={story.cover}
          className="aspect-[4/5]"
          imgClassName="group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <Eyebrow className="mt-5">
          {t(`kinds.${story.kind}`)} · {story.place}
        </Eyebrow>
        <Heading className="mt-2">
          <CoupleNames as="span" a={story.coupleA} b={story.coupleB} className="block text-4xl md:text-5xl" />
        </Heading>
      </Link>
    </Reveal>
  );
}
