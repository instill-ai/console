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
  compiler: {
    styledJsx: true,
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
  env: {
    // This is needed for the integration auth to work
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // This settings here is to fix the building error related to the of the useSearchParams() hook
  // https://github.com/vercel/next.js/issues/61697#issuecomment-1966289723
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};
