# Places — review sheet (all cities)

**What this is:** the drafted content for `Place` records, for Tumo to review **before** any of it
becomes code. Same convention as [provinces-content.md](provinces-content.md).

**Scope widened 2026-09-18 (SP-069):** every landmark in every city, not Soweto alone — *"every place
also has its own interesting thing to tell."*

**The rule I research under (SP-054):** the institution's own published page, a heritage authority or
museum record, or a published history. **Not** a travel blog, an aggregator, or an AI summary.

**Status: research in progress — roughly 20 of 73 drafted.** The classification below is complete and
is the more important half, because it changes what the number even is.

---

## ⚠️ Four findings, before any content

### 1. It is 73 places, not 75

`Hector Pieterson Memorial` and `Mandela House` each appear twice — Johannesburg and Soweto — and
`alsoListedIn` (SP-017) already resolves both from one entity. **Verified working in the browser.**

### 2. Six "landmarks" are not places at all

These are descriptive phrases, not things you can stand in. Promoting them to entities with ids,
sources and coordinates would be forcing the data model to hold something that isn't there:

| String | City | Why not |
|---|---|---|
| `"the wine estates"` | Stellenbosch | Dozens of separate estates, no single entity |
| `"the goldfields headgears"` | Welkom | Plural mine structures across a region |
| `"the traffic-circle street plan"` | Welkom | An urban-planning feature — not somewhere you go |
| `"the Kruger's southern gates"` | Mbombela | Three different gates (Numbi, Malelane, Crocodile Bridge) |
| `"the historic gold-rush streets"` | Barberton | Diffuse streetscape, no defined site |
| `"Mmabatho"` | Mahikeng | A neighbouring town, not a landmark |

**Recommendation: these stay bare strings.** That is exactly what SP-028 is for. It takes the real
number to **67**.

### 3. Four strings conflate two or more places

| String | Actually |
|---|---|
| `"the Gandhi statue & station"` | Two separate sites — the statue, and the railway station where he was thrown off the train in 1893 |
| `"Nelson Mandela Museum"` | **Three** sites: the Bhunga Building in Mthatha, the Youth & Heritage Centre at Qunu, and the open-air museum at Mvezo — and Qunu and Mvezo are *also* listed separately |
| `"Naval Hill & Nelson Mandela statue"` | A hill and the statue on it — arguably one, arguably two |
| `"Donkin Reserve & lighthouse"` | A reserve and the lighthouse in it — arguably one |

These need an editorial call each: one place or two?

### 4. Two entries look geographically or categorically wrong

- **`"Thulamela"` is listed under Thohoyandou, but it is in the northern Kruger National Park** —
  several hundred kilometres away. The Greater Mapungubwe Heritage Route links it to the Venda sites
  thematically, which may be why it's there, but it is not a Thohoyandou landmark.
- **`"Sun City"` is a commercial resort**, not a heritage site. It sits oddly in a list that is
  otherwise museums, memorials and sacred places. Your call whether it belongs.

---

## ⚠️ SP-070 — the coordinate rule now blocks everything

At four places, SP-067 was ten minutes of your verification. At 67 it is not workable, and the
classification above shows why it is not just a volume problem:

**A large share of these have no single point by nature** — the Magaliesberg and Makhonjwa Mountains
are ranges, Algoa Bay is a bay, the Msunduzi is a river, the Golden Mile is a stretch of beachfront,
District Six and Bo-Kaap are districts, Qunu and Mvezo are villages, Vilakazi and Dorp are streets.

`coords` is **required** by SP-011/SP-014. So either:

- **(a) `coords` becomes optional** — reversing SP-014. A place needs sourced prose + a citation;
  a coordinate is added where one honestly exists. **This unblocks the sweep immediately.**
- **(b) `coords` stays required** — and roughly a third of the list cannot ship at all, including
  Vilakazi Street, the place the whole pitch is built on.

**I recommend (a).** It was the right call at four places and it is close to forced at 67.

---

## Drafted places

Every entry below is grounded in a source named in its own `sources` line. Anything I could not
ground to SP-054 standard is marked, not guessed.

### Cape Town

**`robben-island`** — Robben Island · `site`
> Used between the 17th and 20th centuries as a place of banishment, a prison, a hospital for people
> the colony wished to isolate, and a military base. Nelson Mandela was held here for eighteen of his
> twenty-seven years in prison. The last political prisoners left in 1991, the prison closed in 1996,
> and the island became a museum in 1997.

*Sources:* UNESCO World Heritage Centre, *Robben Island* (inscribed 1999) · Department of Sport, Arts
and Culture, *Robben Island Museum*.

**`district-six`** — District Six · `site`
> The inner-city Cape Town district declared white under the Group Areas Act, from which more than
> 60,000 residents were forcibly removed between 1968 and 1982. A former Methodist church near the
> old neighbourhood opened as the District Six Museum in 1994; its floor carries a large map on which
> former residents have written where their homes stood.

*Sources:* District Six Museum, districtsix.co.za.

**`castle-of-good-hope`** — Castle of Good Hope · `monument`
> The oldest surviving colonial building in South Africa.

*Sources:* **[NEEDS SOURCE]** — I have not yet grounded the construction dates or the Castle's own
record. Do not ship this line as it stands.

**`bo-kaap`** — Bo-Kaap · `site`
> The quarter above the city centre settled by people brought to the Cape as slaves from Indonesia,
> Malaysia and elsewhere. Apartheid planners classified it Malay and left it standing, unlike
> District Six.

*Sources:* **[NEEDS SOURCE]** — needs the Bo-Kaap Museum's or Iziko's own record before it ships.

**`table-mountain`** · **`va-waterfront`** — **not yet researched.**

### Johannesburg

**`constitution-hill`** — Constitution Hill · `site`
> A prison complex turned into the home of the Constitutional Court. Three prisons stand on the site:
> the Old Fort of 1893, where white men were held; Number Four, the "Natives' Gaol" built in 1904;
> and the Women's Gaol of 1910. Those detained here include Mahatma Gandhi, Nelson Mandela, Winnie
> Madikizela-Mandela, Albertina Sisulu and Fatima Meer. It opened as a museum in 2004.

*Sources:* Constitution Hill, *The history of Constitution Hill*, constitutionhill.org.za · South
African History Online, *Constitution Hill Museum, Johannesburg*.

**`apartheid-museum`** · **`gold-reef-city`** — **not yet researched.**

### Soweto

Unchanged from the first pass — `vilakazi-street`, `hector-pieterson-memorial`, `mandela-house`,
`regina-mundi-church`. **Regina Mundi's founding date remains genuinely contested** (1960 groundbreaking
/ 1962 completed vs "built in 1964", Wikipedia contradicting its own infobox), so every date is left
out of its entry rather than guessed.

### Kimberley

**`the-big-hole`** — The Big Hole · `site`
> The largest hand-dug excavation in the world, dug by prospectors who descended on a flat-topped
> hill after diamonds were found there.

*Sources:* The Big Hole, thebighole.co.za (the site's own record).

**`sol-plaatje-house`** — Sol Plaatje House · `museum`
> The house on Angel Street bought for Sol Plaatje's family by the Plaatje Jubilee Fund in 1927. He
> lived there until his death in 1932 and his widow until 1942. It is now a museum and a library of
> African literature. **This is the author of *Mhudi*** — one of the app's four literary pillars.

*Sources:* Kimberley City Portal, historical attractions record. **[VERIFY]** — I would rather cite
the museum's own page; I have not found it yet.

**`mcgregor-museum`** — McGregor Museum · `museum`
> Founded on 24 September 1907, now the Northern Cape's principal research institute for natural and
> cultural history. Its branches include the Duggan-Cronin Gallery, holding photographic and
> ethnographic collections from the 1920s and 1930s.

*Sources:* McGregor Museum record. **[VERIFY]** — wants the museum's own page rather than a summary.

**`william-humphreys-art-gallery`** — **not yet researched.**

### Mthatha

**`nelson-mandela-museum`** — Nelson Mandela Museum · `museum`
> A museum across three sites: the Bhunga Building in Mthatha, the Youth and Heritage Centre at Qunu
> where Mandela grew up, and an open-air museum at Mvezo where he was born and where his umbilical
> cord is buried in Xhosa tradition.

*Sources:* Department of Sport, Arts and Culture, *Nelson Mandela Museum*.

**Editorial call needed:** the museum spans Qunu and Mvezo, which `provinces.ts` also lists
separately. One place or three?

**`qunu`** · **`mvezo`** · **`bumbane-great-place`** — **not yet researched** (pending the call above).

### Durban

**`phoenix-settlement`** — Phoenix Settlement · `site`
> The community Gandhi founded on farmland outside Durban in 1904 — homes, a clinic, a school and the
> printing press he had moved there in 1904. He and his family lived there until he returned to India
> in 1914. Declared a national heritage site in 2020.

*Sources:* South African History Online, *Phoenix Settlement and Gandhi Trail* · Durban University of
Technology, *Phoenix Settlement recognised as a national heritage site* (2020).

**`golden-mile`** · **`ushaka-marine-world`** · **`moses-mabhida-stadium`** · **`victoria-street-market`** — **not yet researched.**

### Pietermaritzburg

**`pietermaritzburg-station`** — Pietermaritzburg Railway Station · `site`
> On 7 June 1893 Gandhi, then a young lawyer newly arrived from India, was thrown off a first-class
> carriage here for refusing to move to third class. He later described the night he spent in the
> station's waiting room as the turning point that began his philosophy of non-violent resistance.

*Sources:* Pietermaritzburg Gandhi Foundation, *History* · South African History Online,
*Pietermaritzburg*.

**Editorial call needed:** `provinces.ts` says `"the Gandhi statue & station"` — one string, two
sites. Split, or keep as one?

**`pmb-city-hall`** — City Hall · `monument`
> Opened in 1900. Reported to be the largest brick building in the southern hemisphere, with a 47m
> clock tower.

*Sources:* **[VERIFY]** — the "largest brick building in the southern hemisphere" claim is widely
repeated and, like the Vilakazi Street superlative, **I have not found anything that evidences it.**
Attribute it or drop it.

**`tatham-art-gallery`** · **`msunduzi-river`** — **not yet researched.**

### Thohoyandou

**`lake-fundudzi`** — Lake Fundudzi · `site`
> One of the most sacred sites of the Venda, formed when an ancient landslide dammed the Mutale
> River. It is held to be protected by a python god, honoured in an annual ceremony.

*Sources:* South African Tourism, *Land of the Venda*. **[VERIFY]** — for a sacred site I want a
Venda or heritage-authority source, not a tourism board.

> **⚠️ Cultural-access note, and it is not a detail.** Lake Fundudzi is sacred and access is
> traditionally controlled — permission from the custodians is required, and there are protocols for
> approaching it. **This place must not carry a "plan a visit" affordance** without that being
> handled properly. Thathe Vondo forest carries the same caution. This is precisely the kind of thing
> the humanities-grounding rule exists for, and it argues for an explicit "sacred / restricted
> access" flag on `Place` before either ships.

**`dzata-ruins`** — Dzata ruins · `site`
> The remains of the first Venda capital in South Africa, occupied around the 16th century, with
> stone walling in the Zimbabwe style. It lies in the Nzhelele Valley, about 40km west of
> Thohoyandou.

*Sources:* South African Tourism, *Vhembe District* / Greater Mapungubwe Heritage Route.
**[VERIFY]** — wants SAHRA or the Dzata Museum's own record.

**`thulamela`** — **see finding 4.** It is in the northern Kruger National Park, not Thohoyandou.

**`thathe-vondo-forest`** — **not yet researched.** Sacred; same access caution as Lake Fundudzi.

---

## Not yet researched

Stellenbosch · Gqeberha · Makhanda · Ulundi · Bloemfontein · Welkom · Polokwane · Mbombela ·
Barberton · Mahikeng · Rustenburg, plus the individual entries marked above.

**Roughly 47 of 67 remain.** I will keep going — but answering SP-070 first would stop me researching
coordinates that cannot ship.
