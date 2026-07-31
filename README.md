# AEC Strength Club — 60-Day Challenge

A Next.js app: real accounts, one challenge a day that locks in once ticked,
a 2-day preview window, and a leaderboard. No Claude account needed by anyone —
this is a standalone website.

## Stack
- **Next.js** — the app itself
- **Vercel** — free hosting (Hobby plan)
- **Supabase** — free database + real authentication (not a DIY password system)

## One-time setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a free account, then create a new project.
Pick any name and a strong database password (you won't need that password day-to-day).

### 2. Run the schema
In your Supabase project, open **SQL Editor → New query**, paste in the entire contents of
`supabase/schema.sql` from this folder, and run it. This creates the tables, the security
rules (members can only touch their own rows), and the leaderboard view.

### 3. Get your API keys
In your Supabase project, go to **Settings → API**. Copy:
- **Project URL**
- **anon public** key

### 4. Set environment variables
Copy `.env.example` to `.env.local` and fill in the three values (the two from Supabase,
plus the real date the challenge starts):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CHALLENGE_START_DATE=2026-08-01
```

### 5. Decide on email confirmation
By default, Supabase requires members to click a confirmation link in their email before
they can sign in. For a community app like this, you may prefer to turn that off for a
frictionless signup: **Authentication → Providers → Email → Confirm email → off**.
Either is a reasonable choice — this is just flagging that it's your call.

### 6. Test locally (optional but recommended)
```
npm install
npm run dev
```
Open http://localhost:3000, create a test account, and try ticking today's challenge.

### 7. Deploy
Push this folder to a GitHub repo, then go to [vercel.com/new](https://vercel.com/new) and
import that repo. When it asks for environment variables, paste in the same three from step 4.
Click Deploy — you'll get a live `.vercel.app` URL in about a minute.

If you'd rather not deal with git/GitHub yourself, open this folder in **Claude Code** and ask
it to deploy it for you — it can run the whole thing (git init, GitHub, Vercel CLI) from your
own machine, which has the real internet access this build sandbox doesn't.

## Changing the start date later
Edit `NEXT_PUBLIC_CHALLENGE_START_DATE` in your Vercel project's environment variables
and redeploy (Vercel does this automatically on the next push, or you can trigger a
redeploy manually from the dashboard).

## A note on the free tiers
- **Vercel Hobby** is free but intended for personal/non-commercial projects — worth a
  quick read of their terms if that distinction matters to you.
- **Supabase Free** pauses a project after 7 days with zero activity (data is kept, it just
  needs a manual "resume" click). For a daily-use app like this it's very unlikely to ever
  pause, since one check-in a week keeps it alive.

## Known minor item
`npm audit` flags a couple of moderate-severity advisories in a nested build-time dependency
(PostCSS's source-map handling). They only matter if the build process ever parses untrusted
CSS, which it doesn't here — but if you want them gone entirely, upgrading to Next.js 16 later
would close them (a bigger jump I didn't want to make without testing it against this app first).
