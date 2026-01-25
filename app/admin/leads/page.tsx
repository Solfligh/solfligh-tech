// app/admin/leads/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

type LeadRow = {
  id: string;
  project_slug: string | null;
  name: string | null;
  email: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string | null;

  status: "new" | "contacted" | string | null;
  contacted_at: string | null;
};

function fmtDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function safe(v: unknown) {
  return String(v ?? "").trim();
}

function buildLeadClipboardText(r: LeadRow) {
  const lines = [
    `Lead (${r.status || "new"})`,
    `When: ${fmtDate(r.created_at)}`,
    r.contacted_at ? `Contacted: ${fmtDate(r.contacted_at)}` : null,
    `Project: ${r.project_slug || "-"}`,
    `Name: ${r.name || "-"}`,
    `Email: ${r.email || "-"}`,
    r.company ? `Company: ${r.company}` : null,
    r.source ? `Source: ${r.source}` : null,
    "",
    "Message:",
    r.message || "-",
    "",
    `ID: ${r.id}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export default function AdminLeadsPage() {
  const [adminToken, setAdminToken] = useState("");

  const [q, setQ] = useState("");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState<"" | "new" | "contacted">("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [rows, setRows] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function load() {
    setToast(null);

    if (!adminToken.trim()) {
      setToast({ type: "err", msg: "Paste your ADMIN_TOKEN first." });
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (project.trim()) params.set("project", project.trim().toLowerCase());
      if (status) params.set("status", status);

      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: { "x-admin-token": adminToken.trim() },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load leads");

      setRows(data.leads || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "Failed to load leads" });
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    setPage(1);
    load();
  }

  useEffect(() => {
    if (!adminToken.trim()) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, page]);

  async function copyLead(r: LeadRow) {
    try {
      const text = buildLeadClipboardText(r);
      await navigator.clipboard.writeText(text);
      setToast({ type: "ok", msg: "Copied to clipboard." });
    } catch {
      setToast({ type: "err", msg: "Copy failed (browser blocked clipboard)." });
    }
  }

  async function exportCsv() {
    setToast(null);

    if (!adminToken.trim()) {
      setToast({ type: "err", msg: "Paste your ADMIN_TOKEN first." });
      return;
    }

    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (project.trim()) params.set("project", project.trim().toLowerCase());
      if (status) params.set("status", status);
      params.set("format", "csv");

      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: { "x-admin-token": adminToken.trim() },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "CSV export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const date = new Date();
      const stamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
      a.download = `leads-${stamp}.csv`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setToast({ type: "ok", msg: "CSV downloaded." });
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "CSV export failed" });
    }
  }

  async function toggleContacted(r: LeadRow) {
    setToast(null);

    if (!adminToken.trim()) {
      setToast({ type: "err", msg: "Paste your ADMIN_TOKEN first." });
      return;
    }

    const current = (r.status || "new").toLowerCase();
    const next = current === "contacted" ? "new" : "contacted";

    // optimistic UI
    setRows((prev) =>
      prev.map((x) =>
        x.id === r.id
          ? {
              ...x,
              status: next,
              contacted_at: next === "contacted" ? new Date().toISOString() : null,
            }
          : x
      )
    );

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken.trim(),
        },
        body: JSON.stringify({ id: r.id, status: next }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");

      // reconcile with server result
      const updated = data.lead;
      setRows((prev) =>
        prev.map((x) =>
          x.id === r.id
            ? { ...x, status: updated.status, contacted_at: updated.contacted_at }
            : x
        )
      );

      setToast({ type: "ok", msg: next === "contacted" ? "Marked as contacted." : "Marked as new." });
    } catch (e: any) {
      // revert on failure
      setRows((prev) => prev.map((x) => (x.id === r.id ? r : x)));
      setToast({ type: "err", msg: e?.message || "Update failed" });
    }
  }

  return (
    <main className="bg-white text-slate-900">
      <section className="py-12 sm:py-16">
        <Container>
          <PageHeader
            level={1}
            badge="Admin"
            title="Leads"
            subtitle="View, search, export, and track contact status."
            actions={
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  ← Back to admin
                </Link>
                <button
                  type="button"
                  onClick={exportCsv}
                  className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                  disabled={!adminToken.trim()}
                  title={!adminToken.trim() ? "Paste ADMIN_TOKEN first" : "Export filtered leads to CSV"}
                >
                  Export CSV
                </button>
              </div>
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

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* Left controls */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <h2 className="text-sm font-semibold text-slate-900">Admin Token</h2>
                <p className="mt-1 text-xs text-slate-600">
                  Must match your <code className="font-semibold">ADMIN_TOKEN</code> on Vercel.
                </p>

                <input
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                  placeholder="Paste ADMIN_TOKEN here"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => {
                    setPage(1);
                    load();
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Loading…" : "Load leads"}
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <h2 className="text-sm font-semibold text-slate-900">Filters</h2>

                <label className="mt-4 block text-xs font-semibold text-slate-700">Search</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                  placeholder="name, email, company, message…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />

                <label className="mt-4 block text-xs font-semibold text-slate-700">Project (slug)</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                  placeholder="profitpilot / fxco-pilot / rebirthagro / contact…"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />

                <label className="mt-4 block text-xs font-semibold text-slate-700">Status</label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="">All</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                </select>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={applyFilters}
                    disabled={loading}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQ("");
                      setProject("");
                      setStatus("");
                      setPage(1);
                      setToast(null);
                      if (adminToken.trim()) load();
                    }}
                    disabled={loading}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-60"
                  >
                    Clear
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Export CSV exports your current filters (not just the current page).
                </p>
              </div>
            </div>

            {/* Results table */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Results{" "}
                    <span className="text-slate-500 font-normal">({total.toLocaleString()})</span>
                  </h2>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={loading || page <= 1}
                      className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <div className="text-sm text-slate-600">
                      Page <span className="font-semibold">{page}</span> /{" "}
                      <span className="font-semibold">{totalPages}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={loading || page >= totalPages}
                      className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-slate-500">
                      <tr className="border-b border-slate-200">
                        <th className="py-3 pr-4">When</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-4">Project</th>
                        <th className="py-3 pr-4">Name</th>
                        <th className="py-3 pr-4">Email</th>
                        <th className="py-3 pr-4">Company</th>
                        <th className="py-3 pr-4">Message</th>
                        <th className="py-3 pr-0 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="text-slate-700">
                      {rows.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-slate-500">
                            {loading ? "Loading…" : "No leads found."}
                          </td>
                        </tr>
                      ) : (
                        rows.map((r) => {
                          const st = (r.status || "new").toLowerCase();
                          const isContacted = st === "contacted";

                          return (
                            <tr key={r.id} className="border-b border-slate-100 align-top">
                              <td className="py-3 pr-4 whitespace-nowrap">
                                {fmtDate(r.created_at)}
                                {r.contacted_at ? (
                                  <div className="mt-1 text-xs text-slate-500">
                                    Contacted: {fmtDate(r.contacted_at)}
                                  </div>
                                ) : null}
                              </td>

                              <td className="py-3 pr-4 whitespace-nowrap">
                                <span
                                  className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                                    isContacted
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                      : "border-slate-200 bg-white text-slate-700"
                                  }`}
                                >
                                  {isContacted ? "contacted" : "new"}
                                </span>
                              </td>

                              <td className="py-3 pr-4 whitespace-nowrap">
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                                  {r.project_slug || "-"}
                                </span>
                              </td>

                              <td className="py-3 pr-4">{r.name || "-"}</td>

                              <td className="py-3 pr-4">
                                {r.email ? (
                                  <a className="underline" href={`mailto:${safe(r.email)}`}>
                                    {r.email}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </td>

                              <td className="py-3 pr-4">{r.company || "-"}</td>

                              <td className="py-3 pr-4 max-w-[360px]">
                                <div className="whitespace-pre-wrap break-words text-slate-600">
                                  {r.message || "-"}
                                </div>
                                <div className="mt-2 text-xs text-slate-400">
                                  {r.source ? `Source: ${r.source}` : null}
                                </div>
                              </td>

                              <td className="py-3 pr-0 whitespace-nowrap text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => copyLead(r)}
                                    className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                                    title="Copy lead details"
                                  >
                                    Copy
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => toggleContacted(r)}
                                    className={`rounded-xl px-3 py-2 text-xs font-semibold shadow-sm transition ${
                                      isContacted
                                        ? "border border-slate-200 bg-white/70 text-slate-900 hover:bg-white"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                                    }`}
                                    title={isContacted ? "Mark as new" : "Mark as contacted"}
                                  >
                                    {isContacted ? "Unmark" : "Contacted"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  Showing {rows.length} of {total.toLocaleString()} leads.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
