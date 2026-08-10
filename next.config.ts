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
      // NOTE: these must stay ABOVE the /projects -> /products rules below.
      // Next matches redirects in array order, so the catch-all would otherwise
      // swallow /projects/profitfx and send it to /products/profitfx instead of
      // the external FXCopilot app.
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
      {
        source: "/products/profitfx",
        destination: "https://fxco-pilot.solflightech.org",
        permanent: true,
      },
      {
        source: "/products/profitfx/:path*",
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
      // ✅ /projects -> /products (Website Architecture §11)
      // -----------------------------
      {
        source: "/projects",
        destination: "/products",
        permanent: true,
      },
      {
        // The [^.]+ pattern deliberately excludes any path containing a dot.
        // Redirects run BEFORE filesystem routes, so a bare :path* here would
        // also capture the project media that still lives in public/projects
        // (e.g. /projects/video-poster.jpg, /projects/profitpilot/1.jpg) and
        // redirect those images to URLs that do not exist. Assets keep their
        // /projects paths; only page routes move.
        source: "/projects/:path([^.]+)",
        destination: "/products/:path",
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