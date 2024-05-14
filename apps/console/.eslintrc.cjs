var path = require("path");

module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "@instill-ai/eslint-config-cortex"],
  ignorePatterns: [".eslintrc.cjs"],
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
};
