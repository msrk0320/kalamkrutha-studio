"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { navItems } from "./navItems";

const items = [{ href: "/", key: "home" } as const, ...navItems];

export function MobileNav({ whatsappHref }: { whatsappHref: string }) {
  const t = useTranslations("Nav");
  const tc = useTranslations("Common");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Close when the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full lg:hidden"
        aria-label={t("openMenu")}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </button>
      <dialog
        id="mobile-nav"
        ref={dialogRef}
        aria-label={t("primary")}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-ink/40 lg:hidden"
        onClose={() => {
          setOpen(false);
          toggleRef.current?.focus();
        }}
      >
        <div className="flex h-full flex-col px-4 pb-8 pt-3">
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full"
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <nav aria-label={t("primary")} className="mt-10 flex-1">
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block py-2 font-display text-4xl font-light aria-[current=page]:text-maroon"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("whatsapp", "lg", "w-full")}>
            <WhatsAppIcon /> {tc("whatsappUs")}
          </a>
        </div>
      </dialog>
    </>
  );
}
