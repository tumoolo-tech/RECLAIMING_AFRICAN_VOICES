-- Ubuntu Heritage — moderation for the community archive (issue #45)
-- =========================================================================================
-- WHY. The community feed is the one place in this app where a stranger's recording reaches other
-- readers, and the app is used by children (Kids mode ships in the same build). Since July it has
-- had no approval step, no report button and no takedown path: `uploadPublic` inserted a row with
-- visibility='public' and it was live. docs/12 has required the opposite in as many words since it
-- was written — "AI flags -> human approves before anything goes public" — and that was never built.
--
-- THE DECISION (2026-09-25, with Tumo): a shared recording is PENDING until a human approves it.
-- Publish-then-moderate was the alternative and was rejected: the audience includes children, and the
-- window between "uploaded" and "somebody noticed" is exactly the harm. The cost is real and is on
-- the maintainer — a contributor's voice does not appear until it is reviewed — so the app must say
-- so at the moment of sharing rather than letting someone think it is live.
--
-- WHERE IT IS ENFORCED. In RLS, not in the client. The read policy is what makes this safe: an old
-- app build, a curl request with the publishable key, or a client someone wrote themselves can only
-- ever read approved rows. A filter in the app would be a suggestion; a policy is a rule.
--
-- HOW TO RUN: paste this whole file into the Supabase dashboard -> SQL Editor -> Run.
-- It is idempotent (safe to re-run). Requires 0001_community_archive.sql to have run first.
-- =========================================================================================

-- ── 1. Moderation state on each recording ────────────────────────────────────────────────
-- pending  : uploaded, not yet seen by a human. The default. Invisible to everyone but its owner.
-- approved : a human has listened and published it.
-- removed  : taken down. Kept as a row (not deleted) so the same audio is not re-approved by mistake;
--            the owner's right to erasure is unaffected and still deletes the row outright.
alter table public.recordings
  add column if not exists status text not null default 'pending'
    check (status in ('pending','approved','removed'));

-- Who acted, and when. No reviewer identity is required — this is a one-maintainer project today and
-- a free-text note is more useful than a foreign key to a user table nobody populates.
alter table public.recordings add column if not exists reviewed_at   timestamptz;
alter table public.recordings add column if not exists review_note   text;

comment on column public.recordings.status is
  'Moderation state (issue #45). pending = not yet reviewed and NOT public, whatever visibility says. RLS enforces it.';

-- Existing rows: anything already shared before this migration was live and readable, so grandfather
-- it as approved rather than silently un-publishing a contributor's recording. This is a one-time
-- amnesty for rows that predate the column — it runs once because `status` cannot be null afterwards.
update public.recordings
   set status = 'approved',
       review_note = coalesce(review_note, 'grandfathered: shared before moderation existed (0002)')
 where visibility = 'public'
   and status = 'pending'
   and created_at < now();

-- The feed reads (visibility, status, created_at) — index it the way it is queried.
drop index if exists recordings_public_idx;
create index if not exists recordings_feed_idx
  on public.recordings (visibility, status, created_at desc);

-- ── 2. The read policy: public means approved ────────────────────────────────────────────
-- THE LOAD-BEARING CHANGE. Previously: owner_id = auth.uid() OR visibility = 'public'.
-- An unapproved recording is not public, no matter what its visibility column says.
drop policy if exists "recordings read own or public" on public.recordings;
create policy "recordings read own or public" on public.recordings
  for select using (
    owner_id = auth.uid()
    or (visibility = 'public' and status = 'approved')
  );

-- Audio follows the row: an object is readable by a stranger only while its recording is approved.
drop policy if exists "audio public readable" on storage.objects;
create policy "audio public readable" on storage.objects
  for select using (
    bucket_id = 'recordings'
    and exists (
      select 1 from public.recordings r
      where r.storage_path = storage.objects.name
        and r.visibility = 'public'
        and r.status = 'approved'
    )
  );

-- An owner may edit their own row, but must NOT be able to approve it. Without this, "update own"
-- from 0001 lets anyone set status='approved' on their own upload and walk straight through the gate.
drop policy if exists "recordings update own" on public.recordings;
create policy "recordings update own" on public.recordings
  for update using ( owner_id = auth.uid() )
  with check (
    owner_id = auth.uid()
    and status = (select r.status from public.recordings r where r.id = public.recordings.id)
  );

-- ── 3. Reports ───────────────────────────────────────────────────────────────────────────
-- Anyone who can hear a recording can report it. Deliberately holds NO reporter identity: a report
-- is about the recording, and storing who complained would create personal information this project
-- has no use for and would have to protect (POPIA, docs/05).
create table if not exists public.reports (
  id            uuid        primary key default gen_random_uuid(),
  recording_id  uuid        not null references public.recordings(id) on delete cascade,
  reason        text        not null check (char_length(reason) between 1 and 2000),
  created_at    timestamptz not null default now()
);

comment on table public.reports is
  'Reports against a community recording (issue #45). No reporter identity by design — POPIA, docs/05.';

create index if not exists reports_recording_idx on public.reports (recording_id, created_at desc);

alter table public.reports enable row level security;

-- Insert: any signed-in visitor (including anonymous) may report. Reading reports is NOT granted to
-- anyone through this API — the maintainer reads them in the dashboard. A public list of complaints
-- would be its own harm.
drop policy if exists "reports insert by anyone signed in" on public.reports;
create policy "reports insert by anyone signed in" on public.reports
  for insert with check ( auth.uid() is not null );

-- ── 4. A per-device upload cap ───────────────────────────────────────────────────────────
-- Anonymous auth means a new device is a new identity, so this is a speed bump, not a wall. It exists
-- because the free tier has 1 GB of storage and one loop could fill it: a cap turns "the archive is
-- full" into "please try tomorrow".
create or replace function public.enforce_upload_cap()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent int;
begin
  select count(*) into recent
    from public.recordings
   where owner_id = new.owner_id
     and created_at > now() - interval '24 hours';
  if recent >= 20 then
    raise exception 'upload limit reached: 20 recordings per device per day';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_upload_cap on public.recordings;
create trigger trg_enforce_upload_cap
  before insert on public.recordings
  for each row execute function public.enforce_upload_cap();

-- ── 5. Moderation helpers for the maintainer ─────────────────────────────────────────────
-- Run these in the SQL editor. They are the whole admin interface for now, and saying that plainly
-- beats building a dashboard nobody has time to maintain.
--
--   -- what is waiting:
--   select id, title, language, created_at from public.recordings
--    where visibility='public' and status='pending' order by created_at;
--
--   -- what has been reported, most-reported first:
--   select r.id, r.title, r.status, count(rep.id) as reports
--     from public.recordings r join public.reports rep on rep.recording_id = r.id
--    group by r.id order by reports desc;
--
--   -- approve / take down:
--   update public.recordings set status='approved', reviewed_at=now(), review_note='listened, fine'
--    where id='<uuid>';
--   update public.recordings set status='removed',  reviewed_at=now(), review_note='<why>'
--    where id='<uuid>';
--
-- =========================================================================================
-- Done. Nothing shared from now on appears in the feed until a human sets status='approved'.
-- =========================================================================================
