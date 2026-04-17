# shell palette — pick handoff

**status:** awaiting user decision (subagent could not invoke AskUserQuestion — parent thread must ask and fill in below)

**mockup:** `main/mockups/shell-palette.html`
open locally. picker at top filters by body palette and/or accent; default shows all 12 tiles (4 bodies × 3 accents).

## context

tier-1 audit finding #5 — retire the animated 6-stop pastel gradient (`#fdf2f8 → #fae8ff → #ddd6fe → #bfdbfe → #e0e7ff → #fdf2f8`, 20s loop) in `CloudBackground.tsx` plus the saturated pink/purple/amber tabs in `BinderTabs.tsx`. foundations guideline: near-monochrome chrome, artwork provides all color. the pastel-gradient-into-purple is the "AI design" tell of 2025–2026 and must go.

in the mockup, the middle "2d work" tab shows the **active** accent; tabs above are ghosted (flipped pages); tabs below are neutral chrome; resume tab is accent at ~85% opacity.

## matrix

### body palettes
| key | name | body | chrome | chrome-behind |
| --- | --- | --- | --- | --- |
| 1 | warm cream | `#faf8f3` | `#e8e5df` | `#d6d2c8` |
| 2 | off-white paper | `#fafaf9` | `#d6d3cd` | `#bfbcb4` |
| 3 | near-white minimal | `#fbfbfb` | `#e5e5e5` | `#c9c9c9` |
| 4 | soft charcoal (inverse) | `#1c1917` | `#292524` | `#3a3532` |

### accent options (for active tab + resume + hint text only)
- purple `#9333ea` — current brand continuation
- amber `#b45309` — warm, matches existing resume tab
- teal `#0f766e` — cool contrast, cleanest break from current gradient

## subagent's top 2 recommendations

### pick #1 — warm cream + amber `#b45309`
**rationale:** cream body reads as paper, which reinforces the flipbook metaphor without competing with artwork. `#faf8f3` carries a faint warm undertone so the binder chrome `#e8e5df` blends as a natural off-white rather than looking like dead gray plastic. amber keeps continuity with the existing resume tab (already `#b45309`), so only one hue is introduced instead of two. on cream, amber is warm-on-warm — it recedes into the chrome rather than shouting, which is exactly what a restrained accent should do. WCAG AA white-on-amber is met at the active-tab label size.

**watchouts:**
- amber on cream has less pop than amber on near-white — if the active-tab affordance needs to feel louder, bump weight to 700 or add the inset top highlight already in place
- cream can pick up yellow cast under warm monitor calibration — test on at least one cool-calibrated display before committing
- the hint text in `LandingPage.tsx` (currently `#581c87`) needs to change with this pick — use amber or a neutral `#44403c`

### pick #2 — off-white paper + teal `#0f766e`
**rationale:** cleanest possible break from the current pastel-into-purple identity. `#fafaf9` reads neutral-warm, `#d6d3cd` chrome is confidently gray without being cold, and teal is the maximum-distance accent from the retired purple/pink palette. teal at `#0f766e` is dark enough for AA white text at small sizes and desaturated enough to not feel "corporate dashboard." best choice if the user wants the redesign to feel like an actual new direction rather than a cleanup of the old one.

**watchouts:**
- teal has zero continuity with prior branding — the artist-name gradient in `CloudBackground.tsx` (currently `#7e22ce → #ec4899`) will need to change too or it'll clash
- paper chrome at `#d6d3cd` is slightly darker than warm-cream's chrome — make sure the neutral-tab labels stay legible (use `#1c1917` not pure black)
- teal + artwork-with-warm-tones can feel "hospital" on certain pages — preview on 3d work + pandy sections before committing

## the other two palettes (why not top pick)

- **near-white minimal** (`#fbfbfb` + `#e5e5e5`) — technically the most neutral, but pure gray chrome on pure near-white reads cold and generic. no warmth to anchor the artist's identity; feels like an ecommerce template. would work only if the user wants a deliberately clinical aesthetic.
- **soft charcoal inverse** (`#1c1917` + `#292524`) — beautiful for gallery-mode presentations where every artwork is spotlit, but the book metaphor depends on paper reading as paper. dark mode flips that metaphor. worth keeping as a future "night mode toggle" idea but not as the default shell.

## the three accents (quick comparison)

- **purple `#9333ea`** — safest migration: keeps brand continuity, only desaturates the surroundings. downside: doesn't signal change. if the user wants "same vibe, cleaner" this is the pick.
- **amber `#b45309`** — already present on resume tab, so it's not "new" color introduction. pairs best with warm body. most cohesive on cream.
- **teal `#0f766e`** — highest-contrast break with prior identity. pairs best with paper/near-white. signals redesign most clearly.

---

## user's pick

**body palette:** warm cream `#faf8f3` (chrome `#e8e5df`, chrome-behind `#d6d2c8`)

**accent:** amber `#b45309`

**rationale / notes:** paper metaphor reinforces flipbook, amber already present on resume tab so no new hue introduced. rejected palettes (off-white paper, near-white minimal, soft charcoal) and accent options (purple, teal) are kept as reference in the matrix above and in the mockup at `main/mockups/shell-palette.html` in case we revisit.

**decided by:** jason — 2026-04-17

## parent-thread follow-up tasks (after pick)
1. replace the 6-stop animated gradient in `main/src/app/v2/components/CloudBackground.tsx` with the chosen flat body color — drop the `cloudMove` keyframes and `animationPlayState` logic (no more `visibilitychange` listener needed)
2. update the artist-name gradient in the same file (currently `#7e22ce → #ec4899`) — either flatten to the body text color or tint with the chosen accent at low saturation
3. refactor `main/src/app/v2/components/BinderTabs.tsx`:
   - normal tab bg → `chrome` hex
   - behind (flipped) tab bg → `chrome-behind` hex
   - active tab bg → accent hex (single flat color, drop the `linear-gradient(135deg, …)` pairs)
   - resume tab bg → accent hex at ~0.85 opacity (or its own neutral tone if the user wants resume to feel distinct)
   - update `boxShadow`, `&::before`, and `:focus-visible` outline to use the accent hex tokens
4. expose the palette in `main/src/theme.ts` as Joy UI tokens so `BinderTabs`, `CloudBackground`, and `LandingPage` all pull from one source
5. change the hint text color in `LandingPage.tsx` (currently hard-coded `#581c87`) to the accent hex or a neutral `#44403c`/`#d4d4d8` depending on body choice — verify WCAG AA at 0.85rem
6. run `pnpm test:run` + `npx tsc --noEmit` + agent-browser visual pass on `/v2` before merge
