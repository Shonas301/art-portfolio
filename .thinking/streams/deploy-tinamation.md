---
stream: deploy-tinamation
started: 2026-04-13
last_active: 2026-04-17
status: active
primary: false
branches: []
parent: tinamation
tags:
  - public
  - cloudflare-dns
  - deploy
  - dns
  - deploy-tinamation-goal-deploy
  - vps
  - user
  - confirm-cloudflare-dns
---







#public #cloudflare-dns #deploy #dns #deploy-tinamation-goal-deploy #vps #user #confirm-cloudflare-dns

# deploy-tinamation

## goal

deploy tinamation to `tina.shippit.live` on the hetzner VPS that already hosts email infrastructure for `shippit.live`.

## infrastructure facts

- **domain:** `shippit.live` — DNS on Cloudflare, email stack already live
- **VPS:** hetzner, `87.99.130.166` (IPv4), `2a01:4ff:fc:77::1` (IPv6)
- **OS:** Ubuntu 24.04.3 LTS, kernel 6.8
- **current state (2026-04-13):** clean slate — only git + sshd installed. no node, pnpm, caddy, nginx, ufw
- **SSH access:** `ssh -i ~/.ssh/hetzner_ed25519 root@87.99.130.166` confirmed working

## decisions made

- **runtime:** bare systemd + pnpm (no docker — avoids overhead)
- **reverse proxy:** Caddy (auto TLS via LE, clean multi-subdomain support)
- **deploy user:** non-root `deploy` user, ssh key from root's authorized_keys
- **hosting supabase:** stay on hosted supabase (not self-host)

## deployment plan

### A. manual prereqs (owner action needed)

1. **Cloudflare DNS** — add under `shippit.live`:
   - `A  tina  87.99.130.166  (DNS only, grey cloud initially)`
   - `AAAA tina  2a01:4ff:fc:77::1  (DNS only)`
2. **Google Cloud Console** — add `https://tina.shippit.live/api/auth/callback/google` to OAuth client's authorized redirect URIs
3. gather all `.env.production` values (11 vars from `.thinking/codebase/integrations.md`)

### B. server bootstrap script (`scripts/bootstrap-vps.sh`)

single script run once as root:
- ufw (allow 22/80/443)
- apt upgrade + unattended-upgrades
- create `deploy` user, copy root's authorized_keys
- Node 20 LTS via nodesource
- corepack + pnpm
- Caddy via official apt repo (gets auto-renewed binary + systemd unit)
- `/srv/tinamation` dir owned by deploy

### C. app deploy

1. `deploy` user clones `git@github.com:Shonas301/art-portfolio.git` to `/srv/tinamation`
2. `pnpm install && pnpm build`
3. `/srv/tinamation/.env.production` — all 11 vars, chmod 600
4. systemd unit at `/etc/systemd/system/tinamation.service`:
   - `User=deploy`, `WorkingDirectory=/srv/tinamation`
   - `EnvironmentFile=/srv/tinamation/.env.production`
   - `Environment=NODE_ENV=production PORT=3000`
   - `ExecStart=/usr/bin/pnpm start`, `Restart=on-failure`
5. Caddyfile at `/etc/caddy/Caddyfile`:
   ```
   tina.shippit.live {
     reverse_proxy 127.0.0.1:3000
     encode gzip zstd
   }
   ```
6. `systemctl enable --now tinamation caddy`

### D. redeploy loop (`scripts/deploy-tinamation.sh`)

```sh
ssh deploy@tina 'cd /srv/tinamation && git pull && pnpm install --frozen-lockfile && pnpm build && sudo systemctl restart tinamation'
```
deploy user gets narrow sudo for the restart command only.

### E. `~/.ssh/config` entry

```
Host tina
  HostName 87.99.130.166
  User root
  IdentityFile ~/.ssh/hetzner_ed25519
```

## app-side changes needed

- `NEXTAUTH_URL=https://tina.shippit.live` in `.env.production`
- confirm `next.config.ts` `images.remotePatterns` allows Cloudinary + Supabase hosts
- confirm `/` → `/v2` redirect still works in production

## env vars needed (from integrations.md)

11 vars total — see `.thinking/codebase/integrations.md` for full list:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_ADMIN_PASSWORD` (flag for removal — security risk)

## open questions (as of 2026-04-13)

- should root SSH be locked out after deploy user is set up?
- confirm IPv6 address `2a01:4ff:fc:77::1` is correct in Hetzner networking tab
- confirm Cloudflare DNS is authoritative for `shippit.live` (implied by email setup, not confirmed in writing)

## status

**not yet executed.** plan is complete; blocked on owner completing DNS + Google OAuth prereqs (section A above).

---

## notes

### 2026-04-13

design session — VPS confirmed as hetzner Ubuntu 24.04 clean slate. SSH access verified.
full deployment plan designed. plan was NOT executed — conversation ended pending owner action on Cloudflare DNS and Google OAuth.
bootstrap and deploy scripts not yet written to repo. this stream captures the plan for the next session.

### 2026-04-17

**new launch blockers surfaced by codebase re-map** (see `.thinking/codebase/concerns.md:44-58`):
- `public/` is gitignored (`main/.gitignore:34`) but code references `/resume.pdf` (`ResumeModal.tsx:103-107`) and `/images/headshot.png` (`portfolio-content.ts:104`). both will 404 on deploy from git. fix options: carve `!public/resume.pdf` exception, move assets to supabase storage, or disable the resume button.
- env var drift: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` + `NEXT_PUBLIC_BASE_URL` referenced in code but missing from `.env.example` — update the env var checklist above before running the deploy.
- deploy scripts still unwritten (todo `20260413-deploy-tinamation-write-scripts.md`).

resolve asset 404s before or during the deploy cut — neither was on the original 2026-04-13 checklist.
