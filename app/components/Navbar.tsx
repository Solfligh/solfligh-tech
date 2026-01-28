"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const primaryLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
];

const moreLinks = [
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/investors", label: "Investors" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const [openMobile, setOpenMobile] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpenMobile(false);
    setOpenMore(false);
  }, [pathname]);

  // Close More on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!moreRef.current) return;
      if (!moreRef.current.contains(e.target as Node)) {
        setOpenMore(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const moreIsActive = useMemo(
    () => moreLinks.some((l) => isActive(pathname, l.href)),
    [pathname]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-4 no-underline">
          <div className="relative h-12 w-12">
            <Image
              src="/logo.png"
              alt="SOLFLIGH TECH"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-wide text-slate-950">
              SOLFLIGH TECH
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Technology · Innovation · Getting you back your time
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {primaryLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition no-underline ${
                  active
                    ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setOpenMore((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                openMore || moreIsActive
                  ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              More
              <svg
                className={`h-4 w-4 transition ${openMore ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {openMore && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="p-2">
                  {moreLinks.map((link) => {
                    const active = isActive(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block rounded-xl px-3 py-2 text-sm font-semibold no-underline transition ${
                          active
                            ? "bg-sky-50 text-sky-700"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white no-underline hover:bg-sky-500"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpenMobile((v) => !v)}
          className="md:hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-bold"
        >
          {openMobile ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {openMobile && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-4">
            {[...primaryLinks, ...moreLinks].map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-bold no-underline transition ${
                    active
                      ? "bg-sky-50 text-sky-700"
                      : "text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/contact"
              className="block rounded-xl bg-sky-600 px-4 py-3 text-center text-sm font-bold text-white no-underline hover:bg-sky-500"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
