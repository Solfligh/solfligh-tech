# BACKLOG.md — Solfligh Tech Website

Prioritized work queue. Read `CLAUDE.md` first for project rules and constraints.

**Working agreement:**
- One task per branch, one PR per task. Do not batch unrelated tasks.
- Run `npm run build` AND `npx tsc --noEmit` before opening any PR. Turbopack
  skips type validation, so the build alone is not sufficient.
- If a task requires a decision not specified here, STOP and ask. Do not guess
  at product decisions, data models, or content.
- Never invent statistics, testimonials, customer names, or metrics.

---

## Status — 2026-09-08

**Tasks 1–17 are all complete**, including 12 and 13, which sat here as blocked
on files "not in this repo". Both were checked against the actual documents on
2026-09-08 and were already fixed — see the note under each. Substantial
hardening followed the list itself; see "After the backlog" below.

The strategy docs now live in the private repo
**https://github.com/Solfligh/solfligh-docs**, mirrored at `docs/` in this
working tree (gitignored, because this repo is public).

| # | Task | State |
|---|---|---|
| 1 | Broken image on a live article | Done — PR #1 |
| 2 | `/api/admin/categories` | Done — PR #2, **but see correction below** |
| 3 | `/admin` Status dropdown | Done — PR #3 |
| 4 | `images.domains` deprecated | Done — PR #4 |
| 5 | `middleware` → `proxy` | Done — PR #5 |
| 6 | Dependency housekeeping | Done — PR #6, #7, #11. See task 16. |
| 7 | Services page service lines | Done — PR #15 |
| 8 | Contextual CTA routing | Done — PR #16 |
| 9 | `/projects` → `/products` | Done — PR #14 |
| 10 | `/waitlist` genericization | Done — PR #13 |
| 11 | Careers page | Done — PR #18. No openings yet, so it invents none. |
| 12 | Roadmap doc corrections | Done — verified fixed in the doc itself, 2026-09-08. |
| 13 | Blueprint naming | Done — verified fixed in the doc itself, 2026-09-08. |
| 14 | Vercel preview env vars | Done — resolved in Vercel, previews now build |
| 15 | Books/chapters persistence | Done — PR #12 |
| 16 | Finish npm audit remediation | Done — PR #11. 14 → 7, and all 7 remaining are dev-only. |
| 17 | Blog comments | Done — PR #19. Real backend, approve-first moderation. |

Two issues were found and fixed during this pass that were not on the list:

- **Unauthenticated admin write endpoints** (PR #10). `/api/admin/posts`,
  `/categories`, `/books`, and `/chapters` had no auth at all — anyone could
  create, edit, or delete blog content on production with a single `curl`.
  `requireAdmin` existed and was simply never called. The blog admin was also
  "protected" by a password hardcoded in a `'use client'` file, so it shipped to
  every visitor. Fixed; all 8 admin routes now enforce admin auth. (The shared
  `ADMIN_TOKEN` this originally used has since been retired — PR #41.)
- **A syntax error in `app/lib/comments.ts`** (PR #8) that made `tsc --noEmit`
  fail on `main`, dormant only because nothing imports the module.

Also worth knowing: **Vercel Preview deployments were failing for every PR**
regardless of content, because `SUPABASE_SERVICE_ROLE_KEY` was scoped to
Production only. Red CI therefore carried no signal for the whole first half of
this pass. Resolved (task 14), and the project's Node version was moved to 22.x
to match what `@supabase/supabase-js` requires.

**Correction to task 2 as written.** The premise was out of date. `getCategories`
and `saveCategories` *did* exist in `app/lib/posts.ts`, and the route's relative
import resolves there (not to the root `lib/posts.ts`), so it compiled and
returned data — it was never throwing. The real defect was persistence: writes
went to `public/data/*.json` via `fs.writeFileSync`, which fails on a read-only
serverless filesystem, and the public blog read the baked-in static JSON. Both
now go through Supabase.

---

## After the backlog — Sep 2026

Work that followed tasks 1–17. Most of it came from things found while doing
something else, so it is recorded here rather than as numbered tasks.

**Correctness and data loss**

- **Admin project saving was completely broken** (PR #42). The form POSTed to
  `/api/admin/products`, which does not exist — every save hit Next's HTML 404,
  and calling `res.json()` on it surfaced `Unexpected token '<'` instead. Behind
  that, `upsertProject` wrote a `project_id` column that is not on
  `project_media`, and because media rows are deleted *before* the new ones are
  inserted, a failed save also destroyed the project's existing media. Nothing
  was damaged only because the 404 stopped requests reaching it. Fixed, with a
  real edit path: projects can now be loaded into the form, and saving over a
  slug that was not loaded is refused.
- **Resend failures were swallowed** (PR #20). The SDK reports API errors on a
  returned `error` field rather than throwing, so notifications could fail
  silently.
- **`supabaseAdmin` threw at module scope** (PR #21), which killed whole builds
  rather than one route. Now lazy.
- **`/api/admin/leads` 500'd on `column leads.ip does not exist`** and stayed
  broken across two merges, because the tests covering it mocked the database
  away (PR #25). This is what motivated the integration suite.

**Privacy and abuse**

- Lead IPs stored as SHA-256 hashes, user agents coarsened (PRs #23, #24, #25).
- Rate limiting on comments, leads, and waitlist, DB-backed and failing open
  (PRs #22, #23).

**Comments**

- Real backend with approve-first moderation (PR #19), replacing localStorage.
- Per-comment emails replaced by a daily digest cron (PR #36), authenticated by
  `CRON_SECRET` and failing closed without it.

**SEO**

- Sitemap covers blog, books, chapters, and insights (PR #26).
- Article, Book, Chapter, and Breadcrumb schema (PRs #27–#29).
- Canonical URLs point at `www`, which is the host that actually serves (#39).

**Security and process**

- Per-person admin tokens with identity and revocation (PR #33), httpOnly
  sessions (PR #34), and the shared `ADMIN_TOKEN` retired entirely (PR #41).
- CI runs tests, typecheck, and build on every PR (PR #31). `main` now requires
  it to pass.
- Integration tests against the real schema (PR #35), plus a `projects.json`
  drift guard (PRs #37, #38).
- Branded 404 and error boundaries (PR #40).

**Still open**

- The comment digest has not yet fired with a non-empty queue, so the cron path
  is configured but unproven end to end.
- **Four of the six authoritative documents are still missing.** `docs/` holds
  the Blueprint and the Roadmap; Brand Guidelines, Website Architecture, the
  Cloud PRD, and Operating System / API Standards are not there, yet
  `CLAUDE.md` cites them by section as binding rules.
- `/admin` has not been used by hand since PR #42 changed how saving works.

**Now resolved:** `docs/` is backed up to the private repo
`Solfligh/solfligh-docs`. It had existed only on the founder's machine, having
been gitignored after a brief accidental push to this public repo.

Tasks 12 and 13 turned out to be **already fixed in the documents themselves** —
their premises were stale. That is the third stale premise found in this file
(task 2 and task 16 were the others). **Check the artefact before acting on a
task description here.**

---

## P0 — Visible breakage

### 1. Broken image on a live article
`/insights/profitpilot/posts/profit-unknown.jpg` returns 404.

- Check what actually exists in `public/insights/profitpilot/posts/`
- Either the file is missing, or `app/lib/insightsStore.ts` references a wrong
  filename in the `coverImage` field for the "when-profit-is-unknown-thats-still-an-answer" post
- Fix whichever it is. Do not generate a placeholder image.
- **Done when:** the article page loads with no 404 in the dev server log.

### 2. `/api/admin/categories` throws on every request
`app/api/admin/categories/route.ts` imports `getCategories` and `saveCategories`
from `lib/posts` — **neither function has ever existed** in that module.

**This needs a decision before any code is written. Ask the founder:**
- Is the blog categories feature actually wanted?
- If yes: what is the data shape? (Likely a string array in
  `public/data/categories.json`, mirroring how `getPosts` reads
  `public/data/posts.json` — but confirm rather than assume.)
- If no: delete the route and any UI that calls it.

**Done when:** either the endpoint works end-to-end, or the dead route is removed.

---

## P1 — Correctness and config

### 3. `/admin` Status dropdown cannot express FXCopilot's real status
`app/admin/page.tsx` (~line 393) has a Status `<select>` offering only
`Upcoming`, `In Development`, `Live / Near Launch`. FXCopilot's actual status is
plain `Live`, so editing it through the admin UI would silently change it.

- Add a `Live` option.
- **Done when:** all four current statuses are selectable and round-trip correctly
  through save/reload.

### 4. `images.domains` is deprecated
`next.config.ts` uses `images.domains`; Next 16 warns this is a security risk and
wants `images.remotePatterns`.

- Migrate, preserving the existing allowed host (`fxco-pilot.solflightech.org`).
- **Done when:** the deprecation warning no longer appears on `npm run dev`.

### 5. `middleware.ts` convention deprecated
Next 16 wants `proxy` instead of `middleware`. The file currently handles
maintenance mode via `MAINTENANCE_MODE`.

- Migrate per https://nextjs.org/docs/messages/middleware-to-proxy
- **Done when:** maintenance mode still works (verify by toggling the env var)
  and the warning is gone.

### 6. Dependency housekeeping
- `npx update-browserslist-db@latest` (silences a build warning)
- `npm audit` — review the 14 reported vulnerabilities.
  **Do NOT run `npm audit fix --force`**; it installs breaking major versions.
  Report findings and propose specific upgrades instead.

### 14. Vercel preview deployments have no Supabase env vars

**Every PR preview fails to build**, regardless of what the PR changes. Production
(`main`) is green because it has the env vars; Preview does not.

Reproduced locally: with `NEXT_PUBLIC_SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` removed, `npm run build` dies at
`Failed to collect page data for /api/admin/leads`, because
`app/lib/supabaseAdmin.ts` throws at module evaluation when either is missing.

- Add both vars to Vercel's **Preview** environment
- **Done when:** a PR preview deploys green
- Consider also making `supabaseAdmin.ts` fail lazily rather than at import
  time, so a missing env var degrades one route instead of the whole build

### 15. Books/chapters admin still writes JSON at runtime

Same class of bug as task 2, not fixed by it. `/api/admin/books` and
`/api/admin/chapters` still persist via `fs.writeFileSync` into `public/data/`,
and `app/admin/blog/page.tsx` reads `/data/books.json` + `/data/chapters.json`
directly. That cannot work on a read-only serverless filesystem.

- Migrate to Supabase following the pattern now used for `posts`/`categories`
  in `app/lib/posts.ts` (`hasSupabase()` gate, Supabase read with JSON fallback)
- Keep `public/data/*.json` as the local/dev fallback
- **Done when:** a book or chapter saved through `/admin/blog` survives a redeploy

### 16. Finish the npm audit remediation (continues task 6)

`npm audit` is at **10** (1 low, 1 moderate, 8 high), down from 14 after PR #7.
**Do NOT run `npm audit fix --force`.** Remaining, in priority order:

1. **`next` 16.1.1 → 16.2.12** — clears `next` (high) and `sharp` (high, libvips
   CVEs). Despite the earlier warning in task 6, npm reports this as
   `isSemVerMajor: false` — it is a **minor** bump. It only trips the "outside
   the stated dependency range" message because `package.json` pins `next` to an
   exact `16.1.1` with no caret. Biggest blast radius of what is left; give it
   its own PR and a real smoke test.
2. **`postcss` devDep → 8.5.25** — trivial, in range.
3. **`postcss` bundled inside Next — cannot currently be fixed.** `next@16.2.12`
   still pins `postcss 8.4.31`, which stays inside the vulnerable range
   (`<=8.5.17`). npm's claim that upgrading Next fixes postcss is wrong. Low
   practical risk: the advisory needs attacker-controlled CSS comments, and all
   CSS here is authored. Revisit when Next ships a newer postcss.
4. **7 dev-only transitives** (`@babel/core`, `ajv`, `brace-expansion`,
   `flatted`, `js-yaml`, `minimatch`, `picomatch`) — eslint/babel toolchain,
   never shipped to users. No action; they clear on the next eslint update.

---

## P2 — Documentation gaps vs. the Blueprint

### 7. Services page is missing real service lines
`app/services/page.tsx` shows 5 broad categories. Blueprint §10 and Website
Architecture §5 specify five categories containing ~20 individual lines:

- **Build:** Custom Software Development, Web Development, Mobile App Development,
  API Development, SaaS Development, Startup MVP Development, Enterprise Software
  Development, ERP/Business Systems
- **AI & Automation:** AI Automation, AI Agent Development, Business Process Automation
- **Infrastructure:** Cloud Infrastructure, DevOps, Database Architecture,
  System Integration, API Integration
- **Design & Strategy:** UI/UX Design, Product Consulting, Technology Consulting,
  Digital Transformation
- **Run:** Technical Support, Maintenance

Website Architecture §5 specifies these as **collapsible sections on one page**,
not 20 separate thin pages. Page ends with a "Talk to us about your project" CTA,
distinct from the Products page CTA.

**Done when:** all lines above are present, grouped by category, collapsible,
and the page still passes build + typecheck.

### 8. Contextual CTA routing
Website Architecture §10: the header CTA should route by page context, not to one
fixed destination.

| Visitor context | CTA routes to |
|---|---|
| Homepage / Solfligh Cloud | Developer signup (does not exist yet — use `/contact`) |
| Products page | That product's demo/signup |
| Services page | Contact/consultation form |
| Company pages | General contact form |

**Done when:** the CTA destination changes with route, per the table.

### 9. `/projects` → `/products` URL migration
Nav labels already say "Products" but hrefs are still `/projects`. Website
Architecture §11 specifies `/products` and `/products/[slug]`.

- Rename routes, add **permanent redirects** from `/projects/*` to `/products/*`
  in `next.config.ts` to preserve SEO and existing inbound links
- Update `data/projects.json` `href` fields and the `projects` table in Supabase
  (project ref `ujfzmwpkwjgyltpgszvu`) so both stay in sync
- Update `app/sitemap.ts`
- **Done when:** `/products` works, every old `/projects/*` URL 301s to its new
  equivalent, and no internal link still points at `/projects`.

### 10. `/waitlist` is hardcoded to ProfitPilot
`app/waitlist/page.tsx` accepts a `product` query param and uses it for the
heading, but two strings ignore it entirely:
- success state: "Back to ProfitPilot hub"
- textarea placeholder: "What do you want ProfitPilot to help with?"

So it cannot safely serve RebirthAgro or any future product.

- Drive all copy from the `product` param
- **Note:** Solfligh Cloud must NOT be routed here — Cloud is not a product
  (Blueprint §11.1). This is for products only.
- **Done when:** `?product=rebirthagro` produces fully correct copy throughout.

### 11. No Careers page
Website Architecture §9 lists Careers under Company. It does not exist.

**Ask the founder before building:** are there actual openings, or should this be
a "no current openings, get in touch" page? Do not invent job listings.

### 17. Blog comments are localStorage-only, and `app/lib/comments.ts` is dead code

`app/blog/[slug]/page.tsx` stores comments in `localStorage`. A visitor therefore
only ever sees **their own** comments, on **one** browser, and they vanish when
storage is cleared. Nothing is persisted server-side and no one else can read them.

Meanwhile `app/lib/comments.ts` exports `fetchComments`/`addComment` that POST to
a Google Apps Script webhook — **nothing imports them**. It looks like the
intended real backend that was never wired up. (Its missing-quote syntax error
was fixed in PR #8; the file still parses only because nothing imports it.)

**Decision needed before any code:** is a real comments system wanted?
- If yes: a `comments` table fits the Supabase pattern already established for
  `posts`/`categories`. Needs a moderation/spam story before going public.
- If no: delete `app/lib/comments.ts` and either remove the comment UI or label
  it clearly as local-only notes.

Either way, do not leave it as-is — the current UI implies comments are public
when they are not.

If the Apps Script approach is kept, rotate the webhook URL and move it to an
env var. It is a capability URL and is already committed in git history (`66ff4fd`).

---

## P3 — Documentation corrections (not code)

### 12. Roadmap doc is inaccurate
`10-solfligh-tech-roadmap.md` §2 "Now — Live Today" currently lists:
- **ProfitPilot** as flatly "Live" → should be **"Live / Near Launch"**
- **RebirthAgro** as Live → should move to §3 "In Development"

Both confirmed with the founder. The site is correct; the doc is stale.

> **Resolved.** The doc is now available at `docs/` (mirrored to the private
> repo `Solfligh/solfligh-docs`), and reading it on 2026-09-08 shows §2 already
> correct: ProfitPilot reads **"Live / Near Launch"**, and RebirthAgro is not in
> the "Now — Live Today" table at all. The premise above was stale.
>
> **The site side needed no change either** — `app/roadmap/page.tsx` already
> reads "Live / near launch" for ProfitPilot and lists RebirthAgro under *In
> development — not yet released*. Verified 2026-08-05.

### 13. Blueprint naming inconsistency
`04-solfligh-tech-master-corporate-blueprint-v2.md` §3 (Core Values, item 5) and
§4 still reference "API Cloud" as a product name, which the same document's own
changelog retired. Minor, but the Blueprint is the authoritative naming source,
so it should not contradict itself.

> **Resolved.** Checked against the Blueprint on 2026-09-08: the only remaining
> "API Cloud" mentions are the changelog and two notes explaining that the name
> was retired in favour of Developer Platform / API Gateway. Neither §3 nor §4
> uses it as a current product name, so the document no longer contradicts
> itself. "API Cloud" appears nowhere in the codebase either.

---

## Known constraints — do not "fix" these

- **RLS is enabled with no policies on all Supabase tables. This is deliberate.**
  All access is server-side via `service_role`, which bypasses RLS. Adding
  permissive policies would expose the `leads` table to the public anon key.
- **ProfitPilot's status is "Live / Near Launch"**, deliberately hedged. Do not
  "clean it up" to plain "Live".
- **`data/projects.json` is a fallback**, intentionally duplicating the Supabase
  `projects` table. Keep both in sync; do not delete either.
- **Trailing whitespace in `lib/posts.ts`** is pre-existing throughout the file.
  Leave it; reformatting creates noisy diffs.
