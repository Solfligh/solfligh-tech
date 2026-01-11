"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/investors", label: "Investors" },
  { href: "/partner", label: "Partner With Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* BRAND */}
        <Link href="/" className="flex items-center gap-4 no-underline">
          {/* LOGO */}
          <div className="relative h-12 w-12 md:h-14 md:w-14">
            <Image
              src="/logo.png"
              alt="SOLFLIGH TECH"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-base md:text-lg font-extrabold tracking-wide text-slate-950">
              SOLFLIGH TECH
            </span>
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Technology · Innovation · Getting you back your time
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2 md:ml-10">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(link.href + "/");

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
        </nav>

        {/* CTA */}
        <div className="hidden md:flex">
          <Link
            href="/contact"
            className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500 no-underline"
          >
            Contact Us
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-bold"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100 no-underline"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA */}
            <Link
              href="/contact"
              className="block rounded-xl bg-sky-600 px-4 py-3 text-center text-sm font-bold text-white no-underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
