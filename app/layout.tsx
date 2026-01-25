// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Analytics from "@/app/components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const SITE_URL = "https://solflightech.org";
const ORG_NAME = "SOLFLIGH TECH";

// ✅ Organization Schema (JSON-LD)
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORG_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`, // must exist in /public
  image: `${SITE_URL}/og.png`, // must exist in /public
  description:
    "SOLFLIGH TECH builds modern platforms like ProfitPilot, ProfitFX, and RebirthAgro — focused on automation, clarity, and real business impact.",
  sameAs: [],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SOLFLIGH TECH — Technology · Innovation · Getting you back your time",
    template: "%s — SOLFLIGH TECH",
  },
  description:
    "SOLFLIGH TECH builds modern platforms like ProfitPilot, ProfitFX, and RebirthAgro — focused on automation, clarity, and real business impact.",

  // ✅ Use standard, predictable favicon paths
  // IMPORTANT: these files must exist in /public
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicon-192.png", sizes: "192x192", type: "image/png" }],
  },

  openGraph: {
    title: ORG_NAME,
    description: "Technology · Innovation · Getting you back your time",
    url: SITE_URL,
    siteName: ORG_NAME,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SOLFLIGH TECH",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: ORG_NAME,
    description: "Technology · Innovation · Getting you back your time",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#0284c7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        {/* ✅ Organization schema injected site-wide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
