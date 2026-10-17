"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "./navItems";

export function NavLinks() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-8">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="text-[0.8rem] uppercase tracking-[0.2em] underline-offset-[6px] hover:underline aria-[current=page]:underline"
            >
              {t(item.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
