---
type: decision
status: resolved
resolved: 2026-04-17
resolution: Cormorant
created: 2026-04-17
stream: tinamation
tags:
  - identical-system-stacks
  - round
  - main
  - design-audit
  - serif
  - system-stacks
  - display
  - display-typeface-shortlist
feeds:
  - tinamation
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-foundations.md
  - 2026-04-17-design-audit-craft.md
---



#identical-system-stacks #round #main #design-audit #serif #system-stacks #display #display-typeface-shortlist


# display typeface shortlist (v2 headings)

context: design audit tier-1 #4 — `theme.ts:76-77` sets `fontFamily.body` and `fontFamily.display` to identical system stacks. need a distinct display face for H1/H2 across v2 pages. 12 fonts previewed at 88px with the pangram + "Christina Shi" as appositive in `main/font-preview.html` (kept as testing artifact).

## resolution (2026-04-17)

**picked: Cormorant.** wired via `next/font/google` in `main/src/app/layout.tsx`, exposed as `var(--font-display)`, referenced from `main/src/lib/theme.ts` `fontFamily.display`. shipped in commit `eee34fc`.

user rationale: matched taste criteria (narrow width, clean j/l, strongest kerning of the 12). rejected candidates (Inter, Fraunces, Playfair Display, DM Serif Display) preserved in `main/mockups/hero-typography.html` + `-PICK.md` for future revisits.

## shortlist (resolved)

| font | round | category | why shortlisted |
|------|-------|----------|-----------------|
| Fraunces | 1 | warm rounded serif, variable w/ opsz | original recommendation; warmth + craft signal |
| Inter | 1 | modern geometric sans, variable w/ opsz | familiar, reliable, pairs well with artwork |
| Cormorant | 2 | thin elegant editorial serif | best letter-width + kerning of all 12 (user feedback) |
| Playfair Display | 2 | classical didone, hairline contrast | editorial/gallery register |
| DM Serif Display | 2 | sharp modern-classical terminals | distinctive without shouting |

## rejected (7)

- **Instrument Serif** — too blocky (round 1 user feedback)
- **Newsreader** — too blocky (round 1)
- **Caveat** — handwritten `j` and `l` disliked
- **Space Grotesk** — round 3 (sans attempt after round-2 feedback; user re-opened serifs)
- **Archivo (narrow)** — round 3
- **Bricolage Grotesque** — round 3
- **Manrope** — round 3

note: round 3 (all-sans) was spawned in response to a "prefer sans serif but fine either way" signal, then superseded when user confirmed the round-1 Fraunces/Inter + round-2 top-3 as the real shortlist. round 3 fonts are off the table.

## user preferences (captured)

- narrow letter widths preferred (Cormorant set the bar)
- good kerning essential
- `j` and `l` must be restrained — no curls, no quirky descenders, no handwriting flourishes
- "too blocky" = too much horizontal ink density (eliminated Instrument Serif, Newsreader)
- prefers sans slightly but open to serif if it earns it

## resume-later checklist

when revisiting:

1. pick top 2 from shortlist (gut call — likely Fraunces vs Cormorant based on user feedback convergence)
2. drop each into `theme.ts` `fontFamily.display` behind a Next.js font loader (see `next/font/google`)
3. apply to `<h1>` in `LandingPage.tsx`, binder-tab labels (if desired), `IntroPage.tsx` headline
4. run a side-by-side: screenshot `/v2` and `/v2#intro` at 1440×900 with each, compare
5. include WCAG check post-pick — display weights at 64-88px are "large text" so 3:1 minimum, but check against cream `#faf8f3` body bg
6. finalize → close this note, archive the preview HTML, update tier-1 #4 in `2026-04-17-design-audit.md` with the pick

## artifact locations

- preview HTML (12-font comparison, arrow-key nav): `/Users/jasonshipp/code/friends/tinamation.git/main/font-preview.html`
- preview opens at: `file:///Users/jasonshipp/code/friends/tinamation.git/main/font-preview.html`
- if browser font-override was suppressing results (it did on first attempt), reset `chrome://settings/fonts` first
