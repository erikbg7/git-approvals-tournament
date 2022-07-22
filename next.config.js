/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'secure.gravatar.com', 'gitlab.com'],
  },
};

module.exports = nextConfig;
