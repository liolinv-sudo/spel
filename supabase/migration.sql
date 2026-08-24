-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- once against your own project. This is exactly the kind of schema
-- Lovable's agent would generate and apply automatically when you
-- ask it for a "notes app with login".

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text default '',
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

-- Users can only ever see, insert, update, or delete their own notes.
create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);
