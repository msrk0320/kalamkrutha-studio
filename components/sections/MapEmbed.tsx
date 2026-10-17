import { getTranslations } from "next-intl/server";
import { fullAddress } from "@/lib/content/business";

// Search-by-address embed: no API key, and no exact pin until the studio confirms its location.
const query = encodeURIComponent(`Kalamkrutha Digital Studio, ${fullAddress}`);

export async function MapEmbed() {
  const t = await getTranslations("Contact");
  const tc = await getTranslations("Common");
  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden bg-paper-deep md:aspect-[16/10]">
        <iframe
          title={t("mapTitle")}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 grayscale-[30%]"
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 items-center text-sm uppercase tracking-[0.2em] text-maroon underline-offset-4 hover:underline"
      >
        {tc("openInMaps")} →
      </a>
    </div>
  );
}
