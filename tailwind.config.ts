
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        guinea: {
          green: "#0d8a38",
          yellow: "#f3c830",
          red: "#d72638",
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, #0d8a38 0%, #1e8a3a 35%, #0ca25f 100%)',
        'cta-gradient': 'linear-gradient(90deg, #f1c232 0%, #d19a00 100%)'
      }
    },
  },
  plugins: [],
} satisfies Config;
