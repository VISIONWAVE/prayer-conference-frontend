# Ibadan Prayer Conference — Backend

Receives registration and volunteer sign-up submissions from the conference
website and stores them in SQLite. Includes a password-protected admin
dashboard at `/admin` to view and print everything.

## Endpoints

- `POST /api/submit` — public, called by the website's forms
- `GET /api/submissions` — protected, returns all rows as JSON
- `GET /admin` — protected, the dashboard UI (table view + print button)

## ⚠️ Important: persistent storage

Free tiers on Render and Railway wipe local disk on every redeploy/restart
unless you attach a **persistent disk / volume**. Without one, your
submissions will disappear the next time the service restarts. Set one up
before you rely on this in production (steps below).

## Deploy to Render

1. Push this folder to a GitHub repo.
2. On [render.com](https://render.com), click **New → Web Service**, connect the repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Under **Environment**, add:
   - `ADMIN_USER` — your chosen admin username
   - `ADMIN_PASS` — a strong password
   - `DB_PATH` — `/data/conference.db`
6. Under **Disks**, add a disk mounted at `/data` (this is what makes your
   data persistent — Render's disk feature requires a paid instance type;
   the free tier does not support it, so budget for the cheapest paid plan
   if you need reliable persistence).
7. Deploy. Your site's forms should point to `https://your-app.onrender.com/api/submit`.

## Deploy to Railway

1. Push this folder to a GitHub repo.
2. On [railway.app](https://railway.app), click **New Project → Deploy from GitHub repo**.
3. Railway auto-detects Node and runs `npm install && npm start`.
4. Add the same environment variables as above (`ADMIN_USER`, `ADMIN_PASS`, `DB_PATH=/data/conference.db`).
5. Add a **Volume**, mount it at `/data` (Railway supports volumes on its
   free/hobby tier, making this the simpler option if budget is tight).
6. Deploy. Copy the generated public URL for use in the site's forms.

## Local testing

```bash
cp .env.example .env
npm install
npm start
```

Visit `http://localhost:3000/admin` (login with the credentials from `.env`).

## Viewing / printing submissions

Go to `https://your-backend-url/admin`, log in, and click **Print** — it
hides the controls and prints a clean table of everyone who registered or
signed up, with a running total at the top.
