// app/lib/accessRequests.ts

/**
 * ProfitPilot access requests are stored in waitlist_signups. That table has no
 * business-type or consent columns, so /api/waitlist writes them into `note` as
 * three labelled lines. This reads them back out, and tolerates older plain
 * waitlist notes by treating them as the challenge text.
 */
export function buildAccessRequestNote(input: {
  businessType: string;
  challenge: string;
}): string {
  return [
    `Business type: ${input.businessType}`,
    `Biggest challenge: ${input.challenge || "—"}`,
    "Consent to be contacted: yes",
  ].join("\n");
}

export function parseAccessRequestNote(note: string | null | undefined) {
  const text = (note || "").trim();
  const type = text.match(/^Business type: (.*)$/m);
  const challenge = text.match(/^Biggest challenge: (.*)$/m);
  const consent = /^Consent to be contacted: yes$/m.test(text);

  if (!type && !challenge) {
    return { businessType: "", challenge: text, consent: false };
  }

  const c = (challenge?.[1] || "").trim();
  return {
    businessType: (type?.[1] || "").trim(),
    challenge: c === "—" ? "" : c,
    consent,
  };
}
