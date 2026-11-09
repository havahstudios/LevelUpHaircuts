# Level-Up Hair Salon — Project Specs

## What the app does and who uses it
A marketing website for **Level-Up Hair Salon**, a family-owned unisex salon in Los Angeles (Rancho Park).
Visitors (new and returning clients) use it to see services and prices, read reviews, check hours and location, and request an appointment.

## Design reference
- **Layout, scrolling effects and animations closely follow** https://crafto.themezaa.com/barber/ (single long homepage).
- **Changed:** colors, copy, branding, and wording adjusted for a unisex salon (not men-only barber).
- **Brand feel (from Instagram, loosely):** black + warm gold + cream, classic serif wordmark "LEVEL-UP".
- Palette (draft): ink `#111111`, gold `#C9A24A`, cream `#F7F2EA`, white.
- Fonts (draft): serif display (e.g. "Playfair Display"/similar) + clean sans body (e.g. "Inter").
- No emoji icons, no generic gradients.

## Homepage sections (in order, mirroring the reference)
1. **Header** — centered logo, social icons (Instagram, Facebook, Yelp). Becomes a sticky bar on scroll.
2. **Hero** — full-screen photo with slow zoom/parallax, small kicker ("Los Angeles Unisex Salon"), big serif headline, "Book an appointment" button. Text fades/slides up on load.
3. **Intro + services strip** — short intro paragraph with years/review stat, 4 service cards (Haircuts, Color, Styling & Blowouts, Perms & Treatments) that reveal on scroll with hover effects.
4. **Tagline + photo pair** — one-line tagline with small line icon, two large rounded images with parallax.
5. **Pricing menu** — "Flexible pricing" list of services with dotted leaders and prices, plus a featured stylist card.
6. **Promo banner** — offer block (e.g. first-visit discount) over a background image.
7. **Testimonials** — slider with real-style client quotes (placeholder text until owner approves).
8. **Counters** — 4 animated number counters that count up when scrolled into view.
9. **Contact + appointment form** — address (10962 W Pico Blvd, Los Angeles, CA 90064), phone, hours (Mon–Wed & Sat 9–6, Thu–Fri 9–7, Sun closed), Google Maps link, and appointment request form (name, email, phone, date, service, message).
10. **Footer** — logo, quick links, socials, copyright.

Animations: scroll-triggered fade/slide reveals, image parallax, hero zoom, counter count-up, testimonial slider, smooth scrolling, button hover states. Respect `prefers-reduced-motion`.

## Pages and user flows
- Public only: `/` (homepage). No login, no admin area.
- Flow: visitor scrolls → views services/prices → fills appointment form → sees success or error message.

## Tech stack
- Next.js (latest, App Router) + TypeScript
- Tailwind CSS
- Framer Motion (scroll animations) + Lenis (smooth scroll) — small, standard libraries
- New top-level folders: `seo/` (SEO kit) and `.claude/` (its commands), as on the other sites
- Hosting: Vercel

## Data models and storage
- **Appointment request** (name, email, phone, date, service, message, created_at).
- **Question for you:** where should form submissions go?
  - Option A (simplest, this task): form posts to `/app/api/appointment`, which validates and logs it — no database yet.
  - Option B: save to a Supabase `appointment_requests` table (RLS on, insert-only via API route).
- **Chosen: Option A** (owner said "keep going" Sunday 8 November 2026). Supabase can be added later.

## Third-party services
- Google Fonts, Google Maps link (no API key).
- Supabase only if Option B is chosen.
- Images: placeholder stock photos (Unsplash) until the salon provides real photos and the logo file.

## SEO setup

**Built into the homepage**
- One H1. Title and description written for "hair salon Los Angeles" / Rancho Park / Pico Blvd until `/keyword-research` runs
- Google business data in the page code (`HairSalon`) with the real name, address and hours. Phone left out until confirmed
- `robots.txt`, `sitemap.xml` and `llms.txt`. The final domain is one setting (`siteUrl` in `lib/site.ts`), decided at launch

**The seo-agent kit** (github.com/youtube-jono/seo-agent, version 899bc21, same as AHDOUT DDS, MSJ and Accounting Firm) goes in a `seo/` folder, the same way:
- Commands in `.claude/commands/`: `/keyword-research`, `/service-page`, `/blog-post`, `/seo-optimization`, `/audit`, `/publish`
- `seo/rules.md` is the kit's CLAUDE.md rewritten for this salon. **CLAUDE.md always wins**
- `seo/references/` (the kit's specs), `seo/code/` (check scripts), and the registries `seo/my-setup.md`, `seo/keyword-map.md`, `seo/website-index.md`, `seo/optimization-log.md`
- **Not installed:** `/build-website` (it would replace this design with the kit's template)
- **Removed/changed:** the humour rule is off (warm and friendly voice instead), no GoHighLevel CRM, no affiliate links, business facts go in `seo/my-setup.md`, never CLAUDE.md
- `/publish` will not run until launch, because it submits the sitemap to Google
- Anything not yet known shows on the page as "to confirm", and the check scripts block publishing while any remains

## What "done" looks like
- Homepage with all 10 sections above, visually and behaviorally close to the reference, in Level-Up colors/branding.
- Fully responsive (phone, tablet, desktop).
- Appointment form validates and shows success/error.
- `npm run build` passes, no console errors, checked in the browser.
- The seo-agent kit installed and adapted in `seo/`, with `seo/my-setup.md` filled in from the known facts.

## Things needed from you (can come later)
- Logo file (PNG/SVG) and real salon photos.
- Real prices and service list, phone number, and approved testimonials.

## Progress log

- Sunday 8 November 2026: **Homepage built.** All sections from the reference (hero, about, services, photo row, pricing, wide feature, two promo cards, reviews slider, counters, map and contact card, appointment form, footer), with smooth scrolling, scroll reveals, parallax, word-by-word headline, count-up numbers and a phone menu. Appointment form validates and posts to `/api/appointment` (Option A, logged on the server). Google business data, robots, sitemap and `llms.txt` added. SEO kit installed in `seo/` and `.claude/commands/`. Runs on **http://localhost:3200** (port 3000 is used by another project).
  - Brand and logo sections from the reference were left out: the salon has no brand partnerships or team photos to show yet, and inventing them would break the "real facts only" rule.
  - Photos are Creative Commons placeholders from Openverse, credited in the footer. The full downloaded pool is in `seo/photo-pool/` with its licence list.
  - Reviews show Yelp review highlights, paraphrased. Counters use real facts only (days open, Yelp review count, hours).
  - Phone and prices show "to confirm". `seo/code/check_page_done.py /` fails on those until they are filled in, which blocks publishing on purpose.
  - Build, lint, form (success and error), phone layout and menu checked in the browser.

---

# Phase 2: Five pages + new images (approved Sunday 8 November 2026, built)

## Pages
The one long homepage is split into five pages. The header and footer link between pages instead of jumping down one page. Every page keeps the Crafto look: same fonts, colours, scroll reveals, parallax and smooth scrolling. Each inner page opens with a dark photo banner holding the page title (Crafto-style inner page header).

1. **Home** `/`
   - Hero, the "10962" about block (short version, links to About), four service columns (link to Services), photo row (links to Gallery), "Open until 7pm" feature, two promo cards, reviews slider, counters, "Ready to level up?" booking banner
2. **Services** `/services`
   - Banner "Services"
   - The four services, each as a large photo + text row, alternating sides
   - Full price menu (prices still "to confirm")
   - Two promo cards, booking banner
3. **Gallery** `/gallery`
   - Banner "Gallery"
   - Photo grid with filter buttons: All, Cuts, Colour, Styling, Salon
   - Click a photo to open it full screen, with next / previous arrows (lightbox)
   - Instagram link: "See more on Instagram"
4. **About** `/about`
   - Banner "About"
   - The salon story: family-owned, unisex, Rancho Park (real facts only; opening year "to confirm")
   - Overlapping photos with the "10962 / On Pico Blvd" design
   - Three short "what we care about" points (no icons-on-every-card, no invented claims)
   - Counters and reviews slider
5. **Contact & booking** `/contact`
   - Banner "Contact & booking"
   - Appointment form (same as now, Option A) beside address, phone, hours
   - Full-width map with the dark contact card
   - Short FAQ: walk-ins, parking, how booking works (answers "to confirm" until the salon tells us)

## Images
- **Not copying the Crafto photos.** They are licensed to people who buy that theme, so putting them on a real salon's site would be a copyright problem.
- **AI-generated instead**, about 16 images: hero, four services, gallery (around 8), about, inner-page banners. Warm, moody, black-and-gold salon look, mixed clients (women, men, kids), matching the Crafto photo style.
- Made with the Higgsfield image tool connected here. **It uses credits on your account**, so I will show the cost before generating.
- The current Openverse photos and footer credits are removed once the AI images are in. A small footer line says images are illustrative until real photos arrive.

## SEO
- Each page gets its own title, description and one H1. Sitemap lists all five pages. `seo/website-index.md` gets the four new pages.

## Done looks like
- Five pages, links working from header, footer and phone menu
- Gallery filter and lightbox work, including on phone
- Form still works (success and error) on `/contact`
- `npm run build` passes, no console errors, checked on desktop and phone

## Phase 2 progress

- Sunday 8 November 2026: **Five pages built.** Home, Services, Gallery (filters and full-screen viewer), About, Contact & booking (form, map, FAQ). Header, footer and phone menu link between pages, with the current page highlighted in gold.
  - **17 AI images** made with Higgsfield (GPT Image 2.6, medium quality, 2k), about 17 credits, approved by the owner. Saved in `public/images/ai/`. The Openverse photos were moved to `seo/photo-pool/first-picks/`, not deleted.
  - **Real Yelp reviews** (7, word for word, name and month, link to Yelp) replace the paraphrased highlights. One negative and one mixed review were not used. No star ratings shown, because individual ratings were not visible.
  - New facts from Yelp used on the site: owner Norma, stylists Norma, Sara and Isabella named in reviews, free parking at the rear (from a 2024 review).
  - Still "to confirm": prices, phone, walk-ins, opening year. The SEO check blocks publishing until they are filled in.
  - Build, lint, all 5 pages, gallery filter and viewer, form, phone layout checked in the browser.

## Phase 2b: Template font and motion only (Sunday 8 November 2026, owner request)

- **Heading font is now Limelight**, the same font the Crafto barber template uses (replaces Playfair Display). Body text stays Sen, also from the template.
- **Animations cut back to only what the template has** (measured on the live template):
  - Normal browser scrolling. The smooth-scroll library (Lenis) was removed
  - Hero and page-banner photos scroll at half speed (template parallax ratio 0.5). No zoom, no word-by-word headline
  - About photos drift 50px / 15px and the "On Pico Blvd" label drifts 50px, like the template's about images and "since 1998" label
  - The two about photos fade in with their shadow (template "shadow animation")
  - Heading underline draws in (template separator animation)
  - Button text slides up and swaps on hover (template "switch text")
  - Price rows nudge 15px right on hover
  - Reviews slide sideways with Prev / Next. Auto-advance removed
  - Counters roll digit by digit like an odometer (template counter style)
- Removed: fade-up on every section, image parallax inside boxes, wide-photo reveal, promo card zoom, header hide-on-scroll, staggered menu, gallery photo pop-in, card lift on hover.
- Build and lint pass; checked in the browser on desktop and phone.

- Sunday 8 November 2026: **Stats row changed** (owner request). Days open, Yelp review count, hours and stylist count replaced with template-style stats: years of experience, haircuts per week, colour services per week, happy clients. Each shows "to confirm" until the salon gives real numbers, then rolls in like the template.
