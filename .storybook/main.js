const path = require("path");
module.exports = {
  webpackFinal: async (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "../src");
    config.resolve.alias["@/components"] = path.resolve(
      __dirname,
      "../src/components"
    );
    config.resolve.alias["@/types"] = path.resolve(__dirname, "../src/types");
    config.resolve.alias["@/hooks"] = path.resolve(__dirname, "../src/hooks");
    return config;
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-next-router",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  framework: "@storybook/react",
};
