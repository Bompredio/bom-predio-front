/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  images: {
    domains: ['your-supabase-domain.supabase.co'],
  },
}

module.exports = nextConfig
