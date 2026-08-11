# Airbnb listing page clone

A monorepo containing a Next.js listing page and the Express API that serves it.

```
apps/web    Next.js 16 (App Router) + React 19 + Tailwind CSS 4
apps/api    Express 5 + zod, TypeScript
packages/types  zod schemas shared by both — the single source of truth for contracts
```

The front end has three views: the **listing page**, the full-screen **photo
tour** (photos grouped by room), and the **lightbox** (single photo, prev/next
and arrow-key navigation). The tour opens from any hero image or "Show all
photos"; the lightbox opens from any tour photo and closes back to the tour.

---

## ⚠️ Read this first: the reference page could not be inspected

The brief names `https://airbnb-clone-umber-two.vercel.app` as the single source
of truth. **That URL is not reachable programmatically.** It sits behind Vercel's
Security Checkpoint (Attack Challenge Mode), which blocks automated access:

| Attempt                                   | Result                                    |
| ----------------------------------------- | ----------------------------------------- |
| Plain HTTP fetch (`curl`, `fetch`)        | Serves the JS challenge page, not the app |
| Markdown/text fetcher                     | `HTTP 429 Too Many Requests`              |
| Headless Chromium via Playwright          | `Failed to verify your browser — Code 21` |
| Headed Chrome via Playwright              | `Failed to verify your browser — Code 21` |
| Every path probed (`/`, `/robots.txt`, …) | Same challenge response                   |
| Wayback Machine archive                   | No snapshot exists                        |

I did not attempt to defeat the challenge — circumventing bot protection is not
something I'll engineer around, and it would not have produced a trustworthy
reference anyway.

**What this means for the deliverable.** Everything that does not depend on
seeing the reference is complete and verified: the monorepo, tooling, CI, the
API with typed contracts and validation, the full listing page, the
accessibility and keyboard behaviour, and the visual-regression harness. The
design is calibrated against **Airbnb's own public design language** (layout,
Rausch `#FF385C`, the `#222222`/`#717171` text pair, the `#DDDDDD` hairline, the
1-large-plus-4 gallery mosaic, the sticky booking card).

**What is therefore unmet:** the acceptance criterion _"side-by-side visual diff
is indistinguishable at all breakpoints"_. I cannot claim pixel fidelity to a
page I was unable to load, and you should not take it on trust. The screenshot
harness is built and produces baselines at all three breakpoints — it is ready
to diff the moment the reference is reachable.

### Partially unblocked by supplied screenshots

Reference screenshots were later provided for three areas, and those are now
built to match what they show:

| Supplied               | Built                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Photo tour             | Category thumbnail strip (8 per row, ninth wrapping), per-room sections with the room name and in-room amenities beside a lead photo and a two-up grid |
| Lightbox spec          | Full-screen single-photo viewer, circular prev/next at the edges, `←`/`→` keys, counter, opens from any tour photo                                     |
| Listing page thumbnail | Title above the gallery with Share/Save, `Entire serviced apartment in Candolim, India` and the capacity line beneath it, and the real listing content |
| Reviews summary        | "Guest favourite" laurel banner, star distribution bars, the six category scores with icons, and the review-topic chips                                |

These were matched by eye from static images. Spacing, type sizes and easing
curves are _estimated_, not measured — a screenshot cannot give computed
styles.

### To unblock the fidelity pass

Any one of these is enough:

1. **Disable the protection** — Vercel project → Settings → Security → turn off
   Attack Challenge Mode / Deployment Protection (or add a bypass token).
2. **Share the source** — a repo link or a zip of the reference project.
3. **Export the page** — "Save page as → Webpage, Complete" from your browser,
   plus full-page screenshots at 390 / 834 / 1440 px.

With any of those I can run the side-by-side diff and close the gap.

---

## Quick start

Requirements: Node ≥ 20.11 (`.nvmrc` pins 22), npm 10.

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

`npm run dev` boots both apps through Turborepo:

- web → http://localhost:3000
- api → http://localhost:4000/api/v1
- health → http://localhost:4000/api/v1/health

The web app fetches from the API at request time, so **the API must be running**
for the page to render. If it is not, the route-level error boundary explains
exactly that rather than showing a blank page.

## Scripts

Run from the repository root; each fans out to every workspace.

| Script                 | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Both apps in watch mode                            |
| `npm run build`        | Type-checked production build of all workspaces    |
| `npm run start`        | Serve the production builds                        |
| `npm run lint`         | ESLint, zero warnings tolerated                    |
| `npm run lint:fix`     | ESLint with `--fix`                                |
| `npm run format`       | Prettier, write                                    |
| `npm run format:check` | Prettier, check only (used by CI)                  |
| `npm run type-check`   | `tsc --noEmit` everywhere                          |
| `npm run verify`       | format:check → lint → type-check → build, in order |

In `apps/web`:

| Script                | What it does                                         |
| --------------------- | ---------------------------------------------------- |
| `npm run test:e2e`    | Full Playwright suite at all three breakpoints       |
| `npm run test:a11y`   | axe-core scans only                                  |
| `npm run screenshots` | Regenerate comparison screenshots + assert baselines |

## Repository layout

```
apps/
  api/
    src/
      config/       env parsing (zod, fails fast at boot)
      controllers/  thin: validated input → service → responder
      data/         seed dataset
      lib/          HttpError, logger, date maths, response envelope
      middleware/   request-id, logger, validate, not-found, error-handler
      routes/       route table, mounted under /api/v1
      services/     business rules (availability, the pricing ladder)
      app.ts        Express app factory (portless, testable)
      index.ts      binds the port, handles graceful shutdown
  web/
    src/
      app/          App Router: layout, page, error, not-found, globals.css
      components/
        icons/      hand-drawn 24×24 icon set
        layout/     header, footer
        listing/    photos orchestrator, gallery, photo tour, lightbox,
                    booking card, reviews, amenities, …
        ui/         Modal primitive
      hooks/        focus trap, scroll lock, background inert, overlay stack,
                    SSR-safe client values
      lib/          API client, formatters, config
    tests/          a11y, keyboard, console, screenshots
packages/
  types/src/        listing.ts (domain), api.ts (transport)
docs/api.md         endpoint reference
.github/workflows/  CI
```

## API

Full reference with request/response examples: **[`docs/api.md`](docs/api.md)**.

| Method | Path                           | Purpose                       |
| ------ | ------------------------------ | ----------------------------- |
| GET    | `/health`                      | Liveness probe                |
| GET    | `/listings/:slug`              | Full listing payload          |
| GET    | `/listings/:slug/reviews`      | Paginated reviews + breakdown |
| GET    | `/listings/:slug/availability` | Blocked dates in a window     |
| POST   | `/listings/:slug/quote`        | Price a stay                  |

Every response uses a `{ data, meta? }` / `{ error }` envelope, so clients branch
on the shape rather than the status code.

---

## Architecture decisions

### Tailwind CSS over CSS Modules

The brief asks for a justification, so: this page is a **single, dense,
one-off layout** rather than a component library with reusable variants. Tailwind
suits it for three concrete reasons.

1. **Cloning is a measuring exercise.** Fidelity work is a constant loop of
   "read a computed value, apply it, compare". Having spacing, type and colour
   in the markup means each adjustment is one edit at the point of use, not a
   round-trip between a `.module.css` file and the component.
2. **The design tokens become the contract.** Tailwind 4's CSS-first `@theme`
   block in [`globals.css`](apps/web/src/app/globals.css) holds the palette,
   type scale, radii, shadows and easing curve as real CSS custom properties.
   That file is the design system; every deviation from the reference is a
   one-line change there rather than a hunt through stylesheets.
3. **Dead style pressure.** Utilities are generated from what the markup
   actually uses, so a deleted component takes its styles with it — which
   matters when large sections are being reshaped repeatedly.

The trade-off is verbose `className` strings. Where a pattern genuinely repeats
(`.btn-reserve`, `.link-underline`) it is promoted to a component class in
`@layer components` rather than duplicated.

### Express over Nest

The API surface is five read-mostly endpoints over a single aggregate. Nest's
modules, decorators and DI container would add a framework layer thicker than
the domain it wraps. Express 5 gives what is actually needed — routing,
middleware composition, and native async error forwarding — and the
`routes → controllers → services` split supplies the structure Nest would have
imposed, without the ceremony. If this grew to many resources with cross-cutting
concerns (auth, jobs, subscriptions), Nest would start earning its keep.

### zod schemas as the single source of truth

`packages/types` exports zod schemas, not bare TypeScript types. The API parses
its outbound payloads through them and the web app infers its props from the
same objects, so drift between the seed data and the published contract fails at
build time on both sides rather than at runtime in the browser. `listingSchema`
is validated on the way out of the service, which is what turns "types" into an
actual guarantee.

### npm workspaces + Turborepo

Workspaces alone handle linking; Turborepo adds the task graph (`^build` so
`packages/types` compiles before its consumers) and content-addressed caching, so
repeat `lint`/`type-check` runs are near-instant. No remote cache is configured —
the local one is enough at this size.

### `force-dynamic` on the listing route

The page renders per-request against the live API. This keeps `next build`
independent of a running backend (important for CI) and means pricing and
availability are never stale. The cost is no static prerender; for a page whose
whole purpose is live pricing, that is the right trade.

### Dates start empty in the booking card

Pre-filling check-in/check-out would compute a date during render, which differs
between the server pass and hydration and produces a mismatch warning. Starting
empty matches Airbnb's own "Add dates" state _and_ makes the two renders
identical. Anything genuinely client-only (the `min` attribute) goes through
`useClientValue`, a `useSyncExternalStore` wrapper that serves a server snapshot
during hydration and swaps in the real value afterwards.

### Quote results are derived, not reset

The quote and any error are stored keyed by the selection that produced them and
filtered at render time. A stale price therefore cannot appear while a new one is
in flight, and no effect needs to synchronously clear state — which also keeps
the React Compiler lint rules satisfied.

---

## Accessibility

Target was zero critical axe violations; the suite asserts zero **serious or
critical** across WCAG 2.0/2.1 A and AA, on the page at rest and with each dialog
open.

- **Landmarks and headings** — one `<h1>`, sections labelled via
  `aria-labelledby`, `<main>`/`<header>`/`<footer>`/`<nav>` used semantically.
- **Skip link** — first tab stop, moves focus to `#main`.
- **Focus rings** — `:focus-visible` only, so keyboard users get a 2px black ring
  and pointer users get none. `:focus:not(:focus-visible)` clears the UA outline.
- **Dialogs** — `role="dialog"` + `aria-modal`, named by their title, Escape to
  dismiss, focus trapped while open, focus restored to the trigger on close,
  background scroll locked.
- **Background isolation** — while a dialog is open every other `<body>` child is
  marked `inert`, so a screen reader's virtual cursor cannot wander behind the
  overlay. The `inert` effect is registered _before_ the focus trap so React's
  cleanup order lifts `inert` before focus is restored; the reverse order
  silently drops the focus call.
- **Scrollable dialog bodies** are focusable `role="region"`s, so keyboard users
  can scroll overflowing content.
- **Placeholder links are buttons.** Footer entries with no destination are
  `<button>`, not `href="#"` anchors that would announce as links to nowhere.
- **Live regions** — pricing, validation and confirmation announce through a
  single `aria-live="polite"` region with `aria-busy` while a quote is in flight.
- **Hidden section nav** — the scroll-triggered nav is `aria-hidden` and `inert`
  while faded out, so it never becomes a phantom tab stop.

## Motion

- Transitions use a shared `--ease-airbnb` (`cubic-bezier(0.2, 0, 0, 1)`) at
  150–300 ms depending on the surface.
- Hover states: pill shadow lift on the search bar, brightness on gallery tiles,
  background tint on ghost buttons, `brightness(0.94)` plus a `0.985` scale press
  on the Reserve CTA.
- The section nav is driven by `IntersectionObserver` on a sentinel rather than a
  scroll listener, so scrolling stays off the main thread.
- `prefers-reduced-motion: reduce` collapses every animation and transition to
  0.01 ms and reverts smooth scrolling. A test asserts no element reports a
  transition longer than 50 ms under that setting.

## Testing

39 Playwright tests across three viewports (1440 / 834 / 390).

| Suite                 | Covers                                                               |
| --------------------- | -------------------------------------------------------------------- |
| `a11y.spec.ts`        | axe-core on the page, amenities dialog and photo viewer              |
| `keyboard.spec.ts`    | skip link, focus trap + restoration, arrow-key gallery, booking flow |
| `console.spec.ts`     | no console errors or hydration warnings while exercising portals     |
| `screenshots.spec.ts` | full-page baselines per breakpoint + reduced-motion assertion        |

```bash
cd apps/web
npm run test:e2e                       # everything
npx playwright test --update-snapshots # accept intentional visual changes
```

Comparison images are written to `apps/web/screenshots/<breakpoint>/` for
side-by-side review; committed baselines live in
`apps/web/tests/screenshots.spec.ts-snapshots/`.

axe scans run with reduced motion emulated. Mid-transition frames report blended
colours that no user ever reads as static text, and would otherwise make contrast
results non-deterministic.

### CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs two jobs:

1. **verify** — `format:check`, `lint`, `type-check`, `build`
2. **e2e** — a11y, keyboard and console suites on Chromium

The visual-regression project is excluded from CI: the baselines were rendered on
macOS and font rasterisation differs on Linux, so they would fail for reasons
unrelated to the code. Regenerate baselines on the platform you intend to gate on
if you want that job in CI too.

### Pre-commit

Husky + lint-staged format and lint staged files. Set up automatically by
`npm install` via the `prepare` script.

---

## Known deviations from the reference

Ordered by how much they matter.

1. **Overall fidelity is unverified.** The reference could not be loaded, so
   values are estimated from supplied screenshots where they exist and from
   Airbnb's public design language everywhere else — never measured. Treat every
   value below as considered, not confirmed. Sections with no supplied
   screenshot (amenities, map, host, things to know, footer, and the whole
   mobile and tablet layout) are the least constrained.
2. **Typeface.** Airbnb ships Circular, which is not licensed for
   redistribution. Inter is substituted (`next/font/google`, `display: swap`,
   system fallback stack). Inter's metrics are close but not identical, so line
   breaks and optical weight will differ slightly.
3. **Currency is an assumption.** Prices render in INR, which suits a Goa
   listing, but the supplied screenshots never show a price. If the reference
   uses another currency, change `pricing.currency` in the seed data.
4. **The "Guest favourite" laurel is approximated.** Airbnb's laurel is a
   licensed brand mark; this one is drawn from angled leaf ellipses on a stem.
   It reads correctly at the size it renders but the leaf shapes are not
   identical.
5. **Review topic chips are informational, not filters.** The reference may make
   them clickable to filter reviews; the screenshot does not show that, so they
   are rendered as static chips.
6. **Map.** "Where you'll be" renders a self-contained static placeholder with a
   pin and the real coordinates, not an interactive map — an embedded map needs a
   billable API key. The section keeps the reference's footprint and aspect ratio.
7. **Icons.** Airbnb's icons come from a private sprite. These are hand-drawn on
   the same 24×24 grid with a matching stroke weight and `currentColor`, so they
   read correctly but are not identical paths.
8. **Photography.** Licensed Unsplash images stand in for the listing photos.
   Every URL was fetched and verified to resolve before being committed.
9. **Content.** The listing title, property type, location and capacity follow
   the supplied screenshots. The host, reviews, description and pricing are
   invented. Swap `apps/api/src/data/listing.data.ts` to match the
   reference once its content is known — nothing in the UI is hardcoded to it.
10. **Non-functional controls.** Search, language/currency, share, contact host
    and the footer links are presentational. Save/heart toggles local state only.
11. **Reservation is a stub.** Reserve validates and prices through the API, then
    shows a confirmation message. There is no checkout, payment or persistence.
12. **Single listing.** The API serves one slug. Requesting any other returns a
    structured 404 rather than a listing.

## Environment variables

**`apps/api`** — see `.env.example`

| Variable       | Default                 | Purpose                             |
| -------------- | ----------------------- | ----------------------------------- |
| `PORT`         | `4000`                  | Listen port                         |
| `NODE_ENV`     | `development`           | `development \| test \| production` |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins     |
| `LOG_LEVEL`    | `info`                  | `debug \| info \| warn \| error`    |

**`apps/web`** — see `.env.example`

| Variable                   | Default                          | Purpose                   |
| -------------------------- | -------------------------------- | ------------------------- |
| `API_URL`                  | `http://localhost:4000/api/v1`   | Used by server components |
| `NEXT_PUBLIC_API_URL`      | `http://localhost:4000/api/v1`   | Used by the browser       |
| `NEXT_PUBLIC_LISTING_SLUG` | `romantic-jacuzzi-1bhk-candolim` | Which listing `/` renders |

Invalid API environment fails at boot with a readable message rather than
surfacing as an `undefined` deep inside a handler.
