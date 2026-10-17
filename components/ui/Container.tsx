import type { ElementType, ReactNode } from "react";

const widths = {
  default: "max-w-[1200px]",
  wide: "max-w-[1440px]",
  bleed: "max-w-none",
} as const;

export function Container({
  size = "default",
  as: Tag = "div",
  className = "",
  children,
}: {
  size?: keyof typeof widths;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`mx-auto w-full px-4 md:px-8 ${widths[size]} ${className}`}>{children}</Tag>;
}
