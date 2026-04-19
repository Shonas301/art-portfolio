---
type: todo
status: pending
created: 2026-04-13
completed: null
stream: deploy-tinamation
tags:
  - owner-action-required
  - deploy-prereqs
  - google-cloud-console
  - owner-action
  - action-required
  - steps-are-needed
  - manual-steps
  - cloudflare-dns-add
---







#owner-action-required #deploy-prereqs #google-cloud-console #owner-action #action-required #steps-are-needed #manual-steps #cloudflare-dns-add

# deploy prereqs: DNS + Google OAuth (owner action required)

before the bootstrap script can run, two manual steps are needed:

## 1. Cloudflare DNS

add under `shippit.live` (DNS only / grey cloud until TLS verified):
- `A  tina  87.99.130.166`
- `AAAA  tina  2a01:4ff:fc:77::1`  *(confirm IPv6 in Hetzner networking tab first)*

## 2. Google Cloud Console

add `https://tina.shippit.live/api/auth/callback/google` to the OAuth client's authorized redirect URIs.

## 3. gather .env.production values

collect all 11 env vars (see `.thinking/codebase/integrations.md`). have them ready before running bootstrap.

## notes

- once these are done, run `scripts/bootstrap-vps.sh` then `scripts/deploy-tinamation.sh`
- scripts not yet written to repo — need to do that in the next session first
- see full plan in `streams/deploy-tinamation.md`
