import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimit } from "@/lib/server/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("allows five requests per window, blocks the sixth, then resets", () => {
    const opts = { limit: 5, windowMs: 600_000 };
    for (let i = 0; i < 5; i++) expect(rateLimit("1.2.3.4", opts).allowed).toBe(true);
    expect(rateLimit("1.2.3.4", opts).allowed).toBe(false);
    expect(rateLimit("5.6.7.8", opts).allowed).toBe(true);
    vi.advanceTimersByTime(600_001);
    expect(rateLimit("1.2.3.4", opts).allowed).toBe(true);
  });
});
