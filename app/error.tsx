"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

/**
 * Route-level error boundary.
 *
 * Without this, an unhandled exception shows Next's default error screen with
 * no navigation and no way forward. This keeps the header and footer, offers a
 * retry, and gives a route out.
 *
 * Deliberately does not print the error message. Messages can carry internal
 * detail — a query, a column name, part of a connection string — and this page
 * is shown to whoever hit the error, not only to us. The digest of what went
 * wrong belongs in the server logs, which is where it goes.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced for the server/browser console rather than rendered.
    console.error("Unhandled error rendering a route:", error);
  }, [error]);

  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Something went wrong"
        title="This page didn’t load"
        subtitle="The problem is on our side, not yours. Trying again often works, since most causes are momentary."
        actions={
          <>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              Back to home
            </Link>
          </>
        }
      />

      <div className="mt-10 card-premium p-8">
        <div className="text-base font-bold text-slate-950">If it keeps happening</div>
        <p className="mt-3 text-sm font-semibold text-slate-800">
          Let us know what you were trying to do and we will look at it.{" "}
          <Link href="/contact" className="text-sky-700 hover:underline">
            Contact us
          </Link>
          .
        </p>

        {error?.digest ? (
          <p className="mt-4 text-xs font-semibold text-slate-500">
            Reference: <code className="font-mono">{error.digest}</code> — quoting this helps us
            find the exact failure in our logs.
          </p>
        ) : null}
      </div>
    </Container>
  );
}
