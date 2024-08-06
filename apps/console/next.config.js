/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  transpilePackages: [
    "@mdxeditor/editor",
    "@instill-ai/toolkit",
    "@instill-ai/design-system",
    "@instill-ai/design-tokens",
  ],
  webpack: (config) => {
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
        source: "/:username/models/:modelID",
        destination: "/:username/models/:modelID/playground",
        permanent: false,
      },
      {
        source: "/:username/pipelines/:pipelineID",
        destination: "/:username/pipelines/:pipelineID/playground",
        permanent: false,
      },
      {
        source: "/:username/models/:modelID/:slug(create|api|examples|predictions|versions|settings|readme)",
        destination: "/:username/models/:modelID/:slug",
        permanent: false,
      },
      {
        source: "/:username/pipelines/:pipelineID/:slug(create|api|examples|predictions|versions|settings|readme)",
        destination: "/:username/pipelines/:pipelineID/:slug",
        permanent: false,
      },
    ];
  },
};