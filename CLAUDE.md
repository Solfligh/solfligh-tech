# CLAUDE.md — Solfligh Tech Website

Context file for Claude Code. Read this before making changes.

---

## Project

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4.
Supabase for data, Resend for transactional email.
Live at **solflightech.org** (note: `.org`, not `.com`).

## Authoritative documentation

The Solfligh Tech strategy docs are the **single source of truth** and override
anything currently on the live site:

- Master Corporate Blueprint v1.1
- Brand Guidelines v1.0
- Website Architecture Document v1.0
- Solfligh Cloud PRD v2.1
- Operating System, API Standards, Roadmap

Where docs and code conflict, **the docs win** unless the founder says otherwise.
Ask rather than guess when requirements are unclear.

## Non-negotiable rules

1. **Canonical names.** `FXCopilot` — never "FXCO-PILOT", never "ProfitFX".
   Products are `ProfitPilot`, `RebirthAgro`, `FXCopilot`.
2. **Solfligh Cloud is NOT a product.** It is the platform/infrastructure layer
   (Blueprint §11.1). Never frame it as a product, never route it through a
   product waitlist flow.
3. **No fabricated content.** No invented statistics, metrics, customer quotes,
   or testimonials (Brand Guidelines §3). If there is nothing verifiable to show,
   use an honest "what's live now" summary instead (Website Architecture §3.4).
4. **No AWS / "the X of Africa" comparisons** in public-facing copy
   (Brand Guidelines §4). Internal docs may use them; the website may not.
5. **Africa-first framing** in positioning copy (Blueprint §2).

## Current product status (verified with founder)

| Product | Status |
|---|---|
| ProfitPilot | `Live / Near Launch` — deliberately hedged, do not change to plain "Live" |
| FXCopilot | `Live` — external app at https://fxco-pilot.solflightech.org |
| RebirthAgro | `In Development` — not released |

## Supabase

- **Active project:** `solfligh-web` — ref `ujfzmwpkwjgyltpgszvu`, region eu-west-1
- Three older projects (`solfligh-tech`, `FXCO-PILOT`, `profitpilot`) were
  deleted in Aug 2026. The old `naqwutnphhwjwykofecv` had been paused since
  June 2024 and was unrecoverable — the site had been silently running on the
  `data/projects.json` fallback for months.
- **Tables:** `projects`, `project_media`, `leads`, `waitlist_signups`,
  `posts`, `categories`, `books`, `chapters`, `comments`, `admin_tokens`
- **RLS is enabled with NO policies, deliberately.** All access is server-side
  via `service_role`, which bypasses RLS. This means the public anon key cannot
  read leads or waitlist data. **Do not add permissive policies to these tables.**
- `project_media` is keyed by **`project_slug`**. There is no `project_id`
  column, and writing one broke every project save (PR #42).
- `data/projects.json` is a fallback and must stay in sync with the `projects`
  table. `npm run sync:projects` regenerates it, `npm run sync:projects:check`
  reports drift, and an integration test fails if they diverge.

## Architecture conventions

- Shared components in `app/components/` — `Container`, `PageHeader`, `LeadForm`,
  `ProjectCard`
- **Use `LeadForm` for all lead capture.** It handles `kind: 'contact' | 'partner'
  | 'investor'`, posts to `/api/leads`, and includes validation + honeypot.
  Do not write bespoke form components.
- Data access via `app/lib/projectStore.ts` (Supabase, with JSON fallback)
- Insights content in `app/lib/insightsStore.ts` — a page under
  `app/insights/<hub>/` requires a matching entry in `HUBS`, and each article
  requires an entry in `POSTS`, or it silently 404s / becomes unreachable.

## Admin access

- **Per-person tokens only.** `public.admin_tokens` stores SHA-256 hashes; the
  plaintext is shown once by `scripts/admin-token.mjs issue "Name"` and cannot
  be recovered. `list` and `revoke "Name"` manage them — revoke matches the name
  **exactly and revokes every active token with it**, so name them per device if
  you want independent revocation.
- **The shared `ADMIN_TOKEN` is retired** (PR #41). `verifyAdminToken` does not
  read the environment at all, so setting the variable again does nothing. Four
  unit tests fail if the fallback is reintroduced. Do not add it back.
- `app/api/admin/_auth.ts` is the single guard. Every admin route uses it and
  returns the same shape. It previously existed as four drifting copies.
- Signing in exchanges the token for an httpOnly `admin_session` cookie.

## Testing

- `npm test` — unit, hermetic, no secrets. This is what CI runs.
- `npm run test:integration` — runs against the **real** Supabase project and
  needs `.env.local` plus `ADMIN_TEST_TOKEN` (a real issued token). It **skips
  silently** without them, which reads as passing in the summary line — check
  for `0 skipped`.
- Integration tests exist because mocked tests structurally cannot catch schema
  drift. That class of bug has shipped twice: `leads.ip` survived two merges,
  and `project_media.project_id` broke every project save (PR #42).
- `main` requires the `Test, typecheck, build` check to pass before merging.

## Known outstanding work

1. **Roadmap doc corrections** — `10-solfligh-tech-roadmap.md` §2 lists
   ProfitPilot as flatly "Live" and RebirthAgro as live; both are inaccurate.
   The file lives in `docs/`, which is gitignored (see below), so this cannot be
   done from the repo alone.
2. **Blueprint naming inconsistency** — same location, same constraint.
3. **The comment digest has never fired with a non-empty queue.** The cron is
   configured in `vercel.json` and unit-tested, but the end-to-end path is
   unproven.
4. **`docs/` has no backup.** It is gitignored deliberately — it was briefly
   pushed to this public repo by mistake and removed — so no git remote holds
   it. It exists only on the founder's machine, and this file names it the
   source of truth that overrides the site.

## Recently completed

Everything in `BACKLOG.md` (tasks 1–17) plus the hardening that followed. See
that file for the full record; the load-bearing items are:

**Aug 2026 — the original backlog**

- Fixed lead-loss bug: `/api/leads` returned 500 on DB failure *before* sending
  the notification email, silently dropping leads. Email is now the durable
  fallback; storage is best-effort.
- Fixed dead contact + partner forms (`<button type="button">`, no handler).
- **Unauthenticated admin write endpoints** — `/api/admin/posts`, `/categories`,
  `/books`, `/chapters` had no auth at all. `requireAdmin` existed and was never
  called (PR #10).
- Services expanded to Blueprint §10 lines; contextual CTA routing; `/projects`
  → `/products` with redirects; `/waitlist` genericized; Careers page.
- Canonical FXCopilot naming; `solflightech.org` typo; `/cloud`, `/ai`,
  `/roadmap`; homepage rebuilt without the fabricated revenue widget.

**Sep 2026 — hardening**

- Real blog comments with approve-first moderation, IP rate limiting, and a
  daily digest cron (PRs #19, #22, #36).
- Privacy: lead IPs stored as hashes, user agents coarsened (PRs #24, #25).
- SEO: sitemap covers all content; Article/Book/Chapter schema; canonical
  URLs point at `www`, which is what actually serves (PRs #26–#29, #39).
- Per-person admin tokens, httpOnly sessions, shared token retired
  (PRs #33, #34, #41).
- CI on every PR; integration tests against the real schema (PRs #31, #35).
- Branded 404 and error boundaries (PR #40).
- **Admin project saving was completely broken** — the form POSTed to
  `/api/admin/products`, which does not exist, and behind that 404 the media
  write used a `project_id` column that is not on the table, deleting existing
  media before failing. Fixed with a real edit path (PR #42).

## Deployment

CI runs `npm test`, `tsc --noEmit`, then `npm run build` on every PR, and `main`
requires it to pass. Turbopack skips type validation, so the build alone is not
sufficient — run `npx tsc --noEmit` too.
