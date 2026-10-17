import type { ImageKey } from "./images";

export type StoryKind = "teluguWedding" | "churchWedding" | "preWedding";

export type Story = {
  slug: "telugu-wedding" | "church-wedding" | "pre-wedding";
  kind: StoryKind;
  /** Sample content: names and photos are placeholders until the studio supplies real stories. */
  placeholder: true;
  coupleA: string;
  coupleB: string;
  place: string;
  cover: ImageKey;
  images: ImageKey[];
};

export const stories: Story[] = [
  {
    slug: "telugu-wedding",
    kind: "teluguWedding",
    placeholder: true,
    coupleA: "Priya",
    coupleB: "Ravi",
    place: "Guntur",
    cover: "hero1",
    images: ["s1Talambralu", "s1Jeelakarra", "s1Candid", "s1Mangalsutra"],
  },
  {
    slug: "church-wedding",
    kind: "churchWedding",
    placeholder: true,
    coupleA: "Grace",
    coupleB: "Samuel",
    place: "Guntur",
    cover: "s2Cover",
    images: ["s2Rings", "s2Bride", "s2Family"],
  },
  {
    slug: "pre-wedding",
    kind: "preWedding",
    placeholder: true,
    coupleA: "Anjali",
    coupleB: "Kiran",
    place: "Kondaveedu",
    cover: "s3Fort",
    images: ["s3River", "s3Field", "s3Closeup"],
  },
];

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}
