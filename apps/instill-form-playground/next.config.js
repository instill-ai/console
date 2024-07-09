/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@instill-ai/toolkit",
    "@instill-ai/design-system",
    "@instill-ai/design-tokens",
  ],
};

module.exports = nextConfig;
