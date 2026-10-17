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
    <Tag className={`font-display font-light leading-none ${className}`}>
      {a} <span className="font-display italic text-maroon">&amp;</span> {b}
    </Tag>
  );
}
