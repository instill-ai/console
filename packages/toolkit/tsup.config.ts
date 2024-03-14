import { Options, defineConfig } from "tsup";

const cfg: Options = {
  sourcemap: false,
  minify: false,
  dts: false,
  format: ["esm", "cjs"],
  loader: {
    ".js": "jsx",
  },
  splitting: false,
};

export default defineConfig([
  {
    ...cfg,
    entry: {
      index: "src/server/index.ts",
    },
    outDir: "dist/server",
    esbuildOptions(options) {
      options.external = [
        "react",
        "react-dom",

        // vitest is using some nodejs modules that is not available under our bundle env
        // it will cause Could not resolve "#async_hooks" error
        "#async_hooks",
      ];
    },
  },
  {
    ...cfg,
    entry: {
      index: "src/index.ts",
    },
    outDir: "dist",
    esbuildOptions(options) {
      options.external = [
        "react",
        "react-dom",

        // vitest is using some nodejs modules that is not available under our bundle env
        // it will cause Could not resolve "#async_hooks" error
        "#async_hooks",
      ];

      // use client side code
      options.banner = {
        js: '"use client";',
      };
    },
  },
]);
