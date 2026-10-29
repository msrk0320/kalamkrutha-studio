"use client";

import { animate, cubicBezier } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";

const albumEase = cubicBezier(0.19, 1, 0.22, 1);

// Server and client render the same hidden element; the effect reveals it on scroll,
// or at once when the visitor prefers reduced motion.
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        animate(el, { opacity: [0, 1], translateY: [y, 0], duration: 900, delay: delay * 1000, ease: albumEase });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, transform: `translateY(${y}px)` }}>
      {children}
    </div>
  );
}
