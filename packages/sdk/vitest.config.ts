import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./setupTests.ts",
    coverage: {
      provider: "istanbul",
      exclude: [
        "generate-mocks",
        "mocks",
        ".eslintrc.cjs",
        "tsup.config.ts",
        "dist",
      ],
    },
  },
});
