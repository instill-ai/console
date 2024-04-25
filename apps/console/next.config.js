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
  outputFileTracing: true,
  experimental: {
    forceSwcTransforms: true,
  },
  redirects: async function () {
    return [
      {
        source: "/logout",
        destination: "/api/auth/logout",
        permanent: false,
      },
    ];
  },
};
