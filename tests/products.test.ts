import { describe, it, expect } from "vitest";
import {
  getProduct,
  productLabel,
  normalizeProductSlug,
  isCloudSlug,
} from "@/app/lib/products";

/**
 * These assert two non-negotiable project rules, not just code behaviour:
 *
 *  - canonical product names (CLAUDE.md rule 1). The waitlist used to derive
 *    labels by title-casing the slug, which produced "Rebirthagro" and
 *    "Fxco Pilot". A regression here is a brand bug, not a cosmetic one.
 *  - Solfligh Cloud is not a product (Blueprint 11.1) and must never be routed
 *    through a product waitlist.
 */

describe("canonical product labels", () => {
  it("uses the exact canonical spelling for every product", () => {
    expect(productLabel("profitpilot")).toBe("Jèrè");
    expect(productLabel("rebirthagro")).toBe("RebirthAgro");
    expect(productLabel("fxco-pilot")).toBe("FXCopilot");
  });

  it("never emits the title-cased spellings that the old code produced", () => {
    expect(productLabel("rebirthagro")).not.toBe("Rebirthagro");
    expect(productLabel("fxco-pilot")).not.toBe("Fxco Pilot");
  });

  it("never emits a retired or forbidden name", () => {
    const labels = ["profitpilot", "rebirthagro", "fxco-pilot", "profitfx", "fxcopilot"].map(
      productLabel
    );
    for (const label of labels) {
      expect(label).not.toMatch(/ProfitFX/i);
      expect(label).not.toMatch(/FXCO-PILOT/);
    }
  });

  it("does not invent a label for an unknown product", () => {
    // Falls back to the slug rather than prettifying it into a fake name.
    expect(productLabel("banana")).toBe("banana");
    expect(getProduct("banana")).toBeNull();
  });
});

describe("slug aliases", () => {
  it("resolves known aliases to the canonical slug", () => {
    expect(normalizeProductSlug("fxcopilot")).toBe("fxco-pilot");
    expect(normalizeProductSlug("profitfx")).toBe("fxco-pilot");
    expect(normalizeProductSlug("rebirth-agro")).toBe("rebirthagro");
  });

  it("defaults to Jèrè when no product is given", () => {
    expect(normalizeProductSlug("")).toBe("profitpilot");
    expect(normalizeProductSlug(undefined)).toBe("profitpilot");
  });

  it("gives aliases the same canonical label as the real slug", () => {
    expect(productLabel("fxcopilot")).toBe("FXCopilot");
    expect(productLabel("profitfx")).toBe("FXCopilot");
  });
});

describe("Solfligh Cloud is not a product", () => {
  it("recognises Cloud slugs so the waitlist can refuse them", () => {
    expect(isCloudSlug("cloud")).toBe(true);
    expect(isCloudSlug("solfligh-cloud")).toBe(true);
  });

  it("is absent from the product registry", () => {
    expect(getProduct("cloud")).toBeNull();
    expect(getProduct("solfligh-cloud")).toBeNull();
  });

  it("does not treat real products as Cloud", () => {
    expect(isCloudSlug("profitpilot")).toBe(false);
    expect(isCloudSlug("rebirthagro")).toBe(false);
  });
});

describe("product CTA destinations follow real status", () => {
  it("sends unreleased products to their waitlist", () => {
    expect(getProduct("rebirthagro")?.ctaHref).toContain("/waitlist?product=rebirthagro");
  });

  it("sends Jèrè, which is open for sign-up, to the app's sign-up page", () => {
    const jere = getProduct("profitpilot");
    expect(jere?.ctaHref).toBe("https://app.xn--jr-7iab.com/sign-up");
    expect(jere?.ctaExternal).toBe(true);
    expect(jere?.ctaHref).not.toContain("/waitlist");
  });

  it("sends the live product to its app, externally", () => {
    const fx = getProduct("fxco-pilot");
    expect(fx?.ctaHref).toBe("https://fxco-pilot.solflightech.org");
    expect(fx?.ctaExternal).toBe(true);
  });
});
