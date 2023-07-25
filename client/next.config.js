/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["recipe-ne.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
