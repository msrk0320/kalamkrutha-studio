import type { ImageKey } from "./images";

export type ServiceId =
  | "wedding-photography"
  | "traditional-videography"
  | "candid-photography"
  | "cinematic-videography"
  | "pre-wedding"
  | "post-wedding"
  | "functions"
  | "album-design";

export type WalkInId = "passport" | "passport-extra" | "studio-sitting" | "matching-photos" | "digital-transfer";

export type Service = { id: ServiceId; image: ImageKey; priceFrom?: number };
export type WalkInItem = { id: WalkInId; price: number };

// Owner approved showing prices for now (2026-10-17). Set to false to show "Ask on WhatsApp" everywhere.
export const pricing = { showPrices: true };

// Starting prices from the studio's Justdial listing; engagement/birthday prices appear in the
// functions copy ("Engagement from ₹12,000", "Birthday from ₹10,000").
export const services: Service[] = [
  { id: "wedding-photography", image: "weddingRitual", priceFrom: 25000 },
  { id: "traditional-videography", image: "svcTraditionalVideo" },
  { id: "candid-photography", image: "s1Candid" },
  { id: "cinematic-videography", image: "svcCinematic" },
  { id: "pre-wedding", image: "prewedding" },
  { id: "post-wedding", image: "svcPostWedding" },
  { id: "functions", image: "svcFunctions", priceFrom: 10000 },
  { id: "album-design", image: "svcAlbum" },
];

// Counter rates from the studio window poster (PATWA rates from 01-05-2022).
export const walkIn: WalkInItem[] = [
  { id: "passport", price: 120 },
  { id: "passport-extra", price: 80 },
  { id: "studio-sitting", price: 250 },
  { id: "matching-photos", price: 250 },
  { id: "digital-transfer", price: 50 },
];

export const walkInImages: ImageKey[] = ["svcPassport", "svcStudioSitting"];
