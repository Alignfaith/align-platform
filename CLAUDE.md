# Align Faith - Project Instructions

## Feedback Monitoring

**IMPORTANT:** At the start of each session, check for new user feedback:

- **Feedback Log URL:** https://app.alignfaith.com/feedback-log
- **API Endpoint:** `GET https://app.alignfaith.com/api/feedback`

Review any new feedback entries and address bugs, feature requests, or design issues as appropriate.

## Project URLs

- **Production:** https://app.alignfaith.com
- **Feedback Form:** https://app.alignfaith.com/feedback
- **Feedback Log:** https://app.alignfaith.com/feedback-log

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma + PostgreSQL (**Supabase** — `vxavxntyoyjangiuyqzy.supabase.co`)
- NextAuth.js
- Deployed on **Vercel** (git push origin main → auto-deploys)

## Key Commands

```bash
# Deploy to production
git push origin main

# Push schema changes to production DB (Supabase direct connection)
DATABASE_URL="postgresql://postgres:Kel452657190@db.vxavxntyoyjangiuyqzy.supabase.co:5432/postgres" npx prisma db push

# Check Vercel logs
npx vercel logs app.alignfaith.com
```

## Database

- **Provider:** Supabase (AWS us-east-2)
- **Pooler (app use):** `postgresql://postgres.vxavxntyoyjangiuyqzy:...@aws-1-us-east-2.pooler.supabase.com:6543/postgres`
- **Direct (migrations):** `postgresql://postgres:...@db.vxavxntyoyjangiuyqzy.supabase.co:5432/postgres`
- Fly.io Postgres (`rootedalign-db`) has been decommissioned.
