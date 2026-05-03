import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com', 'placehold.co', 'picsum.photos', 'fastly.picsum.photos'],
  },
};

export default nextConfig;