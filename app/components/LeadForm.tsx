"use client";

import { useState } from "react";

type Kind = "contact" | "partner" | "investor" | "developer";

export default function LeadForm({
  kind,
  includeFirm = false,
  buttonText,
  // The field wording is adjustable so a new audience does not need a bespoke
  // form component, which CLAUDE.md rules out. "Firm / Organization" and
  // "Describe the request, goals, and timeline" read oddly to a developer
  // registering for platform access.
  firmLabel = "Firm / Organization",
  firmPlaceholder = "Firm name (optional)",
  messageLabel = "Message",
  messagePlaceholder = "Describe the request, goals, and timeline...",
}: {
  kind: Kind;
  includeFirm?: boolean;
  buttonText: string;
  firmLabel?: string;
  firmPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot: bots fill this, humans never see it. The API already
  // silently accepts-and-discards any submission where it is set.
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    setOk(false);

    if (name.trim().length < 2) return setErr("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setErr("Please enter a valid email.");
    if (message.trim().length < 10) return setErr("Message must be at least 10 characters.");

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name,
          email,
          firm: includeFirm ? firm : undefined,
          message,
          website,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to send. Please try again.");
      }

      setOk(true);
      setName("");
      setEmail("");
      setFirm("");
      setMessage("");
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="mt-6 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) submit();
      }}
    >
      <div>
        <label htmlFor={`${kind}-name`} className="text-sm font-bold text-slate-950">
          Name
        </label>
        <input
          id={`${kind}-name`}
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Your name"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
        />
      </div>

      <div>
        <label htmlFor={`${kind}-email`} className="text-sm font-bold text-slate-950">
          Email
        </label>
        <input
          id={`${kind}-email`}
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
        />
      </div>

      {includeFirm && (
        <div>
          <label htmlFor={`${kind}-firm`} className="text-sm font-bold text-slate-950">
            {firmLabel}
          </label>
          <input
            id={`${kind}-firm`}
            name="firm"
            autoComplete="organization"
            value={firm}
            onChange={(e) => setFirm(e.target.value)}
            type="text"
            placeholder={firmPlaceholder}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
          />
        </div>
      )}

      <div>
        <label htmlFor={`${kind}-message`} className="text-sm font-bold text-slate-950">
          {messageLabel}
        </label>
        <textarea
          id={`${kind}-message`}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder={messagePlaceholder}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
        />
      </div>

      {/* Honeypot hidden from sighted users, screen readers, and tab order */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${kind}-website`}>Website</label>
        <input
          id={`${kind}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-60"
      >
        {loading ? "Sending..." : buttonText}
      </button>

      {err && (
        <p role="alert" className="text-sm font-semibold text-red-600">
          {err}
        </p>
      )}
      {ok && (
        <p role="status" className="text-sm font-semibold text-emerald-700">
          Sent successfully we’ll get back to you.
        </p>
      )}
    </form>
  );
}
