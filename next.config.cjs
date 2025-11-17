const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  // Não usar experimental.appDir aqui (Next 14 já trata isso). 
  // Apenas adicionamos aliases para resolver @/ imports.
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/components/ui': path.resolve(__dirname, 'components/ui'),
      '@/pages': path.resolve(__dirname, 'pages'),
      '@/lib': path.resolve(__dirname, 'lib'),
    };
    return config;
  }
};
