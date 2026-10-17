import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import te from "@/messages/te.json";

type Tree = { [key: string]: unknown };

function leaves(tree: Tree, prefix = ""): Map<string, unknown> {
  const out = new Map<string, unknown>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const [p, v] of leaves(value as Tree, path)) out.set(p, v);
    } else {
      out.set(path, value);
    }
  }
  return out;
}

const english = leaves(en as unknown as Tree);

describe.each([
  ["te", te],
  ["hi", hi],
])("%s messages", (_name, messages) => {
  const translated = leaves(messages as unknown as Tree);

  it("has exactly the English key set", () => {
    expect([...translated.keys()].sort()).toEqual([...english.keys()].sort());
  });

  it("has no empty strings", () => {
    const empty = [...translated].filter(([, v]) =>
      Array.isArray(v) ? v.length === 0 || v.some((s) => !String(s).trim()) : !String(v).trim(),
    );
    expect(empty).toEqual([]);
  });

  it("keeps list lengths equal to English", () => {
    const mismatched = [...english]
      .filter(([, v]) => Array.isArray(v))
      .filter(([k, v]) => (translated.get(k) as unknown[] | undefined)?.length !== (v as unknown[]).length)
      .map(([k]) => k);
    expect(mismatched).toEqual([]);
  });
});
