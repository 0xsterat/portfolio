import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#E1E7EF",
          light: "#F3F5F9",
          dark: "#9CA3B0",
        },
        nearblack: "#030711",
        coolmist: "#E1E7EF",
        slate: "#9CA3B0",
        deepblue: "#1F2937",
        vivid: "#D97706",
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
