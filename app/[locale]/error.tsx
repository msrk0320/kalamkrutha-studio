"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl } from "@/lib/whatsapp";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("Error");
  const tc = useTranslations("Common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col justify-center pb-16 pt-32">
      <h1 className="max-w-3xl text-5xl font-light md:text-7xl">{t("title")}</h1>
      <p className="mt-6 max-w-xl text-lg text-muted">{t("body")}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className={buttonClasses("primary")}>
          {t("retry")}
        </button>
        <a
          href={whatsappUrl(tc("whatsappMessage"))}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("whatsapp")}
        >
          <WhatsAppIcon /> {tc("whatsappUs")}
        </a>
      </div>
    </Container>
  );
}
