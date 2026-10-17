import type { ElementType } from "react";

export function CoupleNames({
  a,
  b,
  as: Tag = "p",
  className = "",
}: {
  a: string;
  b: string;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag lang="en" className={`font-light leading-none [font-family:var(--font-cormorant),serif] ${className}`}>
      {a} <span className="italic text-maroon">&amp;</span> {b}
    </Tag>
  );
}
