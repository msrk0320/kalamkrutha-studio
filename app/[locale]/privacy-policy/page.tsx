import { setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/sections/LegalDocument";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo/page-metadata";

export function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  return pageMetadata(params, "privacy", "/privacy-policy");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalDocument doc="privacy" />;
}
