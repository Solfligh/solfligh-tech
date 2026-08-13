"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Admin session state for the admin UIs.
 *
 * All three admin pages had their own copy of "paste a token into React state
 * and send it as a header", which meant re-entering it on every reload. This is
 * the single place that logic lives now.
 *
 * The token is exchanged for an httpOnly cookie by /api/admin/session and is
 * not kept in JavaScript afterwards, so admin requests need no headers the
 * browser attaches the cookie to same-origin fetches automatically.
 */

export type AdminSession = {
  /** null while the initial check is in flight, so the UI can avoid flashing. */
  signedIn: boolean | null;
  /** Who the active token belongs to. */
  name: string;
  error: string;
  busy: boolean;
  signIn: (token: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

export function useAdminSession(): AdminSession {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Restores an existing session on load. This is what stops the re-prompting.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (cancelled) return;
        setSignedIn(Boolean(data?.ok));
        setName(data?.name || "");
      } catch {
        if (!cancelled) setSignedIn(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (token: string) => {
    setError("");
    if (!token.trim()) {
      setError("Enter your admin token.");
      return false;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setError(data?.error || "That token was not accepted.");
        return false;
      }

      setSignedIn(true);
      setName(data.name || "");
      return true;
    } catch {
      setError("Could not reach the server.");
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
    } catch {
      // Clearing local state matters more than the response here.
    }
    setSignedIn(false);
    setName("");
  }, []);

  return { signedIn, name, error, busy, signIn, signOut };
}
