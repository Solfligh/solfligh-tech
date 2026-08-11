#!/usr/bin/env node
/**
 * Issue, list, and revoke admin tokens.
 *
 *   node scripts/admin-token.mjs issue "Alice"
 *   node scripts/admin-token.mjs list
 *   node scripts/admin-token.mjs revoke "Alice"
 *
 * Run from the project root. Reads .env.local for Supabase credentials.
 *
 * Only the SHA-256 hash is stored. The token is printed once, here, and cannot
 * be recovered afterwards — losing it means issuing a new one, which is the
 * intended trade.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const file = path.resolve("./.env.local");
  if (!fs.existsSync(file)) {
    console.error("No .env.local found. Run this from the project root.");
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const supa = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Must match hashAdminToken in app/api/admin/_auth.ts.
const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex");

const [, , command, argument] = process.argv;

async function issue(name) {
  if (!name) {
    console.error('Usage: node scripts/admin-token.mjs issue "Person name"');
    process.exit(1);
  }
  // 256 bits of randomness, so the hash needs no slow KDF.
  const token = `slf_${crypto.randomBytes(32).toString("base64url")}`;
  const { error } = await supa
    .from("admin_tokens")
    .insert({ name, token_hash: sha256(token) });

  if (error) {
    console.error("Could not issue token:", error.message);
    process.exit(1);
  }

  console.log("");
  console.log(`  Admin token issued for: ${name}`);
  console.log("");
  console.log(`    ${token}`);
  console.log("");
  console.log("  Copy it now. It is stored only as a hash and cannot be shown again.");
  console.log("  Paste it into the admin login field, or send it over a secure channel.");
  console.log("");
}

async function list() {
  const { data, error } = await supa
    .from("admin_tokens")
    .select("name,created_at,last_used_at,revoked_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Could not list tokens:", error.message);
    process.exit(1);
  }
  if (!data.length) {
    console.log("  No admin tokens issued yet.");
    return;
  }

  console.log("");
  console.log("  NAME                 STATUS    LAST USED             CREATED");
  for (const t of data) {
    const status = t.revoked_at ? "revoked" : "active ";
    const used = t.last_used_at ? new Date(t.last_used_at).toISOString().slice(0, 19) : "never";
    const made = new Date(t.created_at).toISOString().slice(0, 10);
    console.log(`  ${String(t.name).padEnd(20)} ${status}   ${used.padEnd(21)} ${made}`);
  }
  console.log("");
}

async function revoke(name) {
  if (!name) {
    console.error('Usage: node scripts/admin-token.mjs revoke "Person name"');
    process.exit(1);
  }
  const { data, error } = await supa
    .from("admin_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("name", name)
    .is("revoked_at", null)
    .select("name");

  if (error) {
    console.error("Could not revoke:", error.message);
    process.exit(1);
  }
  if (!data.length) {
    console.log(`  No active token found for "${name}".`);
    return;
  }
  console.log(`  Revoked ${data.length} token(s) for ${name}. Effective immediately.`);
}

const commands = { issue, list, revoke };
if (!commands[command]) {
  console.log("Usage:");
  console.log('  node scripts/admin-token.mjs issue "Person name"');
  console.log("  node scripts/admin-token.mjs list");
  console.log('  node scripts/admin-token.mjs revoke "Person name"');
  process.exit(1);
}

await commands[command](argument);
