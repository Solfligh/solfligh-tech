// app/admin/access-requests/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import { useAdminSession } from "../useAdminSession";

type RequestRow = {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  businessType: string;
  challenge: string;
  consent: boolean;
  source: string | null;
  createdAt: string | null;
  codeSentAt: string | null;
};

type Filter = "pending" | "sent" | "";

function fmtDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

/** Digits only, for a wa.me link. Nigerian local numbers start with 0. */
function whatsappHref(phone: string | null) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return null;
  const intl = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

export default function AccessRequestsPage() {
  const session = useAdminSession();
  const [tokenInput, setTokenInput] = useState("");

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("pending");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [rows, setRows] = useState<RequestRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  const load = useCallback(async () => {
    setLoading(true);
    setToast(null);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (q.trim()) params.set("q", q.trim());
      if (filter) params.set("status", filter);

      const res = await fetch(`/api/admin/access-requests?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load requests");

      setRows(data.requests || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "Failed to load requests" });
    } finally {
      setLoading(false);
    }
  }, [page, q, filter]);

  useEffect(() => {
    if (session.signedIn) load();
    // q is applied by the Search button, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.signedIn, page, filter]);

  async function toggleSent(r: RequestRow) {
    const sent = !r.codeSentAt;
    setToast(null);
    try {
      const res = await fetch("/api/admin/access-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, sent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");

      // Reload rather than patching in place, so the Pending/Sent filter stays honest.
      await load();
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "Update failed" });
    }
  }

  const pill = (value: Filter, label: string) => (
    <button
      type="button"
      onClick={() => {
        setPage(1);
        setFilter(value);
      }}
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
        filter === value
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="bg-white text-slate-900">
      <section className="py-12 sm:py-16">
        <Container>
          <PageHeader
            level={1}
            badge="Admin"
            title="jèrè access requests"
            subtitle="People who asked for an access code. Send the code yourself, then mark it sent."
            actions={
              <Link
                href="/admin/leads"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
              >
                View leads
              </Link>
            }
          />

          {toast && (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                toast.type === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {toast.msg}
            </div>
          )}

          {session.signedIn === null ? null : !session.signedIn ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await session.signIn(tokenInput.trim());
                setTokenInput("");
              }}
              className="mt-10 max-w-md space-y-3 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-slate-900">Admin access</h2>
              <p className="text-xs text-slate-600">Paste your admin token once to sign in on this browser.</p>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Admin token"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              {session.error && <p className="text-xs text-rose-700">{session.error}</p>}
              <button
                type="submit"
                disabled={session.busy || !tokenInput.trim()}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
              >
                Sign in
              </button>
            </form>
          ) : (
            <div className="mt-10">
              <div className="flex flex-wrap items-center gap-3">
                {pill("pending", "Needs a code")}
                {pill("sent", "Code sent")}
                {pill("", "All")}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPage(1);
                    load();
                  }}
                  className="ml-auto flex gap-2"
                >
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search name, email, phone"
                    className="w-56 rounded-xl border border-slate-200 px-3 py-1.5 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Search
                  </button>
                </form>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {loading ? "Loading…" : `${total} request${total === 1 ? "" : "s"}`}
              </p>

              <ul className="mt-4 space-y-3">
                {rows.map((r) => {
                  const wa = whatsappHref(r.phone);
                  return (
                    <li
                      key={r.id}
                      className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {r.fullName || "—"}
                            {r.businessType && (
                              <span className="ml-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                                {r.businessType}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
                            {r.email}
                            {r.phone && <span className="text-slate-500"> · {r.phone}</span>}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Requested {fmtDate(r.createdAt)}
                            {r.source ? ` · ${r.source}` : ""}
                            {!r.consent ? " · no recorded consent" : ""}
                          </p>
                          {r.challenge && (
                            <p className="mt-2 text-sm text-slate-700">“{r.challenge}”</p>
                          )}
                          {r.codeSentAt && (
                            <p className="mt-2 text-xs font-semibold text-emerald-700">
                              Code sent {fmtDate(r.codeSentAt)}
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                          {wa && (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                            >
                              WhatsApp
                            </a>
                          )}
                          {r.email && (
                            <a
                              href={`mailto:${r.email}?subject=${encodeURIComponent("Your jèrè access code")}`}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                            >
                              Email
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleSent(r)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                              r.codeSentAt
                                ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                : "bg-sky-600 text-white hover:bg-sky-700"
                            }`}
                          >
                            {r.codeSentAt ? "Undo: mark not sent" : "Mark code sent"}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
                {!loading && rows.length === 0 && (
                  <li className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    {filter === "pending" ? "No requests waiting for a code." : "No requests found."}
                  </li>
                )}
              </ul>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-slate-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
