// app/layout.tsx
import type { Metadata, Viewport } from "next";
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

function ogUrl(params: { title?: string; subtitle?: string; badge?: string }) {
  const u = new URL("/og", SITE_URL);
  if (params.title) u.searchParams.set("title", params.title);
  if (params.subtitle) u.searchParams.set("subtitle", params.subtitle);
  if (params.badge) u.searchParams.set("badge", params.badge);
  return u.toString();
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "SOLFLIGH TECH – Automation & Software That Saves You Time",
    template: "%s — SOLFLIGH TECH",
  },
  description:
    "SOLFLIGH TECH builds modern platforms like ProfitPilot and RebirthAgro — focused on automation, clarity, and real business impact.",

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicon-192.png", sizes: "192x192", type: "image/png" }],
  },

  openGraph: {
    title: "SOLFLIGH TECH",
    description: "Technology · Innovation · Getting you back your time",
    url: SITE_URL,
    siteName: "SOLFLIGH TECH",
    type: "website",
    images: [
      {
        url: ogUrl({
          title: "SOLFLIGH TECH",
          subtitle: "Technology · Innovation · Getting you back your time",
          badge: "SOLFLIGH TECH",
        }),
        width: 1200,
        height: 630,
        alt: "SOLFLIGH TECH",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SOLFLIGH TECH",
    description: "Technology · Innovation · Getting you back your time",
    images: [
      ogUrl({
        title: "SOLFLIGH TECH",
        subtitle: "Technology · Innovation · Getting you back your time",
        badge: "SOLFLIGH TECH",
      }),
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
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
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
