# pursle website

B2B lead generation site: vanilla HTML/CSS/JS frontend, Node.js (Express) + PostgreSQL backend. Requirements live in `agent_context/context.md`.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (bound to `127.0.0.1` in production — never expose port 5432 publicly)

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Create database and run `server/db/schema.sql` as a superuser, then run the `GRANT` section as documented in that file to create the least-privilege app user.
3. `npm install`
4. `npm run dev` or `npm start`

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (default 3000) |
| `NODE_ENV` | `production` enables stricter security (HSTS when HTTPS, trust proxy) |
| `DATABASE_URL` | PostgreSQL connection string (required for successful contact submissions; if unset, the API returns a generic error) |
| `RESEND_API_KEY` | Resend API key for lead notification emails |
| `NOTIFY_EMAIL` | Inbox that receives new lead alerts |
| `FROM_EMAIL` | Sender address verified in Resend |

If `RESEND_API_KEY` is unset, leads are still stored; a warning is logged server-side.

## Production checklist (operations)

These items are required for launch security (see `agent_context/context.md` section 6.8):

- Terminate TLS at nginx, Caddy, or Cloudflare; redirect HTTP → HTTPS.
- Enable HSTS (Express sets it when the request is HTTPS; ensure `trust proxy` and correct `X-Forwarded-Proto`).
- Put Cloudflare (or similar) in front for DDoS / bot filtering if possible.
- PostgreSQL: bind `127.0.0.1` only; use SSH tunnel for remote admin.
- Application DB user: `INSERT` on `leads` only (see `schema.sql`).
- Configure daily backups of the database; test restore before launch.
- VPS: disable root SSH, key-only auth, UFW (80/443/SSH), fail2ban.
- Run `npm audit` regularly; keep dependencies pinned via `package-lock.json`.

## API

- `GET /api/csrf-token` — returns `{ "csrfToken": "..." }` and sets a `SameSite=Strict` CSRF cookie.
- `POST /api/contact` — JSON body: `name`, `company`, `email`, `slowing` (message), `website` (honeypot, must be empty), `_csrf` (must match cookie). Rate limited per IP.

Structured data for search engines is embedded as Schema.org **microdata** on the homepage footer (not inline JSON-LD) so the Content-Security-Policy can keep `script-src 'self'` only.

After deploy: connect **Google Search Console** to the production domain when DNS is live. Analytics is optional; any third-party script must be allowlisted in CSP.

## License

Proprietary — pursle / Bruno Wojahn.
