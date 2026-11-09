# SEO toolkit rules for Level-Up Hair Salon

These rules apply to the SEO commands in `.claude/commands/`. They were adapted from the free SEO Agent (github.com/youtube-jono/seo-agent, version 899bc21) to fit this project.

**This project's `CLAUDE.md` is in charge.** If anything here disagrees with it, `CLAUDE.md` wins. The design follows the Crafto barber reference described in `project_specs.md`, and that design wins over any template in `seo/references/`.

## The commands

1. `/keyword-research` - keywords, filtered and clustered into `seo/keyword-map.md`, the whole plan in one file. `expand` mode refills it
2. `/service-page` - one money page from the next service keyword in the map, built into the existing service page design
3. `/blog-post` - one blog post draft from the next blog keyword in the map, in the salon's voice
4. `/seo-optimization` - fix one page: on-page, technical, images, speed, AI answers
5. `/audit` - the whole-site audit: Semrush, on-page, technical, AI answers, index hygiene, local
6. `/publish` - release through the project's existing pipeline, then the Google steps after launch

Not installed here: `/build-website`, which replaces the site with the kit's own template and would destroy the design this site was built on. **Wherever a command or a reference guide routes work to it, route it to a spec in `project_specs.md` instead.**

## Path map

The reference guides were written for the kit's own layout. In this project:

- `references/...` means `seo/references/...`
- `code/...` means `seo/code/...`
- `website/...` means the project root: `app/`, `components/`, `lib/`, and `public/` for images
- `website/lib/site.config.ts` means `lib/site.ts`, which holds the salon's name, address, hours, socials and `siteUrl`. Services and prices live in `lib/content.ts`
- "CLAUDE.md under ## My setup" means `seo/my-setup.md`

## About this site

Facts every command can rely on. Business facts live in `seo/my-setup.md`.

- A custom Next.js 16 site (App Router, TypeScript, Tailwind v4) at the project root. Vercel will host it. The only way to change the site is to edit the code, then deploy
- Dev server: `npm run dev`, at **http://localhost:3200**. Not port 3000
- **Not live yet.** No domain chosen. `siteUrl` in `lib/site.ts` is set at launch
- Shape of the site today: one long homepage `/`, built to match the Crafto barber reference. No `/services`, `/about` or `/blog` yet. A local service business, so `seo/references/pyramid-structure.md` applies when pages are added
- A **unisex** salon (women, men and kids), not a men-only barber. Services come from Yelp: haircuts, cut and colour, styling and blowouts, perms and chemical treatments. Never add a service the salon has not confirmed
- Leads: the appointment form posts to `app/api/appointment`, which validates and logs it. **There is no CRM and no lead webhook. Never add one, never suggest GoHighLevel**
- Semrush is connected in Claude Code

## Hard rules

- **⛔ The voice.** Warm, friendly and confident, the way a family-run neighbourhood salon talks to a regular. **The kit's humour rule is OFF for this site.** A light touch is fine; a joke every second sentence is not. No hype, no superlatives, no promised outcomes, no "trusted by thousands". Only true things
- **⛔ No emoji icons, no generic gradients** (CLAUDE.md design rule). When a kit template conflicts with the design, the design wins and you say which rule you set aside
- **⛔ This is a real salon with real clients.** No invented client names, reviews, awards, years in business or client counts. Reviews only when the salon supplies or approves them. Stylist names seen on Yelp (Norma, Sara) are used only after the salon confirms they still work there. If proof is missing, say so and ask
- **⛔ The phone number is not confirmed.** Until it is, it shows as "to confirm" and stays out of schema
- **⛔ Approval before the site changes (CLAUDE.md Rule 2).** Research, audits and reports run straight through. Anything that edits `app/`, `components/`, `lib/` or `public/` first shows what it will change and waits for a yes. A new page or section needs a spec in `project_specs.md`, approved, before it is built
- **Never spend money without asking.** Any paid tool call, paid crawl or purchase is described first and waits for a yes
- **Every command accepts a focus.** A command runs end to end by default, but a named slice runs ONLY that slice at full depth: `/seo-optimization images`, `/audit ai`, `/keyword-research expand`. If the focus matches nothing, list the sections and ask
- **Link only what the owner needs to open.** A page to preview (prefer the localhost URL) or a report worth reading. Never an inventory of code files
- **Every page built or changed gets a URL to click.** Local first, for example http://localhost:3200/. If the dev server is not running, start it. Give the live URL too, and say which is which
- **Copy the file shapes exactly.** Before writing any file the owner will open, read `seo/references/file-examples.md`. `seo/references/output-format.md` holds the rules. When the two disagree, file-examples.md wins
- **Files in `seo/` stay short.** If a human needs to read it, it goes in the human file. If only Claude needs it, it goes in `seo/references/`. The test: would the owner do something differently because of this paragraph? If not, cut it and put the explanation in chat
- **Every markdown file in `seo/` passes these before a command finishes:**
  - A busy person reading it on a phone knows what to do in 10 seconds
  - No markdown tables. Use a `##` block per item with bold labels, or a plain list. `seo/keyword-map.html` is the one sanctioned table. This applies only inside `seo/`, never to `project_specs.md`
  - No raw payloads: no YAML, JSON, CSV, timestamps or IDs
  - No bare numbers. Label it or drop it
  - No walls: no list past 10 items without "+ N more", no block of text longer than about four lines
  - Dates in words, such as "Monday 12 October"
  - Plain words, not jargon
  - Three lines at the top: what it is, when it was made, the one next action
  - Decision before data
- **Never delete anything.** No images, sections, paragraphs, pages or scripts. When removal genuinely is right, it goes in the report under "Needs your approval to remove" and waits for an explicit yes. Consolidations and 301 redirects count as deletions
- **If you can't find it, ask.** Never guess a plausible value, never leave it blank, never quietly skip it. Unanswered items go in the report as open questions. A placeholder left on a page is written so it cannot ship by accident, in the shape "to confirm" (the check scripts block publishing while any remains)
- **Label confidence.** Say when a recommendation is practitioner consensus rather than documented Google behaviour
- **Never rewrite the copy during audits or fix passes.** Change the mechanical layer only: title tags, meta descriptions, alt text, heading tags, schema, canonicals, link anchors, image files, slugs, broken markup. Not body sentences, not the salon's wording. Report how many body sentences changed; zero is expected
- **Drafts are not published.** Content commands save drafts and register them in `seo/website-index.md`. Publishing is `/publish`, after the owner approves
- **One primary keyword per page, ever.** Check `seo/keyword-map.md` first
- **Update the registries.** Every draft appends a block to `seo/website-index.md` and moves its row to `# Written` in `seo/keyword-map.md`
- **Record business facts in `seo/my-setup.md`** so nothing is asked twice. Never add them to `CLAUDE.md`

## Two rules that override everything else in this file

**Test before you respond.** After any code change, run it: `npm run build`, the dev server, the check script. Never say "done" if it is untested. This repeats CLAUDE.md Rule 4.

**The 9 out of 10 quality gate.** Nothing goes onto the live site until it scores 9 out of 10 or higher, rated honestly. If it isn't a 9, say exactly what's wrong and fix it first.

## Every command opens with a roadmap

Before the first tool call, print the plan: the steps with rough times, how long overall, every stop where the owner is needed, and what might go wrong. Adapt it to the actual run. Short commands get a short roadmap. Then start.

## How to respond

Follow the "How to Respond" section of `CLAUDE.md`: what I just did, what you need to do, why, next step, errors. Explain it to someone with no coding background. No em dashes, in files, page copy or chat.

## File map

**What the runs produce, all in `seo/`**
- `seo/keyword-map.md` - THE keyword file, and `seo/keyword-map.html`, the same map as a table
- `seo/website-index.md` - every page, from Draft to Published
- `seo/optimization-log.md` - before and after for every `/seo-optimization` run
- `seo/audit-report.md` and `seo/audit-report.html` - the audit checklist and the report page
- `seo/drafts/` - blog post drafts, until the site has a blog
- `seo/my-setup.md` - the salon's facts and connections

**How every file must look**
- `seo/references/file-examples.md` and `seo/references/output-format.md`
- `seo/references/examples/` - worked examples on a made-up business. Never copy their content

**The specs the commands work from** (all in `seo/references/`)
- `on-page-seo.md`, `geo.md`, `meta-info.md`, `search-intent.md`
- `keyword-clusters.md`, `keyword-strategy.md`, `hub-spoke-pages.md`, `pyramid-structure.md`, `standard-pages.md`
- `service-page-template.md`, `cro-cheatsheet.md`, `doorway-pages.md`
- `blog-post-template.md`, `blog-post-retention.md`
- `gbp-setup.md`, `citations.md`, `audit-report-template.html`

**Check scripts, run from the project root**
- `python3 seo/code/check_page_done.py /route` - one page loads, no placeholders, no dead links
- `python3 seo/code/check_page_rhythm.py /route` - one page is not a wall of text
- `python3 seo/code/check_site_complete.py` - the whole site, before publishing. It was written for the kit's own template, so it expects `/services`, `/about` and `/blog`, which this one-page site does not have yet. Ignore those. The findings that matter are "to confirm" text and dead links
- `python3 seo/code/check_page_similarity.py --base http://localhost:3200` - proves pages are not clones
- `python3 seo/code/fetch_stock_photos.py "query" --count 8` - stock photos into `public/images/stock/`, until the salon sends real ones
