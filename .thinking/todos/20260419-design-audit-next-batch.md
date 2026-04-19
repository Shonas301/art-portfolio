---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tags:
  - weight-rebalance-paused
  - cormorant-landed
  - rebalance-paused
  - batch
  - font-scale
  - weight-rebalance
  - tier
  - src
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---


#weight-rebalance-paused #cormorant-landed #rebalance-paused #batch #font-scale #weight-rebalance #tier #src

# design-audit next batch — shadows + font scale + weight rebalance

paused 2026-04-17 after tier-1 shell + Cormorant landed (`eee34fc`). the resume doc stages this as the next autonomous-safe batch. zero progress since.

## items (do together — they cross-reference)

### #6 — shadow consolidation (tier 1, systems)
15 distinct `box-shadow` values → 4 elevation tokens.
- define `--elevation-1/2/3/4` in `main/src/styles/globals.css:root` (next to existing easing tokens)
- sweep: 35 occurrences of `box-shadow`/`boxShadow` across `src/` (last verified 2026-04-19)
- priority files: `ResumeModal`, `JoyCard` theme override in `theme.ts:114-123`, BinderTabs (purple rgba already cleaned)
- drop any remaining `rgba(147,51,234,...)` decorative purple shadows

### #8 — font-size scale (tier 1, systems)
10 sizes → 6-8. current scale already pruned (xs/sm/md/lg/xl/xl2/xl3/xl4 = 8 values, good).
- remaining: purge `ResumeModal` body-sm overrides (~30 per audit)
- remove any remaining non-scale values (`0.78rem / 0.8rem / 0.9rem`) — grep to confirm
- Cormorant is now wired, so display-end of scale can be tuned in-site

### #15 — weight rebalance (tier 2, foundations)
drop `500` from theme, rebalance to 400/600/700.
- 12 raw `fontWeight: 500` consumers still in `src/` (last verified 2026-04-19)
- files: `contact/page.tsx`, `ArtworkManager.tsx`, `PageIndicator.tsx`, `MobileNav.tsx`, `LandingPage.tsx`, `Footer.tsx`, `InquiryForm.tsx`
- bump each to 600 (or 400 depending on element intent)
- no `fontWeight="md"` token consumers exist (safe to rename/drop `fontWeight.md` slot)

## verification

- `pnpm test:run` — expect 88/88 green
- `npx tsc --noEmit` — expect clean
- `pnpm lint` — expect clean
- visual: `/v2` at 1440×900 — compare against `main/audit-postshell-desktop.png`

## then

unblocks tier-2/3 polish backlog: #10 (radii), #12 (reduced-motion gaps), #16 (14× `transition: all`), #17 (semantic tokens), #18 (empty gallery), #19 (fallback toast), #22-25 (minor).

## taste-dependent (not this batch)

- #20 hero artwork selection — tier-2, needs user pick after browsing portfolio-content.ts
