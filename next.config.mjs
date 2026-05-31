/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    formats: ["image/webp"],        // webp only — avif is slow to encode, adds first-load latency
    minimumCacheTTL: 31536000,      // cache optimised images for 1 year
    deviceSizes: [640, 1080, 1920], // tighter ladder — fewer variants to generate
    imageSizes: [96, 256, 512],     // thumbnail + card + stage sizes
  },
  // Three.js / R3F transpile safety
  transpilePackages: ["three"],
};

export default nextConfig;
