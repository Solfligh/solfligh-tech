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
- **Tables:** `projects`, `project_media`, `leads`, `waitlist_signups`
- **RLS is enabled with NO policies, deliberately.** All access is server-side
  via `service_role`, which bypasses RLS. This means the public anon key cannot
  read leads or waitlist data. **Do not add permissive policies to these tables.**
- `data/projects.json` still exists as a fallback and should be kept in sync
  with the `projects` table.

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

## Known outstanding work

1. **Services page granularity** — currently 5 collapsed categories; Blueprint §10
   specifies ~20 individual service lines across Build / AI & Automation /
   Infrastructure / Design & Strategy / Run. Several real lines are missing
   (ERP, DevOps, Database Architecture, System Integration, Support, Maintenance).
2. **Contextual CTA routing** — Website Architecture §10 requires the header CTA
   to route by page context. Currently everything points to `/contact`.
3. **`/projects` → `/products` URL migration** — nav labels say "Products" but
   hrefs are still `/projects`. Needs redirects to preserve SEO.
4. **`/waitlist` genericization** — hardcodes ProfitPilot copy (success-state
   link, textarea placeholder) regardless of its `product` query param, so it
   cannot safely serve other products.
5. **`/admin` Status dropdown** is missing a plain `Live` option (only
   `Upcoming`, `In Development`, `Live / Near Launch`), so FXCopilot's real
   status cannot be set through the admin UI.
6. **Roadmap doc corrections** — `10-solfligh-tech-roadmap.md` §2 lists
   ProfitPilot as flatly "Live" and RebirthAgro as live; both are now known
   inaccurate and the doc needs updating.
7. **No Careers page** exists despite Website Architecture §9 listing one.

## Recently completed (Aug 2026)

- Canonical FXCopilot naming across metadata, JSON-LD, manifest, copy
- Fixed `solfightech.org` → `solflightech.org` typo; `.com` → `.org` subdomain
- New pages: `/cloud`, `/ai`, `/roadmap`
- Navbar restructured to Website Architecture §2; Company dropdown groups
  About/Blog/eBooks/Insights/Partner/Investors
- Homepage rebuilt: Hero → Four Pillars → Products Preview → Proof → Company Close;
  removed fabricated revenue widget and anonymous testimonials
- Fixed `/insights/fxco-pilot` "hub not found" (missing `HUBS` entry)
- **Fixed lead-loss bug:** `/api/leads` returned 500 on DB failure *before*
  sending the notification email, silently dropping project leads entirely.
  Email is now the durable fallback; storage is best-effort.
- **Fixed dead contact + partner forms:** both had `<button type="button">` with
  no handler, no state, no fetch. Now use the shared `LeadForm`.

## Important caveat

None of the recent work has been compiled or type-checked — it was produced in an
environment without `node_modules` or network access. **Run `npm install &&
npm run build` and fix any errors before deploying.**
