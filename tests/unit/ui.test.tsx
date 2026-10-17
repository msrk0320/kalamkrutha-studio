import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/Button";
import { CoupleNames } from "@/components/ui/CoupleNames";
import { fontVariables } from "@/lib/fonts";

describe("Button", () => {
  it("uses the WhatsApp colour for the whatsapp variant", () => {
    render(<Button variant="whatsapp">Chat</Button>);
    expect(screen.getByRole("button", { name: "Chat" }).className).toContain("bg-whatsapp");
  });

  it("renders a link when given an href", () => {
    render(<Button href="https://wa.me/918885858111">Chat</Button>);
    expect(screen.getByRole("link", { name: "Chat" }).tagName).toBe("A");
  });
});

describe("CoupleNames", () => {
  it("sets the ampersand in maroon", () => {
    render(<CoupleNames a="Priya" b="Ravi" />);
    expect(screen.getByText("&").className).toContain("text-maroon");
  });
});

describe("fontVariables", () => {
  it("adds the Telugu font variables only for Telugu", () => {
    expect(fontVariables("te")).toMatch(/telugu/i);
    expect(fontVariables("en")).not.toMatch(/telugu/i);
  });
});
