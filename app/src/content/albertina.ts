import type { Module } from "./types";

// "Albertina Sisulu" — a life, told as a book (SP-122). Tumo, 2026-09-29: "now do a story for
// albertina sisulu", after the Walter Sisulu book (SP-121) — the same form, the same rules.
//
// HER OWN STORY, NOT WALTER'S WIFE'S. She came to politics through her marriage, and the book says
// so, because she did. But for twenty-six years she ran the household, the underground cell and the women's
// movement alone, was the first woman detained under the 90-day law, was banned for seventeen years,
// became a founding co-president of the UDF and was the only woman among the sixteen accused of
// treason in 1985. The book is built on those facts, not on his.
//
// THE HARDEST PAGE: DR ASVAT AND THE TRUTH COMMISSION. She worked beside Dr Abu Baker Asvat, who was
// shot at his surgery on 27 January 1989 and died in her presence. Winnie Madikizela-Mandela and her
// football club long faced rumours of having arranged the killing (see winnie.ts). At the TRC in
// December 1997 a commissioner accused Albertina of shielding Madikizela-Mandela; three days later
// evidence confirmed her account and he told her she was vindicated. The book tells it in that order,
// in the sources' own terms. It does NOT say who killed Asvat or why — the sources report rumour and
// accusation, and so does the book, labelled as such.
//
// A BIOGRAPHY, NOT HER WORDS. Elinor Sisulu's *Walter and Albertina Sisulu: In Our Lifetime* (2002) is
// in copyright and nothing of it is reproduced. Short quotations — Lembede's warning, her words at the
// TRC and to the press, "two chickens" — are as the cited sources carry them.
//
// NO HERO PAGE. She has no page of her own, so the book is reached from the Atlas, and from
// Constitution Hill's place page, whose prose names her (the topic scanner links it).
//
// WHERE SOURCES DISAGREE, THE BOOK SAYS LESS OR TAKES THE CHECKABLE FIGURE:
//   · Birthplace — SAHO gives the Tsomo district, Wikipedia the village of Camama within it: both.
//   · Joining the ANC Women's League — SAHO implies 1948, Wikipedia (citing Pippa Green) 1946: no year.
//   · Years banned — SAHO says 18, "the longest any person in South Africa had been banned";
//     Wikipedia 17. Her first order was served in 1964 and the fourth lapsed in 1981: seventeen, and
//     the superlative is left out.
//   · The wedding — SAHO's two biographies place it at Cofimvaba and at the Bantu Men's Social Centre;
//     Wikipedia has a civil ceremony at Cofimvaba and a reception after. The book gives the date only.
//   · SAHO misdates the Rivonia sentences to 1963; they were passed on 12 June 1964.
//   · The outcome of the appeal against her 1984 conviction is in neither source: not stated.
//
// PICTURES ARE OF PLACES, NEVER OF HER. AI interpretations of settings, every prompt forbidding faces.
//
// CHILD MODE CHANGES THE WORDS, NOT THE FACTS — including Dr Asvat's killing.
//
// NOTE(setswana): no translations yet. Every page falls back to English, labelled as such.

export const albertina: Module = {
  id: "albertina",
  kind: "atlas",
  title: "Albertina Sisulu",
  author: "A life · Reclaimed Voices",
  source: "South African History Online, 'Albertina Nontsikelelo Sisulu'; and others — see references.",
  audience: "Teens & adults (Child mode for younger readers) — nursing, the women's movement, banning and detention",
  blurb: {
    en: "A girl from Tsomo who nursed her siblings through her mother's illness, trained as a nurse and midwife, and — while her husband spent twenty-six years in prison — kept a family, an underground and a women's movement alive. The first woman detained under the 90-day law; a founding president of the UDF; Ma Sisulu. Her life, told as her own.",
  },
  archivePrompt: {
    en: "Was a woman in your family at the Union Buildings on 9 August 1956, or a nurse or midwife in the townships? Add her story to the archive.",
  },
  references: [
    "South African History Online — 'Albertina Nontsikelelo Sisulu' (sahistory.org.za/people/albertina-nontsikelelo-sisulu)",
    "South African History Online — 'Walter Ulyate Sisulu' (ref. B-0065415), for the marriage",
    "Wikipedia — 'Albertina Sisulu' (for Camama, her father's death, the 90-day detention date, the banning years, the UDF launch, Dr Asvat and his killing, the 1985 trial, the 1989 tour, the nomination of Mandela, her TRC testimony, her words to the press, her death and funeral; each traced there to its own citation)",
  ],
  // Not built on one work: authored by the project from the references above, in its own words.
  rights: {
    status: "original",
    basis: "Authored by the project from the cited references, in its own words; Elinor Sisulu's biography is not reproduced. Short quotations are as the cited sources carry them.",
  },

  scenes: [
    {
      id: "camama",
      title: { en: "Nontsikelelo" },
      text: {
        en: "Nontsikelelo Thethiwe was born on 21 October 1918 in Camama, a village in the Tsomo district of the Transkei, as the Spanish flu swept the country. Her mother caught it while pregnant with her and never fully recovered; her father worked in the gold mines and died of lung disease in 1929. As the eldest daughter she became the caregiver of her younger brothers and sisters, and kept being called out of school to look after them. At the Presbyterian mission school in Xolobe, told to choose a Christian name from the missionaries' list, she chose Albertina.",
      },
      childText: {
        en: "Albertina was born on 21 October 1918 in a village in the Eastern Cape. Her mother was often sick, and her father died when she was a child, so Albertina looked after her younger brothers and sisters. At school she chose a new name from a list: Albertina.",
      },
      imagePrompt:
        "A village in the Tsomo hills of the Transkei in the 1920s, rondavels among mealie fields, a small mission school on a rise, soft morning light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4501,
      sourceNote:
        "South African History Online, 'Albertina Nontsikelelo Sisulu' (born 21 October 1918, Tsomo district; the Spanish flu and her mother's illness; caregiver to her siblings; Xolobe; choosing the name Albertina); Wikipedia, 'Albertina Sisulu' (the village of Camama; her father a migrant mineworker who died of occupational lung disease in 1929).",
    },
    {
      id: "mariazell",
      title: { en: "The scholarship" },
      text: {
        en: "Held back two years by caring for her family, she won a scholarship competition and was then disqualified for her age. Her teachers wrote to the isiXhosa newspaper Imvo Zabantsundu to argue her case; the article reached the Catholic mission, and a four-year scholarship was found for her at Mariazell College in Matatiele. From 1936 she paid her board by ploughing fields and working in the laundry in the holidays. She wanted to become a nun, but Father Bernard Huss pointed out that nuns earned nothing and could not support a family — and trainee nurses were paid.",
      },
      childText: {
        en: "Albertina won a prize to go to high school, but was told she was too old. Her teachers wrote to a newspaper, and a college gave her a place. She worked in the fields and the laundry to pay for it. Then she decided to become a nurse, so she could earn money for her family.",
      },
      imagePrompt:
        "A Catholic mission college in the foothills near Matatiele in the late 1930s, a stone chapel and long dormitory buildings, ploughed fields in the foreground, early dawn, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4502,
      sourceNote:
        "South African History Online, 'Albertina Nontsikelelo Sisulu' (two years behind; disqualified for age; her teachers' letter to Imvo Zabantsundu; the Mariazell College scholarship from 1936; ploughing and laundry work; Father Bernard Huss's advice to choose nursing because trainees were paid).",
    },
    {
      id: "the-nurse",
      title: { en: "The nurse" },
      text: {
        en: "In January 1940 she began training at the 'Non-European' section of Johannesburg General Hospital. There she met racism for the first time. Six months in, after a terrible accident at Park Station, the hospital refused to let Black patients into the empty European wards, and seriously injured people were left to lie on the floor. In 1941 she was refused leave to go home to her mother's funeral.",
      },
      childText: {
        en: "In 1940 Albertina went to Johannesburg to train as a nurse. At the hospital she saw Black patients made to lie on the floor, because the beds in the 'white' wards were not allowed to be used for them. It made her angry, and she never forgot it.",
      },
      imagePrompt:
        "A long hospital ward in Johannesburg in 1940, iron beds in rows, tall windows and a polished floor, harsh overhead light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4503,
      sourceNote:
        "South African History Online, 'Albertina Nontsikelelo Sisulu' (training from January 1940 at Johannesburg General's 'Non-European' section; her first experience of racism; the Park Station accident and patients left on the floor; refused leave for her mother's funeral in 1941).",
    },
    {
      id: "married-to-the-nation",
      title: { en: "Married to the nation" },
      text: {
        en: "In 1941 she met Walter Sisulu, and in 1944 she qualified as a nurse and married him, on 15 July, with Nelson Mandela as best man and Evelyn Mase as a bridesmaid. At the reception Anton Lembede told her: \"You are marrying a man who is already married to the nation.\" By her own account she had no political ideas until she met Walter. That year she was the only woman at the founding conference of the Youth League's Transvaal branches — and when Walter gave up his work for the ANC, her nurse's wage kept the family.",
      },
      childText: {
        en: "In 1944 Albertina married Walter Sisulu, a leader of the ANC. A friend warned her that Walter was 'married to the nation'. Walter worked for the ANC full-time, so Albertina's nursing pay fed the whole family.",
      },
      imagePrompt:
        "A small four-roomed house in Orlando West, Soweto, in the 1940s, a neat yard and a washing line, a paraffin lamp in the window at dusk, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4504,
      sourceNote:
        "South African History Online, 'Albertina Nontsikelelo Sisulu' (met Walter in 1941; qualified and married in 1944; Mandela and Evelyn as best man and bridesmaid; the only woman at the Youth League's inaugural conference; sole breadwinner); Wikipedia, 'Albertina Sisulu' (15 July 1944; Lembede's words; 'I had no political ideas... until I met Walter').",
    },
    {
      id: "the-march",
      title: { en: "9 August 1956" },
      text: {
        en: "She joined the ANC Women's League and, in the 1950s, the Federation of South African Women. She qualified as a midwife in 1954 and walked to her patients across the townships with her equipment in a suitcase on her head — and Federation pamphlets inside it. When the ANC boycotted Bantu Education in 1955, her home became an alternative school. On 9 August 1956 she was at Phefeni station at two in the morning, buying and handing out train tickets, so that women could get past the police to Pretoria. Some 20,000 women stood in silence at the Union Buildings.",
      },
      childText: {
        en: "Albertina became a midwife, walking from house to house to help mothers have their babies. On 9 August 1956 she got up in the middle of the night to hand out train tickets, so that thousands of women could march to the Union Buildings against the pass laws.",
      },
      imagePrompt:
        "A township railway station platform before dawn in 1956, a single lamp, an empty ticket window, a train waiting in the dark, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4505,
      sourceNote:
        "South African History Online, 'Albertina Nontsikelelo Sisulu' (the Women's League and FEDSAW; midwife from 1954, walking to patients with her suitcase on her head and FEDSAW pamphlets; her home an alternative school in the 1955 boycott; Phefeni station at 2am on 9 August 1956; about 20,000 women at the Union Buildings).",
    },
    {
      id: "the-cell",
      title: { en: "In the cell, 1958" },
      text: {
        en: "In 1958, when the pass laws were extended to women, she was among more than 2,000 women jailed for protesting. In the cell she nursed a young Winnie Mandela through the near-loss of her first child. After three weeks awaiting trial the women were acquitted, with Nelson Mandela as their lawyer.",
      },
      childText: {
        en: "In 1958 Albertina was put in prison with many other women for protesting against the pass laws. In the prison cell she used her nursing skills to look after Winnie Mandela, who was going to have a baby. The women were all set free.",
      },
      imagePrompt:
        "A crowded prison cell for women in 1958, rough blankets folded on a concrete floor, a barred window high in the wall, a thin shaft of light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4506,
      sourceNote:
        "South African History Online, 'Albertina Nontsikelelo Sisulu' (over 2,000 women jailed in 1958, including her; three weeks awaiting trial; Mandela as their lawyer; all acquitted); Wikipedia, 'Albertina Sisulu' (arrested with Madikizela-Mandela in 1958, she nursed her through the near-miscarriage of her first child in a jail cell).",
    },
    {
      id: "ninety-days",
      title: { en: "Ninety days" },
      text: {
        en: "When Walter went underground in 1963, the police came for her instead. On 19 June 1963 she became the first woman detained under the new 90-day law, which let the police hold people without charge; her son Zwelakhe was arrested too. She was held in solitary confinement for almost two months, and was made to believe her children were ill and Walter was dead. A year later, on 12 June 1964, Walter was sentenced to life. Outside the court in Pretoria, the women sang 'Nkosi Sikelel' iAfrika'.",
      },
      childText: {
        en: "When Walter went into hiding in 1963, the police locked Albertina up alone for almost two months, to try to find him. They told her lies to frighten her. The next year Walter was sent to prison for life, and Albertina had to raise their children on her own.",
      },
      imagePrompt:
        "Church Square in Pretoria on a grey winter day in 1964, the old court building and bare trees, pigeons on the empty paving, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4507,
      sourceNote:
        "Wikipedia, 'Albertina Sisulu' (19 June 1963, the first woman detained under the 90-Day Detention Law); South African History Online, 'Albertina Nontsikelelo Sisulu' (arrested with Zwelakhe; almost two months in solitary; told her children were ill and Walter dead; the women singing in Church Square). SAHO dates the Rivonia sentences to 1963; they were passed on 12 June 1964 (SAHO, 'Walter Ulyate Sisulu').",
    },
    {
      id: "gardens-and-worms",
      title: { en: "Gardens and worms" },
      text: {
        en: "In August 1964 she was served with her first banning order, and she stayed banned, without a break, for seventeen years. To visit Walter on Robben Island she had to apply for the passbook she had marched against. She sewed dresses, knitted and resold eggs to keep her children at school in Swaziland rather than in Bantu Education. And she built an underground cell with John Nkadimeng, meeting contacts at her clinic disguised as patients. Her letters to Walter spoke in code: the 'gardens' were the underground, the 'worms' that ate them were informers.",
      },
      childText: {
        en: "For seventeen years the government 'banned' Albertina, so she could not go to meetings. She sewed and sold eggs to pay for her children's schooling. In secret she kept helping the ANC, and she wrote letters to Walter in a code about 'gardens' and 'worms' that the prison guards could not understand.",
      },
      imagePrompt:
        "A small township vegetable garden behind a house in the 1960s, rows of spinach and mealies, a watering can, a sewing machine visible through an open back door, afternoon light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4508,
      sourceNote:
        "Wikipedia, 'Albertina Sisulu' (first banning order August 1964; banned continuously for 17 years until the fourth order lapsed in August 1981; sewing, knitting and reselling eggs for school fees in Swaziland); South African History Online, 'Albertina Nontsikelelo Sisulu' (the passbook to visit Robben Island; the underground cell with John Nkadimeng and contacts posing as patients; the coded letters of 1965 and 1968). SAHO says 18 years and 'the longest any person in South Africa had been banned'; neither is repeated here.",
    },
    {
      id: "mother-of-the-nation",
      title: { en: "President of the UDF" },
      text: {
        en: "On 5 August 1983, as the United Democratic Front prepared to launch, she was arrested at work and charged with furthering the aims of the ANC, over a tribute she had given at a comrade's funeral. From her cell in Diepkloof she was elected, in absentia, one of the UDF's three national co-presidents at its launch in Mitchell's Plain on 20 August, and a UDF leader called her the 'mother of the nation'. On 24 February 1984 she was sentenced to four years, two suspended. In February 1985 she was arrested again, and was the only woman among sixteen UDF and union leaders charged with treason. On 9 December 1985 the charges against her were dropped. 'A crushing victory for us,' she said.",
      },
      childText: {
        en: "In 1983 Albertina was chosen as one of the three leaders of a huge new movement, the United Democratic Front — while she was in prison! People began to call her the 'mother of the nation'. In 1985 she was put on trial for treason, the only woman among sixteen leaders, but the charges against her were dropped.",
      },
      imagePrompt:
        "A community hall in Mitchell's Plain in 1983, a stage hung with banners in blurred colours, rows of empty chairs, the Cape Flats sky through high windows, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4509,
      sourceNote:
        "Wikipedia, 'Albertina Sisulu' (arrested 5 August 1983 over Rose Mbele's funeral; elected in absentia a national co-president at the Mitchell's Plain launch on 20 August; sentenced 24 February 1984; arrested 19 February 1985; charges dropped 9 December 1985; 'a crushing victory for us'); South African History Online, 'Albertina Nontsikelelo Sisulu' (held at Diepkloof; dubbed 'mother of the nation' by Dr R.A.M. Saloojee; four years, two suspended; the only woman among the sixteen accused).",
    },
    {
      id: "dr-asvat",
      title: { en: "Dr Asvat" },
      text: {
        en: "From 1984 she worked as the nurse and receptionist of Dr Abu Baker Asvat, whose surgery served some of the poorest people in Soweto. He was a leader of AZAPO, a rival of the UDF; she said they were like mother and son. On the afternoon of 27 January 1989 he was shot at his surgery while she was in the dispensary, and died in her presence. Winnie Madikizela-Mandela and her football club long faced rumours of having arranged the killing, and Albertina was drawn into those accusations.",
      },
      childText: {
        en: "Albertina worked with a kind doctor, Dr Asvat, who helped poor people in Soweto. She said they were like mother and son. In 1989 gunmen came to his surgery and shot him, and he died with Albertina beside him.",
      },
      imagePrompt:
        "A small doctor's surgery in Rockville, Soweto, in the late 1980s, a caravan-style clinic with a painted cross, a dusty yard and a bench outside, a hot still afternoon, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4510,
      sourceNote:
        "Wikipedia, 'Albertina Sisulu' (working at Asvat's surgery in Rockville from 1984; his AZAPO leadership; 'like mother and son'; shot on the afternoon of 27 January 1989 while she was in the dispensary, dying in her presence; the rumours against Madikizela-Mandela and her football club, and Albertina drawn into them); South African History Online, 'Albertina Nontsikelelo Sisulu' (his work among the poorest). The gunmen are left unnamed here: the sources report rumour and accusation about who sent them, and so does this page.",
    },
    {
      id: "passport",
      title: { en: "A passport, and a nomination" },
      text: {
        en: "In June 1989 the government suddenly gave her the first passport of her life. She led a UDF delegation abroad, meeting Margaret Thatcher in London and, on 30 June, President George Bush in Washington. On 14 October the last restrictions on her were lifted, and the next day Walter came home. When the first democratic Parliament met on 10 May 1994 she was one of its members — and it was she who formally nominated Nelson Mandela to be president.",
      },
      childText: {
        en: "In 1989 Albertina got her first passport and travelled overseas to meet world leaders. That October, Walter came home at last. In 1994 she became a member of Parliament, and she was the one who stood up and proposed Nelson Mandela as South Africa's president.",
      },
      imagePrompt:
        "The chamber of the Houses of Parliament in Cape Town, green leather benches and wood panelling, morning light, empty and expectant, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4511,
      sourceNote:
        "Wikipedia, 'Albertina Sisulu' (her first passport, June 1989; the UDF tour, Thatcher, and President Bush on 30 June 1989; restrictions lifted 14 October 1989; elected to the first democratic Parliament; nominated Mandela when Parliament opened on 10 May 1994); South African History Online, 'Walter Ulyate Sisulu' (Walter released 15 October 1989).",
    },
    {
      id: "truth-commission",
      title: { en: "\"I am not here to tell lies\"" },
      text: {
        en: "On 1 December 1997 she gave evidence to the Truth and Reconciliation Commission about the day Dr Asvat was killed. Her answers about Madikizela-Mandela were called evasive, and Commissioner Dumisa Ntsebeza asked whether she was shielding a comrade. Weeping, she answered: \"Even if I am shielding her, I am not here to tell lies.\" On 4 December the Commission heard evidence confirming her account that a disputed signature on a patient's record card was not hers. At her own request she returned to the stand, and Ntsebeza told her she had been vindicated.",
      },
      childText: {
        en: "In 1997 Albertina spoke at the Truth Commission about Dr Asvat's death. Some people there said she was not telling everything, and that hurt her deeply. A few days later new evidence showed she had told the truth, and the Commission said so.",
      },
      imagePrompt:
        "A church hall in Johannesburg set up for public hearings in 1997, a long table with microphones, a jug of water and glasses, rows of empty chairs, grey window light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4512,
      sourceNote:
        "Wikipedia, 'Albertina Sisulu' (her TRC appearance on 1 December 1997; responses described as evasive; Commissioner Ntsebeza's question; 'Even if I am shielding her, I am not here to tell lies'; the evidence of 4 December on the record card; her return to the stand and Ntsebeza's statement that she was 'vindicated'). The TRC's own finding on Madikizela-Mandela is in winnie.ts.",
    },
    {
      id: "two-chickens",
      title: { en: "Two chickens" },
      text: {
        en: "She served one term in Parliament, was president of the World Peace Council from 1993, and retired from politics in 1999. Of her marriage she once said: \"We were like two chickens. One always walking behind the other.\" In 2003 Walter died in her arms. She died suddenly at her home in Linden, Johannesburg, on 2 June 2011, aged 92. After a state funeral at Orlando Stadium on 11 June, she was buried beside Walter in Croesus Cemetery. The country she had nursed, organised and mothered called her what a UDF leader had called her in 1983: the mother of the nation.",
      },
      childText: {
        en: "Albertina and Walter loved each other very much. She said they were like two chickens, one always walking behind the other. She died on 2 June 2011, aged 92, and was buried next to Walter. South Africans call her Ma Sisulu, the mother of the nation.",
      },
      imagePrompt:
        "A quiet Johannesburg cemetery in winter light, two simple headstones side by side under a jacaranda tree, fallen leaves on the grass, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4513,
      sourceNote:
        "Wikipedia, 'Albertina Sisulu' (one term in Parliament, retiring in 1999; president of the World Peace Council, 1993; 'two chickens'; died at home in Linden, 2 June 2011, aged 92; state funeral at Orlando Stadium and burial beside Walter in Croesus Cemetery, 11 June; 'mother of the nation'); South African History Online, 'Albertina Nontsikelelo Sisulu' (Walter died in her arms, 2003).",
    },
  ],
};
