"use client";

import Script from "next/script";

/** Cloudflare Turnstile widget; renders only when a site key is configured. Adds `cf-turnstile-response` to the form. */
export function Turnstile({ locale }: { locale: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div className="cf-turnstile" data-sitekey={siteKey} data-language={locale} data-theme="light" />
    </>
  );
}
