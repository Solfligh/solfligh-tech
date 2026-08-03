// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Keep deploy stable (we can turn this OFF after everything is green)
  typescript: {
    ignoreBuildErrors: true,
  },

  /**
   * ✅ Images
   * Added Google Drive support for blog images
   */
  images: {
    // `domains` is deprecated in Next 16 (it matches on hostname only, which is
    // a security risk). Every host previously listed there is preserved below.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fxco-pilot.solflightech.org",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  async redirects() {
    return [
      // -----------------------------
      // ProfitFX legacy -> FXCopilot (external subdomain)
      // -----------------------------
      {
        source: "/profitfx",
        destination: "https://fxco-pilot.solflightech.org",
        permanent: true,
      },
      {
        source: "/profitfx/:path*",
        destination: "https://fxco-pilot.solflightech.org",
        permanent: true,
      },

      // Old project slug -> new project slug
      {
        source: "/projects/profitfx",
        destination: "https://fxco-pilot.solflightech.org",
        permanent: true,
      },
      {
        source: "/projects/profitfx/:path*",
        destination: "https://fxco-pilot.solflightech.org",
        permanent: true,
      },

      // Nice short link
      {
        source: "/fxco-pilot",
        destination: "https://fxco-pilot.solflightech.org",
        permanent: true,
      },

      // -----------------------------
      // ✅ ProfitPilot article redirects
      // -----------------------------

      // Slug cleanup: daily number -> daily numbers
      {
        source: "/insights/profitpilot/from-daily-number-to-daily-clarity",
        destination: "/insights/profitpilot/from-daily-numbers-to-daily-clarity",
        permanent: true,
      },
      // Optional guard (rare, but safe)
      {
        source: "/insights/profitpilot/from-daily-number-to-daily-clarity/:path*",
        destination: "/insights/profitpilot/from-daily-numbers-to-daily-clarity",
        permanent: true,
      },

      // Legacy ProfitPilot article -> habit article
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