import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZYBA — Gen Z Wellness Support",
    short_name: "ZYBA",
    description: "Pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F7F2E7",
    theme_color: "#344638",
    orientation: "portrait",
    categories: ["health", "lifestyle", "wellness"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

