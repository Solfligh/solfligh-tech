// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const SITE_URL = "https://solflightech.org";
const ORG_NAME = "SOLFLIGH TECH";

// If you have Google Analytics enabled, set this in Vercel/Render:
// NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// ✅ Organization Schema (JSON-LD) - Updated with Books
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORG_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og.png`,
  description:
    "SOLFLIGH TECH builds modern platforms like ProfitPilot, ProfitFX, and RebirthAgro — focused on automation, clarity, and real business impact. Read our books on psychology, trauma recovery, and personal growth.",
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
    default: "SOLFLIGH TECH — Technology · Innovation · Getting you back your time",
    template: "%s — SOLFLIGH TECH",
  },
  description:
    "SOLFLIGH TECH builds modern platforms like ProfitPilot, ProfitFX, and RebirthAgro — focused on automation, clarity, and real business impact.",

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
  const hasGA = Boolean(GA_ID);

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* ✅ Optional preconnects (only if GA is enabled) */}
        {hasGA ? (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
          </>
        ) : null}

        {/* ✅ Organization schema injected site-wide (in head is ideal) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          key="org-jsonld"
        />
      </head>

      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        {/* ✅ Google Analytics — lazy loaded to protect performance */}
        {hasGA ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        ) : null}

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}