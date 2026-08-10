import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Approve-first moderation.
 *
 * The public endpoint must be structurally incapable of publishing: whatever a
 * visitor sends, the row is written with approved = false, and the public read
 * only ever returns approved rows. If that ever stops being true, unmoderated
 * text reaches readers.
 */

const insertMock = vi.fn();
const sendMock = vi.fn();
let capturedFilters: Record<string, unknown> = {};

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...args: unknown[]) => sendMock(...args) };
  },
}));

vi.mock("@/app/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: () => ({
      insert: (...args: unknown[]) => insertMock(...args),
      select: (_cols?: string, opts?: { count?: string; head?: boolean }) => {
        // Rate-limit counting path: select(..., { count, head }) -> eq -> gte
        if (opts?.head) {
          return {
            eq: () => ({ gte: () => Promise.resolve({ count: 0, error: null }) }),
          };
        }
        // Read path: record which filters the query applied.
        capturedFilters = {};
        const chain: Record<string, unknown> = {
          eq: (col: string, val: unknown) => {
            capturedFilters[col] = val;
            return chain;
          },
          order: () => Promise.resolve({ data: [], error: null }),
        };
        return chain;
      },
    }),
  },
}));

async function postComment(body: Record<string, unknown>, ip = "203.0.113.5") {
  const { POST } = await import("@/app/api/comments/route");
  const req = new Request("http://localhost/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
  const res = await POST(req as never);
  return { status: res.status, json: await res.json() };
}

const validComment = {
  postSlug: "some-post",
  authorName: "Reader",
  content: "A perfectly ordinary comment.",
};

beforeEach(() => {
  vi.clearAllMocks();
  capturedFilters = {};
  insertMock.mockResolvedValue({ error: null });
  sendMock.mockResolvedValue({ data: { id: "x" }, error: null });
  process.env.RESEND_API_KEY = "re_test";
  process.env.RESEND_FROM = "noreply@example.com";
  process.env.RESEND_TO = "admin@example.com";
});

describe("public submission cannot publish", () => {
  it("always stores approved = false", async () => {
    await postComment(validComment);

    const row = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(row.approved).toBe(false);
  });

  it("ignores an attempt to set approved through the request body", async () => {
    await postComment({ ...validComment, approved: true });

    const row = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(row.approved).toBe(false);
  });

  it("tells the visitor the comment is pending, not published", async () => {
    const { json } = await postComment(validComment);

    expect(json.ok).toBe(true);
    expect(json.pending).toBe(true);
    expect(String(json.message).toLowerCase()).toContain("review");
  });
});

describe("public read only returns approved comments", () => {
  it("filters on approved = true", async () => {
    const { getApprovedComments } = await import("@/app/lib/commentsStore");
    await getApprovedComments("some-post");

    expect(capturedFilters.approved).toBe(true);
    expect(capturedFilters.post_slug).toBe("some-post");
  });
});

describe("validation and anti-spam", () => {
  it("rejects an empty name or body", async () => {
    expect((await postComment({ ...validComment, authorName: "" })).status).toBe(400);
    expect((await postComment({ ...validComment, content: "" })).status).toBe(400);
  });

  it("drops honeypot submissions without storing them, but answers as if accepted", async () => {
    const { status, json } = await postComment({
      ...validComment,
      website: "http://spam.example",
    });

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    // A bot should get no signal that it was detected.
    expect(json.pending).toBe(true);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("stores a hashed ip rather than the raw address", async () => {
    await postComment(validComment, "198.51.100.9");

    const row = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(row.ip_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(row)).not.toContain("198.51.100.9");
  });
});
