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
  experimental: {
    forceSwcTransforms: true,
  },
  unstable_allowDynamic: [
    "node_modules/echarts/lib/coord/geo/GeoJSONResource.js",
  ],
};
