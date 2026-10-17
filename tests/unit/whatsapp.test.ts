import { describe, expect, it } from "vitest";
import { whatsappUrl } from "@/lib/whatsapp";

describe("whatsappUrl", () => {
  it("links to the studio number with an encoded message", () => {
    expect(whatsappUrl("Hi there")).toBe("https://wa.me/918885858111?text=Hi%20there");
  });
});
