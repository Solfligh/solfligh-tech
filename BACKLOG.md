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

## Status — 2026-08-03

| # | Task | State |
|---|---|---|
| 1 | Broken image on a live article | Done — PR #1 |
| 2 | `/api/admin/categories` | Done — PR #2, **but see correction below** |
| 3 | `/admin` Status dropdown | Done — PR #3 |
| 4 | `images.domains` deprecated | Done — PR #4 |
| 5 | `middleware` → `proxy` | Done — PR #5 |
| 6 | Dependency housekeeping | Partial — PR #6 (browserslist), PR #7 (resend/supabase). See task 16. |

**Correction to task 2 as written.** The premise was out of date. `getCategories`
and `saveCategories` *did* exist in `app/lib/posts.ts`, and the route's relative
import resolves there (not to the root `lib/posts.ts`), so it compiled and
returned data — it was never throwing. The real defect was persistence: writes
went to `public/data/*.json` via `fs.writeFileSync`, which fails on a read-only
serverless filesystem, and the public blog read the baked-in static JSON. Both
now go through Supabase.

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

### 13. Blueprint naming inconsistency
`04-solfligh-tech-master-corporate-blueprint-v2.md` §3 (Core Values, item 5) and
§4 still reference "API Cloud" as a product name, which the same document's own
changelog retired. Minor, but the Blueprint is the authoritative naming source,
so it should not contradict itself.

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
