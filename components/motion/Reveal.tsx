"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const albumEase = [0.19, 1, 0.22, 1] as const;

// Always render the same element on server and client (a different element would leave the
// server's hidden styles in place after hydration); reduced motion only removes the movement.
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
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: albumEase, delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
