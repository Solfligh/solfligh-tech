// middleware.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * SOLFLIGH TECH — Maintenance Mode Middleware
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
  return /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json|woff2?|ttf|eot|webmanifest)$/i.test(
    pathname
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow Next internals, admin, maintenance page, and static assets
  if (
    ALLOW_EXACT.has(pathname) ||
    ALLOW_PREFIXES.some((p) => pathname === p || pathname.startsWith(p)) ||
    isStaticAsset(pathname)
  ) {
    return NextResponse.next();
  }

  // ONLY "true" turns maintenance on (prevents "false" being treated as truthy)
  const maintenanceOn =
    (process.env.MAINTENANCE_MODE || "").trim().toLowerCase() === "true";

  if (maintenanceOn) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to all non-API routes
export const config = {
  matcher: ["/((?!api).*)"],
};
