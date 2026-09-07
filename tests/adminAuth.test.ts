import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Admin authentication.
 *
 * Four separate copies of this check used to exist across the admin routes,
 * with two different return shapes. That duplication is how a guard drifts, so
 * these tests pin the behaviour of the single implementation — including that
 * it fails closed, which is the property that matters most.
 */

let tokenRow: { id: string; name: string; revoked_at: string | null } | null = null;
let lookupError: unknown = null;
const updateMock = vi.fn();
let capturedFilters: Record<string, unknown> = {};

vi.mock("@/app/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => {
        const chain: Record<string, unknown> = {
          eq: (col: string, val: unknown) => {
            capturedFilters[col] = val;
            return chain;
          },
          is: (col: string, val: unknown) => {
            capturedFilters[col] = val;
            return chain;
          },
          maybeSingle: () =>
            Promise.resolve(
              lookupError ? { data: null, error: lookupError } : { data: tokenRow, error: null }
            ),
        };
        return chain;
      },
      update: (...args: unknown[]) => {
        updateMock(...args);
        return { eq: () => Promise.resolve({ error: null }) };
      },
    }),
  },
}));

async function check(headers: Record<string, string>) {
  const { requireAdmin } = await import("@/app/api/admin/_auth");
  return requireAdmin(new Request("http://localhost/api/admin/posts", { headers }));
}

beforeEach(() => {
  vi.clearAllMocks();
  tokenRow = null;
  lookupError = null;
  capturedFilters = {};
  delete process.env.ADMIN_TOKEN;
});

describe("rejects when it should", () => {
  it("rejects a request with no token", async () => {
    const auth = await check({});
    expect(auth.ok).toBe(false);
  });

  it("rejects a token that matches no row", async () => {
    tokenRow = null;
    const auth = await check({ "x-admin-token": "slf_not-a-real-token" });
    expect(auth.ok).toBe(false);
  });

  it("fails closed when the lookup itself fails", async () => {
    // A database problem must not become an open door.
    lookupError = { message: "connection refused" };
    const auth = await check({ "x-admin-token": "slf_anything" });
    expect(auth.ok).toBe(false);
  });

  it("only considers tokens that have not been revoked", async () => {
    tokenRow = { id: "1", name: "Alice", revoked_at: null };
    await check({ "x-admin-token": "slf_alice" });
    // The query must filter on revoked_at IS NULL, or a revoked token still works.
    expect(capturedFilters).toHaveProperty("revoked_at", null);
  });
});

describe("accepts a valid per-person token", () => {
  it("returns the token owner, so actions are attributable", async () => {
    tokenRow = { id: "abc", name: "Alice", revoked_at: null };
    const auth = await check({ "x-admin-token": "slf_alice" });

    expect(auth.ok).toBe(true);
    if (auth.ok) {
      expect(auth.identity.name).toBe("Alice");
    }
  });

  it("accepts the token from an Authorization: Bearer header too", async () => {
    tokenRow = { id: "abc", name: "Alice", revoked_at: null };
    const auth = await check({ authorization: "Bearer slf_alice" });
    expect(auth.ok).toBe(true);
  });

  it("records last_used_at", async () => {
    tokenRow = { id: "abc", name: "Alice", revoked_at: null };
    await check({ "x-admin-token": "slf_alice" });
    expect(updateMock).toHaveBeenCalled();
    const patch = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(patch).toHaveProperty("last_used_at");
  });

  it("looks the token up by hash, never by its plaintext", async () => {
    tokenRow = { id: "abc", name: "Alice", revoked_at: null };
    await check({ "x-admin-token": "slf_alice" });

    const looked = String(capturedFilters.token_hash ?? "");
    expect(looked).toMatch(/^[a-f0-9]{64}$/);
    expect(looked).not.toContain("slf_alice");
  });
});

describe("the retired shared ADMIN_TOKEN", () => {
  // These are the tests that would catch the fallback being reintroduced,
  // either deliberately or by a bad merge restoring the old branch.

  it("is refused even when it is still set in the environment", async () => {
    // The exact scenario this guards: the variable is left behind on the host
    // after the code stopped honouring it. It must not open anything.
    process.env.ADMIN_TOKEN = "old-shared-secret";
    tokenRow = null;

    const auth = await check({ "x-admin-token": "old-shared-secret" });
    expect(auth.ok).toBe(false);
  });

  it("is refused via Authorization: Bearer as well", async () => {
    process.env.ADMIN_TOKEN = "old-shared-secret";
    tokenRow = null;

    const auth = await check({ authorization: "Bearer old-shared-secret" });
    expect(auth.ok).toBe(false);
  });

  it("is looked up in admin_tokens like any other string, not compared to the env var", async () => {
    // If the env-var branch came back, the lookup would be short-circuited and
    // no hash would ever reach the database.
    process.env.ADMIN_TOKEN = "old-shared-secret";
    tokenRow = null;

    await check({ "x-admin-token": "old-shared-secret" });
    expect(String(capturedFilters.token_hash ?? "")).toMatch(/^[a-f0-9]{64}$/);
  });

  it("still rejects an empty token", async () => {
    tokenRow = null;
    const auth = await check({ "x-admin-token": "" });
    expect(auth.ok).toBe(false);
  });
});

describe("session cookie", () => {
  it("authenticates from the admin_session cookie", async () => {
    tokenRow = { id: "abc", name: "Alice", revoked_at: null };
    const auth = await check({ cookie: "admin_session=slf_alice" });

    expect(auth.ok).toBe(true);
    if (auth.ok) expect(auth.identity.name).toBe("Alice");
  });

  it("picks the right cookie when others are present", async () => {
    tokenRow = { id: "abc", name: "Alice", revoked_at: null };
    const auth = await check({
      cookie: "ga=123; admin_session=slf_alice; other=xyz",
    });
    expect(auth.ok).toBe(true);
  });

  it("still verifies against the database, so a revoked token's cookie fails", async () => {
    // The cookie carries the token; it is not a standalone session record.
    // Revocation therefore takes effect immediately for existing sessions.
    tokenRow = null;
    const auth = await check({ cookie: "admin_session=slf_revoked" });
    expect(auth.ok).toBe(false);
  });

  it("prefers an explicit header over the cookie", async () => {
    tokenRow = { id: "abc", name: "Alice", revoked_at: null };
    await check({ "x-admin-token": "slf_from_header", cookie: "admin_session=slf_from_cookie" });

    const { hashAdminToken } = await import("@/app/api/admin/_auth");
    expect(capturedFilters.token_hash).toBe(hashAdminToken("slf_from_header"));
  });

  it("ignores an empty cookie value", async () => {
    tokenRow = null;
    const auth = await check({ cookie: "admin_session=" });
    expect(auth.ok).toBe(false);
  });
});
