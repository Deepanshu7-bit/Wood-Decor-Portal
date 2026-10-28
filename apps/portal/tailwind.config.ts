import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sienna: {
          DEFAULT: "#B5562A",
          dark: "#8F3F1C",
          light: "#FFF4EE",
        },
        cream: {
          bg: "#FAF8F5",
          card: "#FFFFFF",
          border: "#EAE4DC",
        },
        charcoal: {
          main: "#1C1917",
          muted: "#78716C",
        },
      },
    },
  },
  plugins: [],
};

export default config;
