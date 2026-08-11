import { describe, it, expect } from "vitest";
import { getHeaderCta } from "@/app/lib/headerCta";

/**
 * Encodes the routing table from Website Architecture 10 so the CTA cannot
 * quietly regress to a single fixed destination.
 */

describe("contextual header CTA", () => {
  it("routes homepage and Cloud to the developer signup", () => {
    expect(getHeaderCta("/").href).toBe("/cloud/access");
    expect(getHeaderCta("/cloud").href).toBe("/cloud/access");
    expect(getHeaderCta("/cloud/anything").href).toBe("/cloud/access");
  });

  it("does not point the signup page at itself", () => {
    expect(getHeaderCta("/cloud/access").href).toBe("/contact");
  });

  it("routes a product page to that product's own signup", () => {
    expect(getHeaderCta("/products/profitpilot").href).toContain(
      "/waitlist?product=profitpilot"
    );
    expect(getHeaderCta("/products/rebirthagro").href).toContain(
      "/waitlist?product=rebirthagro"
    );
  });

  it("sends a live product to its external app and marks it external", () => {
    const cta = getHeaderCta("/products/fxco-pilot");
    expect(cta.href).toBe("https://fxco-pilot.solflightech.org");
    expect(cta.external).toBe(true);
  });

  it("resolves product aliases the same way", () => {
    expect(getHeaderCta("/products/fxcopilot").href).toBe(
      "https://fxco-pilot.solflightech.org"
    );
    expect(getHeaderCta("/products/profitfx").href).toBe(
      "https://fxco-pilot.solflightech.org"
    );
  });

  it("routes the products index and services to contact", () => {
    expect(getHeaderCta("/products").href).toBe("/contact");
    expect(getHeaderCta("/services").href).toBe("/contact");
  });

  it("falls back to contact for company pages and anything unknown", () => {
    for (const path of ["/about", "/blog", "/investors", "/partner", "/careers", "/nonsense"]) {
      expect(getHeaderCta(path).href).toBe("/contact");
    }
  });

  it("falls back safely for an unknown product slug", () => {
    expect(getHeaderCta("/products/not-a-real-product").href).toBe("/contact");
  });

  it("always provides a label, so the button is never blank", () => {
    for (const path of ["/", "/cloud", "/products", "/products/profitpilot", "/services", "/about"]) {
      expect(getHeaderCta(path).label.trim().length).toBeGreaterThan(0);
    }
  });

  it("does not label a waitlist link as 'Contact'", () => {
    // A button reading "Contact" that opens a waitlist is a bug, not routing.
    const cta = getHeaderCta("/products/profitpilot");
    expect(cta.label.toLowerCase()).not.toBe("contact");
  });
});
