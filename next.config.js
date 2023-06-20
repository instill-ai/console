const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    // if (isServer) {
    //   require("./lib/generate-sitemap");
    // }

    if (!dev) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "disabled",
          generateStatsFile: true,
        })
      );
    }

    return config;
  },
  output: "standalone",

  // We need to ignore the babelrc.json at the root, that is for storybook
  experimental: {
    forceSwcTransforms: true,

    // We need this line to make our code-hike snippet work under Next.js standalone server
    // https://github.com/code-hike/codehike/issues/283
    outputFileTracingIncludes: {
      "/pipelines/[id]": ["node_modules/.pnpm/**/shiki/**/*.json"],
    },
  },
};
