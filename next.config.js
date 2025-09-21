/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com', 'storage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['@google-cloud/documentai', '@google-cloud/aiplatform', '@google-cloud/bigquery'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };
    return config;
  },
  // Environment variables for build-time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Enable standalone output for Docker deployment
  output: 'standalone',
  // Optimize for serverless deployment
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
}

module.exports = nextConfig
