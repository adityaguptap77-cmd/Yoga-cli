# Yovana Yoga

A yoga studio website for India: animated marketing site, SEO blog, step-by-step booking form that saves leads and sends emails, reviews, and an admin panel.

The project is two separate apps in one repository.

```
yovana-yoga/
├── backend/                  Express JSON API  (port 4000)
│   └── src/
│       ├── config/           environment and settings
│       ├── constants/        form options, statuses
│       ├── controllers/      request handlers (public + admin/)
│       ├── db/               SQLite connection and schema
│       ├── middleware/       auth + CSRF, rate limits, uploads, errors
│       ├── models/           database queries (leads, blogs, reviews, settings, sessions)
│       ├── routes/           public.routes.js, admin.routes.js
│       ├── seeds/            starter blog posts
│       ├── services/         mailer (SMTP), markdown, seeding
│       ├── templates/emails/ confirmation + notification emails
│       ├── utils/
│       ├── app.js            Express app
│       └── server.js         entry point
├── frontend/                 Next.js 15 (App Router, TypeScript)  (port 3000)
│   ├── public/img/           logo, icons, social image, placeholder photos
│   └── src/
│       ├── app/
│       │   ├── (site)/       public pages + site layout (header, footer)
│       │   ├── (admin)/      admin panel + its own layout
│       │   ├── sitemap.ts    dynamic sitemap (reads published posts)
│       │   └── robots.ts
│       ├── components/       ui/ cards/ layout/ home/ forms/ admin/ seo/
│       ├── content/          services, FAQs, comparison, legal copy
│       ├── lib/              api (server fetchers), admin-api, seo, jsonld, types
│       └── styles/           site.css, admin.css
└── package.json              scripts to run both apps together
```

## How the two apps talk

The browser only ever talks to the frontend. Next.js proxies `/api/*` and `/uploads/*` to the backend (`BACKEND_URL`), so there are no CORS or cookie problems, and the admin session cookie stays on one origin. Server-rendered pages fetch their data from the backend directly, which keeps every page crawlable.

## Run it locally

Requires Node 20 or newer.

```bash
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run dev            # backend on :4000, frontend on :3000
```

Or run them separately in two terminals: `npm run dev:backend` and `npm run dev:frontend`.

Open http://localhost:3000. The admin is at http://localhost:3000/admin.
In development, if `ADMIN_PASSWORD` is empty the sign-in password is `ChangeMe123!`. Set a real one before deploying.
Three starter blog posts are created automatically the first time the backend starts on an empty database.

## Settings

`backend/.env` (never commit it):

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default 4000) |
| `SITE_URL` | Public address of the website. Used in email links and as the allowed browser origin |
| `CORS_ORIGINS` | Extra allowed origins, comma separated (optional) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin sign-in. The password is **required** in production |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Outgoing email. Without them leads are still saved, but no emails are sent |
| `NOTIFY_EMAIL` | Where new-lead alerts go (defaults to `ADMIN_EMAIL`) |
| `DB_PATH`, `UPLOAD_DIR` | Where the SQLite file and uploaded images live (put both on persistent storage) |

`frontend/.env.local`:

| Variable | Purpose |
| --- | --- |
| `BACKEND_URL` | Where the API runs (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | Public website address. Used for canonical URLs, `sitemap.xml`, `robots.txt` and social previews |

## Production

```bash
npm run install:all
npm run build          # builds the frontend
npm start              # runs both; or start:backend and start:frontend on separate hosts
```

Run the backend somewhere with a persistent disk (the database and uploaded images are files). The frontend can run on any Node host. Point `BACKEND_URL` at the API and set `NEXT_PUBLIC_SITE_URL` to your real domain **before building**.

## What is dynamic

- **Blog:** posts live in the database (title, slug, Markdown body, cover image, meta title, meta description, keywords, FAQs). Markdown is converted to sanitised HTML on the backend. FAQs and article details become JSON-LD structured data.
- **Sitemap:** `/sitemap.xml` is rebuilt on every request, so a post appears when published and disappears when unpublished.
- **Leads:** the contact page asks one question per card, confirms the answers, saves to the database, emails the student a confirmation and emails your team an alert. Failed emails are flagged in the admin, never lost.
- **Reviews:** only approved reviews are shown. Student submissions wait for your approval. There are no sample reviews on purpose.
- **Admin** (`/admin`): dashboard, leads (status, notes, search, CSV export), blog editor (draft, publish, unpublish, SEO preview), reviews, settings (studio details, founder photo).

## Before you launch

1. Replace the placeholder founder name, bio and photo (Admin, Settings).
2. Review `frontend/src/content/legal.ts` and `compare.ts`. They are drafts, not legal advice, and must be checked against how your studio actually works.
3. Confirm the studio details, hours and social links in Settings.
4. Set `ADMIN_PASSWORD`, SMTP details, and your real `SITE_URL` / `NEXT_PUBLIC_SITE_URL`.
5. Add real reviews from students who agreed to it. Do not invent them.
6. Submit `https://yourdomain/sitemap.xml` in Google Search Console.
