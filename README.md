# Field Notes — a Lovable-style app, deployed manually

This is a small full-stack notes app built with the exact same stack Lovable
generates for you: **React + TypeScript + Vite + Tailwind** on the frontend,
**Supabase** (Postgres + Auth + Row Level Security) on the backend. Instead
of Lovable's chat agent writing and hosting it, everything here is plain,
portable code pushed to **GitHub** and deployed on **Render** — which is
exactly what you'd do if you exported a Lovable project and self-hosted it.

## What it does

- Sign in with a magic link (Supabase Auth, no passwords)
- Create, view, and delete notes
- Each user only ever sees their own notes (enforced at the database level
  with Row Level Security policies, not just in the UI)

## 1. Create the backend (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migration.sql` from this repo. It
   creates the `notes` table and the RLS policies that scope every row to
   its owner.
3. In **Project Settings → API**, copy the **Project URL** and **anon
   public key**.
4. In **Authentication → Providers**, email OTP/magic-link sign-in is
   enabled by default — nothing else to configure for this demo.

## 2. Run it locally

```bash
npm install
cp .env.example .env
# edit .env with your Supabase URL + anon key
npm run dev
```

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Field Notes: React + Supabase, Lovable-stack clone"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/field-notes.git
git push -u origin main
```

## 4. Deploy on Render

Two options, both work with the `render.yaml` already in this repo:

**Option A — Blueprint (one click from the repo)**
1. In Render, choose **New → Blueprint**, point it at your GitHub repo.
2. Render reads `render.yaml` and provisions a Static Site automatically.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under
   **Environment** in the Render dashboard (they're marked `sync: false`
   in the blueprint on purpose, so secrets never live in the repo).
4. Deploy. Render runs `npm install && npm run build` and serves `dist/`.

**Option B — Manual static site**
1. **New → Static Site**, connect the repo.
2. Build command: `npm install && npm run build`
3. Publish directory: `dist`
4. Add the same two environment variables, then deploy.

Either way you get a live URL (`field-notes.onrender.com` by default, or a
custom domain) backed by your own Supabase project — no Lovable runtime
involved anywhere in the stack.

## What this does and doesn't prove

This reproduces the **output** of Lovable: the same framework choices
(React/Vite/Tailwind), the same backend-as-a-service pattern (Supabase with
RLS), and the same "own your code, host it anywhere" story. What it does
**not** reproduce is Lovable's actual product — the agent that reads a
plain-English prompt, plans a schema, writes this exact code, and wires it
up automatically. That orchestration layer (prompting, multi-model code
generation, iterative self-correction) is the hard, proprietary part; the
React+Supabase scaffold it produces is standard and easy to host yourself,
which is what this repo demonstrates.
