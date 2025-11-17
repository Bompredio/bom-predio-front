import path from 'path';

const nextConfig = {
  experimental: { appDir: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(process.cwd()),
      '@components': path.resolve(process.cwd(), 'components'),
      '@lib': path.resolve(process.cwd(), 'lib'),
      '@pages': path.resolve(process.cwd(), 'pages'),
      '@ui': path.resolve(process.cwd(), 'components/ui')
    };
    return config;
  }
};

export default nextConfig;
