import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
