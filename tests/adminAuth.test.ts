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
      expect(auth.identity.legacy).toBe(false);
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

describe("legacy shared token", () => {
  it("still works during migration, and is marked as legacy", async () => {
    process.env.ADMIN_TOKEN = "old-shared-secret";
    const auth = await check({ "x-admin-token": "old-shared-secret" });

    expect(auth.ok).toBe(true);
    if (auth.ok) {
      expect(auth.identity.legacy).toBe(true);
    }
  });

  it("does not accept a near-miss of the legacy token", async () => {
    process.env.ADMIN_TOKEN = "old-shared-secret";
    const auth = await check({ "x-admin-token": "old-shared-secre" });
    expect(auth.ok).toBe(false);
  });

  it("is not a way in once removed from the environment", async () => {
    // ADMIN_TOKEN unset by beforeEach.
    tokenRow = null;
    const auth = await check({ "x-admin-token": "" });
    expect(auth.ok).toBe(false);
  });
});
