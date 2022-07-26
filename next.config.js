/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'secure.gravatar.com', 'gitlab.com'],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

/*
const nextConfigDev = {
  productionBrowserSourceMaps: true, // Add to see source maps in Lighthouse
  ...nextConfig,
};

// npm i @next/bundle-analyzer, then export it in next.config

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfigDev);
*/

module.exports = nextConfig;
