import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "./metadata";

type MetaPage = "home" | "stories" | "services" | "about" | "contact" | "privacy" | "terms" | "cookies";

/** generateMetadata body for a static page whose copy lives under Meta.<page>. */
export async function pageMetadata(params: Promise<{ locale: Locale }>, page: MetaPage, path: string): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({ locale, path, title: t(`${page}.title`), description: t(`${page}.description`) });
}
