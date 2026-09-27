# 16 — Media rights register

**What this is.** Every piece of music, film, poetry, photography and sound that Ubuntu Heritage
ships, who made it, and whether we have the right to ship it. Issue
[#35](https://github.com/tumoolo-tech/RECLAIMING_AFRICAN_VOICES/issues/35).

The machine-readable register is [`app/src/content/media-rights.ts`](../app/src/content/media-rights.ts);
`media-rights.test.ts` walks `app/assets/` and fails the build if a shipped file has no entry, if two
entries claim the same file, or if a claimed count drifts. **This document is the human half:** what
is outstanding, who to ask, and what to say.

## Why this exists

The repo already recorded rights properly, twice — books carry `Module.rights` (issue #34), and each
heritage-place photograph carries `credit` + `licence` + `source` in `places.ts`. Everything else
shipped with nothing.

Several of those assets *are* credited: `audioBy: "Jessica Mbangeni"`, `anthemBy: "Stellenbosch
University Choir"`, a footer card linking the African Tribe Echoes channel. Someone thought carefully
about naming people, which matters. But **attribution is not a licence.** Naming a performer does not
grant the right to bundle her performance, and a YouTube credit is not a YouTube licence — the terms
do not permit redistribution.

For a project whose name is *Reclaiming African Voices*, using African artists' voices without asking
is the wrong story to be caught in. That is the real reason this is week-1 work, ahead of the legal
one.

## The decision (27 Sep 2026)

**Unverified media keeps playing while permission is requested.** The alternative — switching the
soundtrack off until it is cleared — trades a large, certain loss (202 clips are the app's entire
ambience) against a risk nobody has measured, and does it *before* anyone has been asked. So the app
is unchanged today; what changed is that the repo can now state exactly what it ships and on what
basis.

`unverified` is a debt, not a clearance. This page is the list of debts.

## Status today

| Source | Files | Status | Holder |
|---|---:|---|---|
| The Sound of Ancient Africa | 202 | ⚠️ unverified | African Tribe Echoes (YouTube) |
| *They Came With Chains* (1652) | 1 | ⚠️ unverified | not recorded |
| *We Are Growing* (1816) | 1 | ⚠️ unverified | not recorded |
| *The Song of Kings* (1816) | 1 | ⚠️ unverified | not recorded |
| `journey/walk.webm` | 1 | ⚠️ unverified | not recorded |
| Praise poems — Mandela, Women's Month | 2 | ⚠️ unverified | Jessica Mbangeni |
| Youth Day poem | 1 | ⚠️ unverified | Sekhutlwana sa Bannye |
| National anthem recording | 1 | ⚠️ unverified | Stellenbosch University Choir |
| Curated animal sounds | 22 | ⚠️ unverified | various, not recorded |
| Hero photographs | 49 | ⚠️ unverified | not recorded |
| Third-party logos | 7 | ⚠️ unverified | each mark's owner (see #55) |
| Heritage-place photographs | 28 | ✅ cleared | per photo, in `places.ts` |
| Flags | 54 | ✅ cleared | public domain (flagcdn.com) |
| App icons | 6 | ✅ cleared | this project |
| AI interpretations | 191 | 🤖 generated | this project |

**567 files. 11 sources carrying a debt; 288 files cleared or generated.**

Three of the debts are **named people or ensembles** — Jessica Mbangeni, Sekhutlwana sa Bannye, the
Stellenbosch University Choir. Those are the ones to ask first: they are reachable, the ask is
reasonable, and a yes costs them nothing.

## What has to happen next (Tumo)

1. **Ask.** Send the four requests below. Record each reply — the date, the person, and what they
   granted — in the `evidence` field of that source's entry in `media-rights.ts`. A status may only
   move to `cleared` when `evidence` is filled in; the test enforces it.
2. **Establish the films' origin.** Three films and one `.webm` have no recorded source at all. Until
   someone can say where each came from, there is nobody to ask. Start with
   `design/1652-2026/They-Came-With-Chains_Media_ejo2cumV550_001_1080p.mp4` — the filename carries an
   11-character YouTube id.
3. **Write the hero photo sources.** `assets/heroes/README.md` already requires a `sources.txt` per
   person. None was ever written, for any of the four. Whoever gathered them knows where they came
   from; that knowledge is currently in one person's head.
4. **Decide, per refusal.** Anything declined or unanswered goes to `must-replace`, and then either a
   CC0/CC-BY replacement (Free Music Archive, Wikimedia Commons, Internet Archive with a stated
   licence) or removal. That is a product call, not an engineering one.

> Contact details are deliberately **not** written here — find them on each artist's own channel or
> the university's music department page, rather than trusting a detail copied into a repo.

---

## Request drafts

Short, specific, and honest about what the project is. Each one says what we use, where, that it is
free and non-commercial, and that we will stop if asked.

### 1. African Tribe Echoes — the soundtrack

> **Subject:** Permission to use your music in a free South African heritage app
>
> Hello,
>
> I'm Tumo Mogame, a South African developer. I've built **Ubuntu Heritage** — a free, non-commercial
> app that brings South Africa's foundational indigenous literature to young readers: Sol Plaatje's
> *Mhudi*, S.E.K. Mqhayi, Credo Mutwa, B.W. Vilakazi, in English and our indigenous languages.
>
> While building it I used the ambient track *The Sound of Ancient Africa* from your channel as the
> app's background music. Your channel is credited in the app's footer with a link. I should have
> asked first, and I'm asking now.
>
> Specifically, I'd like permission to use that track as ambient background audio inside the app. It
> is free to use, has no advertising, and earns nothing. If you'd rather I didn't, tell me and I'll
> remove it — no argument.
>
> Happy to credit you however you prefer.
>
> Thank you,
> Tumo Mogame — ubuntu-heritage

### 2. Jessica Mbangeni — the praise poems

> **Subject:** Permission to include your praise poetry in a free heritage app
>
> Dear Ms Mbangeni,
>
> I'm Tumo Mogame, a South African developer. I've built **Ubuntu Heritage**, a free app that teaches
> young South Africans our own literature and history — Plaatje, Mqhayi, Mutwa, Vilakazi — in English
> and our indigenous languages.
>
> Two of your recorded performances are in it: one on the page for National Women's Day, and one on
> the page about Nelson Mandela. You are credited by name on the Women's Day page. I'm writing
> because a credit is not permission, and I should have asked you before including your voice.
>
> I'd like your permission to keep them, and I'd also like to credit you properly on both — your
> name, and anything else you'd like said. The app is free, carries no advertising and makes no
> money. If you'd prefer them removed, say so and they come out immediately.
>
> An app about reclaiming African voices should not be using one without asking, so I'd rather fix
> this properly.
>
> With respect,
> Tumo Mogame — ubuntu-heritage

### 3. Sekhutlwana sa Bannye — the Youth Day poem

> As above, naming the Youth Day (16 June) page and the single recording used there.

### 4. Stellenbosch University Choir — the anthem recording

> **Subject:** Permission to use your anthem recording in a free heritage app
>
> Good day,
>
> I'm Tumo Mogame, a South African developer. **Ubuntu Heritage** is a free, non-commercial app
> teaching South African literature and history to young readers.
>
> It plays your recording of the national anthem on its anthems page, credited to the Stellenbosch
> University Choir. I understand that while Enoch Sontonga's *Nkosi Sikelel' iAfrika* is long out of
> copyright, your **recording** is the choir's own, so I'm writing to ask permission to use it.
>
> The app is free, has no advertising, and earns nothing. If permission isn't available I'll replace
> the recording.
>
> Thank you,
> Tumo Mogame — ubuntu-heritage

---

## How to record a reply

In `app/src/content/media-rights.ts`, on that source's entry:

```ts
status: "cleared",
evidence: "Email from <name>, <date>: permission granted for non-commercial use in the app, credit as <x>.",
```

The test refuses a `cleared` status with no `evidence`, so the grant and the status move together.
That check exists because the first version of it searched the prose for the word "permission" — and
the soundtrack's own text already contained it, in the sentence *"Permission not yet requested"*. A
status is not its own proof.
