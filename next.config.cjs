const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: { appDir: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
      '@components': path.resolve(__dirname, 'components'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@ui': path.resolve(__dirname, 'components/ui')
    };
    return config;
  }
};
