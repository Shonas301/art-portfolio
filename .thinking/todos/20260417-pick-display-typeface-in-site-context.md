---
type: todo
status: completed
created: 2026-04-17
completed: 2026-04-17
stream: tinamation
tags:
  - pick-display-typeface
  - in-site-context
  - isolated-previews-proved
  - fonts-shortlisted
  - round
  - display
  - opsz-axis
  - display-typeface
related:
  - 2026-04-17-display-typeface-shortlist.md
  - 2026-04-17-design-audit.md
---




#pick-display-typeface #in-site-context #isolated-previews-proved #fonts-shortlisted #round #display #opsz-axis #display-typeface

# pick display typeface from shortlist (in-site context)

5 fonts shortlisted 2026-04-17 after three rounds of isolated preview. user tabled the final pick pending view in the actual v2 site context (hero, headings, binder-tab chrome) — isolated previews proved insufficient.

## shortlist

- **Fraunces** (round 1) — warm rounded variable serif, opsz axis
- **Inter** (round 1) — modern geometric variable sans, opsz axis
- **Cormorant** (round 2) — thin elegant editorial serif; best letter-width + kerning of 12 per user
- **Playfair Display** (round 2) — classical didone with hairline contrast
- **DM Serif Display** (round 2) — sharp distinctive terminals

## process when resuming

1. wire each candidate via `next/font/google` in `main/src/app/layout.tsx` behind a CSS variable
2. swap `fontFamily.display` in `main/src/lib/theme.ts` to reference that variable
3. apply display face to H1 in `LandingPage.tsx` (hero), `IntroPage.tsx`, any other >32px heading — do not change body typography
4. capture `/v2` + `/v2#intro` screenshots at 1440×900 for each candidate
5. narrow to top 2 → side-by-side review
6. WCAG contrast check at hero size (display counts as "large text" — 3:1 min) against cream body bg `#faf8f3`
7. commit winner, close shortlist note

## context

- full design audit at `.thinking/notes/2026-04-17-design-audit.md` (tier-1 #4)
- shortlist rationale at `.thinking/notes/2026-04-17-display-typeface-shortlist.md`
- preview HTML still at `main/font-preview.html` — useful until final pick
- user preferences captured: narrow letter widths, clean j/l, no handwriting, no blocky density

## depends on

- no blockers — can resume any time
- pairs well with tier-1 #5 (neutral shell + desaturated chrome); consider doing both in one sitting so site-level visual decisions cohere
