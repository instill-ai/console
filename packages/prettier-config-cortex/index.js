module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 80,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: true,
  overrides: [
    {
      files: [".*", "*.json", "*.md", "*.toml", "*.yml"],
      options: {
        useTabs: false,
      },
    },
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
