/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  transpilePackages: [
    "@instill-ai/toolkit",
    "@instill-ai/design-system",
    "@instill-ai/design-tokens",
  ],
  webpack: (config) => {
    // if (isServer) {
    //   require("./lib/generate-sitemap");
    // }

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
      {
        source: "/:namespace/models/:model",
        destination: "/:namespace/models/:model/playground",
        permanent: false,
      },
    ];
  },
};
