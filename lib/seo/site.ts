const DEFAULT_SITE_URL = "https://kalamkrutha-studio.vercel.app";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

/** Search engines may index the site only after launch, when this flag is set to "true". */
export function allowIndexing(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}
