import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The daily digest replaced the per-comment email, which raises the stakes on
 * two behaviours: it must not be triggerable by anyone (an open cron endpoint
 * is a way to spam the inbox), and it must not fail silently, because silence
 * now means no notification at all rather than one fewer.
 */

const sendMock = vi.fn();
let pendingRows: Array<Record<string, unknown>> = [];
let adminTokenRow: { id: string; name: string } | null = null;

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...args: unknown[]) => sendMock(...args) };
  },
}));

vi.mock("@/app/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: (table: string) => ({
      select: () => {
        const chain: Record<string, unknown> = {
          eq: () => chain,
          is: () => chain,
          gte: () => Promise.resolve({ count: 0, error: null }),
          maybeSingle: () => Promise.resolve({ data: adminTokenRow, error: null }),
          order: () =>
            Promise.resolve({
              data: table === "comments" ? pendingRows : [],
              error: null,
            }),
        };
        return chain;
      },
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  },
}));

async function runDigest(headers: Record<string, string> = {}) {
  const { GET } = await import("@/app/api/cron/comment-digest/route");
  const res = await GET(new Request("http://localhost/api/cron/comment-digest", { headers }));
  return { status: res.status, json: await res.json() };
}

function pending(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    post_slug: "a-post",
    author_name: `Person ${i + 1}`,
    content: "A pending comment.",
    approved: false,
    created_at: new Date(Date.now() - 3_600_000).toISOString(),
    approved_at: null,
  }));
}

beforeEach(() => {
  vi.clearAllMocks();
  pendingRows = [];
  adminTokenRow = null;
  sendMock.mockResolvedValue({ data: { id: "mail-1" }, error: null });
  process.env.RESEND_API_KEY = "re_test";
  process.env.RESEND_FROM = "noreply@example.com";
  process.env.RESEND_TO = "admin@example.com";
  delete process.env.CRON_SECRET;
  delete process.env.ADMIN_TOKEN;
});

describe("the endpoint cannot be triggered by anyone", () => {
  it("rejects a request with no credentials", async () => {
    const { status } = await runDigest();
    expect(status).toBe(401);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a wrong cron secret", async () => {
    process.env.CRON_SECRET = "the-real-secret";
    const { status } = await runDigest({ authorization: "Bearer not-the-secret" });
    expect(status).toBe(401);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("accepts the cron secret Vercel sends", async () => {
    process.env.CRON_SECRET = "the-real-secret";
    pendingRows = pending(1);
    const { status } = await runDigest({ authorization: "Bearer the-real-secret" });
    expect(status).toBe(200);
  });

  it("accepts a valid admin token, so it can be sent on demand", async () => {
    process.env.ADMIN_TOKEN = "legacy-admin";
    pendingRows = pending(1);
    const { status } = await runDigest({ "x-admin-token": "legacy-admin" });
    expect(status).toBe(200);
  });

  it("fails closed when no cron secret is configured", async () => {
    // Absent CRON_SECRET must not mean "anyone may trigger it".
    pendingRows = pending(3);
    const { status } = await runDigest({ authorization: "Bearer anything" });
    expect(status).toBe(401);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("what it sends", () => {
  beforeEach(() => {
    process.env.CRON_SECRET = "s";
  });

  it("sends nothing when the queue is empty", async () => {
    pendingRows = [];
    const { status, json } = await runDigest({ authorization: "Bearer s" });

    expect(status).toBe(200);
    expect(json.pending).toBe(0);
    expect(json.sent).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends one email covering every pending comment", async () => {
    pendingRows = pending(3);
    const { json } = await runDigest({ authorization: "Bearer s" });

    expect(json.pending).toBe(3);
    expect(json.sent).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const mail = sendMock.mock.calls[0][0] as Record<string, string>;
    expect(mail.subject).toContain("3 comments");
    for (const name of ["Person 1", "Person 2", "Person 3"]) {
      expect(mail.html).toContain(name);
    }
  });

  it("uses singular wording for a single comment", async () => {
    pendingRows = pending(1);
    await runDigest({ authorization: "Bearer s" });

    const mail = sendMock.mock.calls[0][0] as Record<string, string>;
    expect(mail.subject).toBe("1 comment awaiting review");
  });

  it("escapes comment content, which is attacker supplied", async () => {
    pendingRows = [
      {
        ...pending(1)[0],
        author_name: "<script>alert(1)</script>",
        content: "<img src=x onerror=alert(1)>",
      },
    ];
    await runDigest({ authorization: "Bearer s" });

    const mail = sendMock.mock.calls[0][0] as Record<string, string>;
    expect(mail.html).not.toContain("<script>alert(1)</script>");
    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;script&gt;");
  });
});

describe("it does not fail silently", () => {
  beforeEach(() => {
    process.env.CRON_SECRET = "s";
    pendingRows = pending(2);
  });

  it("reports an error when email is not configured", async () => {
    // Silence here would mean no notification at all, since the digest
    // replaced the per-comment email.
    delete process.env.RESEND_API_KEY;
    const { status, json } = await runDigest({ authorization: "Bearer s" });

    expect(status).toBe(500);
    expect(json.sent).toBe(false);
  });

  it("reports an error when Resend rejects the send", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "nope" } });
    const { status, json } = await runDigest({ authorization: "Bearer s" });

    expect(status).toBe(502);
    expect(json.sent).toBe(false);
    expect(json.pending).toBe(2);
  });

  it("reports an error when the send throws", async () => {
    sendMock.mockRejectedValue(new Error("network"));
    const { status, json } = await runDigest({ authorization: "Bearer s" });

    expect(status).toBe(502);
    expect(json.sent).toBe(false);
  });
});
