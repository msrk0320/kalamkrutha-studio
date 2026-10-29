"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { images, type ImageKey } from "@/lib/content/images";

/** Main photo viewer with a synced thumbnail strip, like flipping through an album's contact sheet. */
export function FilmStrip({ slides, label }: { slides: ImageKey[]; label: string }) {
  const t = useTranslations("Stories");
  const alt = useTranslations("Images");
  const reduce = useReducedMotion() ?? false;
  const [main, setMain] = useState<SwiperInstance | null>(null);
  const [thumbs, setThumbs] = useState<SwiperInstance | null>(null);
  const [selected, setSelected] = useState(0);
  const canPrev = selected > 0;
  const canNext = selected < slides.length - 1;

  const onSlideChange = (s: SwiperInstance) => {
    setSelected(s.activeIndex);
    thumbs?.slideTo(s.activeIndex);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") main?.slidePrev();
    if (e.key === "ArrowRight") main?.slideNext();
  };

  return (
    <section aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown} className="select-none">
      <Swiper onSwiper={setMain} onSlideChange={onSlideChange} speed={reduce ? 0 : 500} className="bg-ink">
        {slides.map((key, i) => {
          const img = images[key];
          return (
            <SwiperSlide
              key={key}
              role="group"
              aria-roledescription="slide"
              aria-label={t("slideOf", { n: i + 1, total: slides.length })}
              className="relative aspect-[4/5] sm:aspect-[3/2]"
            >
              <Image
                src={img.src}
                alt={alt(key)}
                fill
                sizes="(min-width: 1200px) 1200px, 100vw"
                loading="lazy"
                className="object-contain"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p data-slide-status aria-live="polite" className="text-sm tabular-nums text-muted">
          {t("slideOf", { n: selected + 1, total: slides.length })}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => main?.slidePrev()}
            disabled={!canPrev}
            aria-label={t("previous")}
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink/30 transition-colors hover:border-ink disabled:opacity-30"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => main?.slideNext()}
            disabled={!canNext}
            aria-label={t("next")}
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink/30 transition-colors hover:border-ink disabled:opacity-30"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div className="mt-4" aria-label={t("thumbnails")} role="group">
        <Swiper
          onSwiper={setThumbs}
          modules={[FreeMode]}
          freeMode
          slidesPerView={4.5}
          spaceBetween={8}
          breakpoints={{ 640: { slidesPerView: 7 } }}
        >
          {slides.map((key, i) => {
            const img = images[key];
            return (
              <SwiperSlide key={key}>
                <button
                  type="button"
                  onClick={() => main?.slideTo(i)}
                  aria-current={i === selected ? "true" : undefined}
                  aria-label={t("slideOf", { n: i + 1, total: slides.length })}
                  className={`relative block aspect-square w-full overflow-hidden transition-opacity ${
                    i === selected ? "opacity-100 outline outline-2 -outline-offset-2 outline-maroon" : "opacity-55 hover:opacity-90"
                  }`}
                >
                  <Image src={img.src} alt="" fill sizes="160px" loading="lazy" className="object-cover" />
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
