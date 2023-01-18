/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  output: "standalone",

  // We need to ignore the babelrc.json at the root, that is for storybook
  experimental: {
    forceSwcTransforms: true,
  },
};
