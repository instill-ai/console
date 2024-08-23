/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  transpilePackages: [
    '@mdxeditor/editor',
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
      //Redirect naked pipeline and model links to the playground
      {
        source: "/:namespace/pipelines/:pipelineId",
        destination: "/:namespace/pipelines/:pipelineId/playground",
        permanent: false,
      },
      {
        source: "/:namespace/models/:modelId",
        destination: "/:namespace/models/:modelId/playground",
        permanent: false,
      },
    ];
  },
};