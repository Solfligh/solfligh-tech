import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// Uses env in production, falls back to localhost in dev.
// On Vercel you can set NEXT_PUBLIC_SITE_URL to your domain later.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SOLFLIGH TECH — Innovative Software Solutions",
    template: "%s — SOLFLIGH TECH",
  },
  description:
    "SOLFLIGH TECH builds intelligent, scalable, future-ready technology — from modern web and mobile products to AI automation and agent-driven systems.",
  icons: {
    icon: "/favicon-32.png",
    apple: "/favicon-192.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "SOLFLIGH TECH",
    title: "SOLFLIGH TECH — Innovative Software Solutions",
    description:
      "We build intelligent, scalable, future-ready technology — software, automation, and AI systems.",
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
    title: "SOLFLIGH TECH — Innovative Software Solutions",
    description:
      "We build intelligent, scalable, future-ready technology — software, automation, and AI systems.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
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
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
