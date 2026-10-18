"use client";

import { setConsent } from "@/app/lib/consent";

/** Footer link: forget the saved analytics choice and ask again. */
export default function CookieSettings() {
  return (
    <button type="button" onClick={() => setConsent(null)} className="hover:text-slate-900">
      Cookie choices
    </button>
  );
}
