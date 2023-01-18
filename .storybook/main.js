const path = require("path");
module.exports = {
  webpackFinal: async (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "../src");
    config.resolve.alias["@/components"] = path.resolve(
      __dirname,
      "../src/components"
    );
    config.resolve.alias["@/hooks"] = path.resolve(__dirname, "../src/hooks");
    config.resolve.alias["@/lib"] = path.resolve(__dirname, "../src/lib");
    config.resolve.alias["@/pages"] = path.resolve(__dirname, "../src/pages");
    config.resolve.alias["@/services"] = path.resolve(
      __dirname,
      "../src/services"
    );
    config.resolve.alias["@/styles"] = path.resolve(__dirname, "../src/styles");
    config.resolve.alias["@/types"] = path.resolve(__dirname, "../src/types");
    config.resolve.alias["@/utils"] = path.resolve(__dirname, "../src/utils");
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
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: true,
  },
};
