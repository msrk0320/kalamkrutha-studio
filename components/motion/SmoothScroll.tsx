"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Pause while the mobile menu has locked page scroll (programmatic scrolling ignores overflow: hidden).
    const lenis = new Lenis({ autoRaf: true, virtualScroll: () => document.documentElement.style.overflow !== "hidden" });
    return () => lenis.destroy();
  }, []);
  return null;
}
