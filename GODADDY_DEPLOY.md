# GoDaddy / VPS Deploy Guide

This app stores CMS content on the server in:

`data/site-content.runtime.json`

Admin saves at `/admin` write to that file. Code deploys should not overwrite it.

## What Changed

This repo now includes a safer server deploy flow:

- `npm run build:server`
  Uses a Node memory cap for the Next.js build to reduce VPS crashes.
- `npm run deploy:server`
  Pulls latest code, installs deps, backs up CMS data, builds, and restarts PM2.

## Server Requirements

- Node.js 20+
- npm
- PM2 installed globally
- A persistent writable `data/` directory
- Git access to the repo

## Environment Variables

Set these on the server in `.env.local`:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Optional:

- `NEXT_BUILD_MEMORY_MB=1024`
- `APP_NAME=drdivya-site`
- `APP_DIR=/home/divyavps/Dr.DIvyaSaiN`
- `BACKUP_DIR=/home/divyavps/Dr.DIvyaSaiN/backups`

If your CMS data should live outside the app folder, also set:

- `SITE_CONTENT_DATA_DIR=/home/divyavps/emmi-data`

## Recommended Deploy Command

From the VPS:

```bash
cd ~/Dr.DIvyaSaiN
npm run deploy:server
```

That command will:

1. Back up `data/site-content.runtime.json` if it exists
2. `git pull origin main`
3. `npm ci --no-audit --no-fund`
4. `npm run build:server`
5. Restart PM2 app `drdivya-site`

## First-Time PM2 Setup

If PM2 is not installed:

```bash
npm install -g pm2
```

If the app has never been started before:

```bash
cd ~/Dr.DIvyaSaiN
pm2 start npm --name drdivya-site -- start
pm2 save
pm2 startup
```

## If The Build Is Still Heavy

Try lowering memory pressure and building after a reboot:

```bash
sudo reboot
```

Then deploy again:

```bash
cd ~/Dr.DIvyaSaiN
NEXT_BUILD_MEMORY_MB=768 npm run deploy:server
```

If the SSH session still drops, run in the background:

```bash
cd ~/Dr.DIvyaSaiN
nohup npm run deploy:server > deploy.log 2>&1 &
tail -f deploy.log
```

## Verify After Deploy

Check PM2:

```bash
pm2 status
pm2 logs drdivya-site --lines 50
```

Check the site:

- Open `/`
- Open `/services`
- Open `/admin`
- Edit a small field and confirm it saves

## Troubleshooting

If the SSH session closes during build, check:

```bash
free -h
df -h
dmesg -T | tail -100
journalctl -xe --no-pager | tail -100
```

Common causes:

- VPS rebooted
- build hit memory limit and was killed
- disk full
- PM2 app name mismatch

