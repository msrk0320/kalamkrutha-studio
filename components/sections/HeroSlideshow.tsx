"use client";

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { images, type ImageKey } from "@/lib/content/images";

const FADE_S = 1.6;

export function HeroSlideshow({
  slides,
  intervalMs = 6000,
  children,
}: {
  slides: ImageKey[];
  intervalMs?: number;
  children: ReactNode;
}) {
  const t = useTranslations("Hero");
  const alt = useTranslations("Images");
  const reduce = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const autoplay = !reduce && !paused && !hovered && slides.length > 1;

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoplay, intervalMs, slides.length]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        data-hero
        aria-roledescription="carousel"
        aria-label={t("slidesLabel")}
        className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-ink text-white"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {slides.map((key, i) => {
          const active = i === index;
          const img = images[key];
          return (
            <m.div
              key={key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
              aria-hidden={!active}
              className="absolute inset-0 -z-10"
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : FADE_S, ease: "easeInOut" }}
            >
              <m.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: active && !reduce ? 1.06 : 1 }}
                transition={{ duration: active ? (intervalMs + FADE_S * 1000) / 1000 : 0, ease: "linear" }}
              >
                <Image
                  src={img.src}
                  alt={alt(key)}
                  fill
                  sizes="100vw"
                  preload={i === 0}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="object-cover object-[70%_center]"
                />
              </m.div>
            </m.div>
          );
        })}

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/25 to-black/10 md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent"
        />

        <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-24 md:px-8 md:pb-28">
          {children}
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-5 right-20 flex items-center gap-1 md:bottom-7 md:right-28">
            {slides.map((key, i) => (
              <button
                key={key}
                type="button"
                aria-label={t("goToSlide", { n: i + 1 })}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className="group inline-flex size-11 items-center justify-center"
              >
                <span
                  className={`block h-px transition-all duration-500 ${i === index ? "w-8 bg-white" : "w-4 bg-white/50 group-hover:bg-white/80"}`}
                />
              </button>
            ))}
            {!reduce && (
              <button
                type="button"
                aria-label={paused ? t("play") : t("pause")}
                onClick={() => setPaused((p) => !p)}
                className="ml-1 inline-flex size-11 items-center justify-center rounded-full border border-white/40 text-xs hover:border-white"
              >
                <AnimatePresence initial={false} mode="wait">
                  <m.span key={paused ? "play" : "pause"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {paused ? (
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
                        <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
                      </svg>
                    )}
                  </m.span>
                </AnimatePresence>
              </button>
            )}
          </div>
        )}
      </section>
    </LazyMotion>
  );
}
