import { describe, it, expect } from "vitest";
import { coarseUserAgent } from "@/app/lib/userAgent";

/**
 * Lead records store a coarse "browser on OS" label instead of the raw header.
 * The matching order is load-bearing — Android also says Linux, Edge and Opera
 * also say Chrome, and Chrome also says Safari — so these lock in precedence.
 */

const UA = {
  chromeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  safariIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  chromeAndroid:
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  safariMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  edgeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
  firefoxLinux:
    "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
};

describe("coarseUserAgent", () => {
  it("maps common browsers to browser on OS", () => {
    expect(coarseUserAgent(UA.chromeWindows)).toBe("Chrome on Windows");
    expect(coarseUserAgent(UA.safariIos)).toBe("Safari on iOS");
    expect(coarseUserAgent(UA.safariMac)).toBe("Safari on macOS");
    expect(coarseUserAgent(UA.firefoxLinux)).toBe("Firefox on Linux");
  });

  it("prefers Android over the Linux token it also contains", () => {
    expect(coarseUserAgent(UA.chromeAndroid)).toBe("Chrome on Android");
  });

  it("prefers Edge over the Chrome token it also contains", () => {
    expect(coarseUserAgent(UA.edgeWindows)).toBe("Edge on Windows");
  });

  it("prefers iOS over the Mac OS X token an iPhone also reports", () => {
    expect(coarseUserAgent(UA.safariIos)).not.toContain("macOS");
  });

  it("labels automated clients as Bot", () => {
    expect(coarseUserAgent("curl/8.4.0")).toBe("Bot");
    expect(coarseUserAgent("python-requests/2.31.0")).toBe("Bot");
    expect(coarseUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe("Bot");
  });

  it("returns null for an absent header rather than a placeholder string", () => {
    expect(coarseUserAgent(null)).toBeNull();
    expect(coarseUserAgent(undefined)).toBeNull();
    expect(coarseUserAgent("   ")).toBeNull();
  });

  it("never returns the original string, which is the whole point", () => {
    for (const ua of Object.values(UA)) {
      const out = coarseUserAgent(ua);
      expect(out).not.toBe(ua);
      expect(out!.length).toBeLessThan(40);
      // No version numbers or build identifiers should survive.
      expect(out).not.toMatch(/\d+\.\d+/);
    }
  });
});
