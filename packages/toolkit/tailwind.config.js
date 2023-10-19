/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@instill-ai/design-tokens/dist/tailwind.config.cjs")],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
