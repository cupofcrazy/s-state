/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.scdn.co" },
      { hostname: "via.placeholder.com" },
      { hostname: "mosaic.scdn.co" },
      { hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
