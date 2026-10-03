# Environment Setup

Copy `.env.example` to `.env` and fill in:

- `POSTGRES_PRISMA_URL` — pooled Postgres connection string (Supabase pooler, port 6543)
- `POSTGRES_URL_NON_POOLING` — direct Postgres connection string, used for migrations (port 5432)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth client from Google Cloud Console (add redirect URI `<your-domain>/api/auth/callback/google`)
- `AUTH_SECRET` — generate with `npx auth secret`
- `AUTH_TRUST_HOST` — set to `true` when deploying on Vercel
- `GEMINI_API_KEY` — optional; without it, insights fall back to a rule-based analysis

Add the same values in your deployment platform's environment variable settings.

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```
