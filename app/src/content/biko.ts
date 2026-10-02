import type { Module } from "./types";

// "Steve Biko" — a life, told as a book (SP-118). Tumo, 2026-09-25: Biko should have his own
// dedicated book telling his biography, read the way every other book in this app is read.
//
// A BIOGRAPHY, NOT HIS WRITINGS. Biko's own collected writings (I Write What I Like, 1978) are very
// likely still in copyright, so nothing of his is reproduced here. Every scene is the project's own
// telling, in its own words, of facts from the references below — each scene's `sourceNote` names
// the ones it rests on (AGENTS.md §2). Researched 2026-09-25.
//
// TWO CORRECTIONS THIS RESEARCH MADE, both carried into heroes.ts: he was BORN IN TARKASTAD, at his
// grandmother's house, and grew up in Ginsberg (the hero page had Ginsberg as his birthplace); and he
// took no office in the Black People's Convention (the hero page had "helps form it [VERIFY]").
//
// PICTURES ARE OF PLACES, NEVER OF HIM. The scene images are AI interpretations of settings —
// streets, a campus, a clinic, a courtroom — and every prompt forbids people's faces. A real person
// is never given an AI face (the heroes README; the humanities-grounding rule). The real photographs
// in assets/heroes/biko/ come in only once their sources are recorded.
//
// CHILD MODE CHANGES THE WORDS, NOT THE FACTS. His death in custody is told plainly to a child:
// that police hurt him while he was locked up, and that he died. Nothing is softened into something
// that did not happen, and nothing graphic is added.
//
// NOTE(setswana): no translations yet. Every page falls back to English, labelled as such.

export const biko: Module = {
  id: "biko",
  kind: "atlas",
  title: "Steve Biko",
  author: "A life · Reclaimed Voices",
  source: "South African History Online; the TRC Amnesty Committee; Daily Maverick; and others — see references.",
  audience: "Teens & adults (Child mode for younger readers) — Black Consciousness, detention, justice",
  blurb: {
    en: "Born in Tarkastad in 1946, dead in police custody at thirty. The life of the man who taught that liberation begins in the mind — and the forty-eight years his family has waited for justice.",
  },
  archivePrompt: {
    en: "Does your family remember 1977, or Black Consciousness in your town? Add their voice to the archive.",
  },
  references: [
    "South African History Online — 'Stephen Bantu Biko' (sahistory.org.za/people/stephen-bantu-biko)",
    "Truth and Reconciliation Commission — press release 'Amnesty decision on death of Steve Biko', 16 February 1999 (justice.gov.za/trc/media/pr/1999/p990216a.htm)",
    "Daily Maverick — 'Healing demands justice, says Steve Biko's family as they welcome reopening of inquest into his death', 14 September 2025",
    "The Irish Times — 'Suspects in Biko killing will not face prosecution', October 2003",
    "M. Mokone, review of Steve Biko, I Write What I Like, ed. Aelred Stubbs (London: Bowerdean Press, 1978), Race & Class, 1979",
    "Wikipedia — 'Steve Biko' (for the 1948 move to Ginsberg, Room 619, the drive to Pretoria, and the funeral venue; each traced there to its own citation)",
  ],
  // Not built on one work: authored by the project from the references above, in its own words.
  // Biko's own writings are not reproduced.
  rights: {
    status: "original",
    basis: "Authored by the project from the cited references, in its own words; none of Steve Biko's own writings are reproduced.",
  },

  scenes: [
    {
      id: "tarkastad",
      title: { en: "Tarkastad and Ginsberg" },
      text: {
        en: "Stephen Bantu Biko was born on 18 December 1946 at his grandmother's house in Tarkastad, in what is now the Eastern Cape. His parents were Mzingaye Biko, a policeman and later a clerk, and Nokuzola Macethe Duna. In 1948 the family moved to Ginsberg, a township just outside King William's Town. His father died in 1950, when Steve was four.",
      },
      childText: {
        en: "Steve Biko was born on 18 December 1946 in a small town called Tarkastad, at his granny's house. When he was a baby, his family moved to Ginsberg, near King William's Town. His father died when Steve was only four years old.",
      },
      imagePrompt:
        "A quiet Eastern Cape township street at dawn in the late 1940s, small brick houses, dusty road, rolling hills beyond, warm light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4101,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (birth, parents, father's death); Wikipedia, 'Steve Biko' (the 1948 move to Ginsberg).",
    },
    {
      id: "lovedale",
      title: { en: "Expelled at fifteen" },
      text: {
        en: "In April 1962 he went to Lovedale College, where his elder brother Khaya was also a student. Three months later, with Khaya suspected of involvement with Poqo, the armed wing of the Pan Africanist Congress, Steve was arrested too, and expelled from Lovedale after only three months there.",
      },
      childText: {
        en: "When Steve went to high school at Lovedale College, the police suspected his big brother of working against the government. Steve was arrested too, and sent away from the school.",
      },
      imagePrompt:
        "An old stone mission college building in the Eastern Cape, 1960s, empty courtyard, overcast sky, sombre mood, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4102,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (Lovedale, April 1962; expelled after three months; Khaya and Poqo).",
    },
    {
      id: "mariannhill",
      title: { en: "Mariannhill" },
      text: {
        en: "In 1964 he enrolled at St Francis College, a Catholic boarding school at Mariannhill in Natal, and matriculated there with very good grades. At the beginning of 1966 he began studying medicine at the University of Natal Medical School — its section for Black students.",
      },
      childText: {
        en: "Steve went to a new school, St Francis College at Mariannhill, and did very well. Then he went to university to study to become a doctor.",
      },
      imagePrompt:
        "A Catholic mission school on green Natal hills in the 1960s, red roofs, a chapel tower, soft afternoon light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4103,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (St Francis College, 1964; matriculation; University of Natal Medical School, 1966).",
    },
    {
      id: "walkout",
      title: { en: "The walk-out" },
      text: {
        en: "As a student he joined the National Union of South African Students, NUSAS. At its conference at Rhodes University in July 1967, Black delegates were given separate accommodation, and Biko walked out. He began to argue that Black students had to organise for themselves rather than wait for others to speak for them.",
      },
      childText: {
        en: "At a big student meeting, the Black students were made to sleep in separate rooms from the white students. Steve walked out. He decided that Black students should start their own group and speak for themselves.",
      },
      imagePrompt:
        "An empty 1960s university lecture hall with wooden benches and tall windows, a single open door letting in light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4104,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (NUSAS; the July 1967 conference at Rhodes University and the walk-out over segregated accommodation).",
    },
    {
      id: "saso",
      title: { en: "Black Consciousness" },
      text: {
        en: "In December 1968, at Mariannhill, Biko and others founded the South African Students' Organisation, SASO, for Black students. At its founding congress at Turfloop in July 1969 he was elected its first president. Its idea came to be called Black Consciousness: that Black people had first to free their own minds from the inferiority apartheid tried to teach them.",
      },
      childText: {
        en: "Steve and his friends started a new student group called SASO, and Steve became its first president. They believed Black people should be proud of who they are, and should never believe the lie that they were less than anyone else.",
      },
      imagePrompt:
        "A small meeting room in a 1960s mission building at night, chairs arranged in a circle, papers on a table, a single lamp glowing, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4105,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (SASO founded 1–3 December 1968 at Mariannhill; founding congress July 1969 at Turfloop; first president).",
    },
    {
      id: "frank-talk",
      title: { en: "Frank Talk" },
      text: {
        en: "From 1970 he wrote a column for the SASO newsletter under the pen name Frank Talk, headed 'I Write What I Like'. In December 1970 he married Nontsikelelo 'Ntsiki' Mashalaba; their son Nkosinathi was born in 1971. After his death his writings were collected by his friend Father Aelred Stubbs and published in London in 1978 as I Write What I Like.",
      },
      childText: {
        en: "Steve wrote for a student newsletter using a secret pen name: Frank Talk. He married Ntsiki Mashalaba, and they had a son called Nkosinathi. Later his writings were collected into a book called I Write What I Like.",
      },
      imagePrompt:
        "A typewriter on a wooden desk beside stacks of cyclostyled newsletters, 1970s, warm lamplight, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4106,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (the Frank Talk column; marriage, December 1970; Nkosinathi, 1971); Mokone's 1979 review of I Write What I Like, ed. Aelred Stubbs (Bowerdean Press, 1978).",
    },
    {
      id: "zanempilo",
      title: { en: "Building, not only protesting" },
      text: {
        en: "In January 1972 he began working for the Black Community Programmes, and in August that year his medical studies ended. In December 1972 the Black People's Convention was launched at Hammanskraal, with 1,400 delegates from 145 organisations. The movement ran projects of its own: near King William's Town, the Zanempilo Clinic opened its doors in January 1975, with Dr Mamphela Ramphele among its doctors.",
      },
      childText: {
        en: "Steve and his friends didn't only protest — they built things for their communities. Near King William's Town they opened a clinic called Zanempilo, where people could see a doctor.",
      },
      imagePrompt:
        "A modest rural health clinic building in the Eastern Cape countryside, 1970s, whitewashed walls, a painted sign without words, morning light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4107,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (Black Community Programmes, January 1972; studies ended August 1972; BPC launched December 1972 at Hammanskraal; Zanempilo Clinic, January 1975); Wikipedia, 'Steve Biko' (Mamphela Ramphele at Zanempilo).",
    },
    {
      id: "banned",
      title: { en: "Banned" },
      text: {
        en: "On 3 March 1973 the government banned him. The order confined him to the magisterial district of King William's Town and was to last until 28 February 1978. In 1975 he was held for 137 days without being charged.",
      },
      childText: {
        en: "In 1973 the government 'banned' Steve. That meant he had to stay in King William's Town. In 1975 he was locked up for 137 days without being charged with any crime.",
      },
      imagePrompt:
        "A lonely small-town street in King William's Town in the 1970s, colonial-era buildings, long afternoon shadows, a closed gate, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4108,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (banning order of 3 March 1973, confined to King William's Town, in force until 28 February 1978; 137 days' detention in 1975).",
    },
    {
      id: "detention",
      title: { en: "August – September 1977" },
      text: {
        en: "On 17 August 1977 he was arrested near King William's Town, on his way back from Cape Town. He was held at Walmer police station in Port Elizabeth, then taken to the Security Police offices in the Sanlam Building, Room 619. Between the night of 6 September and the next morning he suffered a brain haemorrhage from a beating by the Security Police. On 11 September, naked and manacled in the back of a Land Rover, he was driven about 1,190 kilometres to Pretoria. He died there on 12 September 1977. He was thirty.",
      },
      childText: {
        en: "In August 1977 the police arrested Steve and locked him up in Port Elizabeth. While he was locked up, the police hurt him very badly. They drove him a very long way to Pretoria instead of caring for him, and he died there on 12 September 1977. He was only thirty years old.",
      },
      imagePrompt:
        "A long empty highway at night across the South African interior, 1970s, headlights fading into darkness, cold blue tones, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4109,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (arrest 17 August 1977; Walmer; the Sanlam Building; brain haemorrhage on the night of 6–7 September; transfer to Pretoria on 11 September; death 12 September 1977); Wikipedia, 'Steve Biko' (Room 619; the Land Rover and the 1,190 km drive).",
    },
    {
      id: "inquest",
      title: { en: "'It leaves me cold'" },
      text: {
        en: "The Minister of Justice, Jimmy Kruger, claimed Biko had been on a hunger strike, and said his death left him cold. About 20,000 people came to the funeral in King William's Town on 25 September 1977. The inquest, which began at the Old Synagogue in Pretoria on 14 November, found no positive evidence that anyone had caused his death.",
      },
      childText: {
        en: "The government told lies about how Steve died, and a court said no one was to blame. About 20,000 people came to his funeral to say goodbye and to show that they knew the truth.",
      },
      imagePrompt:
        "A packed stadium seen from a distance under a grey sky, banners and flags as abstract colour, 1970s Eastern Cape, mournful, no faces visible, cinematic, painterly, artistic interpretation, no text",
      seed: 4110,
      sourceNote:
        "South African History Online, 'Stephen Bantu Biko' (Kruger's hunger-strike claim and his words; funeral 25 September 1977, about 20,000 people; inquest from 14 November at the Old Synagogue, Pretoria, and its finding); Wikipedia, 'Steve Biko' (Victoria Stadium, King William's Town).",
    },
    {
      id: "justice",
      title: { en: "Truth, and still no trial" },
      text: {
        en: "Five former Security Police officers asked the Truth and Reconciliation Commission for amnesty for his death. All five were refused. On 16 February 1999 Harold Snyman, Daniel Siebert, Jacobus Beneke and Rubin Marx were refused because the killing was not associated with a political objective and they had not made full disclosure; the fifth, Gideon Nieuwoudt, had been refused by another panel in December 1998. In October 2003 the state said none would be prosecuted, citing too little evidence and the time that had passed. In September 2025 the inquest into his death was reopened in the Gqeberha High Court. His son Nkosinathi said the family was cautious.",
      },
      childText: {
        en: "Many years later, the policemen asked to be forgiven by the Truth and Reconciliation Commission, but they were refused — the Commission found they had not told the whole truth. Still, no one was ever put on trial. In 2025 a court began looking at Steve's death again, and his family is still waiting for justice.",
      },
      imagePrompt:
        "An empty wood-panelled courtroom with high windows, dust in slanting light, rows of empty benches, quiet and solemn, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4111,
      sourceNote:
        "TRC press release, 'Amnesty decision on death of Steve Biko', 16 February 1999 (the four officers, the date, both reasons, Nieuwoudt refused the previous December); The Irish Times, October 2003 (no prosecution); Daily Maverick, 14 September 2025 (inquest reopened in the Gqeberha High Court; Nkosinathi Biko).",
    },
  ],
};
