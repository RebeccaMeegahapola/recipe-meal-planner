import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Image optimization
    images: {
        domains: [
            'images.pexels.com',
            'images.unsplash.com',
            'spoonacular.com',
            'img.spoonacular.com',
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.pexels.com',
            },
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**.spoonacular.com',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Enable React Strict Mode for better development
    reactStrictMode: true,

    // Compiler options
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Production browser source maps (helps with debugging)
    productionBrowserSourceMaps: false,

    // Disable X-Powered-By header for security
    poweredByHeader: false,

    // Increase timeout for API routes (Spoonacular API can be slow)
    staticPageGenerationTimeout: 120,

    // Experimental features (optional)
    experimental: {
        optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
    },

    // Output configuration
    output: 'standalone', // Smaller deployment size on Vercel

    // Headers for security
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
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ];
    },

    // Redirects (if needed)
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;