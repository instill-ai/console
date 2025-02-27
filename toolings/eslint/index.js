module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  ignorePatterns: [
    "**/node_modules",
    "**/dist",
    "**/build",
    "**/testRunner.ts",
  ],
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
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:testing-library/react",
    "plugin:storybook/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],

  // These rules come from eslint-config-next, we though these rules suit our
  // needs too
  rules: {
    "react/no-unknown-property": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-no-target-blank": "off",
    "testing-library/render-result-naming-convention": "off",
  },
  overrides: [
    {
      // For performance run vitest/recommended on test files, not regular code
      files: ["**/?(*.)+(test).{js,jsx,ts,tsx}"],
      extends: ["plugin:testing-library/react", "plugin:vitest/recommended"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-object-literal-type-assertion": "off",
        "@typescript-eslint/no-empty-function": "off",
      },
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
