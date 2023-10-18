import { defineConfig } from "tsup";

export default defineConfig({
  sourcemap: false,
  minify: false,
  dts: false,
  format: ["esm", "cjs"],
  loader: {
    ".js": "jsx",
  },
  esbuildOptions(options) {
    options.external = [
      "react",
      "react-dom",
      "react-markdown",
      "remark-frontmatter",
    ];
  },
});
