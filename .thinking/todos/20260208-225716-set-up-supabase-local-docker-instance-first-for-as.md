---
type: todo
status: pending
created: 2026-02-08 22:57
completed: null
stream: tinamation
tags:
  - supabase-free-hosted
  - free-hosted-tier
  - real-sdk
  - free-hosted
  - supabase-cdn-urls
  - hosted-tier
  - supabase-free
  - supabase
---












#supabase-free-hosted #free-hosted-tier #real-sdk #free-hosted #supabase-cdn-urls #hosted-tier #supabase-free #supabase


# Set up Supabase free hosted tier for asset storage and upload wix-assets

**Decision:** use Supabase free hosted tier (not Docker) — real SDK, persistent, no local infra.

## steps
- create Supabase project (free tier — 1GB storage)
- configure storage buckets: `images` (public) and `videos` (public)
- install `@supabase/supabase-js` in [[tinamation/streams/tinamation|tinamation]]
- add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- write upload script to push all 41 images from `wix-assets/images/` to storage
- upload 3 wix-hosted mp4 videos from `wix-assets/videos/` to storage
- handle vimeo embeds separately (2 vimeo videos — likely keep as embed URLs, not stored assets)
- create a storage service/helper in the app to generate public URLs from Supabase
- update portfolio content data to reference Supabase storage URLs

## notes
- free tier pauses after 1 week inactivity — fine for dev, will need paid for prod
- 1GB storage limit on free — monitor usage with videos (mp4s are ~10MB each)
- can use Supabase CDN URLs directly in `<img>` and `<video>` tags
