import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    testTimeout: 20000,
    server: {
      deps: {
        // To solve Cannot find module ERROR
        // https://github.com/vitest-dev/vitest/issues/4554
        inline: ["next-auth"],
      },
    },
  },
});
