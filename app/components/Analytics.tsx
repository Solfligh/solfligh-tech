"use client";

import Link from "next/link";
import Script from "next/script";
import { useSyncExternalStore } from "react";
import { getConsentSnapshot, setConsent, subscribeConsent } from "@/app/lib/consent";

/**
 * Google Analytics behind a consent banner. Nothing is requested from Google
 * until the visitor accepts; declining (or never answering) loads nothing.
 * With no NEXT_PUBLIC_GA_ID there is nothing to consent to, so no banner.
 */
export default function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  // "loading" on the server and during hydration, so the banner never flashes at a visitor
  // who has already answered. null = not answered yet.
  const choice = useSyncExternalStore(subscribeConsent, getConsentSnapshot, () => "loading" as const);

  if (!GA_ID) return null;

  return (
    <>
      {choice === "granted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: true, anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {choice === null ? (
        <div
          role="dialog"
          aria-label="Analytics cookies"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-slate-800">
              We would like to use Google Analytics cookies to see which pages are useful. Nothing
              is sent to Google unless you accept.{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setConsent("denied")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-900"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => setConsent("granted")}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
