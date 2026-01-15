// next.config.ts

const nextConfig = {
  // Keep deploy stable
  typescript: { ignoreBuildErrors: true },

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
};

export default nextConfig;
