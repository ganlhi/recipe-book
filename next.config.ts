import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    // Find the existing rule for svg files and exclude them
    config.module.rules.forEach(
      (rule: { test: { toString: () => string | string[] }; exclude: RegExp }) => {
        if (rule.test && rule.test.toString().includes('svg')) {
          rule.exclude = /\.svg$/;
        }
      },
    );

    // Add custom rule to handle SVG imports as components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
