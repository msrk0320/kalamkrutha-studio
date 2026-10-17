import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kalamkrutha Digital Studio",
    short_name: "Kalamkrutha",
    description: "Wedding photography and films, functions, albums and a walk-in studio in Guntur.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F2ED",
    theme_color: "#F5F2ED",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
