module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};
