var path = require("path");

module.exports = {
  root: true,
  extends: ["@instill-ai/eslint-config-cortex"],
  ignorePatterns: [
    ".eslintrc.cjs",
    "tsup.config.ts",
    "vitest.config.ts",
    "setupTests.ts",
    "generate-mocks/*",
  ],
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
};
