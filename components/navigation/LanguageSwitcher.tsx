"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels = { en: "EN", te: "తెలుగు", hi: "हिन्दी" } as const;

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("Nav");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <ul aria-label={t("language")} className={`flex items-center gap-1 ${className}`}>
      {routing.locales.map((locale) => (
        <li key={locale}>
          <Link
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 text-[0.8rem] transition-opacity ${
              locale === current ? "font-semibold underline decoration-1 underline-offset-4" : "opacity-80 hover:opacity-100"
            }`}
          >
            {labels[locale]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
