var path = require("path");

module.exports = {
  root: true,
  extends: ["@instill-ai/eslint-config-cortex", "plugin:storybook/recommended"],
  ignorePatterns: [".eslintrc.cjs"],
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
};