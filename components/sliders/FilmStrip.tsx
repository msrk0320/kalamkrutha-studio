"use client";

import { useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { images, type ImageKey } from "@/lib/content/images";

/** Main photo viewer with a synced thumbnail strip, like flipping through an album's contact sheet. */
export function FilmStrip({ slides, label }: { slides: ImageKey[]; label: string }) {
  const t = useTranslations("Stories");
  const alt = useTranslations("Images");
  const reduce = useReducedMotion() ?? false;
  const [mainRef, main] = useEmblaCarousel({ loop: false, duration: reduce ? 1 : 30 });
  const [thumbRef, thumbs] = useEmblaCarousel({ containScroll: "keepSnaps", dragFree: true });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(slides.length > 1);

  const onSelect = useCallback(() => {
    if (!main) return;
    const i = main.selectedScrollSnap();
    setSelected(i);
    setCanPrev(main.canScrollPrev());
    setCanNext(main.canScrollNext());
    thumbs?.scrollTo(i);
  }, [main, thumbs]);

  useEffect(() => {
    if (!main) return;
    main.on("select", onSelect).on("reInit", onSelect);
    return () => {
      main.off("select", onSelect).off("reInit", onSelect);
    };
  }, [main, onSelect]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") main?.scrollPrev();
    if (e.key === "ArrowRight") main?.scrollNext();
  };

  return (
    <section aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown} className="select-none">
      <div ref={mainRef} className="overflow-hidden bg-ink">
        <div className="flex">
          {slides.map((key, i) => {
            const img = images[key];
            return (
              <div
                key={key}
                role="group"
                aria-roledescription="slide"
                aria-label={t("slideOf", { n: i + 1, total: slides.length })}
                className="relative aspect-[4/5] min-w-0 flex-[0_0_100%] sm:aspect-[3/2]"
              >
                <Image
                  src={img.src}
                  alt={alt(key)}
                  fill
                  sizes="(min-width: 1200px) 1200px, 100vw"
                  loading="lazy"
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p data-slide-status aria-live="polite" className="text-sm tabular-nums text-muted">
          {t("slideOf", { n: selected + 1, total: slides.length })}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => main?.scrollPrev()}
            disabled={!canPrev}
            aria-label={t("previous")}
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink/30 transition-colors hover:border-ink disabled:opacity-30"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => main?.scrollNext()}
            disabled={!canNext}
            aria-label={t("next")}
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink/30 transition-colors hover:border-ink disabled:opacity-30"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div ref={thumbRef} className="mt-4 overflow-hidden" aria-label={t("thumbnails")} role="group">
        <div className="flex gap-2">
          {slides.map((key, i) => {
            const img = images[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => main?.scrollTo(i)}
                aria-current={i === selected ? "true" : undefined}
                aria-label={t("slideOf", { n: i + 1, total: slides.length })}
                className={`relative aspect-square min-w-0 flex-[0_0_22%] overflow-hidden transition-opacity sm:flex-[0_0_14%] ${
                  i === selected ? "opacity-100 outline outline-2 -outline-offset-2 outline-maroon" : "opacity-55 hover:opacity-90"
                }`}
              >
                <Image src={img.src} alt="" fill sizes="160px" loading="lazy" className="object-cover" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
