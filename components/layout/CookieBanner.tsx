"use client";

import { useTranslations } from "next-intl";
import { buttonClasses } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { setConsent, useConsent } from "@/lib/consent";

/** Shown only when Google Analytics is configured and the visitor has not chosen yet. */
export function CookieBanner() {
  const t = useTranslations("Cookie");
  const consent = useConsent();
  if (!process.env.NEXT_PUBLIC_GA_ID || consent !== null) return null;

  return (
    <div
      data-cookie-banner
      role="region"
      aria-label={t("policy")}
      className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-xl border border-line bg-paper p-5 shadow-xl shadow-ink/10 md:bottom-6"
    >
      <p className="text-[0.95rem]">
        {t("message")}{" "}
        <Link href="/cookie-policy" className="text-maroon underline underline-offset-4">
          {t("policy")}
        </Link>
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" className={buttonClasses("primary")} onClick={() => setConsent("granted")}>
          {t("accept")}
        </button>
        <button type="button" className={buttonClasses("outline")} onClick={() => setConsent("denied")}>
          {t("decline")}
        </button>
      </div>
    </div>
  );
}
