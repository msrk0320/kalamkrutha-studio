import { act, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "@/messages/en.json";

const motion = vi.hoisted(() => ({ reduce: false }));

vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => motion.reduce,
}));

const { HeroSlideshow } = await import("@/components/sections/HeroSlideshow");

function renderHero() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <HeroSlideshow slides={["hero1", "hero2", "hero3"]}>
        <h1>Life Time Memories</h1>
      </HeroSlideshow>
    </NextIntlClientProvider>,
  );
}

const slide = (n: number) => screen.getAllByRole("group", { hidden: true })[n]!;

describe("HeroSlideshow", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    motion.reduce = false;
  });

  it("advances to the next photograph after six seconds", () => {
    renderHero();
    expect(slide(0)).toHaveAttribute("aria-hidden", "false");
    act(() => vi.advanceTimersByTime(6000));
    expect(slide(1)).toHaveAttribute("aria-hidden", "false");
    expect(slide(0)).toHaveAttribute("aria-hidden", "true");
  });

  it("does not auto-advance when the visitor prefers reduced motion", () => {
    motion.reduce = true;
    renderHero();
    act(() => vi.advanceTimersByTime(20000));
    expect(slide(0)).toHaveAttribute("aria-hidden", "false");
  });

  it("can be paused", () => {
    renderHero();
    act(() => screen.getByRole("button", { name: "Pause slideshow" }).click());
    act(() => vi.advanceTimersByTime(20000));
    expect(slide(0)).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByRole("button", { name: "Play slideshow" })).toBeInTheDocument();
  });

  it("loads the first photograph eagerly and the rest lazily", () => {
    renderHero();
    const imgs = screen.getAllByRole("img", { hidden: true });
    expect(imgs[0]).not.toHaveAttribute("loading", "lazy");
    expect(imgs[1]).toHaveAttribute("loading", "lazy");
  });
});
