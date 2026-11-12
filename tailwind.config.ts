import type { Config } from "tailwindcss";

// Token warna & tipografi ZYBA — The Tactile Sanctuary
// Sumber acuan tunggal: design-system/zyba/MASTER.md & design-system/PALETTE_LOCK.md
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Base canonical tokens
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

        // Semantic surface tokens
        surface: {
          canvas: "#F7F2E7",
          card: "rgba(255, 255, 255, 0.95)",
          "card-subtle": "rgba(255, 255, 255, 0.60)",
          "card-sunken": "#EDE6D6",
          popover: "#FFFFFF",
        },

        // Semantic ink tokens
        ink: {
          primary: "#3B2A20",
          secondary: "#5A4636",
          muted: "#7C6853",
          faint: "#A49280",
          inverse: "#F7F2E7",
        },

        // Semantic line & border tokens
        line: {
          subtle: "rgba(59, 42, 32, 0.08)",
          default: "rgba(59, 42, 32, 0.12)",
          strong: "rgba(59, 42, 32, 0.20)",
          focus: "rgba(242, 136, 75, 0.40)",
        },

        // Semantic accent tokens
        accent: {
          focus: "#F2884B",
          vital: "#8FAE5D",
          "warm-card": "#FCE3D3",
          "vital-card": "#E4EED2",
        },
      },
      borderRadius: {
        pill: "999px",
      },
      boxShadow: {
        xs: "0 1px 3px 0 rgba(59, 42, 32, 0.05)",
        sm: "0 2px 6px 0 rgba(59, 42, 32, 0.07)",
        md: "0 4px 12px 0 rgba(59, 42, 32, 0.08)",
        lg: "0 8px 24px -4px rgba(59, 42, 32, 0.10)",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
