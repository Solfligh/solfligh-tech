"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary, for an error thrown by the root layout itself.
 *
 * This replaces the root layout rather than rendering inside it, so there is no
 * Navbar, no Footer, and no guarantee the site stylesheet loaded — which is why
 * everything here is inline styles and plain anchors. A Tailwind class or a
 * next/link would be a bet that the very thing that just failed is working.
 *
 * If this ever renders, something is badly wrong, so it stays deliberately
 * plain and does not depend on anything.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error in the root layout:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          background: "#ffffff",
          color: "#0f172a",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: 560, textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            SOLFLIGH TECH
          </p>

          <h1 style={{ margin: "0 0 12px", fontSize: 28, lineHeight: 1.2 }}>
            The site failed to load
          </h1>

          <p style={{ margin: "0 0 24px", color: "#475569", lineHeight: 1.6 }}>
            This is a fault on our side. Reloading usually works. If it does not, the site is
            likely down and we would rather you knew that than kept trying.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                cursor: "pointer",
                background: "#0284c7",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Try again
            </button>

            <a
              href="/"
              style={{
                display: "inline-block",
                border: "1px solid #cbd5e1",
                color: "#0f172a",
                padding: "10px 20px",
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>

          {error?.digest ? (
            <p style={{ marginTop: 24, fontSize: 12, color: "#94a3b8" }}>
              Reference: <code>{error.digest}</code>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
