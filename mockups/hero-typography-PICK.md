# hero typography — pick handoff

**status:** awaiting user decision (subagent could not invoke AskUserQuestion — parent thread must ask and fill in below)

**mockup:** `main/mockups/hero-typography.html`
open locally, arrow-key between candidates, then fill in the pick.

## shortlist (in mockup order)
1. Inter (variable sans, opsz)
2. Fraunces (variable serif, opsz)
3. Cormorant (thin editorial serif)
4. Playfair Display (classical didone)
5. DM Serif Display (sharp modern-classical)

## subagent's top 2 recommendations

### pick #1 — Cormorant
**rationale:** user flagged it as their favorite for letter-width + kerning. narrowest of the serifs. clean single-story `j` and straight `l` — no calligraphic flourishes. zero horizontal ink bulk, the opposite of "blocky." display opsz via Cormorant Garamond-style terminals keeps it elegant at h1 sizes. earns the slight-sans preference by being tighter than any sans in the list except Inter.

**watchouts:**
- hairline weights under 400 get fragile on low-dpi screens at the subtitle size
- tab labels at 0.8rem will need weight 600 minimum to hold against the pink/purple gradients
- kerning is good but not variable — pair with `font-feature-settings: "kern" 1` (already in globals.css ✓)

### pick #2 — Inter
**rationale:** matches the user's stated slight-sans preference directly. variable opsz means the h1 gets display-optimized cuts while the 0.8rem tabs get their text-optimized cut — rare in a single family. narrow geometric forms, mechanically perfect kerning, completely clean `j`/`l`. reads modern without feeling cold. safest pick if the user wants to commit to one family site-wide (body + display).

**watchouts:**
- less personality than Cormorant — risks feeling generic for an artist portfolio
- the lowercase-everything treatment flattens some of Inter's subtle weight contrast

## the other three (why not)
- **Fraunces** — opsz warmth is lovely but the wider letterforms conflict with "narrow." feels slightly blocky at h1.
- **Playfair Display** — classical didone contrast reads elegant but the bracketed serifs add horizontal ink. kerning is fine but not exceptional.
- **DM Serif Display** — striking sharp terminals, but the stroke weight is *heavy*. this is the blockiest of the five — direct conflict with stated taste.

---

## user's pick

**chosen:** Cormorant

**rationale / notes:** matches stated taste (narrow width, clean j/l, strong kerning). rejected candidates (Inter, Fraunces, Playfair Display, DM Serif Display) and the mockup at `main/mockups/hero-typography.html` are kept as reference in case we revisit.

**decided by:** jason — 2026-04-17

## parent-thread follow-up tasks (after pick)
1. wire `next/font/google` import for the chosen family in `main/src/app/layout.tsx` (or `main/src/app/v2/layout.tsx` if v2-scoped)
2. update `main/src/theme.ts` to expose the font in Joy UI theme tokens (`fontFamily.display` or equivalent)
3. apply to `Typography level="h1"` and `level="h3"` in `LandingPage.tsx` — and consider extending to binder tab labels in `BinderTabs.tsx` for consistency
4. confirm `font-feature-settings: "kern" 1, "liga" 1, "calt" 1` in `globals.css` is inherited (already there ✓)
5. run `pnpm test:run` + visual check via agent-browser before merge
