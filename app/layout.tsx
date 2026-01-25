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

export const metadata: Metadata = {
  metadataBase: new URL("https://solflightech.org"),

  title: {
    default: "SOLFLIGH TECH — Technology · Innovation · Getting you back your time",
    template: "%s — SOLFLIGH TECH",
  },

  description:
    "SOLFLIGH TECH builds modern platforms like ProfitPilot, ProfitFX, and RebirthAgro — focused on automation, clarity, and real business impact.",

  alternates: {
    canonical: "https://solflightech.org",
  },

  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },

  openGraph: {
    title: "SOLFLIGH TECH",
    description: "Technology · Innovation · Getting you back your time",
    url: "https://solflightech.org",
    siteName: "SOLFLIGH TECH",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "SOLFLIGH TECH — Technology & Innovation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SOLFLIGH TECH",
    description: "Technology · Innovation · Getting you back your time",
    images: ["/og-default.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
