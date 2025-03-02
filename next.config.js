/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

const path = require("path");

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(otf|ttf)$/i,
      type: "asset/resource",
      generator: {
        filename: "fonts/[name][ext]",
      },
    });
    return config;
  },
};
