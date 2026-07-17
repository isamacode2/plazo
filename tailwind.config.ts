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
        brand: {
          50: "#fdf3ee",
          100: "#fbe2d3",
          200: "#f6c19f",
          300: "#ef9c67",
          400: "#e87d3c",
          500: "#e2621b",
          600: "#c14e14",
          700: "#9a3f13",
          800: "#793314",
          900: "#602a14",
        },
      },
    },
  },
  plugins: [],
};
export default config;
