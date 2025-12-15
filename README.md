# christina shi art portfolio

3d artist portfolio built with next.js 15, mui joy, and typescript.

## tech stack

- next.js 15 (app router)
- react 19
- typescript 5.9
- mui joy ui 5.0
- emotion (css-in-js)
- pnpm 10.10

## development

```bash
# install dependencies
pnpm install

# run development server
pnpm dev

# open http://localhost:3000
```

## build

```bash
# create production build
pnpm build

# start production server
pnpm start
```

## project structure

```
src/
├── app/                    # next.js app router
│   ├── layout.tsx         # root layout with theme
│   ├── page.tsx           # home page
│   ├── demo-reel/
│   ├── 3d-work/
│   ├── pandy-series/
│   ├── code/
│   ├── 2d-work/
│   ├── resume/
│   └── contact/
├── components/            # reusable components
│   ├── Banner.tsx        # navigation
│   ├── Footer.tsx
│   ├── GalleryGrid.tsx
│   ├── GalleryModal.tsx
│   └── ThemeProvider.tsx
├── lib/
│   └── theme.ts          # mui joy theme config
├── styles/
│   └── globals.css       # global styles
└── types/
    └── gallery.ts
```

## previous version

the vite + react router version is preserved in:
- git tag: `v1.0.0`
- git branch: `v1`

to view: `git checkout v1`
