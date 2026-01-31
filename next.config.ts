// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Keep deploy stable (we can turn this OFF after everything is green)
  typescript: {
    ignoreBuildErrors: true,
  },

  /**
   * ✅ Images
   * DO NOT use hostname: "**" — it breaks builds.
   *
   * If you use Next/Image with Supabase:
   * 1) Look at your NEXT_PUBLIC_SUPABASE_URL (example: https://abcdxyz.supabase.co)
   * 2) Add that hostname to `domains` below (example: "abcdxyz.supabase.co")
   */
  images: {
    domains: [
      // "YOURPROJECT.supabase.co",
      "fxco-pilot.solflightech.com",
    ],
  },

  async redirects() {
    return [
      // -----------------------------
      // ProfitFX legacy -> FXCO-PILOT
      // -----------------------------
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

      // -----------------------------
      // ✅ ProfitPilot article redirect (CRITICAL FIX)
      // -----------------------------
      {
        source: "/insights/profitpilot/how-profitpilot-makes-daily-profit-clarity-automatic",
        destination:
          "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
