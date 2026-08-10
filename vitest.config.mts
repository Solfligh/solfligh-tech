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
    // Route handlers read env at call time; keep tests from depending on
    // whatever happens to be in .env.local.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
      COMMENT_IP_SALT: "test-salt",
    },
  },
});
