import { getTranslations } from "next-intl/server";
import { navItems } from "@/components/navigation/navItems";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { business, fullAddress } from "@/lib/content/business";
import { services } from "@/lib/content/services";
import { whatsappUrl } from "@/lib/whatsapp";
import { Wordmark } from "./Header";

const socials = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
] as const;

const legal = [
  { href: "/privacy-policy", key: "privacy" },
  { href: "/terms", key: "terms" },
  { href: "/cookie-policy", key: "cookies" },
] as const;

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.24em] text-muted">{title}</h2>
      <ul className="space-y-2.5 text-[0.95rem]">{children}</ul>
    </div>
  );
}

export async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const ts = await getTranslations("Services.items");
  const tc = await getTranslations("Common");
  const tl = await getTranslations("Legal");
  const ta = await getTranslations("About");
  const linkClass = "hover:text-maroon hover:underline underline-offset-4";
  const activeSocials = socials.filter((s) => business.social[s.key]);

  return (
    <footer className="mt-24 border-t border-line bg-paper-deep">
      <Container size="wide" className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
        <div className="max-w-xs">
          <Link href="/">
            <Wordmark />
          </Link>
          <p className="mt-5 text-[0.95rem] text-muted">{t("description")}</p>
          {activeSocials.length > 0 && (
            <ul aria-label={t("follow")} className="mt-6 flex gap-2">
              {activeSocials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a
                    href={business.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line hover:border-maroon hover:text-maroon"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Column title={t("explore")}>
          <li>
            <Link href="/" className={linkClass}>
              {tn("home")}
            </Link>
          </li>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {tn(item.key)}
              </Link>
            </li>
          ))}
        </Column>

        <Column title={t("services")}>
          {services.map((s) => (
            <li key={s.id}>
              <Link href={`/services#${s.id}`} className={linkClass}>
                {ts(`${s.id}.title`)}
              </Link>
            </li>
          ))}
        </Column>

        <Column title={t("contact")}>
          <li>
            <a href={`tel:${business.phoneE164}`} className={linkClass}>
              {business.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={whatsappUrl(tc("whatsappMessage"))} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {tc("whatsappUs")}
            </a>
          </li>
          <li>
            <a href={`mailto:${business.email}`} className={`${linkClass} break-all`}>
              {business.email}
            </a>
          </li>
          <li className="text-muted">{fullAddress}</li>
          <li className="text-muted">{ta("hours")}</li>
        </Column>
      </Container>

      <div className="border-t border-line">
        <Container size="wide" className="flex flex-col gap-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            {t("rights", { year: new Date().getFullYear() })} {t("placeholderPhotos")}
          </p>
          <nav aria-label={t("legal")}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {tl(`${l.key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
