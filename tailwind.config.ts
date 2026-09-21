import type { Config } from "tailwindcss";

// Token warna & tipografi diambil dari AGENTS.md (bagian 3 — Design Tokens),
// hasil observasi UI kit Figma ZYBA.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F2E7",
        "brown-900": "#3B2A20",
        "brown-700": "#5A4636",
        "green-500": "#8FAE5D",
        "green-100": "#E4EED2",
        "orange-500": "#F2884B",
        "orange-100": "#FCE3D3",
        mood: {
          depressed: "#A99BE0",
          sad: "#EE8A5E",
          neutral: "#6B5645",
          happy: "#E8C24A",
          overjoyed: "#8FAE5D",
        },
        danger: "#D9534F",
      },
      borderRadius: {
        pill: "999px",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
