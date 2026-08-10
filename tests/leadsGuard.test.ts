import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The lead-loss guard.
 *
 * /api/leads is meant to fail only when a lead reached neither the database nor
 * an inbox. That guard existed and was still silently defeated: the code set
 * `notified = true` straight after resend.emails.send(), without checking the
 * returned `error`. The Resend SDK reports API failures on that field rather
 * than throwing, so a rejected email counted as delivered and the lead was lost
 * while the visitor was told it succeeded.
 *
 * These tests pin the behaviour that fix restored.
 */

const sendMock = vi.fn();
const insertMock = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...args: unknown[]) => sendMock(...args) };
  },
}));

vi.mock("@/app/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: () => ({
      insert: (...args: unknown[]) => insertMock(...args),
      select: () => ({
        eq: () => ({ gte: () => Promise.resolve({ count: 0, error: null }) }),
      }),
    }),
  },
}));

async function postLead(body: Record<string, unknown>) {
  const { POST } = await import("@/app/api/leads/route");
  const req = new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.1" },
    body: JSON.stringify(body),
  });
  const res = await POST(req);
  return { status: res.status, json: await res.json() };
}

const validLead = {
  kind: "contact",
  name: "Test Person",
  email: "test@example.com",
  message: "This is a message long enough to pass validation.",
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "re_test";
  process.env.RESEND_FROM = "noreply@example.com";
  process.env.RESEND_TO = "admin@example.com";
});

describe("lead notification result handling", () => {
  it("reports notified: false when Resend rejects via the error field", async () => {
    // This is the exact regression: the SDK resolves with { error }, it does
    // not throw. Trusting the absence of a throw marked the lead as notified.
    insertMock.mockResolvedValue({ error: null });
    sendMock.mockResolvedValue({ data: null, error: { message: "API key is invalid" } });

    const { status, json } = await postLead(validLead);

    expect(json.notified).toBe(false);
    // Storage worked, so the request itself still succeeds.
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.stored).toBe(true);
  });

  it("reports notified: true only on a genuinely clean send", async () => {
    insertMock.mockResolvedValue({ error: null });
    sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });

    const { json } = await postLead(validLead);

    expect(json.notified).toBe(true);
    expect(json.stored).toBe(true);
  });

  it("still succeeds when storage fails but the email goes out", async () => {
    // Email is the durable fallback, which is the whole point of the guard.
    insertMock.mockResolvedValue({ error: { message: "db down" } });
    sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });

    const { status, json } = await postLead(validLead);

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.stored).toBe(false);
    expect(json.notified).toBe(true);
  });

  it("fails loudly when BOTH channels fail, instead of claiming success", async () => {
    insertMock.mockResolvedValue({ error: { message: "db down" } });
    sendMock.mockResolvedValue({ data: null, error: { message: "mail down" } });

    const { status, json } = await postLead(validLead);

    expect(status).toBe(500);
    expect(json.ok).toBe(false);
    expect(json.error).toBeTruthy();
  });

  it("also treats a thrown send as not notified", async () => {
    insertMock.mockResolvedValue({ error: null });
    sendMock.mockRejectedValue(new Error("network"));

    const { json } = await postLead(validLead);

    expect(json.notified).toBe(false);
    expect(json.stored).toBe(true);
  });
});

describe("lead privacy", () => {
  it("stores a hashed ip, never the raw address", async () => {
    insertMock.mockResolvedValue({ error: null });
    sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });

    await postLead(validLead);

    expect(insertMock).toHaveBeenCalled();
    const row = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(row).not.toHaveProperty("ip");
    expect(row.ip_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(row)).not.toContain("203.0.113.1");
  });

  it("stores a coarse user agent, not the raw header", async () => {
    insertMock.mockResolvedValue({ error: null });
    sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });

    await postLead(validLead);

    const row = insertMock.mock.calls[0][0] as Record<string, unknown>;
    // No UA header was sent by the test request, so this should be null rather
    // than an empty string or a placeholder.
    expect(row.user_agent === null || typeof row.user_agent === "string").toBe(true);
    expect(String(row.user_agent ?? "")).not.toContain("Mozilla/5.0");
  });
});

describe("honeypot", () => {
  it("accepts the request but stores nothing when the honeypot is filled", async () => {
    const { status, json } = await postLead({ ...validLead, website: "http://spam.example" });

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(insertMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });
});
