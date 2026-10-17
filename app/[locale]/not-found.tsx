import { useTranslations } from "next-intl";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/navigation";

const links = [
  { href: "/", key: "home" },
  { href: "/stories", key: "stories" },
  { href: "/services", key: "services" },
  { href: "/contact", key: "contact" },
] as const;

export default function NotFound() {
  const t = useTranslations("NotFound");
  const tn = useTranslations("Nav");
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center pb-16 pt-32">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h1 className="mt-4 max-w-3xl text-5xl font-light md:text-7xl">{t("title")}</h1>
      <p className="mt-6 max-w-xl text-lg text-muted">{t("body")}</p>
      <ul className="mt-10 flex flex-wrap gap-3">
        {links.map((l, i) => (
          <li key={l.href}>
            <Link href={l.href} className={buttonClasses(i === 0 ? "primary" : "outline")}>
              {tn(l.key)}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
