/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Three.js / R3F transpile safety
  transpilePackages: ["three"],
};

export default nextConfig;
