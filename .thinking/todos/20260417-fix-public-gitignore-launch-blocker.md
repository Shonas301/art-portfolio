---
type: todo
status: pending
created: 2026-04-17
completed: null
stream: deploy-tinamation
tags:
  - codebase-re-map
  - public
  - deploy-surfaced
  - gitignore
  - fix-public
  - codebase
  - resume
  - rendering-code-references
---


#codebase-re-map #public #deploy-surfaced #gitignore #fix-public #codebase #resume #rendering-code-references

# fix public/ gitignore — resume + headshot 404 on deploy

surfaced by 2026-04-17 codebase re-map (`.thinking/codebase/concerns.md:44-58`).

`public/` is blanket gitignored (`main/.gitignore:34`) but the rendering code references two assets in it:
- `src/app/v2/components/ResumeModal.tsx:103-107` — `<IconButton component="a" href="/resume.pdf" download>`
- `src/app/v2/data/portfolio-content.ts:104` — `/images/headshot.png`

both files are absent from the repo and will 404 on any deploy that builds from git.

## fix options (pick per asset)

- carve `!public/resume.pdf` + `!public/images/` exceptions into `.gitignore` and commit real assets
- migrate both to supabase storage (bucket already used at `portfolio-content.ts:7`) and reference via `STORAGE_BASE`
- hybrid — resume in supabase, headshot in supabase, delete blanket `public` ignore and add targeted ignores for `public/output/frames/` + `public/output/*.mp4` (1.6gb of cruft)

## also needed

- drop env var drift in `.env.example`: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, `NEXT_PUBLIC_BASE_URL` missing
- delete `main/public/vite.svg` (leftover from pre-nextjs migration, referenced nowhere)

## why it blocks launch

- resume download button is a visible 404 — immediate credibility hit for an artist portfolio
- intro page headshot is visually broken
- both regress work already done in the 2026-04-09 comprehensive pass and 2026-04-17 design audit
