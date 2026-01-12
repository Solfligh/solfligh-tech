import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isMaintenance = process.env.MAINTENANCE_MODE === "true";
  if (!isMaintenance) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // ✅ Allow maintenance + admin while site is locked
  if (pathname === "/maintenance" || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow Next.js internals + static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-touch-icon") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/pwa-assets")
  ) {
    return NextResponse.next();
  }

  // Allow common static file extensions (images/fonts/css/js)
  if (
    /\.(png|jpg|jpeg|webp|svg|gif|ico|css|js|map|txt|xml|json|woff|woff2|ttf|eot)$/.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  // Redirect everything else to /maintenance
  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api).*)"],
};
