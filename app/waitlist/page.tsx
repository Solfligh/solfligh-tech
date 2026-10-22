// app/waitlist/page.tsx
"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "@/app/components/Container";
import {
  getProduct,
  isCloudSlug,
  normalizeProductSlug,
  productLabel as canonicalProductLabel,
} from "@/app/lib/products";

type ApiResponse =
  | { ok: true; stored?: boolean; message: string }
  | { ok: false; error: string };

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

/* ------------------------------
   Inner component (SAFE)
-------------------------------- */
function WaitlistContent() {
  const sp = useSearchParams();

  const rawProduct = sp.get("product");

  // Solfligh Cloud is the platform layer, not a product (Blueprint 11.1), so it
  // must never be routed through a product waitlist.
  const cloudRequested = useMemo(() => isCloudSlug(rawProduct), [rawProduct]);

  const product = useMemo(() => normalizeProductSlug(rawProduct), [rawProduct]);

  const source = useMemo(() => {
    return (sp.get("source") || "waitlist_page").trim();
  }, [sp]);

  // Known products get their canonical name and a real "back" destination.
  // Unknown slugs fall back to neutral copy rather than an invented name.
  const info = useMemo(() => getProduct(product), [product]);
  const productLabel = useMemo(() => canonicalProductLabel(product), [product]);
  const hasKnownProduct = !!info;

  // jèrè is live by access code, so it gets a request form rather than a
  // waitlist. Other products keep the waitlist.
  const accessCode = product === "profitpilot";

  const [businessType, setBusinessType] = useState("");
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          source,
          email,
          fullName,
          phone,
          company,
          note,
          ...(accessCode ? { businessType, consent } : {}),
        }),
      });

      const data = (await res.json()) as ApiResponse;

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(!data.ok ? data.error : "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(
        data.message ||
          (accessCode
            ? "Thanks, we have your request. We’ll email you an access code if there is a place for your business. Check your spam folder too."
            : "You’re in. We’ll notify you when early access opens.")
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  // Cloud is not a product: show where to actually go instead of a waitlist form.
  if (cloudRequested) {
    return (
      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden">
          <Container>
            <div className="relative py-12 sm:py-16">
              <div className="mx-auto max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>Solfligh Cloud</Pill>
                  <Pill>Platform</Pill>
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Solfligh Cloud doesn’t use a product waitlist
                </h1>

                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  Solfligh Cloud is the platform and infrastructure layer behind our
                  products, not a product you join a waitlist for. Read what’s live
                  today, or talk to us about building on it.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/cloud"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Explore Solfligh Cloud
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    Talk to us
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-sky-200/25 blur-3xl" />
          <div className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-blue-200/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/60 blur-3xl" />
        </div>

        <Container>
          <div className="relative py-12 sm:py-16">
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>Early access</Pill>
                {hasKnownProduct && <Pill>{productLabel}</Pill>}
                {!accessCode && <Pill>Waitlist</Pill>}
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {accessCode
                  ? `Request your ${productLabel} access code`
                  : hasKnownProduct
                    ? `Join the ${productLabel} waitlist`
                    : "Join the waitlist"}
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {accessCode
                  ? `${productLabel} is in early access. Tell us about your business and we’ll email you an access code to create your account.`
                  : "Get notified when early access opens. No spam just product updates and your invite."}
              </p>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {status === "success" ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-950">
                      {accessCode ? "Request received" : "You’re on the list ✅"}
                    </p>
                    <p className="text-sm text-slate-700">{message}</p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      {info && (
                        <Link
                          href={info.backHref}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                        >
                          {info.backLabel}
                        </Link>
                      )}
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        Go home
                      </Link>
                    </div>
                  </div>
                ) : accessCode ? (
                  <form onSubmit={onSubmit} className="space-y-4">
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      aria-label="Your name"
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      type="tel"
                      aria-label="Phone or WhatsApp number"
                      placeholder="Phone or WhatsApp number"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                      aria-label="Email address"
                      placeholder="Email address"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      required
                      aria-label="What kind of business do you run?"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">What kind of business do you run?</option>
                      <option value="Shop">Shop</option>
                      <option value="Trader">Trader</option>
                      <option value="Food">Food</option>
                      <option value="Services">Services</option>
                      <option value="Other">Other</option>
                    </select>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      aria-label="What is your biggest challenge managing your business? (optional)"
                      placeholder="What is your biggest challenge managing your business? (optional)"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <label className="flex items-start gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        required
                        className="mt-1"
                      />
                      <span>
                        I agree to be contacted about {productLabel} (see our{" "}
                        <Link href="/privacy" className="underline">
                          privacy page
                        </Link>
                        ).
                      </span>
                    </label>

                    {status === "error" && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                    >
                      {status === "loading" ? "Sending…" : "Request an access code"}
                    </button>
                    {info?.appUrl && (
                      <p className="text-sm text-slate-600">
                        Already have a code?{" "}
                        <a
                          href={info.appUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-sky-700 underline"
                        >
                          Open {productLabel}
                        </a>
                      </p>
                    )}
                  </form>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name (optional)"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company (optional)"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>

                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                      placeholder="Email address"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />

                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                      placeholder={
                        hasKnownProduct
                          ? `What do you want ${productLabel} to help with?`
                          : "What do you want this product to help with?"
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />

                    {status === "error" && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                    >
                      {status === "loading" ? "Joining…" : "Join the waitlist"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/* ------------------------------
   REQUIRED Suspense wrapper
-------------------------------- */
export default function WaitlistPage() {
  return (
    <Suspense fallback={null}>
      <WaitlistContent />
    </Suspense>
  );
}
