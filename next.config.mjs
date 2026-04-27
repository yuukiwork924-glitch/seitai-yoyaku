import withPWA from "next-pwa";
import defaultCache from "next-pwa/cache.js";

// API routes must never be cached — always fetch fresh from server
const runtimeCaching = defaultCache.map((entry) => {
  if (entry.options?.cacheName === "apis") {
    return { urlPattern: entry.urlPattern, handler: "NetworkOnly", method: "GET" };
  }
  return entry;
});

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default pwaConfig(nextConfig);
