// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/app/lib/site";
import { JERE_DOMAIN_HOST, JERE_APEX_HOST, JERE_DOMAIN_ORIGIN, JERE_LEGACY_PATH, JERE_ICON_PATH, isJereHost, jereDomainEnabled } from "@/app/lib/jereDomain";

/**
 * SOLFLIGH TECH  Maintenance Mode Proxy (SEO-safe)
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

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = (req.headers.get("host") || req.nextUrl.hostname).replace(/:\d+$/, "").toLowerCase();
  const brandedHost = isJereHost(hostname);
  const toJereHome = () => {
    const target = new URL(JERE_DOMAIN_ORIGIN);
    target.search = req.nextUrl.search;
    return NextResponse.redirect(target, 308);
  };

  if (hostname === JERE_APEX_HOST) {
    const target = req.nextUrl.clone();
    target.protocol = "https:";
    target.host = JERE_DOMAIN_HOST;
    target.port = "";
    return NextResponse.redirect(target, 308);
  }

  // Browser defaults and saved-home-screen icons must match this hostname,
  // including during maintenance. The corporate site's files stay untouched.
  if (brandedHost && ["/favicon.ico", "/favicon.png", "/favicon-32.png", "/favicon-192.png", "/favicon-512.png", "/apple-touch-icon.png"].includes(pathname)) {
    const target = req.nextUrl.clone();
    target.pathname = JERE_ICON_PATH;
    target.search = "";
    return NextResponse.rewrite(target);
  }
  if (brandedHost && ["/manifest.webmanifest", "/site.webmanifest"].includes(pathname)) {
    return NextResponse.json({
      name: "Jèrè",
      short_name: "Jèrè",
      description: "Sales, stock, expenses and debts with Jèrè.",
      start_url: "/",
      scope: "/",
      display: "browser",
      background_color: "#fbf9f4",
      theme_color: "#121a38",
      icons: [{ src: JERE_ICON_PATH, sizes: "512x512", type: "image/png", purpose: "any" }],
    }, { headers: { "Content-Type": "application/manifest+json; charset=utf-8" } });
  }

  // A separate sitemap keeps corporate URLs off the product domain.
  if (brandedHost && pathname === "/robots.txt") {
    return new NextResponse(`User-agent: *\nAllow: /\nSitemap: ${JERE_DOMAIN_ORIGIN}/sitemap.xml\n`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  if (brandedHost && pathname === "/sitemap.xml") {
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${JERE_DOMAIN_ORIGIN}/</loc></url></urlset>`, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }

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
    if (brandedHost) {
      if (pathname === "/") {
        const target = req.nextUrl.clone();
        target.pathname = JERE_LEGACY_PATH;
        return NextResponse.rewrite(target);
      }
      if ([JERE_LEGACY_PATH, "/products/jere", "/jere"].includes(pathname)) return toJereHome();
      if (pathname === "/og") return NextResponse.next();
      // Company navigation and articles continue to live on the company site.
      const target = new URL(SITE_URL);
      target.pathname = pathname;
      target.search = req.nextUrl.search;
      return NextResponse.redirect(target, 308);
    }
    if (jereDomainEnabled() && [JERE_LEGACY_PATH, "/products/jere", "/jere"].includes(pathname)) return toJereHome();
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

// Optional: limit the proxy to routes that matter (keeps it fast & predictable)
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
