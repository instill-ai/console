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

    // We need this line to make our code-hike snippet work under Next.js standalone server
    // https://github.com/code-hike/codehike/issues/283
    outputFileTracingIncludes: {
      "/pipelines/[id]": ["node_modules/.pnpm/**/shiki/**/*.json"],
    },
  },
};
