---
type: todo
status: pending
created: 2026-04-13
completed: null
stream: deploy-tinamation
tags:
  - write-deployment-scripts
  - repo-scripts-designed
  - write-deployment
  - deploy-user
  - systemctl-restart
  - systemctl-restart-tinamation
  - deploy
  - one-shot-server-setup
---







#write-deployment-scripts #repo-scripts-designed #write-deployment #deploy-user #systemctl-restart #systemctl-restart-tinamation #deploy #one-shot-server-setup

# write deployment scripts to repo

scripts designed but not yet written. write these to `scripts/` in the tinamation repo:

## files to create

- `scripts/bootstrap-vps.sh` — one-shot server setup (ufw, node 20, pnpm, caddy, deploy user, /srv/tinamation)
- `scripts/deploy-tinamation.sh` — redeploy loop (git pull, pnpm install, pnpm build, systemctl restart)
- `.env.production.example` — template with all 11 var names, no values
- `deploy/tinamation.service` — systemd unit (or inline in bootstrap script)
- `deploy/Caddyfile` — caddy config block for `tina.shippit.live`

## notes

- full spec for each file is in `streams/deploy-tinamation.md` sections B–E
- blocked on DNS prereqs being done first (see other todo)
- deploy user needs narrow sudo for `systemctl restart tinamation` only
