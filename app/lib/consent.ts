/**
 * The visitor's choice about analytics cookies (NDPA: consent must be a clear
 * affirmative act, so nothing loads until the visitor says yes).
 *
 * The choice lives in the visitor's own browser. Storage can be unavailable
 * (private mode, blocked site data), in which case no choice is remembered and
 * the answer is "not given", never "granted".
 */

export type ConsentChoice = "granted" | "denied";

export const CONSENT_KEY = "solfligh_analytics_consent";

export function parseConsent(raw: string | null | undefined): ConsentChoice | null {
  return raw === "granted" || raw === "denied" ? raw : null;
}

export function readConsent(storage: Pick<Storage, "getItem"> | undefined): ConsentChoice | null {
  if (!storage) return null;
  try {
    return parseConsent(storage.getItem(CONSENT_KEY));
  } catch (err) {
    console.warn("Consent choice could not be read; treating it as not given:", err);
    return null;
  }
}

export function writeConsent(
  storage: Pick<Storage, "setItem" | "removeItem"> | undefined,
  choice: ConsentChoice | null,
): void {
  if (!storage) return;
  try {
    if (choice === null) storage.removeItem(CONSENT_KEY);
    else storage.setItem(CONSENT_KEY, choice);
  } catch (err) {
    console.warn("Consent choice could not be saved; it will be asked again:", err);
  }
}

/* ------------------------------------------------------------------ */
/* A tiny store for React (useSyncExternalStore) so the banner, the    */
/* analytics loader and the footer link share one answer. The in-memory */
/* copy keeps the choice for this page view when storage is blocked.   */
/* ------------------------------------------------------------------ */

let memoryChoice: ConsentChoice | null = null;
const listeners = new Set<() => void>();

/** The current answer in the browser: this page view's choice, else the saved one. */
export function getConsentSnapshot(): ConsentChoice | null {
  if (memoryChoice) return memoryChoice;
  return readConsent(typeof window === "undefined" ? undefined : window.localStorage);
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

/** Record a choice, or pass null to forget it and ask again. */
export function setConsent(choice: ConsentChoice | null): void {
  memoryChoice = choice;
  writeConsent(typeof window === "undefined" ? undefined : window.localStorage, choice);
  listeners.forEach((l) => l());
}
