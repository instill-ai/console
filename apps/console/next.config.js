/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    "@mdxeditor/editor",
    "@instill-ai/toolkit",
    "@instill-ai/design-system",
    "@instill-ai/design-tokens",
  ],
  output: "standalone",
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
};
