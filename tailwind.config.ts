import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#050816",
          secondary: "#0b1120",
        },
        foreground: "#f8fafc",
        card: {
          DEFAULT: "rgba(15, 23, 42, 0.72)",
          foreground: "#f8fafc",
        },
        popover: {
          DEFAULT: "#0b1120",
          foreground: "#f8fafc",
        },
        primary: {
          DEFAULT: "#22c55e",
          foreground: "#050816",
        },
        secondary: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          foreground: "#f8fafc",
        },
        muted: {
          DEFAULT: "#64748b",
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#22c55e",
          foreground: "#050816",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#f8fafc",
        },
        border: "rgba(255, 255, 255, 0.06)",
        input: "rgba(255, 255, 255, 0.04)",
        ring: "rgba(34, 197, 94, 0.4)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
