# Reviewing a language — a guide for the person doing it

> **You do not need to be a programmer, and you do not need to install anything.** You will be sent a
> single document — a *review sheet* — with the app's words in English beside their current wording in
> your language, and an empty column to write a better one. That is the whole job.

Ubuntu Heritage speaks eleven of South Africa's twelve official languages. Every word outside English
was produced by a machine, and **as of 2026-09-23 not one of them has been read by a speaker.** The
app says so rather than hiding it, and this guide exists to change it.

---

## What we are asking

| | |
|---|---|
| **Time** | Tier 1 is about **34 short strings** — most reviewers finish it in under an hour. |
| **Tools** | A document. Word, Google Docs, a text editor, pen and paper — whatever you use. |
| **Skill** | You speak the language. That is the qualification. |
| **Credit** | Your name, in the app, beside the language you checked — or not, if you prefer. Your choice. |

**You do not have to finish.** Tier 1 alone is worth more to us than the other three tiers together,
and a sheet with ten corrected rows is ten more than we have now.

---

## Why it is ordered the way it is

The sheet is not in the order the app was written. It is ordered by **what a wrong word costs**
([`app/src/i18n/review-priority.ts`](../app/src/i18n/review-priority.ts)):

1. **Consent, money and erasure.** The screen that asks permission to record someone's voice; the one
   that warns a film will cost 13 MB of prepaid data; the promise that deleting really deletes. A
   wrong word here is not a typo — it means someone agreed to something they did not understand.
2. **Getting around, and actions that cannot be undone.** Navigation, Kids mode, the archive's record
   and delete buttons.
3. **The rest of the interface.** Buttons, headings, labels.
4. **The history itself.** Scene text, blurbs, quiz questions — the largest and slowest tier, and the
   one where a machine draft is most likely to be fluent and wrong.

---

## How to fill in the sheet

Each row has the English, the current wording in your language, and an empty **Correction** cell.

- **Right already?** Leave the Correction cell empty.
- **Wrong, awkward, or not how anyone actually says it?** Write what you would say. *"I would put it
  completely differently"* is the single most useful thing you can tell us — write the different
  version, not a note about it.
- **The English itself is unclear, or the idea does not exist in your language?** Write `?` and a few
  words about why. That is a finding about **our English**, and we will change it.
- **A word we should not have translated at all?** Some terms are meant to stay as they are —
  *inkundla*, *ubulungisa*, *izimbongi*, *sanusi*, place names, people's names. If we have translated
  something that should have been left alone, say so.

### Three things worth knowing

- **Nothing you write goes live unreviewed by you.** We apply your corrections and, if anything is
  ambiguous, we ask you before shipping it.
- **Tone matters as much as accuracy.** The app is read by children and by elders. If a line is
  correct but sounds like a government form, that is worth fixing and we want to know.
- **You are allowed to say the draft is bad.** The whole reason these sheets exist is that we do not
  trust the machine output. Confirming it is wrong is a real answer.

---

## What happens next

1. Send the sheet back however suits you — email, a message, or a pull request if you use git.
2. We apply the corrections and record you in
   [`app/src/i18n/languages.ts`](../app/src/i18n/languages.ts) — your name, **what you actually
   reviewed**, and the date. "Reviewed the consent sheet" is a different claim from "reviewed the
   app", and the registry keeps them apart on purpose.
3. That language's status changes from machine-drafted to reviewed **for the part you read**, and
   readers can see it.

---

## For whoever is sending the sheets

```bash
cd app
npm run review:sheet -- tn        # one language, by code
npm run review:sheet -- --all     # every language except English
```

Sheets are written to `review/<code>.md` and **nothing under `src/` is touched** — the generator only
reads. The sheets are deliberately **not committed**: they go stale the moment a string changes, and a
reviewer working from a stale sheet wastes their time. Generate a fresh one when you send it.

A **returned** sheet is a different thing: it is the record of what a person said, so it belongs in
`review/returned/<code>-<name>-<date>.md` and **is** committed.

When you apply a returned sheet:

- Apply it by hand. There is no write-back script on purpose — a regex that edits eleven languages at
  once is one bad match away from corrupting all of them.
- Set `reviewedUi` (and `reviewedContent`, where they read the history) in the same commit as the
  strings, and add the reviewer to `reviewers` with the scope they actually covered. A test fails if a
  language claims review with nobody named.
- Ask before publishing a name. Credit is offered, never assumed.

---

## Open question for Tumo

`languages.ts` currently marks **Setswana** `reviewedContent: true`, and the language picker shows a
gold tick next to it — which tells a reader a speaker has verified the Setswana story text. But the
content files themselves say otherwise:

> `// NOTE(setswana): the tn fields are AI-assisted DRAFTS and must be reviewed by a Setswana speaker`
> — [`content/mhudi.ts`](../app/src/content/mhudi.ts), and the same in `indaba.ts`

Both cannot be true. **Did you review the Setswana content yourself?** If yes, the note should go and
you belong in `reviewers`. If no, `reviewedContent` should be `false` for `tn` until someone has —
and the app currently shows a tick it has not earned. Flagged rather than changed, because only you
know the answer and it removes something a reader can see. Raised 2026-09-23 with issue #38.
