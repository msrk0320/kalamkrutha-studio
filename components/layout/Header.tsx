import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { MobileNav } from "@/components/navigation/MobileNav";
import { NavLinks } from "@/components/navigation/NavLinks";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { whatsappUrl } from "@/lib/whatsapp";
import { HeaderShell } from "./HeaderShell";

/** Latin wordmark in every locale: it is the studio's brand mark. */
export function Wordmark() {
  return (
    <span lang="en" className="flex flex-col leading-none">
      <span className="text-[1.6rem] tracking-wide [font-family:var(--font-cormorant),serif]">Kalamkrutha</span>
      <span className="mt-1 text-[0.6rem] uppercase tracking-[0.34em] [font-family:var(--font-inter),sans-serif]">
        Digital Studio
      </span>
    </span>
  );
}

export async function Header() {
  const t = await getTranslations("Nav");
  const tc = await getTranslations("Common");
  const wa = whatsappUrl(tc("whatsappMessage"));

  return (
    <HeaderShell>
      <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" aria-label={t("mainSite")} className="shrink-0">
          <Wordmark />
        </Link>
        <nav aria-label={t("primary")} className="hidden lg:block">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden lg:flex" />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-maroon px-5 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-maroon-hover sm:inline-flex"
          >
            <WhatsAppIcon width={18} height={18} />
            {tc("whatsappUs")}
          </a>
          <MobileNav whatsappHref={wa} />
        </div>
      </div>
    </HeaderShell>
  );
}
