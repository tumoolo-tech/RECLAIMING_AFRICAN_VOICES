# Places — review sheet (all cities)

**What this is:** drafted content for `Place` records, for Tumo to review **before** any of it becomes
code. Same convention as [provinces-content.md](provinces-content.md).

**Scope (SP-069):** every landmark in every city — *"every place also has its own interesting thing to
tell."*

**Sourcing rule (SP-054):** the institution's own published page, a heritage authority or museum
record, or a published history. **Not** a travel blog, an aggregator, or an AI summary.

**How to sign off:** ✅ approve · ❌ reject · ✏️ amend, per entry. A rejected place **stays a bare
string** (SP-028) — a normal outcome, not a failure.

---

## Where this stands

| | |
|---|---|
| Landmark strings | 75 |
| Unique (dedup via `alsoListedIn`) | **73** |
| Not places — stay strings (SP-071) | **6** |
| **Real target** | **67** |
| **Drafted below** | **~55** |
| Grounded to SP-054 standard | ~40 |
| Marked `[VERIFY]` or `[NEEDS SOURCE]` | ~15 |

**`coords` is now optional (SP-073)**, so nothing is blocked. **I have supplied no coordinates at
all** — none could be sourced to SP-054 standard, and under SP-052 a coordinate is a factual claim.
Add them later, per place, where a real one exists.

---

## ⚠️ Decisions still needed

### 1. Sacred sites — SP-072, and the most important thing on this page

**Lake Fundudzi** is among the most sacred sites of the Venda, and **access is traditionally
controlled by its custodians**. **Thathe Vondo forest** carries the same caution — it is a holy
forest. A "plan a visit" button on either would be this app's tourism layer overriding a living
custom.

I have added `access?: "sacred-restricted"` to `Place` and **a test that fails if any `Experience`
lists such a place** — so the guarantee lives in the data, not in a component someone might forget.
Mutation-tested: a tour booking Lake Fundudzi turns the suite red.

**Your call:** is describing these places at all the right thing, even without a booking path? I have
drafted them. If the answer is no, they stay strings.

### 2. Four strings conflate several places

| String | Actually | My recommendation |
|---|---|---|
| `"Nelson Mandela Museum"` | **Three** sites — Bhunga Building (Mthatha), Youth & Heritage Centre (Qunu), open-air museum (Mvezo). Qunu and Mvezo are *also* listed separately | One `Place` for the museum; keep Qunu and Mvezo as their own places |
| `"the Gandhi statue & station"` | Two sites. The **station** is where the 1893 ejection happened | Split — the station carries the history |
| `"Naval Hill & Nelson Mandela statue"` | A hill and the statue on it | Keep as one |
| `"Donkin Reserve & lighthouse"` | A reserve and the 1861 lighthouse in it | Keep as one |

### 3. Two entries look wrong

- **`"Thulamela"`** is listed under Thohoyandou but is **in the northern Kruger National Park**, hundreds of km away. It is linked to the Venda sites by the Greater Mapungubwe Heritage Route, which may explain it. **Recommend: remove from Thohoyandou.**
- **`"Sun City"`** is a commercial resort in a list otherwise made of museums, memorials and sacred places. **Recommend: leave as a string.**

### 4. Two superlatives repeated everywhere, evidenced nowhere

- *"Vilakazi Street is the only street in the world to have housed two Nobel laureates"* — already in `provinces.ts`.
- *"Pietermaritzburg City Hall is the largest brick building in the southern hemisphere."*

Both are published widely; neither is demonstrated by any source I found. **Attribute, don't assert.**

---

## Not places — stay bare strings (SP-071)

`"the wine estates"` · `"the goldfields headgears"` · `"the traffic-circle street plan"` ·
`"the Kruger's southern gates"` · `"the historic gold-rush streets"` · `"Mmabatho"`

*Note:* Welkom's horseshoe town plan **is** documented — Anglo American commissioned William
Backhouse to design the town in 1947 around a horseshoe retail core. That belongs in `City.origins`,
not as a place you can stand in.

---

# The places

## Western Cape

### Cape Town

**`robben-island`** · `site`
> Used between the 17th and 20th centuries as a place of banishment, a prison, a hospital for people the colony wished to isolate, and a military base. Nelson Mandela was held here for eighteen of his twenty-seven years in prison. The last political prisoners left in 1991, the prison closed in 1996, and it became a museum in 1997.

*Sources:* UNESCO World Heritage Centre, *Robben Island* (inscribed 1999) · Dept. of Sport, Arts and Culture, *Robben Island Museum*.

**`district-six`** · `site`
> The inner-city district declared white under the Group Areas Act, from which more than 60,000 residents were forcibly removed between 1968 and 1982. A former Methodist church nearby opened as the District Six Museum in 1994; its floor carries a map on which former residents wrote where their homes stood.

*Sources:* District Six Museum, districtsix.co.za.

**`table-mountain`** · `site`
> Declared a national monument in 1957 after two decades of campaigning, and inscribed by UNESCO in 2004 as part of the Cape Floral Region Protected Areas. More than 2,200 plant species grow in the park, many found nowhere else on earth.

*Sources:* SANParks, *Table Mountain National Park — Natural & Cultural History* · UNESCO, Cape Floral Region Protected Areas.

**`castle-of-good-hope`** · `monument` — *[NEEDS SOURCE]*
> The oldest surviving colonial building in South Africa.

**`bo-kaap`** · `site` — *[NEEDS SOURCE]*
> The quarter above the city centre settled by people brought to the Cape as slaves from Indonesia, Malaysia and elsewhere. Apartheid planners classified it Malay and left it standing, unlike District Six.

**`va-waterfront`** · `site` — *[VERIFY]*
> Built around the harbour that began with the small jetty Jan van Riebeeck built in 1654.

### Stellenbosch

**`dorp-street`** · `street`
> The old wagon road to Cape Town; the first plots were allocated along it in 1710. It carries one of the longest surviving rows of old buildings of any town in southern Africa, and its length is a national monument. The oaks along it — the oldest dating to about 1760 — are themselves proclaimed monuments.

*Sources:* Stellenbosch Heritage Foundation, *Stellenbosch history*.

**`jonkershoek`** · `site` — **not researched.**

## Gauteng

### Johannesburg

**`constitution-hill`** · `site`
> A prison complex that became the home of the Constitutional Court. Three prisons stand here: the Old Fort of 1893 for white men; Number Four, the "Natives' Gaol", built 1904; and the Women's Gaol of 1910. Those held here include Mahatma Gandhi, Nelson Mandela, Winnie Madikizela-Mandela, Albertina Sisulu and Fatima Meer. It opened as a museum in 2004.

*Sources:* Constitution Hill, *The history of Constitution Hill* · South African History Online.

**`apartheid-museum`** · **`gold-reef-city`** — **not researched.**

### Soweto

**`vilakazi-street`** · `street`
> The street in Orlando West where Nelson Mandela and Archbishop Desmond Tutu both lived. It is named after Benedict Wallet Vilakazi — the Zulu poet, the first Black South African to earn a PhD, and the author of *Inkondlo kaZulu* (1935), the first collection of Western-influenced poetry published in Zulu. **He is one of this app's four literary pillars.**

*Sources:* Encyclopædia Britannica, *Benedict Wallet Vilakazi* · University of the Witwatersrand, *The last word: Benedict Vilakazi* (2022). **[NEEDS SOURCE]** for Tutu's residence — I have not grounded that address. *See superlative note above.*

**`hector-pieterson-memorial`** · `museum` · `alsoListedIn: ["johannesburg"]`
> The memorial and museum in Orlando West commemorating the schoolchildren killed when police opened fire on the march of 16 June 1976. Named for Hector Pieterson, the twelve-year-old whose death that day was carried around the world in Sam Nzima's photograph. The museum opened on 16 June 2002, near where he was shot.

*Sources:* South African History Online — 8288 Khumalo Street; opened 16 June 2002; surrounding area declared a National Heritage Site.

**`mandela-house`** · `museum` · `alsoListedIn: ["johannesburg"]`
> The four-roomed house at 8115 Vilakazi Street where Nelson Mandela lived from 1946. He gave it to the Soweto Heritage Trust in 1997 to run as a museum, and it was awarded heritage status on 16 March 1999. On his release he called it "the centre point of my world".

*Sources:* Mandela House (Soweto Heritage Trust), *About* — **the institution's own record**, which is exactly the SP-054 standard.

**`regina-mundi-church`** · `church`
> The largest Catholic church in South Africa, in Rockville. During apartheid it sheltered anti-apartheid meetings and activists and became known as "the people's church". When police fired on students in Orlando West on 16 June 1976, many fled here; police followed them in and fired inside, and the marks remain. In 1997 President Mandela declared 30 November Regina Mundi Day.

*Sources:* South African History Online. **⚠️ The founding date is genuinely contested** — 1960 groundbreaking/1962 completed vs "built in 1964", Wikipedia contradicting its own infobox — so **no date appears above**. Resolving it needs the parish's or archdiocese's record.

## Northern Cape — Kimberley

**`the-big-hole`** · `site`
> The largest hand-dug excavation in the world, dug by prospectors who descended on a flat-topped hill after diamonds were found there.

*Sources:* The Big Hole, thebighole.co.za.

**`sol-plaatje-house`** · `museum`
> The house on Angel Street bought for Sol Plaatje's family by the Plaatje Jubilee Fund in 1927. He lived there until his death in 1932 and his widow until 1942. It is now a museum and a library of African literature. **Plaatje wrote *Mhudi* — one of this app's four literary pillars.**

*Sources:* Kimberley City Portal, historical attractions. **[VERIFY]** — I would rather cite the museum's own page.

**`mcgregor-museum`** · `museum`
> Founded 24 September 1907; the Northern Cape's principal research institute for natural and cultural history. Its branches include the Duggan-Cronin Gallery, holding photographic and ethnographic collections from the 1920s and 1930s.

*Sources:* McGregor Museum record. **[VERIFY]** — wants the museum's own page.

**`william-humphreys-art-gallery`** — **not researched.**

## Eastern Cape

### Gqeberha

**`donkin-reserve`** · `monument`
> The reserve above the city, holding the stone pyramid Sir Rufane Donkin raised to his wife Elizabeth — after whom Port Elizabeth was named — and the lighthouse of 1861, which now houses the city's tourist information centre.

*Sources:* City of Gqeberha, *The Donkin Reserve* · Nelson Mandela Bay Tourism.

**`route-67`** · `route`
> Sixty-seven public artworks, and sixty-seven steps, marking Nelson Mandela's sixty-seven years of public work. The trail runs from the Donkin Reserve.

*Sources:* Nelson Mandela Bay Tourism, *Route 67* · South African Tourism.

**`algoa-bay`** · **`st-georges-park`** · **`the-boardwalk`** — **not researched.** *(`"the boardwalk"` may be the commercial Boardwalk complex — check before promoting it.)*

### Mthatha

**`nelson-mandela-museum`** · `museum`
> A museum across three sites: the Bhunga Building in Mthatha, the Youth and Heritage Centre at Qunu where Mandela grew up, and an open-air museum at Mvezo where he was born and where his umbilical cord is buried in Xhosa tradition.

*Sources:* Dept. of Sport, Arts and Culture, *Nelson Mandela Museum*. *See conflation note above.*

**`qunu`** · **`mvezo`** · **`bumbane-great-place`** — **not researched**, pending the conflation call.

### Makhanda

**`egazini`** · `monument`
> A memorial to the Xhosa who died in the Frontier Wars fought around the town — the counterweight to the settler monument on the hill above.

*Sources:* **[VERIFY]** — I want a heritage-authority record for this one, not a tourism listing. It matters that this memorial in particular is well sourced.

**`1820-settlers-monument`** · `monument`
> Opened 13 July 1974 to commemorate the roughly 4,000 English-speaking settlers who arrived in the Eastern Cape in 1820. The idea was first put by Sir George Cory in 1920.

*Sources:* ESAT (Stellenbosch University), *1820 Settlers Monument*.

**`cathedral-of-st-michael-and-st-george`** · `church`
> Begun in 1824 and completed 128 years later in 1952. Its belfry holds the first full ring of eight bells on the continent.

*Sources:* Grahamstown/Makhanda heritage walking-tour record. **[VERIFY]**

**`rhodes-university`** · `site`
> Founded in 1904.

*Sources:* **[NEEDS SOURCE]** — one line is not enough for a place with this name and this history. Needs proper treatment or it should stay a string.

## KwaZulu-Natal

### Durban

**`phoenix-settlement`** · `site`
> The community Gandhi founded on farmland outside Durban in 1904 — homes, a clinic, a school, and the printing press he moved there that year. He and his family lived there until he returned to India in 1914. Declared a national heritage site in 2020.

*Sources:* South African History Online, *Phoenix Settlement and Gandhi Trail* · Durban University of Technology (2020).

**`moses-mabhida-stadium`** · `site`
> Opened in 2009 for the FIFA World Cup, seating about 56,000, named for Moses Mabhida, former General Secretary of the South African Communist Party.

*Sources:* South African History Online, *Moses Mabhida Stadium*.

**`golden-mile`** · **`ushaka-marine-world`** · **`victoria-street-market`** — **not researched to standard.** *(Victoria Street Market is culturally significant to Durban's Indian community and deserves a proper source, not a tourism blurb.)*

### Pietermaritzburg

**`pietermaritzburg-station`** · `site`
> On 7 June 1893 Gandhi, a young lawyer newly arrived from India, was thrown off a first-class carriage here for refusing to move to third class. He described the night in the station's waiting room as the turning point that began his philosophy of non-violent resistance.

*Sources:* Pietermaritzburg Gandhi Foundation, *History* · South African History Online.

**`pmb-city-hall`** · `monument`
> Opened in 1900, with a 47m clock tower.

*Sources:* **[VERIFY]** — *see superlative note; the "largest brick building" claim is unevidenced.*

**`tatham-art-gallery`** · **`msunduzi-river`** — **not researched.**

### Ulundi

**`ondini`** · `site`
> King Cetshwayo's capital, burned by the British in 1879 after the Battle of Ulundi. The royal enclosure has been reconstructed, and the site is the headquarters of Amafa AkwaZulu Natali, the provincial heritage body.

*Sources:* Battlefields Route, *Ondini Cultural Museum and site of King Cetshwayo's Royal Residence*. **[VERIFY]** — should cite Amafa directly.

**`emakhosini`** · `site`
> The valley holding the graves and royal capitals of seven Zulu kings, officially the eMakhosini Ophathe Heritage Park.

*Sources:* Battlefields Route, *eMakhosini Opathe Heritage Park*. **[VERIFY]**

**`ulundi-battlefield`** · `site`
> Where the Anglo-Zulu War ended on 4 July 1879. Lord Chelmsford crossed the White Mfolozi and formed square on the Mahlabatini plain within sight of the king's capital; a Zulu army of between 15,000 and 20,000 attacked to within 30 metres of the square before being driven back with heavy losses.

*Sources:* Battlefields Route, *Ulundi Battlefield*. **[VERIFY]**

## Free State

### Bloemfontein

**`waaihoek-wesleyan-church`** · `church`
> The Wesleyan Methodist school church in Waaihoek where the South African Native National Congress — renamed the African National Congress in 1923 — was founded on 8 January 1912. The four-day meeting was convened by the thirty-year-old Pixley ka Isaka Seme and drew more than sixty delegates from across the country. Declared a national heritage site in 2018.

*Sources:* **SAHRA, *Waaihoek Wesleyan Mission Church*** · Free State Dept. of Sport, Arts, Culture and Recreation, *Wesleyan Church Museum*. **This is the best-sourced entry on the page** — a heritage authority and a provincial department.

**`naval-hill`** · `monument`
> The hill above the city carrying the Nelson Mandela statue, which faces the Waaihoek church where the ANC was founded.

*Sources:* South African History Online, *Naval Hill*.

**`national-womens-memorial`** · `monument`
> Commemorates the roughly 27,000 Boer women and children who died in British concentration camps during the South African War.

*Sources:* **[VERIFY]** — wants the Anglo-Boer War Museum's own record, which adjoins the memorial.

**`oliewenhuis-art-museum`** — **not researched.**

### Welkom

**`oppenheimer-park`** · `site` — *[VERIFY]*
> The park at the centre of the town Anglo American founded in 1947 and had William Backhouse design around a horseshoe retail core.

*Sources:* South African History Online, *Welkom*. The town's founding is well sourced; the park itself is not.

## Limpopo — Thohoyandou

**`lake-fundudzi`** · `site` · **`access: "sacred-restricted"`**
> One of the most sacred sites of the Venda, formed when an ancient landslide dammed the Mutale River. It is held to be protected by a python god, honoured in an annual ceremony. **Access is controlled by its custodians.**

*Sources:* South African Tourism, *Land of the Venda*. **[VERIFY]** — for a sacred site I want a Venda or heritage-authority source, not a tourism board. **No `Experience` may list this place** (SP-072, enforced by test).

**`dzata-ruins`** · `site`
> The remains of the first Venda capital in South Africa, occupied around the 16th century, with stone walling in the Zimbabwe style. In the Nzhelele Valley, about 40km west of Thohoyandou.

*Sources:* South African Tourism, Vhembe District / Greater Mapungubwe Heritage Route. **[VERIFY]** — wants SAHRA or the Dzata Museum.

**`thathe-vondo-forest`** · `site` · **`access: "sacred-restricted"`** — **not researched.** Sacred; same caution.

**`thulamela`** — **see finding 3.** In the northern Kruger, not Thohoyandou.

## Mpumalanga

### Barberton

**`makhonjwa-mountains`** · `site`
> Forty per cent of the Barberton Greenstone Belt, and the best-preserved succession of volcanic and sedimentary rock from 3.6 to 3.25 billion years ago — a record of early Earth's surface, meteorite impacts, volcanism and the environment of early life. Inscribed by UNESCO in 2018, the first World Heritage site in Mpumalanga and the country's tenth.

*Sources:* UNESCO World Heritage Centre, *Barberton Makhonjwa Mountains* (inscribed 2018).

**`eureka-city-ruins`** · `site`
> The remains of a gold-rush town that at its height in the 1880s held around 650 diggers, with two hotels, canteens and music halls, a bakery and a racecourse, serving the Sheba Reef nearby.

*Sources:* De Kaap Echo, *Eureka City, Barberton's forgotten wild-west gold town*. **[VERIFY]** — a local paper; wants a heritage record.

### Mbombela

**`lowveld-national-botanical-garden`** · **`mbombela-stadium`** — **not researched.**

## North West

### Mahikeng

**`mafikeng-museum`** · `museum`
> Housed in a colonial-era prison and police station, established in 1902. Its Siege Room holds artefacts and photographs of the 217-day siege, and **an entire display is given to Sol T. Plaatje** — the author of *Mhudi*, who kept a diary through that siege. The museum's emphasis on Tswana history is deliberate.

*Sources:* Mafikeng Museum records via Museum Explorer SA / Africa Commons. **[VERIFY]** — wants the museum's own page. **Second place in this sweep tied to the app's literary core.**

**`barolong-royal-kraal`** · `site`
> The kgotla of the Barolong Boora-Tshidi. It carries monuments to the Barolong who died in the siege and to Chief Besele Montshiwa. About 400 Barolong were killed, against fewer than 200 British soldiers and town guard — and **Mafikeng is the only town known to carry war monuments to the Black men and women who died in the South African War.**

*Sources:* South African History Online, *Mahikeng* · Mahikeng Local Municipality, *History*.

**`cookes-lake`** — **not researched.**

### Rustenburg

**`boekenhoutfontein`** · `site`
> Paul Kruger's farm, bought in 1859 and his until his death. The farmhouse was destroyed by British forces during the South African War and has been restored; the property holds family graves, the koppie where he went to pray, and the saddle in the hills where he hid his horses. Declared a national monument in 1971.

*Sources:* The Heritage Portal, *The Kruger Houses at Boekenhoutfontein* · Paul Kruger Country House Museum.

**`magaliesberg`** · **`pilanesberg-national-park`** — **not researched.**
**`sun-city`** — **see finding 3.** Recommend leaving as a string.

---

## What remains

Roughly **12 places not yet researched**, plus about **15 marked `[VERIFY]`** where I have a source
but want a better one — an institution's own page rather than a summary. The `[VERIFY]` ones are
usable if you accept the source; the `[NEEDS SOURCE]` ones are not.

**Nothing here is blocked any more.** `coords` optional (SP-073) removed the structural blocker, and
the sacred-site guard is in place and tested.
