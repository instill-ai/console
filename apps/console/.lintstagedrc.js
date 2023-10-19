// ref: https://nextjs.org/docs/pages/building-your-application/configuring/eslint#lint-staged

const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
  "package.json": ["pnpm check-pnpm-overrides"],
  "pnpm-lock.yaml": ["pnpm check-pnpm-overrides"],
};
