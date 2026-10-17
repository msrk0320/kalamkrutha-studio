"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/** Transparent over the home hero until the visitor scrolls; solid paper everywhere else. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !overHero || scrolled;

  return (
    <header
      data-solid={solid}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid
          ? "border-b border-line bg-paper/95 text-ink backdrop-blur-sm"
          : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent text-white"
      }`}
    >
      {children}
    </header>
  );
}
