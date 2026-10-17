import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { CoupleNames } from "@/components/ui/CoupleNames";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";
import { Link } from "@/i18n/navigation";
import type { Story } from "@/lib/content/stories";

// Album page layouts: prints at different sizes and heights, mirrored for alternate spreads.
const layouts = {
  left: [
    "col-span-2 md:col-span-6 md:row-span-2 aspect-[4/5] md:aspect-auto md:h-[min(78vh,760px)]",
    "md:col-span-3 md:col-start-8 aspect-[3/4] md:mt-24",
    "md:col-span-2 md:col-start-11 aspect-square mt-12 md:mt-56",
    "hidden md:block md:col-span-4 md:col-start-8 aspect-[3/2] md:-mt-10",
  ],
  right: [
    "col-span-2 md:col-span-6 md:col-start-7 md:row-span-2 md:row-start-1 aspect-[4/5] md:aspect-auto md:h-[min(78vh,760px)]",
    "md:col-span-3 md:col-start-2 md:row-start-1 aspect-[3/4] md:mt-24",
    "md:col-span-2 md:col-start-5 md:row-start-1 aspect-square mt-12 md:mt-56",
    "hidden md:block md:col-span-4 md:col-start-2 md:row-start-2 aspect-[3/2] md:-mt-10",
  ],
} as const;

export async function AlbumSpread({ story, align }: { story: Story; align: "left" | "right" }) {
  const t = await getTranslations("Stories");
  const tc = await getTranslations("Common");
  const prints = [story.cover, ...story.images].slice(0, 4);
  const href = `/stories/${story.slug}` as const;

  return (
    <article className="py-16 md:py-28">
      <Container size="wide">
        <Link href={href} className="group block" aria-label={`${story.coupleA} & ${story.coupleB} – ${tc("viewStory")}`}>
          <div className="grid grid-cols-2 items-start gap-3 md:grid-cols-12 md:gap-6">
            {prints.map((id, i) => (
              <Reveal key={id} delay={i * 0.12} className={layouts[align][i]}>
                <Photo
                  id={id}
                  className="h-full w-full"
                  imgClassName="group-hover:scale-[1.02]"
                  sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                />
              </Reveal>
            ))}
          </div>
        </Link>

        <Reveal className={`mt-10 flex flex-col gap-4 md:mt-14 ${align === "right" ? "md:items-start" : "md:items-end md:text-right"}`}>
          <Eyebrow>
            {t(`kinds.${story.kind}`)} · {story.place} · {t(`dates.${story.kind}`)}
          </Eyebrow>
          <h3>
            <CoupleNames as="span" a={story.coupleA} b={story.coupleB} className="block text-5xl md:text-7xl lg:text-8xl" />
          </h3>
          <Link
            href={href}
            className="inline-flex min-h-11 items-center gap-2 text-sm uppercase tracking-[0.2em] text-maroon underline-offset-4 hover:underline"
          >
            {tc("viewStory")} <ArrowRightIcon />
          </Link>
        </Reveal>
      </Container>
    </article>
  );
}
