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
- Prisma + PostgreSQL (Fly Postgres — database only, app is on Vercel)
- NextAuth.js
- Deployed on **Vercel** (git push origin main → auto-deploys)

## Key Commands

```bash
# Deploy to production
git push origin main

# Push schema changes to production DB (requires Fly CLI login)
~/.fly/bin/fly proxy 15433:5432 -a rootedalign-db &
DATABASE_URL="postgres://rootedalign:G6EsHWNx5Y6AXVA@localhost:15433/rootedalign" npx prisma db push

# Check Vercel logs
npx vercel logs app.alignfaith.com
```
