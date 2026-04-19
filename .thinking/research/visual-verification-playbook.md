---
domain: visual-verification
confidence: high
last_updated: 2026-04-09
tags:
  - page
  - tab
  - resume
  - section
  - binder-tabs
  - resume-tab
  - binder
  - flip
---










#page #tab #resume #section #binder-tabs #resume-tab #binder #flip


# visual verification playbook — tinamation

how to start and visually verify the tinamation site using agent-browser.

## prerequisites

1. **worktree setup:** code lives in `main/` worktree of the bare repo. `cd` or run from there.
2. **env file:** `.env.local` is required but not committed. copy from the old repo if missing:
   ```zsh
   cp /Users/jasonshipp/code/friends/tinamation/.env.local main/.env.local
   ```
3. **deps:** `pnpm install` in the main worktree if `node_modules/` is absent.

## start dev server

```zsh
cd /Users/jasonshipp/code/friends/tinamation.git/main
pnpm dev &
# wait ~3s for compilation, confirm with:
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# expect 307 (redirects to /v2)
```

## routes

| route | what it is |
|-------|------------|
| `/` | redirects to `/v2` (307) — v2 is now primary |
| `/v1` | traditional gallery layout — flat page, nav header, sections |
| `/v2` | interactive flipbook — binder tabs, page flip animations |

## agent-browser walkthrough

### open and screenshot landing

```zsh
agent-browser open http://localhost:3000/v2
agent-browser screenshot /tmp/tina-v2-landing.png
```

### navigate by binder tabs (preferred over arrow keys)

arrow keys flip one page at a time and hit many blank interstitial pages.
**use binder tab labels instead** — they jump directly to content sections:

```zsh
agent-browser find label "jump to intro" click
agent-browser find label "jump to 3d work" click
agent-browser find label "jump to 2d work" click
agent-browser find label "jump to code" click
agent-browser find label "jump to pandy" click
agent-browser find label "jump to contact" click
agent-browser find label "jump to resume" click
```

**gotcha:** `find text "3d work" click` fails with strict mode violation because
the text appears in both the tab label and the page content. always use
`find label "jump to <section>"` for tab navigation.

**gotcha:** after clicking a tab, you may land on a blank interstitial page.
press `ArrowRight` once or twice and wait 1.5s to reach the actual content page.

### wait for flip animations

flip animations take ~1-1.5s. always sleep after navigation before screenshotting:

```zsh
agent-browser find label "jump to 3d work" click
sleep 2
agent-browser screenshot /tmp/tina-section.png
```

### check page position

```zsh
agent-browser snapshot -c -s "text=page"
# returns e.g.: "3d work · page 7" or "between sections · page 16"
```

"between sections" means you're on an interstitial blank page — flip forward.

### keyboard shortcuts modal

```zsh
agent-browser press "?"
sleep 1
agent-browser screenshot /tmp/tina-help.png
agent-browser press Escape  # close it
```

### jump to extremes

```zsh
agent-browser press Home   # first page (landing)
agent-browser press End    # last content page (contact area)
```

### check for errors

```zsh
agent-browser errors    # page errors (js exceptions, hydration, etc)
agent-browser console   # console log/warn/error messages
```

### close

```zsh
agent-browser close
```

## gotcha: binder tab strict mode on mobile

after mobile+a11y work, both MobileNav and BinderTabs have `aria-label="jump to [section]"`.
`find label "jump to intro"` now resolves to 2 elements (strict mode violation).
use `@ref` from `snapshot -i` instead:

```zsh
agent-browser snapshot -i   # get refs
agent-browser click @e4     # click by ref, not by label
```

## gotcha: NEXT_PUBLIC env vars

`src/lib/env.ts` uses literal `process.env.NEXT_PUBLIC_X` (not dynamic lookup).
next.js only inlines NEXT_PUBLIC_ vars when the full string appears as a literal.
if env vars aren't reaching the browser, check env.ts isn't using `process.env[key]`.

## known issues observed (2026-04-09)

### hydration mismatch — FIXED (2026-04-09)

was: framer-motion SSR divergence on landing hint.
fix: deferred sessionStorage read via useEffect.

### nextauth session error (dev only)

`/api/auth/session` returns 500 if NEXTAUTH_SECRET, GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET are missing from .env.local. this is expected in dev
without google oauth credentials — the admin panel just won't authenticate.

### blank interstitial pages

many pages between sections are blank or near-blank. this is by design (the
flipbook has 47 pages but only ~15-20 have content). navigating by arrow keys
through these is tedious — always prefer binder tabs.

### gallery thumbnails — FIXED (2026-04-09)

was: all cards showed identical dark placeholders.
fix: supabase storage populated with 41 images + 3 videos, dynamic content wired.

### profile image placeholder

the "about me" / intro page shows an empty circle where a profile photo should be.
needs a real headshot at /images/headshot.png or as a supabase asset.

### resume tab — FIXED (2026-04-09)

was: resume tab tried to flip to a page that doesn't exist.
fix: resume tab now dispatches OPEN_RESUME (opens modal) + URL hash syncs to #resume.

## section verification checklist

when verifying the site visually, confirm each section renders:

- [ ] **landing** (`/v2`) — welcome text, interaction hint, binder tabs visible
- [ ] **intro** — "about me", bio text, profile image placeholder
- [ ] **3d work** — section header, gallery cards with thumbnails
- [ ] **2d work** — section header, gallery cards
- [ ] **code** — section header, project cards
- [ ] **pandy** — "pandy series" header, animation cards
- [ ] **contact** — "get in touch", email button, social links, inquiry form
- [ ] **resume** — resume content or download button
- [ ] **keyboard help** — `?` key opens modal with all shortcuts
- [ ] **page indicator** — bottom bar shows section name + page number
- [ ] **boundary feedback** — arrow key at first/last page shows visual feedback

## stopping the dev server

```zsh
# find and kill the next dev process
kill $(lsof -ti:3000) 2>/dev/null
```
