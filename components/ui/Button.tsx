import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "whatsapp" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-sans text-[0.8rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-maroon text-paper hover:bg-maroon-hover",
  outline: "border border-ink/70 text-ink hover:bg-ink hover:text-paper",
  whatsapp: "bg-whatsapp text-[#062b14] hover:brightness-95",
  ghost: "text-ink underline-offset-4 hover:underline",
  light: "border border-white/80 text-white hover:bg-white hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type ButtonProps = CommonProps &
  ({ href: string; external?: boolean } | ({ href?: undefined } & ComponentProps<"button">));

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = ""): string {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = buttonClasses(variant, size, className);

  if (props.href !== undefined) {
    const isExternal = props.external ?? /^(https?:|tel:|mailto:)/.test(props.href);
    if (isExternal) {
      const opensTab = props.href.startsWith("http");
      return (
        <a
          href={props.href}
          className={classes}
          {...(opensTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  );
}
