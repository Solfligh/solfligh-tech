// src/lib/dailyCheck.ts

import type { SupabaseClient } from "@supabase/supabase-js";

export function formatYMD(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseYMD(ymd: string) {
  // ymd: "YYYY-MM-DD"
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  return new Date(y, (m || 1) - 1, d || 1);
}

export function isAfterLocalHour(now: Date, hour24: number) {
  return now.getHours() >= hour24;
}

export function localTodayYMD(now = new Date()) {
  return formatYMD(now);
}

export function localYesterdayYMD(now = new Date()) {
  const d = new Date(now);
  d.setDate(d.getDate() - 1);
  return formatYMD(d);
}

type SnapshotRow = {
  snapshot_date: string;
  income_cents: number;
  expense_cents: number;
  net_cents: number;
  has_incomplete_costs: boolean;
};

type AckRow = {
  snapshot_date: string;
};

export async function findPendingDailyCheckDate(opts: {
  supabase: SupabaseClient;
  tenantId: string;
  userId: string;
  now?: Date;
  cutoffHourLocal?: number; // default 19 (7pm)
}) {
  const { supabase, tenantId, userId } = opts;
  const now = opts.now ?? new Date();
  const cutoffHourLocal = opts.cutoffHourLocal ?? 19;

  // Rule:
  // - Before 7pm: we don't force Daily Check.
  // - After 7pm: show the most recent unacknowledged snapshot among [today, yesterday] (or recent few).
  if (!isAfterLocalHour(now, cutoffHourLocal)) return null;

  // Fetch recent snapshots (small window keeps it cheap)
  const { data: snaps, error: snapErr } = await supabase
    .from("daily_profit_snapshots")
    .select("snapshot_date,income_cents,expense_cents,net_cents,has_incomplete_costs")
    .eq("tenant_id", tenantId)
    .order("snapshot_date", { ascending: false })
    .limit(7);

  if (snapErr) throw snapErr;

  const snapshots = (snaps ?? []) as SnapshotRow[];
  if (snapshots.length === 0) {
    // If no snapshot exists yet, still push to today; the page can create it via RPC.
    return localTodayYMD(now);
  }

  // Fetch acknowledgements for those snapshot dates
  const dates = snapshots.map((s) => s.snapshot_date);

  const { data: acks, error: ackErr } = await supabase
    .from("daily_check_ack")
    .select("snapshot_date")
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .in("snapshot_date", dates);

  if (ackErr) throw ackErr;

  const acknowledgedSet = new Set(((acks ?? []) as AckRow[]).map((a) => a.snapshot_date));

  // Prefer today first, then yesterday, then most recent unack.
  const today = localTodayYMD(now);
  const yesterday = localYesterdayYMD(now);

  const orderedPreference = [today, yesterday, ...dates];

  for (const d of orderedPreference) {
    if (dates.includes(d) || d === today) {
      if (!acknowledgedSet.has(d)) return d;
    }
  }

  return null;
}
