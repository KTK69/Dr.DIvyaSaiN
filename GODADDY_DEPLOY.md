# GoDaddy deployment (content on server)

This site stores all CMS content in a JSON file on the server:

`data/site-content.runtime.json`

Admin saves at `/admin` write to this file. The live site reads the same file on every request.

## Requirements

- Node.js 20+ on the server
- A **persistent**, **writable** `data/` directory (not wiped on redeploy)
- Process manager such as PM2 running `npm run build` then `npm run start`

## Environment variables

Copy `.env.example` to `.env.local` on the server and set:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (long random string)

**Remove** any `BLOB_READ_WRITE_TOKEN` from hosting env vars (legacy Vercel storage).

## Deploy steps

1. Upload or `git pull` the project on the server.
2. `npm ci`
3. `npm run build`
4. Ensure `data/site-content.runtime.json` exists and is writable.
5. `npm run start` (or PM2: `pm2 start npm --name emmi -- start`)
6. Point your domain reverse proxy to port 3000 (or your chosen port).

## Keep your content safe

- `data/site-content.runtime.json` is **not in git** — each server keeps its own copy. Pushing code will not overwrite blogs already saved on production.
- Back up `data/site-content.runtime.json` on the server before every deploy.
- If deploy replaces the app folder, set `SITE_CONTENT_DATA_DIR` to a path **outside** the deploy directory, e.g. `/home/youruser/emmi-data`, and keep `site-content.runtime.json` there.
- After deploy, open `/admin`, confirm “Synced …” time updates after a small edit, then hard-refresh the live `/blog` page.

## Verify saves work

1. Edit a blog in admin — wait for “Changes synced across the site.”
2. Open `https://your-domain.com/api/site-content` — check `updatedAt` and blog text.
3. On the server, confirm the JSON file timestamp and content changed.

## Troubleshooting

| Symptom | Likely cause |
|--------|----------------|
| Admin saves but live site unchanged | Old Vercel Blob env var, or `data/` not persistent |
| Old many blogs reappear | Server not reading `site-content.runtime.json`; check API response |
| Sort order not sticking | Fixed: sort/Up-Down now save immediately |
| Changes delayed 5+ minutes | Fixed: removed ISR caching; use latest build |
