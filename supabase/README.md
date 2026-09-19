# Supabase — Community Archive backend

Cloud backend for the **Community Archive**: it lets a recording move off the device to be shared
with (and played by) the community — while keeping every recording **private by default, owned by the
person who made it, and truly erasable**. A person's voice is personal information under **POPIA**, so
access is enforced entirely by **Row-Level Security (RLS)**.

- **Project URL:** `https://ogdlpfykyklblpfrgqwv.supabase.co`
- **Client key:** the **publishable** key (safe in the client **only because RLS is on** — see below).
- **Auth model:** **anonymous sign-in** — no account, no PII collected. Each device gets a stable
  `auth.uid()`; RLS keys everything to it.

## Set it up (once, ~2 minutes)

1. **Run the schema.** Open the [Supabase dashboard](https://supabase.com/dashboard) → your project →
   **SQL Editor** → paste all of [`migrations/0001_community_archive.sql`](migrations/0001_community_archive.sql)
   → **Run**. It's idempotent (safe to re-run). This creates:
   - `public.recordings` (metadata + consent) with RLS,
   - a **private** `recordings` storage bucket with RLS,
   - an erasure trigger (deleting a row deletes its audio object too).
2. **Enable anonymous auth.** Dashboard → **Authentication → Sign In / Providers → Anonymous** → enable.
   Without this the client can't get an `auth.uid()` and every RLS check will (correctly) deny access.
3. **Confirm the keys** are in `app/.env` (already added):
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://ogdlpfykyklblpfrgqwv.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
   ```

## Optional: CAPTCHA protection (hCaptcha)

CAPTCHA is **not required** for anonymous sign-ins — it's abuse-prevention for a public launch. If you
enable it, **every** sign-in must carry a valid hCaptcha token, so the app renders an hCaptcha widget
in the share flow and passes the token to `signInAnonymously({ options: { captchaToken } })`.

To enable:
1. Create a free account at [hcaptcha.com](https://www.hcaptcha.com) → add a site → copy the
   **Sitekey** (public) and **Secret key** (private).
2. Supabase dashboard → **Authentication → Attack Protection → Enable CAPTCHA protection** → provider
   **hCaptcha** → paste the **Secret key** → **Save**. (The secret lives ONLY here.)
3. Put the **Sitekey** in `app/.env` as `EXPO_PUBLIC_HCAPTCHA_SITEKEY=...` (public, safe to bundle).
   For local dev, hCaptcha's always-pass test sitekey is `10000000-ffff-ffff-ffff-000000000001`.

Note: the CLI `npm run supabase:check` can't solve a CAPTCHA, so once it's enabled the check reports
"CAPTCHA enabled — verify in-app" instead of signing in headlessly.

## The access rules (what RLS guarantees)

| Action | Who can do it |
|---|---|
| Insert a recording | only as yourself (`owner_id = auth.uid()`) |
| Read metadata | your own rows **+** any row marked `public` |
| Read audio bytes | your own folder **+** audio belonging to a `public` row |
| Update / delete (erase) | only your own |

Private recordings are readable by **nobody but the owner** — not even with the publishable key, because
RLS runs on every request. That is the POPIA guarantee, in the database itself.

## Data model

`public.recordings`: `id` (uuid) · `owner_id` · `title` · `visibility` (`private`|`public`) ·
`language` · `storage_path` · `duration_seconds` · `transcript` (filled later by Lelapa) ·
`consent_version` + `consented_at` (POPIA) · `created_at`.

Audio path convention inside the bucket: `<owner_id>/<recording_id>.<ext>`.

## Wired to the app (live since July 2026; this section rewritten 2026-09-19)

The app talks to this backend on **web** through [`app/src/services/archive/`](../app/src/services/archive/):

| Step | Where |
|---|---|
| Anonymous sign-in on first cloud action (hCaptcha token when CAPTCHA protection is on) | `supabase.ts` → `ensureAnonSession()`; `components/CaptchaGate.web.tsx` |
| **"Share with community"** → upload the audio to `recordings/<uid>/<id>.<ext>` and insert the public row | `cloud.ts` → `uploadPublic()` |
| The community feed (public rows, newest first) and time-limited playback URLs | `cloud.ts` → `fetchPublicFeed()`, `signedUrlFor()`; rendered in `ArchiveScreen.tsx` |
| Delete = remove the object **then** the row (the trigger is the backstop) | `cloud.ts` → `deleteCloud()` |

Private recordings are never uploaded — they stay in IndexedDB on the device. **Native** has no captcha
widget (`CaptchaGate.tsx` is a stub), so cloud sharing is web-only today (issue #44).

**What is still missing, and tracked:** no moderation, reporting or takedown path on the public feed
(**issue #45** — `docs/12` requires human approval before anything goes public); erasure breaks if the
anonymous session is lost (**#46**); no country/topic tags on rows (**#47**); transcription (Lelapa)
not wired (**#56**).
