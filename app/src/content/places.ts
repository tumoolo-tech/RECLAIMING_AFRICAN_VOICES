// Real, visitable places — the layer that turns a story into somewhere you can stand.
//
// A Place is geography and history: what this place is, where it is, and the source that says so.
// It knows nothing about tickets. Everything bookable lives in `experiences.ts` (SP-058), because a
// booking is not a property of a place — one tour visits four of them, and a museum that closes must
// not delete the street it stands on.
//
// INTEGRITY (AGENTS.md §4): `sources` is REQUIRED, so a place with no citation does not compile. An
// unsourced landmark stays a bare string in `provinces.ts` rather than being promoted into an entity
// with invented provenance. `coords` is OPTIONAL (SP-073) — a third of these places have no single
// point by nature — but where one is given it is a sourced factual claim like any other, because a
// wrong coordinate sends a real person to the wrong place (SP-052).
//
// Decisions: docs/sim_plan.md §4.4 · seeded in TOUR-05b from design/places-content.md.

/** What kind of thing this is. No "other" — an escape hatch is where unclassifiable junk collects. */
export type PlaceKind = "museum" | "street" | "site" | "route" | "monument" | "church";

export type Place = {
  /** Globally unique, kebab-case: "hector-pieterson-memorial". */
  id: string;
  name: string;
  /** The city this place is physically IN → `provinces.ts` City.id. */
  cityId: string;
  /** Other cities whose `landmarks` list it without being where it is. Soweto's memorial and
   *  Mandela House are also listed under Johannesburg, and both should resolve here rather than
   *  leaving a chip that looks tappable and is not (SP-017). */
  alsoListedIn?: string[];
  /** The EXACT string this place appears as in `provinces.ts` `City.landmarks`. Pinned rather than
   *  name-matched: the chip reads "Hector Pieterson Memorial" while the museum's own name carries
   *  "& Museum", and no fuzzy matching is allowed anywhere (SP-016). A test fails if it stops
   *  appearing in `cityId` or in any `alsoListedIn` city (SP-051). */
  landmarkLabel: string;
  kind: PlaceKind;
  /** Why it matters — sourced prose. English only, like the rest of `src/content` (SP-015). */
  what: string;
  /** OPTIONAL (SP-073), and not as a convenience: a third of this app's places have no single point
   *  by nature — the Magaliesberg is a range, Algoa Bay a bay, the Msunduzi a river, District Six a
   *  district, Vilakazi a street. Where a coordinate IS given it is a sourced factual claim like any
   *  other (SP-052), because a wrong one sends a real person to the wrong place. */
  coords?: { lat: number; lng: number };
  /** Absent means open. Any value here means **no `Experience` may list this place** — enforced by a
   *  test in `places.test.ts`, so no booking path can reach it and no component can route around it.
   *
   *  `"sacred-restricted"` — access is governed by custom, not by opening hours. Thathe Vondo forest
   *    is the clearest case: ordinary Venda people may not walk in it, and that taboo extends to
   *    visitors. Lake Fundudzi is the same. A "plan a visit" button here would be this layer
   *    overriding a living custom (SP-072).
   *  `"living-residence"` — someone's home and a seat of living authority, not a heritage site.
   *    Bumbane Great Place is the residence of the reigning aBaThembu king (SP-074). */
  access?: "sacred-restricted" | "living-residence";
  /** REQUIRED. Where the history — and the coordinate, if given — come from. No source, no place (T4). */
  sources: string;
  /** A REAL PHOTOGRAPH of this place, licensed for reuse — never an AI image.
   *
   *  An AI picture of Vilakazi Street depicts a real, identifiable address that this app is
   *  actively telling someone to travel to. The existing disclosure ("artistic interpretation …
   *  not depictions of real people") was written for literary scenes and does not cover that: a
   *  reader would take an invented street for a photograph of the street. So places carry licensed
   *  photographs or nothing at all.
   *
   *  `file` is a NAME, not a `require()`. Resolving assets here would make this module import
   *  image binaries and stop it loading under `node --test` — the exact trap that keeps
   *  `provinces.ts` un-importable (SP-032). `place-images.ts` maps the name to the asset and is
   *  imported only by components. A test pins every `file` to a real entry in that map. */
  image?: {
    file: string;
    /** Photographer, as the licence requires them to be credited. */
    credit: string;
    /** e.g. "CC BY-SA 4.0". Recorded because reuse terms are a fact we must be able to show. */
    licence: string;
    /** Where it came from, so the licence claim is checkable. */
    source: string;
  };
};

/** TOUR-05b. Seeded 2026-09-18 from design/places-content.md — every entry below names a real
 *  source. What is NOT here is deliberate: places marked [NEEDS SOURCE], the six strings that are
 *  not places (SP-071), the nine with no story this repo can tell, and the three access-restricted
 *  ones awaiting Tumo's call on whether they belong at all. Those all stay bare strings in
 *  provinces.ts, which is what SP-028 is for. */
export const places: Place[] = [
  // ── Western Cape ───────────────────────────────────────────────────────────────────────────────
  {
    id: "robben-island",
    image: {
      file: "robben-island.webp",
      credit: "Moheen Reeyad",
      licence: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Maximum_Security_Prison,_Robben_Island_(02).jpg",
    },
    name: "Robben Island",
    cityId: "cape-town",
    landmarkLabel: "Robben Island",
    kind: "site",
    what:
      "Used between the 17th and 20th centuries as a place of banishment, a prison, a hospital for people the colony wished to isolate, and a military base. Nelson Mandela was held here for eighteen of his twenty-seven years in prison. The last political prisoners left in 1991, the prison closed in 1996, and it became a museum in 1997.",
    sources:
      "UNESCO World Heritage Centre, Robben Island (inscribed 1999) · Department of Sport, Arts and Culture, Robben Island Museum.",
  },
  {
    id: "district-six",
    image: {
      file: "district-six.webp",
      credit: "Mike Peel",
      licence: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:District_Six_Museum,_Cape_Town_2018_04.jpg",
    },
    name: "District Six",
    cityId: "cape-town",
    landmarkLabel: "District Six",
    kind: "site",
    what:
      "The inner-city district declared white under the Group Areas Act, from which more than 60,000 residents were forcibly removed between 1968 and 1982. A former Methodist church nearby opened as the District Six Museum in 1994; its floor carries a map on which former residents wrote where their homes stood.",
    sources: "District Six Museum, districtsix.co.za.",
  },
  {
    id: "table-mountain",
    image: {
      file: "table-mountain.webp",
      credit: "SkyPixels",
      licence: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Cape_Town_City.jpg",
    },
    name: "Table Mountain",
    cityId: "cape-town",
    landmarkLabel: "Table Mountain",
    kind: "site",
    what:
      "Declared a national monument in 1957 after two decades of campaigning, and inscribed by UNESCO in 2004 as part of the Cape Floral Region Protected Areas. More than 2,200 plant species grow in the park, many of them found nowhere else on earth.",
    sources:
      "SANParks, Table Mountain National Park — Natural & Cultural History · UNESCO, Cape Floral Region Protected Areas (2004).",
  },
  {
    id: "dorp-street",
    image: {
      file: "dorp-street.webp",
      credit: "Steven Morrow",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Oak_trees,_Dorp_Street,_Stellenbosch.jpg",
    },
    name: "Dorp Street",
    cityId: "stellenbosch",
    landmarkLabel: "Dorp Street",
    kind: "street",
    what:
      "The old wagon road to Cape Town; the first plots along it were allocated in 1710. It carries one of the longest surviving rows of old buildings of any town in southern Africa, and its length is a national monument. The oaks along it, the oldest dating to about 1760, are themselves proclaimed monuments.",
    sources: "Stellenbosch Heritage Foundation, A Short History of Stellenbosch.",
  },
  {
    id: "jonkershoek",
    image: {
      file: "jonkershoek.webp",
      credit: "KodachromeFan",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Jonkershoek_Valley_Twin_Peaks.jpg",
    },
    name: "Jonkershoek",
    cityId: "stellenbosch",
    landmarkLabel: "Jonkershoek",
    kind: "site",
    what:
      "The valley south-east of the town, about 11,000 hectares, now a CapeNature reserve. It takes its name from Jan Andriessen, known as Jan de Jonkheer, who held the original grant. In 1817 Lord Charles Somerset granted the land to Wouter Eduard Wium on condition that he plant oaks, and the great oaks there are the result.",
    sources: "CapeNature, Jonkershoek Nature Reserve.",
  },

  // ── Gauteng ────────────────────────────────────────────────────────────────────────────────────
  {
    id: "constitution-hill",
    image: {
      file: "constitution-hill.webp",
      credit: "Mihi tr",
      licence: "CC BY 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Eternal_Flame_on_Constitution_Hill_in_Johannesburg.JPG",
    },
    name: "Constitution Hill",
    cityId: "johannesburg",
    landmarkLabel: "Constitution Hill",
    kind: "site",
    what:
      "A prison complex that became the home of the Constitutional Court. Three prisons stand here: the Old Fort of 1893, where white men were held; Number Four, the \"Natives' Gaol\", built in 1904; and the Women's Gaol of 1910. Those detained here include Mahatma Gandhi, Nelson Mandela, Winnie Madikizela-Mandela, Albertina Sisulu and Fatima Meer. It opened as a museum in 2004.",
    sources:
      "Constitution Hill, The history of Constitution Hill (constitutionhill.org.za) · South African History Online.",
  },
  {
    id: "apartheid-museum",
    image: {
      file: "apartheid-museum.webp",
      credit: "NJR ZA",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:South_Africa-Johannesburg-Apartheid_Museum001.jpg",
    },
    name: "Apartheid Museum",
    cityId: "johannesburg",
    landmarkLabel: "Apartheid Museum",
    kind: "museum",
    what:
      "Opened in 2001, the first institution in the world built specifically to document apartheid. Twenty-two exhibition areas trace the rise and fall of the system between 1948 and 1994. It was built as a condition of the 1995 casino-licence bid for the adjacent Gold Reef City, and funded by it.",
    sources:
      "Apartheid Museum, About Us · South African History Online. Sources disagree on whether it opened in March or November 2001, so no month is claimed here.",
  },
  {
    id: "vilakazi-street",
    image: {
      file: "vilakazi-street.webp",
      credit: "Nagarjun Kandukuru",
      licence: "CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Homes_on_Mandela%27s_Vilakazi_street.jpg",
    },
    name: "Vilakazi Street",
    cityId: "soweto",
    landmarkLabel: "Vilakazi Street",
    kind: "street",
    what:
      "The street in Orlando West where Nelson Mandela lived from 1946, at number 8115. It is named after Benedict Wallet Vilakazi, the Zulu poet, the first Black South African to earn a PhD, and the author of Inkondlo kaZulu (1935) — the first collection of Western-influenced poetry published in Zulu, and one of the works this app is built on. South African Tourism and Mandela House describe it as the only street in the world to have housed two Nobel laureates, Mandela and Archbishop Desmond Tutu.",
    sources:
      "Encyclopaedia Britannica, Benedict Wallet Vilakazi · University of the Witwatersrand, The last word: Benedict Vilakazi (2022) · Mandela House (Soweto Heritage Trust), About. The \"only street in the world\" claim is attributed above rather than asserted: it is published by South African Tourism, Brand South Africa and Mandela House, but no source demonstrates it.",
  },
  {
    id: "hector-pieterson-memorial",
    image: {
      file: "hector-pieterson-memorial.webp",
      credit: "Albinfo (original uploader, German Wikipedia)",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Hector_Pieterson_Memorial.jpg",
    },
    name: "Hector Pieterson Memorial & Museum",
    cityId: "soweto",
    alsoListedIn: ["johannesburg"],
    landmarkLabel: "Hector Pieterson Memorial",
    kind: "museum",
    what:
      "The memorial and museum in Orlando West commemorating the schoolchildren killed when police opened fire on the march of 16 June 1976. It is named for Hector Pieterson, the twelve-year-old whose death that day was carried around the world in Sam Nzima's photograph. The museum opened on 16 June 2002, near the place he was shot.",
    sources:
      "South African History Online, Hector Pieterson Memorial and Museum, Soweto — 8288 Khumalo Street, Orlando West; opened 16 June 2002; the surrounding area declared a National Heritage Site.",
  },
  {
    id: "mandela-house",
    image: {
      file: "mandela-house.webp",
      credit: "Richard Matthews",
      licence: "CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Mandela_House_8115.jpg",
    },
    name: "Mandela House",
    cityId: "soweto",
    alsoListedIn: ["johannesburg"],
    landmarkLabel: "Mandela House",
    kind: "museum",
    what:
      "The four-roomed house at 8115 Vilakazi Street, on the corner of Ngakane Street, where Nelson Mandela lived from 1946. He gave it to the Soweto Heritage Trust in 1997 to be run as a museum, and it was awarded heritage status on 16 March 1999. On his release he described it as the centre point of his world.",
    sources:
      "Mandela House (Soweto Heritage Trust), About — the institution's own record: 8115 Orlando West, corner of Vilakazi and Ngakane Streets; heritage status 16 March 1999.",
  },
  {
    id: "regina-mundi-church",
    image: {
      file: "regina-mundi-church.webp",
      credit: "Moongateclimber (attributed on Wikimedia Commons)",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Regina_mundi_church,_soweto.JPG",
    },
    name: "Regina Mundi Church",
    cityId: "soweto",
    landmarkLabel: "Regina Mundi Church",
    kind: "church",
    what:
      "The largest Catholic church in South Africa, in Rockville. During apartheid it opened its doors to anti-apartheid meetings and sheltered activists, and became known as the people's church. When police fired on students in Orlando West on 16 June 1976, many fled here; police followed them inside and fired, and the marks remain. In 1997 President Mandela declared 30 November Regina Mundi Day.",
    sources:
      "South African History Online, Regina Mundi, Catholic Church, Soweto. No founding date is given here on purpose: sources conflict (1960 groundbreaking / 1962 completed versus 1964), and resolving it needs the parish's or archdiocese's own record.",
  },

  // ── Northern Cape ──────────────────────────────────────────────────────────────────────────────
  {
    id: "the-big-hole",
    image: {
      file: "the-big-hole.webp",
      credit: "Rudolph Botha",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Big_Hole_Kimberley.jpg",
    },
    name: "The Big Hole",
    cityId: "kimberley",
    landmarkLabel: "The Big Hole",
    kind: "site",
    what:
      "The largest hand-dug excavation in the world, dug out of what had been a flat-topped hill by the thousands of prospectors who descended on Kimberley when diamonds were found there.",
    sources: "The Big Hole, thebighole.co.za — the site's own record.",
  },
  {
    id: "sol-plaatje-house",
    name: "Sol Plaatje House",
    cityId: "kimberley",
    landmarkLabel: "Sol Plaatje House",
    kind: "museum",
    what:
      "The house on Angel Street bought for Sol Plaatje's family by the Plaatje Jubilee Fund in 1927. He lived there until his death in 1932 and his widow until 1942. It is now a museum and a library of African literature. Plaatje wrote Mhudi, one of the works this app is built on.",
    sources:
      "Kimberley City Portal, historical attractions record. [VERIFY] — the museum's own page would be a better source than this one.",
  },
  {
    id: "mcgregor-museum",
    image: {
      file: "mcgregor-museum.webp",
      credit: "flowcomm",
      licence: "CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:McGregor_Museum,_Kimberley_(4527868638).jpg",
    },
    name: "McGregor Museum",
    cityId: "kimberley",
    landmarkLabel: "McGregor Museum",
    kind: "museum",
    what:
      "Founded on 24 September 1907, and now the Northern Cape's principal research institute for natural and cultural history. Its branches include the Duggan-Cronin Gallery, which holds photographic and ethnographic collections made in the 1920s and 1930s.",
    sources: "McGregor Museum institutional record. [VERIFY] — wants the museum's own page.",
  },
  {
    id: "william-humphreys-art-gallery",
    name: "William Humphreys Art Gallery",
    cityId: "kimberley",
    landmarkLabel: "William Humphreys Art Gallery",
    kind: "museum",
    what:
      "Opened in 1952 and named for William Benbow Humphreys (1889–1965), who in 1948 gave the City of Kimberley most of his collection of sixteenth- and seventeenth-century Dutch and Flemish Old Masters, British and French paintings and antique furniture. South African works assembled by the Kimberley Athenaeum, and the Max Greenberg Bequest, form the rest of the core collection.",
    sources: "William Humphreys Art Gallery record · South African Tourism. [VERIFY] — wants the gallery's own page.",
  },

  // ── Eastern Cape ───────────────────────────────────────────────────────────────────────────────
  {
    id: "donkin-reserve",
    image: {
      file: "donkin-reserve.webp",
      credit: "Portiatn",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Donkin_Reserve,_Port_Elizabeth.JPG",
    },
    name: "Donkin Reserve & Lighthouse",
    cityId: "gqeberha",
    landmarkLabel: "Donkin Reserve & lighthouse",
    kind: "monument",
    what:
      "The reserve above the city, holding the stone pyramid Sir Rufane Donkin raised to his wife Elizabeth — after whom Port Elizabeth was named — and the lighthouse of 1861, which now houses the city's tourist information centre.",
    sources: "City of Gqeberha, The Donkin Reserve · Nelson Mandela Bay Tourism.",
  },
  {
    id: "route-67",
    image: {
      file: "route-67.webp",
      credit: "Suzi-k",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Port_Elizabeth_Nelson_Mandela_quote_in_St_Marys_terrace.JPG",
    },
    name: "Route 67",
    cityId: "gqeberha",
    landmarkLabel: "Route 67",
    kind: "route",
    what:
      "Sixty-seven public artworks, and sixty-seven steps, marking Nelson Mandela's sixty-seven years of public work. The trail runs from the Donkin Reserve through the old town.",
    sources: "Nelson Mandela Bay Tourism, Route 67 · South African Tourism.",
  },
  {
    id: "algoa-bay",
    name: "Algoa Bay",
    cityId: "gqeberha",
    landmarkLabel: "Algoa Bay",
    kind: "site",
    what:
      "The bay where the British settlers landed: between December 1819 and April 1820 twenty-one vessels carried roughly 4,000 of them here, the first, the Chapman, on 10 April 1820. Its warm shallow water is also a calving ground for southern right whales and a nursery for humpback calves, and it was designated a Whale Heritage Area in June 2021.",
    sources:
      "Nelson Mandela Bay Tourism, Historical Port Elizabeth · Wildlife Heritage Areas, Algoa Bay Whale Heritage Area (2021).",
  },
  {
    id: "st-georges-park",
    image: {
      file: "st-georges-park.webp",
      credit: "PaddyBriggs (original uploader, English Wikipedia)",
      licence: "Public domain",
      source: "https://commons.wikimedia.org/wiki/File:Sahara_Oval_St_George%27s,_uploaded_2005.jpg",
    },
    name: "St George's Park",
    cityId: "gqeberha",
    landmarkLabel: "St George's Park",
    kind: "site",
    what:
      "Established in 1859, the oldest park in the city. Its cricket ground came into use in 1889 and hosted South Africa's first Test match in March that year. The club it serves, formally constituted in 1843, is among the oldest in the country.",
    sources: "St George's Park history (Nelson Mandela University) · International Cricket Council. [VERIFY]",
  },
  {
    id: "nelson-mandela-museum",
    image: {
      file: "nelson-mandela-museum.webp",
      credit: "Xufanc",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Mthatha-NMM1813.JPG",
    },
    name: "Nelson Mandela Museum",
    cityId: "mthatha",
    landmarkLabel: "Nelson Mandela Museum",
    kind: "museum",
    what:
      "A museum across three sites: the Bhunga Building in Mthatha, the Youth and Heritage Centre at Qunu where Mandela grew up, and an open-air museum at Mvezo where he was born. The Bhunga Building holds an exhibition tracing his life largely in his own words.",
    sources: "Department of Sport, Arts and Culture, Nelson Mandela Museum.",
  },
  {
    id: "mvezo",
    name: "Mvezo",
    cityId: "mthatha",
    landmarkLabel: "Mvezo",
    kind: "site",
    what:
      "The village on the plateau above the Mbashe River where Nelson Mandela was born on 18 July 1918, and where his umbilical cord is buried in Xhosa tradition. His father was stripped of his chieftaincy by the colonial administration while Mandela was an infant, and the family left.",
    sources: "Department of Sport, Arts and Culture, Nelson Mandela Museum — Mvezo is one of its three sites.",
  },
  {
    id: "qunu",
    image: {
      file: "qunu.webp",
      credit: "Salym Fayad",
      licence: "CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Qunu,_South_Africa.jpg",
    },
    name: "Qunu",
    cityId: "mthatha",
    landmarkLabel: "Qunu",
    kind: "site",
    what:
      "Where Mandela's mother took the family after his father's death, and where he spent the childhood he later described as the happiest part of his life. It is where he chose to be buried.",
    sources: "Department of Sport, Arts and Culture, Nelson Mandela Museum — Qunu is one of its three sites.",
  },
  {
    id: "egazini",
    name: "Egazini",
    cityId: "makhanda",
    landmarkLabel: "Egazini",
    kind: "monument",
    what:
      "A memorial to the Xhosa who died in the Frontier Wars fought around the town — the counterweight to the settler monument on the hill above it.",
    sources:
      "Makhanda heritage records. [VERIFY] — this memorial in particular deserves a heritage-authority source, and I have not found one.",
  },
  {
    id: "1820-settlers-monument",
    name: "1820 Settlers Monument",
    cityId: "makhanda",
    landmarkLabel: "the 1820 Settlers Monument",
    kind: "monument",
    what:
      "Opened on 13 July 1974 to commemorate the roughly 4,000 English-speaking settlers who arrived in the Eastern Cape in 1820. The idea was first put forward by Sir George Cory in 1920.",
    sources: "ESAT (Stellenbosch University), 1820 Settlers Monument.",
  },
  {
    id: "cathedral-of-st-michael-and-st-george",
    image: {
      file: "cathedral-of-st-michael-and-st-george.webp",
      credit: "Tim Giddings (English Wikipedia)",
      licence: "Public domain",
      source: "https://commons.wikimedia.org/wiki/File:Grahamstown_Cathedral.JPG",
    },
    name: "Cathedral of St Michael & St George",
    cityId: "makhanda",
    landmarkLabel: "Cathedral of St Michael & St George",
    kind: "church",
    what:
      "Begun in 1824 and completed 128 years later, in 1952. Its belfry holds the first full ring of eight bells on the continent.",
    sources: "Makhanda architectural and cultural heritage records. [VERIFY]",
  },

  // ── KwaZulu-Natal ──────────────────────────────────────────────────────────────────────────────
  {
    id: "phoenix-settlement",
    name: "Phoenix Settlement",
    cityId: "durban",
    landmarkLabel: "Phoenix Settlement (Gandhi)",
    kind: "site",
    what:
      "The community Gandhi founded on farmland outside Durban in 1904 — homes, a clinic, a school, and the printing press he moved there that year. He and his family lived there until he returned to India in 1914. It was declared a national heritage site in 2020.",
    sources:
      "South African History Online, Phoenix Settlement and Gandhi Trail · Durban University of Technology, Phoenix Settlement recognised as a national heritage site (2020).",
  },
  {
    id: "victoria-street-market",
    name: "Victoria Street Market",
    cityId: "durban",
    landmarkLabel: "Victoria Street Market",
    kind: "site",
    what:
      "Indian indentured labourers and market gardeners traded along Victoria Street between 1860 and 1910 — some two thousand of them, mostly selling vegetables from carts. The municipality allocated the ground and established a market in 1910 to house them. It burned down in 1973, in circumstances some traders believed suspicious, and they were moved to a hall alongside the African Market. The present market was rebuilt on the original site and reopened in July 1990.",
    sources:
      "Victoria Street Market, History · Goolam Vahed, The Victoria Street Early Morning Squatters Market, 1910– (via South African History Online) — a published academic history.",
  },
  {
    id: "moses-mabhida-stadium",
    name: "Moses Mabhida Stadium",
    cityId: "durban",
    landmarkLabel: "Moses Mabhida Stadium",
    kind: "site",
    what:
      "Opened in 2009 for the FIFA World Cup, seating about 56,000, and named for Moses Mabhida, a former General Secretary of the South African Communist Party.",
    sources: "South African History Online, Moses Mabhida Stadium.",
  },
  {
    id: "pietermaritzburg-station",
    name: "The Gandhi Statue & Station",
    cityId: "pietermaritzburg",
    landmarkLabel: "the Gandhi statue & station",
    kind: "site",
    what:
      "On 7 June 1893 Gandhi, a young lawyer newly arrived from India, was thrown off a first-class carriage at this station for refusing to move to third class. He later described the night he spent in the waiting room as the turning point that began his philosophy of non-violent resistance. A statue in the city commemorates him.",
    sources:
      "Pietermaritzburg Gandhi Foundation, History · South African History Online, Pietermaritzburg. Note: provinces.ts lists the statue and the station as one string; they are two sites, and the station carries the history.",
  },
  {
    id: "pmb-city-hall",
    image: {
      file: "pmb-city-hall.webp",
      credit: "Johan Pretorius",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Pietermaritzburg_City_Hall.JPG",
    },
    name: "City Hall",
    cityId: "pietermaritzburg",
    landmarkLabel: "City Hall (red-brick)",
    kind: "monument",
    what: "The red-brick city hall, opened in 1900, with a clock tower 47 metres high.",
    sources:
      "Pietermaritzburg heritage records. [VERIFY] — the widely repeated claim that it is the largest brick building in the southern hemisphere is deliberately omitted: it is published everywhere and evidenced nowhere.",
  },
  {
    id: "tatham-art-gallery",
    name: "Tatham Art Gallery",
    cityId: "pietermaritzburg",
    landmarkLabel: "Tatham Art Gallery",
    kind: "museum",
    what:
      "Founded in 1903 through Ada Susan Tatham's fundraising and housed in the old Supreme Court building. Until 1923 it held British painting; between 1923 and 1926 Colonel Robert Whitwell gave more than four hundred works, including Impressionist and Post-Impressionist pieces. From 1983 it began acquiring work by contemporary Black South African artists and ceramists, and it now holds southern African ceramics, beadwork, basketry and carving alongside a strong KwaZulu-Natal focus.",
    sources: "Tatham Art Gallery collection history. [VERIFY] — wants the gallery's own page.",
  },
  {
    id: "ondini",
    name: "oNdini Royal Homestead",
    cityId: "ulundi",
    landmarkLabel: "oNdini royal homestead (reconstructed)",
    kind: "site",
    what:
      "King Cetshwayo's capital, burned by the British in 1879 after the Battle of Ulundi. The royal enclosure has been reconstructed, and the site is the headquarters of Amafa AkwaZulu Natali, the provincial heritage body.",
    sources: "Battlefields Route, Ondini Cultural Museum and site of King Cetshwayo's Royal Residence. [VERIFY] — should cite Amafa directly.",
  },
  {
    id: "emakhosini",
    image: {
      file: "emakhosini.webp",
      credit: "JMK",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Gees_van_eMakhosini-monument,_eMakhosini.jpg",
    },
    name: "Emakhosini",
    cityId: "ulundi",
    landmarkLabel: "Emakhosini — the valley of the kings",
    kind: "site",
    what:
      "The valley holding the graves and royal capitals of seven Zulu kings, officially the eMakhosini Ophathe Heritage Park.",
    sources: "Battlefields Route, eMakhosini Opathe Heritage Park. [VERIFY]",
  },
  {
    id: "ulundi-battlefield",
    name: "Ulundi Battlefield",
    cityId: "ulundi",
    landmarkLabel: "the Ulundi battlefield",
    kind: "site",
    what:
      "Where the Anglo-Zulu War ended on 4 July 1879. Lord Chelmsford crossed the White Mfolozi and formed square on the Mahlabatini plain within sight of the king's capital; a Zulu army of between 15,000 and 20,000 attacked to within thirty metres of the square before being driven back with heavy losses.",
    sources: "Battlefields Route, Ulundi Battlefield. [VERIFY]",
  },

  // ── Free State ─────────────────────────────────────────────────────────────────────────────────
  {
    id: "waaihoek-wesleyan-church",
    image: {
      file: "waaihoek-wesleyan-church.webp",
      credit: "KeMang??",
      licence: "CC0",
      source: "https://commons.wikimedia.org/wiki/File:Waaihoek_Wesleyan_Church_01.jpg",
    },
    name: "Waaihoek Wesleyan Church",
    cityId: "bloemfontein",
    landmarkLabel: "Waaihoek (ANC founding site)",
    kind: "church",
    what:
      "The Wesleyan Methodist school church in Waaihoek where the South African Native National Congress — renamed the African National Congress in 1923 — was founded on 8 January 1912. The four-day meeting was convened by the thirty-year-old Pixley ka Isaka Seme and drew more than sixty delegates from across the country. It was declared a national heritage site in 2018.",
    sources:
      "SAHRA, Waaihoek Wesleyan Mission Church · Free State Department of Sport, Arts, Culture and Recreation, Wesleyan Church Museum.",
  },
  {
    id: "naval-hill",
    image: {
      file: "naval-hill.webp",
      credit: "Graham Maclachlan",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Naval_Hill,_Bloemfontein,_9301,_South_Africa_-_panoramio.jpg",
    },
    name: "Naval Hill",
    cityId: "bloemfontein",
    landmarkLabel: "Naval Hill & Nelson Mandela statue",
    kind: "monument",
    what:
      "The hill above the city, carrying the Nelson Mandela statue — which faces the Waaihoek church where the ANC was founded in 1912.",
    sources: "South African History Online, Naval Hill.",
  },
  {
    id: "national-womens-memorial",
    image: {
      file: "national-womens-memorial.webp",
      credit: "Linton Brothers (historic photograph)",
      licence: "Public domain",
      source: "https://commons.wikimedia.org/wiki/File:The_National_Womens_Memorial,_Bloemfontein_in_South_Africa.jpg",
    },
    name: "National Women's Memorial",
    cityId: "bloemfontein",
    landmarkLabel: "the National Women's Memorial",
    kind: "monument",
    what:
      "Commemorates the roughly 27,000 Boer women and children who died in British concentration camps during the South African War.",
    sources: "National Women's Monument records. [VERIFY] — wants the adjoining Anglo-Boer War Museum's own record.",
  },
  {
    id: "oliewenhuis-art-museum",
    image: {
      file: "oliewenhuis-art-museum.webp",
      credit: "Ymblanter",
      licence: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Bloemfontein_Oliewenhuis_Art_Museum_seen_from_the_south.jpg",
    },
    name: "Oliewenhuis Art Museum",
    cityId: "bloemfontein",
    landmarkLabel: "Oliewenhuis Art Museum",
    kind: "museum",
    what:
      "A mansion on Grant's Hill designed in 1935 by William Mollison of Public Works and completed in 1941. It was the Governor-General's residence from 1942, hosted King George VI and his family for three days in 1947, and became an official presidential residence after 1961. It is now the Free State's only art museum, devoted to South African artists.",
    sources: "South African History Online, Oliewenhuis Art Museum.",
  },

  // ── Limpopo ────────────────────────────────────────────────────────────────────────────────────
  {
    id: "bakone-malapa",
    name: "Bakone Malapa Open-Air Museum",
    cityId: "polokwane",
    landmarkLabel: "the Bakone Malapa open-air museum",
    kind: "museum",
    what:
      "An open-air museum of Northern Sotho life. The name comes from Bakone ba Matlala a' Thaba, the clan who lived here in the 17th century, and malapa, the Northern Sotho word for homestead. Two traditional homesteads carry the exhibits, and the village is reconstructed in the style of about 250 years ago. Excavation has also found Ndebele and Shangaan occupation, and Stone Age settlement going back some 20,000 years.",
    sources:
      "South African Tourism, The Bakone Malapa Northern Sotho Open-Air Museum. [VERIFY] — wants the museum's or the municipality's own record.",
  },
  {
    id: "irish-house",
    name: "The Irish House",
    cityId: "polokwane",
    landmarkLabel: "the Irish House",
    kind: "museum",
    what:
      "A prefabricated Victorian building brought to the town in 1906 by the German immigrant Moschke, sold in 1920 to J.A. Jones, who ran it as a general dealer and gave it the name it still carries. The city council bought it in 1984 and restored it, green paint and all. It now holds displays on Limpopo's history and cultural groups, and archaeological finds from nearby sites.",
    sources: "South African History Online, Irish House, Polokwane Museum.",
  },
  {
    id: "dzata-ruins",
    name: "Dzata Ruins",
    cityId: "thohoyandou",
    landmarkLabel: "Dzata ruins",
    kind: "site",
    what:
      "The remains of the first Venda capital in South Africa, occupied around the 16th century, with stone walling in the Zimbabwe style. It lies in the Nzhelele Valley, about 40km west of Thohoyandou.",
    sources:
      "South African Tourism, Vhembe District / Greater Mapungubwe Heritage Route. [VERIFY] — wants SAHRA or the Dzata Museum's own record.",
  },

  // ── Mpumalanga ─────────────────────────────────────────────────────────────────────────────────
  {
    id: "makhonjwa-mountains",
    image: {
      file: "makhonjwa-mountains.webp",
      credit: "MaruAttwood",
      licence: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Baberton_greenstone_belt_view.jpg",
    },
    name: "Barberton Makhonjwa Mountains",
    cityId: "barberton",
    landmarkLabel: "the Makhonjwa Mountains (UNESCO)",
    kind: "site",
    what:
      "Forty per cent of the Barberton Greenstone Belt, and the best-preserved succession of volcanic and sedimentary rock from 3.6 to 3.25 billion years ago — a record of early Earth's surface, of meteorite impacts, of volcanism, and of the environment of early life. Inscribed by UNESCO in 2018, the first World Heritage site in Mpumalanga and South Africa's tenth.",
    sources: "UNESCO World Heritage Centre, Barberton Makhonjwa Mountains (inscribed 2018).",
  },
  {
    id: "eureka-city-ruins",
    name: "Eureka City Ruins",
    cityId: "barberton",
    landmarkLabel: "Eureka City ruins",
    kind: "site",
    what:
      "The remains of a gold-rush town in the mountains north-west of Barberton. At its height in the 1880s it held around 650 diggers, with two hotels, canteens and music halls, a bakery and a racecourse, serving the Sheba Reef nearby.",
    sources: "De Kaap Echo, Eureka City, Barberton's forgotten wild-west gold town. [VERIFY] — a local paper; wants a heritage record.",
  },
  {
    id: "lowveld-national-botanical-garden",
    name: "Lowveld National Botanical Garden",
    cityId: "mbombela",
    landmarkLabel: "Lowveld National Botanical Garden",
    kind: "site",
    what:
      "One of South Africa's nine national botanical gardens, at the confluence of the Crocodile and Nels rivers. It was established in 1969 and opened on 10 September 1971, and its 159 hectares hold more than 600 naturally occurring plant species. It is managed by SANBI.",
    sources: "SANBI, Lowveld National Botanical Garden.",
  },

  // ── North West ─────────────────────────────────────────────────────────────────────────────────
  {
    id: "mafikeng-museum",
    name: "Mafikeng Museum",
    cityId: "mahikeng",
    landmarkLabel: "the Mafikeng Museum",
    kind: "museum",
    what:
      "Housed in a colonial-era prison and police station and established in 1902. Its Siege Room holds artefacts and photographs of the 217-day siege, and an entire display is given to Sol T. Plaatje, the author of Mhudi, who kept a diary through that siege. The museum's emphasis on Tswana history is deliberate.",
    sources: "Mafikeng Museum institutional records. [VERIFY] — wants the museum's own page.",
  },
  {
    id: "barolong-royal-kraal",
    name: "Barolong Royal Kraal",
    cityId: "mahikeng",
    landmarkLabel: "the Barolong royal kraal",
    kind: "site",
    what:
      "The kgotla of the Barolong Boora-Tshidi. It carries monuments to the Barolong who died in the siege and to Chief Besele Montshiwa. About 400 Barolong were killed, against fewer than 200 British soldiers and town guard — and Mafikeng is the only town known to carry war monuments to the Black men and women who died in the South African War.",
    sources: "South African History Online, Mahikeng · Mahikeng Local Municipality, History.",
  },
  {
    id: "boekenhoutfontein",
    name: "Boekenhoutfontein",
    cityId: "rustenburg",
    landmarkLabel: "Kruger's farm (Boekenhoutfontein)",
    kind: "site",
    what:
      "Paul Kruger's farm, bought in 1859 and his until his death. The farmhouse was destroyed by British forces during the South African War and has since been restored; the property holds family graves, the koppie where he went to pray, and the saddle in the hills where he hid his horses. It was declared a national monument in 1971.",
    sources: "The Heritage Portal, The Kruger Houses at Boekenhoutfontein · Paul Kruger Country House Museum.",
  },
  {
    id: "magaliesberg",
    image: {
      file: "magaliesberg.webp",
      credit: "Humphrey1938",
      licence: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Magaliesberg_mountains_27.jpg",
    },
    name: "The Magaliesberg",
    cityId: "rustenburg",
    landmarkLabel: "the Magaliesberg",
    kind: "site",
    what:
      "One of the oldest mountain ranges on earth, roughly 2.3 billion years old — quartzite, shale, chert and dolomite laid down in an inland basin about two billion years ago and later tilted by the upwelling that formed the Bushveld Igneous Complex. A UNESCO biosphere reserve of 357,870 hectares where two great African biomes meet, holding 443 bird species, nearly half of all those in the subregion. It adjoins the Cradle of Humankind.",
    sources: "UNESCO Man and the Biosphere Programme, Magaliesberg.",
  },
  {
    id: "pilanesberg-national-park",
    image: {
      file: "pilanesberg-national-park.webp",
      credit: "NJR ZA",
      licence: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Pilanesberg-Lenong_view-001.jpg",
    },
    name: "Pilanesberg National Park",
    cityId: "rustenburg",
    landmarkLabel: "Pilanesberg National Park",
    kind: "site",
    what:
      "Set in the crater of a long-extinct volcano, a rare formation dated to about 1.3 billion years ago in the late Proterozoic.",
    sources: "Pilanesberg geological records. [VERIFY] — the dating is consistent across sources but I found no park or SANParks record for it.",
  },
];

export const placeById = (id: string): Place | undefined => places.find((p) => p.id === id);
