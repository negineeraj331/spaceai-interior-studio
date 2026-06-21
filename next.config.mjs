/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.replicate.delivery" },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
