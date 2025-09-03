/** @type {import('next').NextConfig} */
const nextConfig = {
  // This will ignore all ESLint errors during the build process.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // This will ignore all TypeScript errors during the build process.
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;