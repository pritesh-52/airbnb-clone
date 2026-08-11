# Build plan

How this repository was planned and built, in the order it happened, with the
decisions and their reasoning. The [README](../README.md) documents _what
exists_; this documents _why it was sequenced that way_ and _what remains_.

**Status:** Phases 0–8 complete. Phase 9 (fidelity pass) partially unblocked —
reference screenshots were supplied for the photo tour, the lightbox and the
reviews summary, and those are built. The reference URL itself is still
unreachable, so nothing is measured.

---

## The constraint that shaped everything

The brief named `https://airbnb-clone-umber-two.vercel.app` as the single source
of truth for a pixel-perfect clone. Phase 0 established that the URL is not
reachable programmatically — it sits behind Vercel's Security Checkpoint.

That failure forked the plan. The original shape was _measure, then reproduce_.
The revised shape is **build everything the reference does not gate, verify it
hard, and leave one clean seam where the measured values drop in.**

Concretely, that meant three planning rules for every subsequent phase:

1. **No reference-dependent guesswork gets buried.** Anything that would need a
   measured value goes in one place — the `@theme` token block, or the seed data
   file — never scattered through components.
2. **Verify what can be verified objectively.** Accessibility, keyboard
   operability, hydration correctness and API behaviour are all testable without
   the reference. Those got a real harness.
3. **State the gap plainly.** The unmet acceptance criterion is documented rather
   than quietly reframed as met.

---

## Build order

```
Phase 0  Reconnaissance ──▶ Phase 1  Foundation ──▶ Phase 2  Contracts
                                                          │
                                        ┌─────────────────┴─────────────────┐
                                        ▼                                   ▼
                                 Phase 3  API                    Phase 4  Design system
                                        └─────────────────┬─────────────────┘
                                                          ▼
                                              Phase 5  Page composition
                                                          ▼
                                              Phase 6  Motion + a11y
                                                          ▼
                                              Phase 7  Verification
                                                          ▼
                                              Phase 8  Documentation
                                                          ▼
                                       Phase 9  Fidelity pass  ◀── BLOCKED by Phase 0
```

Phases 3 and 4 are independent — the API and the design system share no
dependency, and both only need the contracts from Phase 2. Everything else is
strictly serial because each phase consumes the previous one's output.

The ordering rule throughout: **contracts before consumers, and cheap
verification before expensive work.** The API was built and smoke-tested before
a single component was written, so no frontend time could be lost to a backend
that did not hold up.

---

## Phases

### Phase 0 — Reconnaissance · blocked

**Goal.** Extract ground truth from the reference: DOM, computed styles, asset
URLs, breakpoint behaviour.

**What was tried.** Plain HTTP fetch (served the JS challenge), a text/markdown
fetcher (`429`), headless Chromium via Playwright (`Code 21`), headed Chrome via
Playwright (`Code 21`), direct path probing including `/robots.txt` (same
challenge), and the Wayback Machine (no snapshot exists).

**Decision.** Stop. Defeating a deliberately-deployed bot challenge is not
something to engineer around, and a circumvented capture would not have been a
trustworthy reference anyway. Re-plan around the gap instead.

**Exit criteria.** Blocked — recorded prominently in the README with the
unblock options.

### Phase 1 — Foundation · complete

**Goal.** A workspace that can be linted, type-checked and built from one root
command before there is anything in it.

**Decisions.**

- npm workspaces for linking, Turborepo for the task graph and caching. No
  remote cache — the local one is sufficient at this size.
- One root ESLint flat config that apps extend, rather than three independent
  configs that drift.
- `eslint-config-prettier` applied **last in every config**, including after the
  React/Next/jsx-a11y blocks the web app adds, so no plugin can reintroduce
  formatting rules that fight Prettier.
- A `verify` script chaining format → lint → types → build in that order, so the
  cheapest check fails first.

**Exit criteria.** `npm run verify` runs green on an empty workspace.

### Phase 2 — Contracts · complete

**Goal.** One definition of every request and response, consumed by both apps.

**Decisions.**

- Export **zod schemas, not bare TypeScript types**. Types alone are erased at
  runtime and guarantee nothing; schemas give the API real validation and the web
  app inferred types from the same object.
- Split domain (`listing.ts`) from transport (`api.ts`) so the envelope and error
  codes can evolve independently of the listing shape.
- The API parses its _outbound_ payload through `listingSchema`, which is what
  turns the shared package from documentation into an enforced contract.

**Exit criteria.** Package builds; both apps import from it; a deliberate shape
change breaks the type-check on both sides.

### Phase 3 — API · complete

**Goal.** Serve all listing data with typed contracts, validation, error
handling and a health check.

**Decisions.**

- **Express over Nest.** Five read-mostly endpoints over a single aggregate;
  Nest's modules and DI container would be thicker than the domain they wrap.
  The `routes → controllers → services` split supplies the structure Nest would
  have imposed, without the ceremony.
- Keep controllers thin — pull validated input, call a service, hand off to the
  responder. All business rules live in services.
- `createApp()` binds no port, so the app is drivable in-process by tests.
- One `validate({ params, query, body })` middleware backed by the shared
  schemas, replacing each segment with the _parsed_ value so handlers receive
  coerced, defaulted data.
- The quote endpoint carries the real logic: capacity, stay-length bounds,
  blocked-date conflicts, and an ordered fee ladder.

**Exit criteria.** All five endpoints smoke-tested including the 404 and 422
paths, plus graceful shutdown.

### Phase 4 — Design system · complete

**Goal.** A token layer that is the _only_ place a measured value needs to land.

**Decisions.**

- **Tailwind over CSS Modules.** Cloning is a measuring loop — read a computed
  value, apply it, compare — and utilities keep each adjustment at the point of
  use rather than a round-trip to a separate stylesheet. Tailwind 4's CSS-first
  `@theme` block then holds the palette, type scale, radii, shadows and easing as
  real custom properties, which is exactly the single seam Phase 9 needs.
- `:focus-visible` only for focus rings, with `:focus:not(:focus-visible)`
  clearing the UA outline — keyboard users get a ring, pointer users do not.
- A global `prefers-reduced-motion` block collapsing every transition, rather
  than per-component opt-outs that get forgotten.

**Exit criteria.** `globals.css` is the single design surface; no component
hardcodes a palette value.

### Phase 5 — Page composition · complete

**Goal.** The full listing page, rendering from the API.

**Decisions.**

- Server component fetches; interactive parts are client islands receiving data
  as props. Keeps the payload small and the data flow one-directional.
- `force-dynamic` on the route, so `next build` does not require a running
  backend (important for CI) and pricing is never stale.
- **Booking dates start empty.** Pre-filling would compute a date during render,
  which differs between the server pass and hydration. Starting empty matches
  Airbnb's own "Add dates" state _and_ makes the two renders identical. Anything
  genuinely client-only goes through `useClientValue`, a `useSyncExternalStore`
  wrapper serving a server snapshot during hydration.
- **Quote results are derived, not reset.** The quote and any error are keyed by
  the selection that produced them and filtered at render, so a stale price
  cannot appear while a new one is in flight — and no effect needs to
  synchronously clear state.

**Exit criteria.** Page renders end-to-end from the API at all three
breakpoints.

### Phase 6 — Motion and accessibility · complete

**Goal.** Every interactive element operable by keyboard; motion that respects
the user's preference.

**Decisions.**

- Scroll-triggered nav driven by `IntersectionObserver` on a sentinel, not a
  scroll listener, so scrolling stays off the main thread.
- The modal primitive owns the whole dialog contract: `aria-modal`, name from
  title, Escape, focus trap, focus restoration, scroll lock, and **background
  `inert`** so a screen reader's virtual cursor cannot wander behind the overlay.
- Placeholder links are `<button>`, not `href="#"` anchors that would announce
  as links to nowhere.

**Exit criteria.** Keyboard-only operation of every control, verified by test.

### Phase 7 — Verification · complete

**Goal.** Make the acceptance criteria testable rather than asserted.

**Decisions.**

- Playwright across three viewport projects (1440 / 834 / 390), one config, four
  suites — so breakpoint coverage costs no duplicated test code.
- axe scans run with **reduced motion emulated**: mid-transition frames report
  blended colours no user reads as static text, which would otherwise make
  contrast results non-deterministic.
- Screenshot baselines are committed but **excluded from CI** — they were
  rendered on macOS and Linux rasterises fonts differently, so they would fail
  for reasons unrelated to the code.

**Exit criteria.** 31 tests green; baselines deterministic across two runs;
`verify` clean from a cold cache.

### Phase 8 — Documentation · complete

**Goal.** A reader can set up, run, extend and audit the project — and knows
exactly what is unverified.

**Exit criteria.** README covering setup, scripts, architecture decisions and
known deviations; `docs/api.md` with request/response examples for every
endpoint; this plan.

### Phase 9 — Fidelity pass · blocked

Depends on Phase 0. See _Outstanding work_ below.

---

## Fidelity strategy

The brief specifies three dimensions. Each was planned differently, because each
has a different relationship to the blocked reference.

| Dimension              | Approach                                                                                           | Verifiable without the reference?                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Visual design**      | All values funnelled into the `@theme` token block; layout follows Airbnb's public design language | ❌ No — this is the gap                                                |
| **Motion**             | Shared easing curve and duration scale; global reduced-motion collapse                             | ⚠️ Partly — behaviour is tested, the specific curves are not confirmed |
| **Interaction & a11y** | WAI-ARIA dialog pattern, focus management, semantic HTML                                           | ✅ Yes — fully tested                                                  |

This is why the accessibility work is the most confidently complete part of the
build and the visual layer is the least: one has an objective standard to test
against, the other has a reference that could not be read.

---

## Verification gates

| Gate                | Command                                         | Status                               |
| ------------------- | ----------------------------------------------- | ------------------------------------ |
| Formatting          | `npm run format:check`                          | Passing                              |
| Linting             | `npm run lint`                                  | Passing, zero warnings tolerated     |
| Types               | `npm run type-check`                            | Passing                              |
| Build               | `npm run build`                                 | Passing                              |
| Accessibility       | `npx playwright test tests/a11y.spec.ts`        | Zero serious/critical axe violations |
| Keyboard            | `npx playwright test tests/keyboard.spec.ts`    | Passing                              |
| Console / hydration | `npx playwright test tests/console.spec.ts`     | Zero errors or warnings              |
| Visual regression   | `npx playwright test tests/screenshots.spec.ts` | Baselines stable (not gated in CI)   |

---

## Risk register

| Risk                                       | Impact                                | Mitigation                                                          |
| ------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------- |
| Reference stays inaccessible               | Pixel fidelity unverifiable           | Deviations documented; token layer isolates the change surface      |
| Circular is proprietary                    | Line breaks and optical weight differ | Inter substituted with metric-adjusted fallbacks; swap is one token |
| Interactive map needs a billable key       | Section is a placeholder              | Same footprint and aspect ratio kept, so the swap is drop-in        |
| Screenshot baselines are platform-specific | CI false failures                     | Excluded from CI; regeneration documented                           |
| Seed content is invented                   | Content mismatch with reference       | Isolated to `apps/api/src/data/listing.data.ts`                     |

---

## Outstanding work

Phase 9 runs as soon as the reference is reachable. Any one of these unblocks it:

1. **Disable the protection** — Vercel project → Settings → Security → turn off
   Attack Challenge Mode / Deployment Protection, or issue a bypass token.
2. **Share the source** — a repo link or a zip of the reference project.
3. **Export the page** — "Save page as → Webpage, Complete", plus full-page
   screenshots at 390 / 834 / 1440 px.

Then, in order:

1. **Capture.** Reference DOM, computed styles and asset URLs at all three
   breakpoints.
2. **Extract tokens.** Rewrite the `@theme` block from measured values —
   palette, type scale, spacing, radii, shadows, easing.
3. **Diff section by section.** Header, gallery, overview, amenities, booking
   card, reviews, location, host, footer.
4. **Swap content.** Replace the seed data and image assets with the
   reference's.
5. **Re-baseline.** Regenerate screenshots and run the side-by-side pixel diff
   at each breakpoint.
6. **Re-run the harness.** Confirm the accessibility and keyboard suites still
   pass after the visual changes.

Steps 2 and 4 are deliberately cheap: the design tokens live in one CSS block
and the content lives in one data file, because Phase 0's failure was known
before either was written.
