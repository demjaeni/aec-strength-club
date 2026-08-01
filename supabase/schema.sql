-- Run this once in your Supabase project's SQL Editor (Database > SQL Editor > New query).

-- Profiles: just a display name per member. No passwords live here —
-- Supabase's built-in auth.users table handles that securely.
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Everyone signed in can see everyone's name (needed for the leaderboard).
create policy "Profiles are viewable by authenticated users"
  on profiles for select
  to authenticated
  using (true);

-- You can only create/update your own profile row.
create policy "Users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- Automatically create a profile row the moment someone signs up, using the
-- name passed in signUp's metadata. Runs with definer privileges so it works
-- immediately even before email confirmation creates a session for the user
-- (a plain client-side insert at that point would fail row level security).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Completions: one locked-in row per member per day.
create table if not exists completions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  day int not null check (day >= 1 and day <= 60),
  completed_at timestamptz default now(),
  unique (user_id, day)
);

alter table completions enable row level security;

-- Members can only see their own completions (used for their own progress view).
create policy "Users can view their own completions"
  on completions for select
  to authenticated
  using (auth.uid() = user_id);

-- Members can only insert their own completions.
create policy "Users can insert their own completions"
  on completions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Intentionally no update or delete policy: once a day is ticked, nothing
-- (not even the member who ticked it) can change or remove that row. That's
-- what makes the lock-after-tick rule real at the database level, not just in the UI.

-- Leaderboard view: total completed per member only — no daily detail exposed,
-- matching the "names + score only" decision. This view is owned by the
-- database role that creates it, so it can aggregate across everyone's
-- completions even though the completions table itself restricts each member
-- to their own rows.
create or replace view leaderboard as
  select
    profiles.id,
    profiles.name,
    count(completions.id)::int as total_completed
  from profiles
  left join completions on completions.user_id = profiles.id
  group by profiles.id, profiles.name;

grant select on leaderboard to authenticated;

-- Badges: permanent, once-earned records. Awarding logic lives in the app
-- (lib/badges.js) and runs as the member's own authenticated session, so
-- insert stays restricted to their own rows just like completions. There is
-- intentionally no update or delete policy — a badge is never revoked, even
-- if the condition that earned it (e.g. a top-10 leaderboard spot) later
-- stops being true.
create table if not exists badges (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_key text not null,
  earned_at timestamptz default now(),
  unique (user_id, badge_key)
);

alter table badges enable row level security;

create policy "Users can view their own badges"
  on badges for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own badges"
  on badges for insert
  to authenticated
  with check (auth.uid() = user_id);
