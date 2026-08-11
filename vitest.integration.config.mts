import { defineConfig } from "vitest/config";
import path from "path";
import fs from "fs";

/**
 * Integration tests run against the real Supabase project.
 *
 * They exist to catch what the mocked tests structurally cannot: a query that
 * names a column the table no longer has. That is exactly how the admin leads
 * endpoint broke — the `ip` column was dropped, two consumers still selected
 * it, and every mocked test kept passing because a mock does not know the
 * schema.
 *
 * Real credentials are read from .env.local. When they are absent the tests
 * skip rather than fail, so this can be run anywhere without configuration.
 */

function loadEnvLocal(): Record<string, string> {
  const file = path.resolve(import.meta.dirname, ".env.local");
  if (!fs.existsSync(file)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./") },
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.integration.test.ts"],
    // Real queries over the network; the default 5s is tight.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Shared database, so parallel writes would interfere.
    fileParallelism: false,
    env: loadEnvLocal(),
  },
});
