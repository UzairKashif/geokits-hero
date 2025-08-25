import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for mobile
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental features for performance
  experimental: {
    // Enable gzip compression
    gzipSize: true,
    // Better tree shaking
    optimizePackageImports: ['framer-motion', 'gsap', 'mapbox-gl', 'lenis'],
  },
  
  // Headers for mobile optimization
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Cache static assets aggressively
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Enable webpack bundle analyzer in development
  webpack: (config, { dev, isServer }) => {
    // Optimize for mobile performance
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: 'gsap',
            chunks: 'all',
          },
          mapbox: {
            test: /[\\/]node_modules[\\/]mapbox-gl[\\/]/,
            name: 'mapbox',
            chunks: 'all',
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Enable compression
  compress: true,
  
  // Generate static pages where possible
  output: 'standalone',
  
  // Power consumption settings for mobile
  poweredByHeader: false,
  
  // Strict mode for better performance
  reactStrictMode: true,
};

export default nextConfig;
