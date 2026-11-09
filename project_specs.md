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

## Preview link and GitHub (Sunday 8 November 2026)

- **Live preview:** https://level-up-hair-salon.vercel.app (Vercel project `level-up-hair-salon`, account havahstudios-3680). For showing the salon, not for customers yet.
- **No-index switch:** `indexable: false` in `lib/site.ts` makes robots.txt block everything and adds a noindex tag, so Google stays away until launch. Flip it at launch.
- **Booking form warning:** submissions only land in Vercel's server logs (Option A). The salon does not receive them. Needs email or Supabase before real customers use it.
- **Git:** repository started on branch `main`, first commit made. `seo/photo-pool/` (19MB archive) is kept out of git. Pushed to https://github.com/havahstudios/LevelUpHaircuts (branch `main`). Vercel is connected to it: every push to `main` deploys the live preview automatically.

---

# Phase 3: Online booking + salon schedule (approved Sunday 8 November 2026, built, waiting for Supabase keys)

## What it does and who uses it
- **Customers** book a real appointment online: pick a service, a stylist (or "Any stylist"), and an open time. It is booked instantly.
- **Salon staff** log in to a private dashboard to see the schedule, add phone-in and walk-in bookings by hand, move or cancel bookings, block time off, and update services, prices, stylists and hours themselves. No code needed to change any of it.

## Decisions (owner, Sunday 8 November 2026)
- Instant booking (no approval step). Customers only ever see truly free times
- Customers choose a stylist or "Any stylist" (books whoever is free)
- Emails to the salon (new / changed / cancelled booking) and to the customer (confirmation with a cancel link)
- New Supabase project just for Level-Up

## Public pages
1. **`/book`**, a 4-step booking page in the site's design:
   1. Choose a service (name, length, price, all from the database)
   2. Choose a stylist, or "Any stylist"
   3. Choose a day (calendar, next 60 days) and an open time. Times come from salon hours, the stylist's working hours, their existing bookings, time off and the service length
   4. Your details: name, phone, email, optional note. Then **Confirm booking**
   - Success screen with the date, time, stylist and a booking reference
   - If someone else grabs the same time a second earlier, the customer sees "That time was just taken, please pick another" (the database refuses double bookings)
2. **`/book/manage/[code]`**: the link in the customer's email. Shows their booking and lets them cancel it
3. "Book" buttons across the site point to `/book`. The old request form on Contact & booking is replaced by the real booking flow (the page keeps the map, hours and FAQ)
4. Prices on the Services page come from the database, so when the salon updates a price in the dashboard, the website updates too (this also clears the "to confirm" prices)

## Staff dashboard (login required, `/admin`)
- **Login**: email and password (Supabase Auth). No public sign-up. The owner's account is created first; the owner can add staff accounts
- **Schedule** (main screen)
  - Day view with one column per stylist, 15-minute rows, today by default. Arrows to change day, plus a week view
  - Click an empty time to **add a booking by hand**: client name and phone (email optional), service, stylist, time, source (phone or walk-in), note. Existing clients are suggested as you type
  - Click a booking to **edit, move, cancel**, or mark **completed** or **no-show**
  - **Block time**: lunch, a day off or holidays, for one stylist or the whole salon
  - Works on an iPad or phone at the front desk
- **Services**: add, edit, hide services. Name, category, length in minutes, price, description, order
- **Stylists**: add, edit, hide stylists, set each one's working days and hours, and which services they offer
- **Hours**: salon opening hours per day, closed dates, how far ahead people can book (default 60 days), minimum notice (default 2 hours)
- **Clients**: simple list with visit history, phone and email, searchable

## Tech stack
- Next.js (App Router) + TypeScript + Tailwind, same as the site
- **Supabase**: Postgres database, Auth for staff logins, Row Level Security on every table
- **Resend** for emails
- Vercel hosting (already connected to GitHub)
- All times stored in UTC and shown in Los Angeles time

## Data models (Supabase, all with RLS on)
- **stylists**: name, active, display order
- **services**: name, category, description, duration (minutes), price, active, display order
- **stylist_services**: which stylist offers which service
- **salon_hours**: per weekday: open, close, or closed
- **stylist_hours**: per stylist per weekday: start, end (defaults to salon hours)
- **time_off**: stylist (or whole salon), start, end, reason
- **closed_dates**: holidays and other full-day closures
- **clients**: name, phone, email, notes (matched by phone or email so repeat clients are not duplicated)
- **bookings**: client, stylist, service, start, end, status (booked, cancelled, completed, no-show), source (online, phone, walk-in), note, private cancel code, created by
  - A database rule makes two bookings for the same stylist at overlapping times impossible
- **staff**: which logged-in users are staff, and whether each is owner or staff

## Who can see what (security)
- Visitors can read active services, stylists and hours only. They can never read bookings or clients
- Online bookings go through an API route on the server, which re-checks the time is free before saving. The secret Supabase key stays on the server only
- Staff (logged in and listed in `staff`) can read and change everything in the dashboard
- Only the owner can add or remove staff accounts
- Cancel links use a long random code, not the booking number

## Third-party services
- **Supabase** (free plan): database and staff logins
- **Resend** (free plan, 3,000 emails a month). Emails to customers need a verified domain. Until the salon has its domain, only the salon's notification email can be sent, and customers see the on-screen confirmation
- **Vercel**: hosting, plus the secret keys stored as environment variables

## What I need from you (I will walk you through each)
1. Create the Supabase project and send me its keys
2. Create a Resend account and send me its API key
3. From the salon: stylist names, working days and hours, each service's length and price, the email that should get booking notifications, and who needs a staff login

## What "done" looks like
- A customer can book on `/book` on phone and desktop, gets a confirmation screen (and email, once a domain is verified), and can cancel from the link
- Double bookings are impossible, including two people clicking the same time at once
- Staff can log in, see the day and week schedule per stylist, add a phone-in booking in under 30 seconds, and edit, move, cancel and block time
- Staff can change services, prices, stylists and hours, and the public site and available times update straight away
- Logged-out visitors cannot open any `/admin` page or read bookings (tested)
- `npm run build` passes, no console errors, happy and error paths tested in the browser, deployed to the preview link

## Phase 3 progress

- Sunday 8 November 2026: **Booking system built**, not yet connected to a live database.
  - Database: `supabase/migrations/0001_booking.sql` (tables, Row Level Security, no-double-booking rule, starting data from Yelp). Tested in an in-memory Postgres: 13 of 13 checks pass, including visitors seeing no bookings or clients and overlapping bookings being refused
  - Free-time logic in `lib/booking/availability.ts`, tested with 22 checks including daylight-saving days, stylist hours, lunch blocks and minimum notice
  - Public: `/book` (4 steps), `/book/manage/[code]` (view or cancel), APIs `/api/availability`, `/api/bookings`, `/api/bookings/cancel`
  - Staff: `/admin/login`, `/admin` (day and week schedule, add / edit / move / cancel / complete / no-show, block time), `/admin/clients`, `/admin/services`, `/admin/stylists`, `/admin/hours`, `/admin/team`. `proxy.ts` guards `/admin`
  - Every "Book" button now goes to `/book`. The old request form and `/api/appointment` were removed. Services page prices come from the database (fall back to "to confirm")
  - `cacheComponents` switched off in `next.config.ts` (staff pages read the login on every request; same as the MSJ site)
  - Starting service lengths (45 to 120 minutes) and stylists (Norma, Sara, Isabella) are placeholders for the salon to correct in the dashboard
  - **Not yet tested end to end:** needs the Supabase project and keys. Build, lint and type check pass; pages show "not set up yet" messages until then

## Lighter, more modern look (Sunday 8 November 2026, owner request)

- Fewer dark areas: header turns frosted white on scroll (dark text off the home photo), inner-page banners are now light cream with the title beside a rounded photo, footer and contact card are light, promo and feature photos have lighter shading, gallery viewer is light
- Main buttons are gold with dark text instead of black
- Home hero uses the bright salon interior photo with a lighter tint
- Staff dashboard sidebar and login are light
- Note: the project sits on an iCloud-synced Desktop, which creates "file 2" copies inside `.next/` during builds. Harmless (`.next` is not in git); delete `.next` if a build complains

## Live on Vercel (Sunday 8 November 2026)
- Supabase keys and `NEXT_PUBLIC_SITE_URL` added to Vercel (Production). https://level-up-hair-salon.vercel.app now books against the real database; free times, services and the staff login all work live
- Owner login: havahstudios@gmail.com (password set by the owner in Supabase), on the staff list as Owner

---

# Phase 3b: Salon accepts or declines online bookings (approved Sunday 8 November 2026, built, migration 0002 run, live)

Owner request: when a booking comes in, the salon gets an email with buttons to **accept or decline** it, and each booking shows its **status** and whether **the time is still available**.

This replaces "instant booking" (Phase 3 decision) for **online** bookings only. Phone and walk-in bookings added by staff stay booked straight away.

## How it works
1. A customer books on `/book` as now. The booking is saved as **Pending** and the time is held, so nobody else can take it while the salon decides
2. The customer sees "Request sent. We'll email you as soon as the salon confirms", and gets a "request received" email
3. The salon gets an email with the client, service, stylist and time, plus:
   - **Status:** Waiting for you
   - **Availability:** "Norma is free at this time" (checked when the email is sent)
   - Two buttons: **Accept** and **Decline**
4. Clicking a button opens a page on the site (no login needed, secured by a private link) that shows the booking, its current status and a live availability check, with one tap to confirm Accept or Decline. A confirm tap is needed because some email programs open links automatically to scan them, which must never accept a booking by itself
5. **Accept**: status becomes Booked, the customer gets a confirmation email with their cancel link
6. **Decline**: status becomes Declined, the time is freed, the customer gets a polite "we couldn't fit you in, please pick another time" email with a link to `/book`
7. The private link only works while the booking is still Pending

## In the dashboard
- Pending bookings show on the schedule in gold outline with a **Pending** label
- A **Waiting for approval** list at the top of the schedule, newest first, each with Accept and Decline buttons and the availability check
- Opening any booking shows a **Status** line (Pending, Booked, Declined, Cancelled, Completed, No-show) and, for pending ones, **Accept / Decline** buttons

## Database change
- New file `supabase/migrations/0002_approval.sql` (you run it once in the SQL Editor, like the first one):
  - Two new statuses: `pending` and `declined`
  - Pending bookings hold their time (count in the no-double-booking rule); declined ones do not
  - A private `respond_code` on each booking for the Accept / Decline links

## Emails (Resend)
- Needs a Resend API key
- Until the salon has its own verified domain, Resend only delivers to the account owner's own email. So at first the **salon emails (with the Accept / Decline buttons) go to havahstudios@gmail.com**, and customer emails wait for the domain. Customers still see their status on screen and on their booking link
- Once a domain is verified, customer emails switch on with no code change (one setting)

## What "done" looks like
- Online booking creates a Pending booking that holds the time
- The salon email arrives with Accept / Decline buttons, status and availability
- Accept and Decline work from the email and from the dashboard, and update the customer's booking page
- A link cannot be used twice or after the booking changed
- Pending bookings are clearly marked on the schedule with a waiting list
- Tested end to end locally and on the live link

## Phase 3b progress
- Sunday 8 November 2026: migration 0002 run in Supabase. Tested locally against the real database: online booking saved as Pending and holds the time; opening the email link does not accept by itself; Accept sets Booked; Decline sets Declined and frees the time; links cannot be reused; bad links rejected; customer page shows the status. Pushed live
- Still to test with the owner signed in: the dashboard's Waiting for approval list and Accept / Decline in a booking
- Emails: waiting for the Resend API key. Until then the Accept / Decline link is written to the server log

## Clean-up, month view, footer links (Sunday 8 November 2026, owner request)
- All 9 test bookings and their 9 test client records deleted from Supabase (services, stylists, hours and the owner login kept)
- Staff schedule has a **Month** view next to Day and Week: whole weeks of the month, up to 3 appointments per day with "+ N more", a pending count per day, click a day to open it, click an appointment to open it
- Footer: **Staff login** link to `/admin` and the standard **Built by Havah Studios** pill (same as Benny's Grill), linking to havahstudios.live
- Salon booking alerts go to havahstudios@gmail.com (set in Hours & settings). Sending needs the Resend API key

## Emails through Gmail, test mode (Sunday 8 November 2026, owner request)
- Resend put on hold. Emails now send from the owner's Gmail (`GMAIL_USER` + `GMAIL_APP_PASSWORD`, a Google app password). Resend still works as a fallback if a key is added later
- Test mode on: `EMAIL_REDIRECT_TO=havahstudios@gmail.com` sends every email (salon Accept / Decline and all customer emails) to that inbox, customer ones labelled "[Customer email for ...]". Remove it to send customer emails to customers
- Owner chose Resend after all (simplest while everything goes to their own inbox). `RESEND_API_KEY` added locally and on Vercel. Sending tested locally and live: salon email and labelled customer copy both delivered via Resend. Test bookings removed

## Double-booking checks and nicer emails (Sunday 8 November 2026, owner request)
- New guards (`findClash` in `lib/booking/bookings.ts`): a client cannot hold two overlapping bookings (stops a double-click with "Any stylist" booking two stylists); staff cannot add or move a booking into blocked time; a request cannot be accepted if its time now clashes with blocked time. The database still refuses two overlapping bookings for one stylist
- 18 double-booking tests run against the live database (online vs online, partial overlap, back-to-back, staff vs pending, same client, simultaneous double-clicks, simultaneous staff adds, moving onto a taken time, lunch blocks, accepting into a block, answering twice, cancel then rebook, restoring a cancelled booking onto a taken slot). All passed; test data removed
- Emails redesigned (`lib/booking/email-templates.ts`): Level-Up wordmark, white card on cream, status tag, details panel, availability dot, full-width rounded gold buttons, footer with address and links. Checked at phone and desktop width
