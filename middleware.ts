// middleware.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * SOLFLIGH TECH — Maintenance Mode Middleware (SEO-safe)
 *
 * IMPORTANT:
 * - Only the literal string "true" enables maintenance mode.
 * - "false", "0", empty, or unset will NOT enable maintenance mode.
 *
 * Env:
 * - MAINTENANCE_MODE=true|false
 */

const ALLOW_PREFIXES = [
  "/maintenance",
  "/admin",
  "/_next", // next internals (static, image optimizer, etc.)
];

const ALLOW_EXACT = new Set([
  // Favicons / icons
  "/favicon.ico",
  "/favicon.png",
  "/favicon-32.png",
  "/favicon-192.png",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/manifest.webmanifest",

  // SEO
  "/robots.txt",
  "/sitemap.xml",
]);

function isStaticAsset(pathname: string) {
  return /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json|woff2?|ttf|eot)$/i.test(
    pathname
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow Next internals, admin, maintenance page, and static assets
  if (
    ALLOW_PREFIXES.some((p) => pathname.startsWith(p)) ||
    ALLOW_EXACT.has(pathname) ||
    isStaticAsset(pathname)
  ) {
    return NextResponse.next();
  }

  const isMaintenanceOn = process.env.MAINTENANCE_MODE === "true";

  if (!isMaintenanceOn) {
    return NextResponse.next();
  }

  // ✅ SEO-safe: serve the maintenance page with 503 (temporary downtime)
  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";

  const res = NextResponse.rewrite(url, { status: 503 });

  // Tell crawlers to come back later (pick a value that fits your maintenance window)
  // 3600 seconds = 1 hour
  res.headers.set("Retry-After", "3600");

  // Extra safety: prevent caching of the maintenance response
  res.headers.set("Cache-Control", "no-store, max-age=0");

  // Optional: hint "don't index this response"
  // (The 503 already does the heavy lifting, but this is fine.)
  res.headers.set("X-Robots-Tag", "noindex, nofollow");

  return res;
}

// Optional: limit middleware to routes that matter (keeps it fast & predictable)
export const config = {
  matcher: [
    /*
      Match all paths except:
      - _next (Next.js internals)
      - static files (handled above too, but this helps reduce runs)
    */
    "/((?!_next/).*)",
  ],
};
