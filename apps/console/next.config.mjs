import MillionLint from "@million/lint";

const nextConfig = {
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
    ];
  },
};

export default MillionLint.next({ rsc: true })(nextConfig);
