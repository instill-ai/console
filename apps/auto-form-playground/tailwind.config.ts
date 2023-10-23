import type { Config } from "tailwindcss";

const config: Config = {
  presets: [require("@instill-ai/design-tokens/dist/tailwind.config.cjs")],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@instill-ai/design-system/dist/*.{js,mjs}",
    "./node_modules/@instill-ai/toolkit/dist/*.{js,mjs}",
  ],
  plugins: [],
};
export default config;
