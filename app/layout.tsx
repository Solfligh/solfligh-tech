// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Analytics from "@/app/components/Analytics";
import { SITE_URL } from "@/app/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const ORG_NAME = "SOLFLIGH TECH";

// ✅ Organization Schema (JSON-LD) - Updated with Books
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORG_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og.png`,
  description:
    "SOLFLIGH TECH builds modern platforms like jèrè, FXCopilot, and RebirthAgro focused on automation, clarity, and real business impact. Read our books on psychology, trauma recovery, and personal growth.",
  sameAs: [],
  hasMenu: {
    "@type": "Menu",
    name: "Main Navigation",
    hasMenuSection: {
      "@type": "MenuSection",
      name: "Content",
      hasMenuItem: [
        {
          "@type": "MenuItem",
          name: "eBooks",
          url: `${SITE_URL}/books`
        },
        {
          "@type": "MenuItem",
          name: "Blog",
          url: `${SITE_URL}/blog`
        }
      ]
    }
  }
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SOLFLIGH TECH  Technology · Innovation · Getting you back your time",
    template: "%s SOLFLIGH TECH",
  },
  description:
    "SOLFLIGH TECH builds modern platforms like jèrè, FXCopilot, and RebirthAgro focused on automation, clarity, and real business impact.",

  // ✅ Use standard, predictable favicon paths
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
      <head>
        {/* ✅ Organization schema injected site-wide (in head is ideal) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          key="org-jsonld"
        />
      </head>

      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        {/* Google Analytics loads only after the visitor accepts (see Analytics) */}
        <Analytics />

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
