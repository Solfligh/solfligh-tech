-- Records when an access code was sent for a ProfitPilot request.
-- Additive and nullable: existing rows and /api/waitlist inserts are unaffected.
-- RLS stays enabled with no policies (see CLAUDE.md); access is service_role only.
alter table public.waitlist_signups
  add column if not exists code_sent_at timestamptz;
