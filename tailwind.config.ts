import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        paper: "#f5f2eb",
        ivory: "#faf8f5",
        ink: "#141413",
        hairline: "#e5e0d5",
        behappy: {
          primary: "#0284c7",
          "primary-hover": "#0369a1",
          secondary: "#059669",
          "secondary-hover": "#047857",
          cyan: "#38bdf8",
          dark: "#0a0f1d",
          darkLight: "#131b2e",
          card: "#182238",
          muted: "#94a3b8",
          whatsapp: "#25D366"
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
