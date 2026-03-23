# Rooted - Project Instructions

## Feedback Monitoring

**IMPORTANT:** At the start of each session, check for new user feedback:

- **Feedback Log URL:** https://rootedalign.fly.dev/feedback-log
- **API Endpoint:** `GET https://rootedalign.fly.dev/api/feedback`

Review any new feedback entries and address bugs, feature requests, or design issues as appropriate.

## Project URLs

- **Production:** https://rootedalign.fly.dev
- **Feedback Form:** https://rootedalign.fly.dev/feedback
- **Feedback Log:** https://rootedalign.fly.dev/feedback-log

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL (Fly Postgres)
- NextAuth.js
- Deployed on Fly.io

## Key Commands

```bash
# Deploy to production
fly deploy

# Push schema changes to production DB
fly proxy 15433:5432 -a rootedalign-db &
DATABASE_URL="postgres://rootedalign:G6EsHWNx5Y6AXVA@localhost:15433/rootedalign" npx prisma db push

# Check production logs
fly logs -a rootedalign
```
