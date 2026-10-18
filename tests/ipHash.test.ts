import { describe, it, expect, vi, afterEach } from "vitest";
import { hashIp } from "@/app/lib/rateLimit";

vi.mock("@/app/lib/supabaseAdmin", () => ({ supabaseAdmin: {} }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("hashIp", () => {
  it("hashes with the configured salt and is stable per IP", () => {
    vi.stubEnv("COMMENT_IP_SALT", "a-real-salt");
    const a = hashIp("203.0.113.7");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(hashIp("203.0.113.7")).toBe(a);
    expect(hashIp("203.0.113.8")).not.toBe(a);
  });

  it("differs by salt", () => {
    vi.stubEnv("COMMENT_IP_SALT", "salt-one");
    const one = hashIp("203.0.113.7");
    vi.stubEnv("COMMENT_IP_SALT", "salt-two");
    expect(hashIp("203.0.113.7")).not.toBe(one);
  });

  it("returns nothing in production when no salt is configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("COMMENT_IP_SALT", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(hashIp("203.0.113.7")).toBe("");
    expect(err).toHaveBeenCalled();
  });

  it("still works without a salt outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("COMMENT_IP_SALT", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect(hashIp("203.0.113.7")).toMatch(/^[0-9a-f]{64}$/);
  });
});
