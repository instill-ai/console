import { defineConfig } from "tsup";

export default defineConfig({
  sourcemap: false,
  minify: false,
  dts: false,
  splitting: false,
  format: ["esm", "cjs"],
  loader: {
    ".js": "jsx",
  },
  clean: true,
  esbuildOptions(options) {
    options.external = [
      // vitest is using some nodejs modules that is not available under our bundle env
      // it will cause Could not resolve "#async_hooks" error
      "#async_hooks",
    ];
  },
});
