import type { NextConfig } from "next";

// cacheComponents is off: the staff dashboard reads the login on every request,
// which is simpler with classic dynamic rendering (same setup as the MSJ site).
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // Tailwind CSS
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
