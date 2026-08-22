# Environment Setup

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` — Postgres connection string
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth client from Google Cloud Console (add redirect URI `<your-domain>/api/auth/callback/google`)
- `AUTH_SECRET` — generate with `npx auth secret`
- `GEMINI_API_KEY` — optional; without it, insights fall back to a rule-based analysis

Add the same values in your deployment platform's environment variable settings.

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```
