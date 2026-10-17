import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// next/font only works inside the Next compiler; give each font a predictable class.
vi.mock("next/font/google", () => {
  const font = (name: string) => () => ({ variable: `font-${name}`, className: `font-${name}`, style: {} });
  return Object.fromEntries(
    [
      "Cormorant_Garamond",
      "Inter",
      "Noto_Serif_Telugu",
      "Noto_Sans_Telugu",
      "Noto_Serif_Devanagari",
      "Noto_Sans_Devanagari",
    ].map((n) => [n, font(n)]),
  );
});

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
