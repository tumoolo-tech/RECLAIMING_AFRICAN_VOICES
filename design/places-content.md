# Places — review sheet (Soweto pilot)

**What this is:** the drafted content for the first four `Place` records, for Tumo to review **before**
any of it becomes code. Same convention as [provinces-content.md](provinces-content.md), which
`provinces.ts` names as its own review sheet.

**Why it exists:** SP-053. Review happens on prose, not on a TypeScript diff. Nothing here reaches
`app/src/content/places.ts` until it is signed off (TOUR-05b).

**The rule I researched under (SP-054):** an acceptable source is the institution's own published
page, a heritage authority or museum record, or a published history. **Not** a travel blog, an
aggregator, or an AI summary. Anything I could not ground that way is marked, not guessed.

**How to sign off:** mark each row ✅ approve / ❌ reject / ✏️ amend. A rejected place **stays a bare
string** in `provinces.ts` rather than becoming an entity with thin provenance (SP-028) — that is a
normal outcome, not a failure.

---

## ⚠️ Three things to decide before anything ships

### 1. No coordinate can be sourced to SP-054 standard

**None of the four institutions publish decimal coordinates.** Museums publish street addresses;
they do not publish lat/lng. The candidates below come from Wikipedia, which **SP-054 does not
admit** as a source.

SP-052 says a coordinate is a factual claim and is sourced like any other — so by our own rule,
these four coordinates cannot ship as they stand. Three ways out:

- **(a) You verify each against an official map** (Google Maps / OpenStreetMap at the published
  street address) and we cite "verified against the published street address". Honest, and about ten
  minutes of work.
- **(b) Amend SP-054** to admit Wikipedia for coordinates specifically — a lower bar for a
  locational fact than for a historical claim.
- **(c) Drop `coords`** after all, reversing SP-014, and ship four places without them.

**This currently blocks TOUR-05b.** I'd suggest (a) — it keeps SP-054 intact and the work is small.

### 2. Vilakazi Street has no single coordinate

It is a street, not a point. Any coordinate is a *representative* choice, not a fact about the
street. This is the same problem that made a bike tour an `Experience` rather than a `Place` of
`kind: "route"`.

Options: use the Mandela House corner as the representative point and say so in `sources`; or leave
Vilakazi Street without coordinates, which needs `coords` to be optional after all.

### 3. The "only street in the world" claim is a superlative nobody evidences

`provinces.ts` already states, in Soweto's `origins`: *"Vilakazi Street is the only street to have
housed two Nobel laureates."* The claim is published by South African Tourism, Brand South Africa,
CNN, and Mandela House's own site — but **they are all repeating it, not evidencing it.** No source
demonstrates that no other street on earth qualifies.

That Mandela and Tutu both lived on Vilakazi Street is solidly attested. The superlative is not.
**Recommendation:** attribute rather than assert — *"South African Tourism and Mandela House describe
it as the only street in the world to have housed two Nobel laureates"* — and leave the existing
`provinces.ts` line for a separate pass, since this phase promised not to edit existing content
(SP-029).

---

## The four places

### 1. `vilakazi-street` — Vilakazi Street

| | |
|---|---|
| **kind** | `street` |
| **cityId** | `soweto` |
| **alsoListedIn** | — |
| **landmarkLabel** | `"Vilakazi Street"` ✔ matches `provinces.ts` |
| **coords** | ⚠️ see §2 above — a street has no point |

**`what` (draft):**
> The street in Orlando West where Nelson Mandela and Archbishop Desmond Tutu both lived. It is named
> after Benedict Wallet Vilakazi, the Zulu poet and the first Black South African to receive a PhD,
> whose *Inkondlo kaZulu* (1935) was the first collection of Western-influenced poetry published in
> Zulu.

**`sources` (draft):**
> Named for B.W. Vilakazi — Encyclopædia Britannica, *Benedict Wallet Vilakazi*; University of the
> Witwatersrand, "The last word: Benedict Vilakazi" (2022). Mandela's residence at 8115 — Mandela
> House (Soweto Heritage Trust), About. **[NEEDS SOURCE]** for Tutu's residence on the street — I have
> not grounded the address of Tutu House to SP-054 standard.

**Open:** the superlative (§3). The Tutu residence needs its own citation before the `what` line can
name him — or the line drops him and says only what is sourced.

---

### 2. `hector-pieterson-memorial` — Hector Pieterson Memorial & Museum

| | |
|---|---|
| **kind** | `museum` |
| **cityId** | `soweto` |
| **alsoListedIn** | `["johannesburg"]` ✔ Joburg lists it too (SP-017) |
| **landmarkLabel** | `"Hector Pieterson Memorial"` ✔ matches both cities |
| **coords** | candidate `-26.234833, 27.908617` — ⚠️ Wikipedia, see §1 |

**`what` (draft):**
> The memorial and museum in Orlando West commemorating the schoolchildren killed when police opened
> fire on the march of 16 June 1976. It is named for Hector Pieterson, the twelve-year-old whose death
> that day was carried around the world in Sam Nzima's photograph. The museum opened on 16 June 2002,
> near the place he was shot.

**`sources` (draft):**
> South African History Online, *Hector Pieterson Memorial and Museum, Soweto* — address 8288 Khumalo
> Street, Orlando West; opened 16 June 2002; the surrounding area declared a National Heritage Site.

**Open — worth your judgement:** `provinces.ts` calls it "Hector Pieterson Memorial", but the
memorial and the museum are **two adjacent things**: the memorial marks near where Pieterson was
shot; the museum opened in 2002. I have modelled them as one place because the landmark string does.
Splitting them would be more accurate and would break the `landmarkLabel` match. Your call.

---

### 3. `mandela-house` — Mandela House

| | |
|---|---|
| **kind** | `museum` |
| **cityId** | `soweto` |
| **alsoListedIn** | `["johannesburg"]` ✔ |
| **landmarkLabel** | `"Mandela House"` ✔ matches both cities |
| **coords** | candidate `-26.2385361, 27.9087722` — ⚠️ Wikipedia, see §1 |

**`what` (draft):**
> The four-roomed house at 8115 Vilakazi Street, on the corner of Ngakane Street, where Nelson
> Mandela lived from 1946. He gave it to the Soweto Heritage Trust in 1997 to be run as a museum, and
> it was awarded heritage status on 16 March 1999. On his release he described it as "the centre
> point of my world".

**`sources` (draft):**
> Mandela House (Soweto Heritage Trust), *About* — 8115 Orlando West, corner of Vilakazi and Ngakane
> Streets; "On 16 March 1999, the house was awarded the status of a public heritage site, with Nelson
> Mandela as the Founder Trustee"; the "centre point of my world" quotation.

**Note on the dates:** the museum's own page gives **16 March 1999** for heritage status and 1946 for
when Mandela moved in. Wikipedia says he lived there "1946 to 1962" — I have used the museum's own
wording and left the end date out, since the institution does not state one. **The strongest source
here is the institution itself**, which is exactly what SP-054 asks for.

---

### 4. `regina-mundi-church` — Regina Mundi Church

| | |
|---|---|
| **kind** | `church` |
| **cityId** | `soweto` |
| **alsoListedIn** | — |
| **landmarkLabel** | `"Regina Mundi Church"` ✔ matches `provinces.ts` |
| **coords** | candidate `-26.262, 27.8829` — ⚠️ Wikipedia, see §1 |

**`what` (draft):**
> The largest Catholic church in South Africa, in Rockville, Soweto. During apartheid it sheltered
> anti-apartheid meetings and activists and became known as "the people's church". When police fired
> on students in Orlando West on 16 June 1976, many fled here; police followed them in and fired
> inside the building, and the marks are still visible. In 1997 President Mandela declared 30 November
> Regina Mundi Day in recognition of the church's role in the struggle.

**`sources` (draft):**
> South African History Online, *Regina Mundi, Catholic Church, Soweto*. **[NEEDS SOURCE]** — see the
> date conflict below before this ships.

**⚠️ Unresolved factual conflict — I am not picking a winner.** The construction date is genuinely
contested across sources:

| Claim | Where |
|---|---|
| Groundbreaking 1960, completed 1962 | Wikipedia infobox |
| "built in 1964" | Wikipedia body text — *contradicts its own infobox* |
| Official opening 24 July 1962, presided over by Cardinal Montini of Milan | search summary, unverified |

I have kept every date out of the `what` line above rather than guess. Resolving this needs the
parish's or the archdiocese's own record. **Until then this place is `[NEEDS SOURCE]` on its founding
date — though the 1976 account and the Mandela proclamation are separately sourced and could ship
without it.**

---

## Proposed links (`place-links.ts`)

### `direct` — the event happened here, or the person is memorialised here

| Content | Place | `why` (draft) |
|---|---|---|
| `article:time-soweto-photograph` | `hector-pieterson-memorial` | The article is about Sam Nzima's photograph of Hector Pieterson's death on 16 June 1976; this is the place that memorialises him and that day |
| `article:herstory-soweto-erasure` | `hector-pieterson-memorial` | The article is about the same uprising and the same photograph, arguing Antoinette Sithole is remembered as "Hector's sister" rather than a protester |
| `president:mandela` | `mandela-house` | He lived at 8115 Vilakazi Street from 1946 |
| `city:soweto` | all approved places | The city screen lists its own landmarks |

**Note on the first two:** the memorial is *near* where Pieterson was shot, not the exact spot. They
qualify as `direct` under §9's **memorialised** clause rather than its "happened here" clause, and
the `why` says so rather than blurring it.

### `thematic` — one real candidate, and it is a genuine boundary case

| Content | Place | The argument |
|---|---|---|
| `module:vilakazi` | `vilakazi-street` | The app's fourth literary pillar is B.W. Vilakazi's *Inkondlo kaZulu* (1935). **The street is named after him.** |

**This is the one I most want you to rule on**, because it tests the rule rather than applying it:

- **For `direct`:** §9 admits "where the person is memorialised", and naming a street after someone is
  a memorialisation. He is the reason the street has that name.
- **For `thematic`:** he never lived or worked there. Groutville-born, Wits-based. The connection is
  commemorative, not biographical — and §9 says *when a link is genuinely arguable, it is thematic.*

**My reading: `thematic`.** The literal text of §9 would let it through as direct, but the spirit
won't — a reader tapping "visit this" from a poetry module would expect somewhere Vilakazi *was*, and
the street is not that. Under-claiming costs a weaker card; over-claiming states something false.

It is also, separately, the most interesting thing this research turned up: **the hackathon's
literary core reaches the tourism layer from the other direction** — not history pointing at a place,
but a place named after a poet in the app's own canon.

### Rejected

| Considered | Verdict |
|---|---|
| `article:herstory-soweto-erasure` → `regina-mundi-church` | **Rejected.** Demonstrators did flee to Regina Mundi on 16 June, but **the article never mentions the church.** Linking them would be me inventing the connection, not finding it (SP-055) |

---

## What this unblocks, and what it doesn't

**Ready to ship on your approval:** `hector-pieterson-memorial` and `mandela-house` — both grounded,
Mandela House on the institution's own record.

**Needs one more thing each:** `vilakazi-street` (a source for Tutu's residence, or drop him from the
line) · `regina-mundi-church` (the founding-date conflict, or ship without a founding date).

**Blocks all four:** the coordinate question in §1. Ten minutes of your time under option (a) and
every place above can land.
