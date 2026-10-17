export const locales = ["en", "te", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
