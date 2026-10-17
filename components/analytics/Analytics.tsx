"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

/**
 * Plausible (cookieless) loads whenever NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
 * Google Analytics 4 loads only when NEXT_PUBLIC_GA_ID is set and the visitor accepted analytics cookies.
 */
export function Analytics() {
  const consent = useConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <>
      {plausible && (
        <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      )}
      {gaId && consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
    </>
  );
}
