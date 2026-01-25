// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Keep TypeScript strict in production
  typescript: {
    ignoreBuildErrors: false,
  },

  // ✅ Allow external images (Supabase, OG images, videos thumbnails)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "fxco-pilot.solflightech.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async redirects() {
    return [
      // ProfitFX legacy -> FXCO-PILOT
      {
        source: "/profitfx",
        destination: "https://fxco-pilot.solflightech.com",
        permanent: true,
      },
      {
        source: "/profitfx/:path*",
        destination: "https://fxco-pilot.solflightech.com",
        permanent: true,
      },

      // Old project slug -> new project slug
      {
        source: "/projects/profitfx",
        destination: "https://fxco-pilot.solflightech.com",
        permanent: true,
      },
      {
        source: "/projects/profitfx/:path*",
        destination: "https://fxco-pilot.solflightech.com",
        permanent: true,
      },

      // Nice short link
      {
        source: "/fxco-pilot",
        destination: "https://fxco-pilot.solflightech.com",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
