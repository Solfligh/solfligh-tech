import { describe, it, expect } from "vitest";
import { CONSENT_KEY, parseConsent, readConsent, writeConsent } from "@/app/lib/consent";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => void (data[k] = v),
    removeItem: (k: string) => void delete data[k],
  };
}

describe("analytics consent", () => {
  it("treats anything but an explicit choice as not given", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent(undefined)).toBeNull();
    expect(parseConsent("")).toBeNull();
    expect(parseConsent("true")).toBeNull();
    expect(parseConsent("GRANTED")).toBeNull();
  });

  it("round-trips granted and denied", () => {
    const s = memoryStorage();
    writeConsent(s, "granted");
    expect(readConsent(s)).toBe("granted");
    writeConsent(s, "denied");
    expect(readConsent(s)).toBe("denied");
  });

  it("forgets the choice when reset, so the banner returns", () => {
    const s = memoryStorage({ [CONSENT_KEY]: "granted" });
    writeConsent(s, null);
    expect(readConsent(s)).toBeNull();
  });

  it("never reads blocked storage as consent", () => {
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readConsent(blocked)).toBeNull();
    expect(() => writeConsent(blocked, "granted")).not.toThrow();
    expect(readConsent(undefined)).toBeNull();
  });
});
