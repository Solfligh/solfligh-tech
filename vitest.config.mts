import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    // Mirrors the "@/*" -> "./*" alias in tsconfig.json.
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Integration tests talk to the real database and need real credentials.
    // They run separately via `npm run test:integration`, so `npm test` stays
    // hermetic and needs no secrets — which is what lets CI run it as-is.
    exclude: ["tests/integration/**", "node_modules/**"],
    // Route handlers read env at call time; keep tests from depending on
    // whatever happens to be in .env.local.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
      COMMENT_IP_SALT: "test-salt",
    },
  },
});
