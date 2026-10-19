import { describe, expect, it } from "vitest";
import { buildAccessRequestNote, parseAccessRequestNote } from "@/app/lib/accessRequests";

describe("access request note", () => {
  it("round-trips what /api/waitlist writes", () => {
    const note = buildAccessRequestNote({ businessType: "Shop", challenge: "Stock keeps running out" });
    expect(parseAccessRequestNote(note)).toEqual({
      businessType: "Shop",
      challenge: "Stock keeps running out",
      consent: true,
    });
  });

  it("treats a missing challenge as empty", () => {
    const note = buildAccessRequestNote({ businessType: "Food", challenge: "" });
    expect(parseAccessRequestNote(note).challenge).toBe("");
  });

  it("keeps an older plain waitlist note as the challenge text", () => {
    expect(parseAccessRequestNote("I want to track debts")).toEqual({
      businessType: "",
      challenge: "I want to track debts",
      consent: false,
    });
  });

  it("handles null", () => {
    expect(parseAccessRequestNote(null).businessType).toBe("");
  });
});
