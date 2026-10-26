"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useSelectedLayoutSegments } from "next/navigation";
import CookieSettings from "@/app/components/CookieSettings";
import { getProduct } from "@/app/lib/products";

function useJereLanding() {
  const segments = useSelectedLayoutSegments();
  // The branded homepage rewrites to this route. Segments also work during SSR,
  // so the corporate navigation never flashes before hydration.
  return segments[0] === "products" && segments[1] === "profitpilot";
}

export function SiteHeader({ children }: { children: ReactNode }) {
  const isJere = useJereLanding();
  if (!isJere) return children;

  const product = getProduct("profitpilot")!;
  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e0ef] bg-[#fbfaf7]/95 text-[#201c33] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <a href="#" aria-label="Jèrè home" className="flex shrink-0 items-center gap-2 no-underline">
          <Image src="/projects/profitpilot/logo.png" alt="" width={40} height={40} className="rounded-xl" />
          <span className="text-2xl font-bold tracking-tight">jèrè</span>
        </a>
        <nav aria-label="Jèrè navigation" className="hidden items-center gap-6 text-sm font-medium text-[#625c70] md:flex">
          <a href="#features" className="hover:text-[#5546e8]">Features</a>
          <a href="#offline" className="hover:text-[#5546e8]">Offline</a>
          <a href="#screens" className="hover:text-[#5546e8]">Inside Jèrè</a>
          <a href="#questions" className="hover:text-[#5546e8]">FAQs</a>
        </nav>
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <a href={`${product.appUrl}sign-in`} className="py-2 text-sm font-semibold hover:text-[#5546e8]">Sign in</a>
          <a href={product.ctaHref} className="rounded-xl bg-[#5546e8] px-4 py-3 text-sm font-semibold text-white no-underline hover:bg-[#4335cc]">Get started</a>
        </div>
      </div>
      <nav aria-label="Jèrè sections" className="flex justify-center gap-5 border-t border-[#e5e0ef] px-4 py-3 text-sm font-medium text-[#625c70] md:hidden">
        <a href="#features">Features</a>
        <a href="#offline">Offline</a>
        <a href="#screens">Inside Jèrè</a>
        <a href="#questions">FAQs</a>
      </nav>
    </header>
  );
}

export function SiteFooter({ children }: { children: ReactNode }) {
  const isJere = useJereLanding();
  if (!isJere) return children;

  const product = getProduct("profitpilot")!;
  return (
    <footer className="border-t border-[#e5e0ef] bg-[#fbfaf7] text-[#625c70]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <a href="#" className="text-2xl font-bold tracking-tight text-[#201c33] no-underline">jèrè</a>
          <p className="mt-2 text-sm">Sales, stock, expenses and customer debts, together.</p>
        </div>
        <nav aria-label="Jèrè footer" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          <a href={`${product.appUrl}help`}>Help</a>
          <a href={`${product.appUrl}privacy`}>Privacy</a>
          <a href={`${product.appUrl}terms`}>Terms</a>
          <CookieSettings />
        </nav>
      </div>
    </footer>
  );
}
