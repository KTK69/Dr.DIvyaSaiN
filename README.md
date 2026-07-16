# Dr. Divya Sai Narsingam Website

Next.js site with an admin-managed CMS for services, blogs, testimonials, and page content.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main Commands

```bash
npm run dev
npm run lint
npm run build
npm run build:server
npm run start
```

## Admin CMS

- Visit `/admin`
- Content is stored in `data/site-content.runtime.json` on the server
- Navbar services and service detail content are editable from the admin panel

## Server Deploy

For VPS / GoDaddy deployment, see [GODADDY_DEPLOY.md](./GODADDY_DEPLOY.md).

Recommended server command:

```bash
cd ~/Dr.DIvyaSaiN
npm run deploy:server
```

