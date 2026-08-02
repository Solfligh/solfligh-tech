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
