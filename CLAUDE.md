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

## Git commits

- Use ONLY the exact commit message I provide. Do not add a body, do not add a Co-Authored-By trailer, do not add any extra lines. One line, exactly as given.
- If I don't give you a commit message, ask me for one before committing. Do not invent one.
- Never use git commit -m with a heredoc (cat <<EOF). Use a simple single-quoted or double-quoted string.
- Never pass --no-verify or skip hooks.

## Approvals

- Never self-approve destructive commands (rm -rf, git reset --hard, git push --force, database deletes, Prisma migrations). Always prompt me.
- When I type "proceed" or "approved", that covers only the specific action we just discussed. It does not extend to follow-up actions.

## Working directory guardrails

- This repo is align-platform, the live Vercel-deployed web app. The mobile repo align-mobile lives at ~/Desktop/align-mobile and must be treated as read-only unless I specifically tell you to edit it.
- Never create files in /mnt or anywhere outside this repo.

## Mobile endpoint conventions

- Mobile-compatible API routes live under /api/auth/ and take supabaseUserId as a body or query param. Web routes use next-auth cookies. Do not mix the two patterns.
- Mirror the logging style of existing /api/auth/mobile-* routes for new mobile endpoints.
- No em dashes or hyphens in marketing or user-facing copy.
