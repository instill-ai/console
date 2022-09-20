module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  ignorePatterns: ["**/node_modules", "**/dist", "**/build"],
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {},
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      globalReturn: false,
    },
    ecmaVersion: 2020,
    project: ["./tsconfig.json"],
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",

    // eslint-plugin-react
    "plugin:react/recommended",

    // @typescript-eslint/eslint-plugin
    "plugin:@typescript-eslint/recommended",

    // eslint-plugin-import
    "plugin:import/recommended",

    // eslint-import-resolver-typescript
    "plugin:import/typescript",

    // eslint-plugin-react-hooks
    "plugin:react-hooks/recommended",

    // eslint-plugin-storybook
    "plugin:storybook/recommended",
  ],
  rules: {
    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    "react/react-in-jsx-scope": "off",
  },
  overrides: [
    {
      // For performance run jest/recommended on test files, not regular code
      files: ["**/?(*.)+(test).{js,jsx,ts,tsx}"],
      extends: [
        "plugin:jest/recommended",
        "plugin:jest-formatting/recommended",
        "plugin:testing-library/react",
      ],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-object-literal-type-assertion": "off",
        "@typescript-eslint/no-empty-function": "off",
      },
    },
    {
      // We use playwright eslint plugin on e2e test
      files: ["e2e/*.spec.{js,ts}"],
      extends: ["plugin:playwright/playwright-test"],
    },
    {
      // To disambiguate unit from e2e (playwright) test files, the *.spec.ts
      // is used across this repo, so we can apply a different ruleset.
      files: ["*.spec.ts"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-object-literal-type-assertion": "off",
        "@typescript-eslint/no-empty-function": "off",
      },
    },
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        // Disable React.FC missing in props validation error (react/prop-types)
        "react/prop-types": "off",
        "react/require-default-props": "off",
      },
    },
    {
      files: ["*.js"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2020,
      },
      rules: {
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "sonarjs/no-duplicate-string": "off",
        "sonarjs/no-all-duplicated-branches": "off",
        "@typescript-eslint/consistent-type-exports": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "import/order": "off",
      },
    },
  ],
};
