/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.zara.net",
      },
      {
        protocol: "https",
        hostname: "**.zara.net",
      },
      {
        protocol: "https",
        hostname: "**.amazon.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
       {
        protocol: "https",
        hostname: "**.ebayimg.com",
      },
    ],
  },
};
 
export default nextConfig;
