/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack configuration (optional)
  // webpack: (config, { isServer }) => {
  //   // Custom webpack configuration
  //   return config;
  // },

  // Environment variable configuration
  // env: {
  //   CUSTOM_KEY: process.env.CUSTOM_KEY,
  // },

  // Redirects configuration
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-page',
  //       destination: '/new-page',
  //       permanent: true,
  //     },
  //     {
  //       source: '/blog/:slug',
  //       destination: '/posts/:slug',
  //       permanent: false,
  //     }
  //   ];
  // },

  // Rewrites configuration
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://api.example.com/:path*',
  //     }
  //   ];
  // },

  // Image optimization configuration
  images: {
    
      unoptimized: true,
    //domains: ['example.com', 'cdn.example.net'],
    domains: ['i.imgur.com','api.escuelajs.co']
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // TypeScript configuration
  typescript: {
    // Optionally disable type checking during production builds
    ignoreBuildErrors: false,
  },

  // Compiler options (for SWC)
  compiler: {
    // Remove React PropTypes from production build
    // removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    
    // // Experimental features
    // reactRemoveProperties: true,
  },

  // Internationalization configuration
  // i18n: {
  //   locales: ['en', 'fr', 'de'],
  //   defaultLocale: 'en',
  // },

  // Performance and optimization settings
  // productionBrowserSourceMaps: false,
  // optimizeFonts: true,

  // Experimental features
  experimental: {
    // Enable React Server Components
   // serverComponents: true,
   //turboMode: true,
    // Optimize server-side rendering
   // optimizeServerReact: true,
  },

  // Disable x-powered-by header for security
  //poweredByHeader: false,
};

module.exports = nextConfig;