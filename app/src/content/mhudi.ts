import type { Module } from "./types";

// Grounded in Sol Plaatje, *Mhudi* (1930) — see docs/04-humanities-sources.md.
// NOTE(setswana): the `tn` fields are AI-assisted DRAFTS and must be reviewed by a
// Setswana speaker before submission (setswana-i18n skill + integrity rule).

export const mhudi: Module = {
  id: "mhudi",
  title: "Mhudi",
  author: "Sol T. Plaatje",
  year: 1930,
  source: "Sol T. Plaatje, *Mhudi* (written c.1917, published 1930)",
  audience: "Young adults & adults — resilience, displacement, agency",
  blurb: {
    en: "The first English novel by a Black South African. After the Mfecane scatters the Barolong, Mhudi and Ra-Thaga forge an egalitarian life in the wilderness — overturning the colonial pastoral myth.",
    tn: "Buka ya ntlha ya Seesemane e e kwadilweng ke Mo-Aforika Montsho wa Borwa. Morago ga Mfecane, Mhudi le Ra-Thaga ba aga botshelo jo bo lekanang mo nageng.",
  },
  references: [
    "Tim Couzens & Brian Willan — criticism of Mhudi (enotes.com)",
    "Sol Plaatje University — 'Mhudi: A century later' (BKO Magazine)",
    "'Plotting South African history: narrative in Sol Plaatje's Mhudi' (journals.co.za)",
  ],  // Public domain. Sol T. Plaatje died on 19 June 1932; Copyright Act 98 of 1978, life + 50 → the
  // work entered the public domain on 1 January 1983. The scenes are the project's own adaptation.
  rights: {
    status: "public-domain",
    authorDied: 1932,
    basis: "Public domain since 1983 (Plaatje d. 1932; Copyright Act 98 of 1978, life + 50). The scenes are the project's own adaptation of the novel.",
  },

  scenes: [
    {
      // NEW, written from ch. 1 (issue #33). The novel opens with a political act, not a battle, and
      // Plaatje refuses to make his own people blameless: chief Tauana has Mzilikazi's two tribute
      // collectors killed "without informing his counsellors in any way", and the counsellors are
      // riding out to make amends when the reprisal arrives. That refusal is the humanities point —
      // it is a Barolong writer declining to tell a simple story about Barolong innocence — and it is
      // why the scene leads the module. English only for now: Setswana belongs to a speaker (#38).
      id: "kunana-tribute",
      title: { en: "The Tribute at Kunana" },
      text: {
        en: "A hundred years before Plaatje wrote, Mzilikazi's Matebele had made themselves rulers of the highveld, and each spring the Bechuana chiefs — the Barolong at Kunana among them — paid him tribute. When two of his indunas, Bhoya and Bangela, arrived to collect it, chief Tauana had them taken to a ravine and killed, without telling his counsellors. The counsellors set out to make amends and were still on the road when the Matebele reached Kunana. Everything that happens to Mhudi begins here, in a decision her own chief made badly.",
      },
      childText: {
        en: "Long ago a powerful king named Mzilikazi ruled the land, and once a year the Barolong people sent him a gift to keep the peace. When two of his messengers came for it, the Barolong chief had them killed — and he did not ask his advisors first. The king sent his soldiers, and Mhudi's town was destroyed.",
      },
      imagePrompt:
        "Two royal envoys in feathered headdress arriving on foot at a large Barolong town of domed clay homesteads on the open highveld, cattle and grain baskets, a tense formal greeting under a wide midday sky, 1830s Southern Africa, cinematic, painterly, 4k, historically grounded, artistic interpretation",
      seed: 1301,
      sourceNote:
        "Plaatje, Mhudi (1930), ch. 1 'A Tragedy and its Vendetta', pp. 15–25 (Lovedale) — the annual tribute, the killing of the indunas Bhoya and Bangela at Tauana's order, and the reprisal on Kunana.",
    },
    {
      // REWRITTEN FROM THE BOOK (issue #33). This scene used to say that "it was Mhudi whose courage
      // and quick judgement saved Ra-Thaga" from a lion. The novel does not contain that event. What
      // ch. 2 actually describes is better, and truer to what Plaatje is doing: Mhudi flees a feeding
      // lion, runs into Ra-Thaga, then REFUSES to be left behind — "I am prepared to see ten other
      // lions with you rather than stay alone" — guides him back to the animal, and charges it beside
      // him. Plaatje makes the point through Ra-Thaga's own surprise rather than by asserting it:
      // "He believed that women were timid creatures, but here was one actually volunteering to guide
      // him to where the lion was." The old version came from a summary; this one comes from p. 26–31.
      //
      // The Setswana below is left as it was for the old text and NO LONGER MATCHES the English. It
      // needs a Setswana speaker, not a machine and not me — it is on the tier-4 review sheet
      // (`npm run review:sheet -- tn`). Until then `localize` falls back to English and says so.
      id: "the-lion",
      title: { en: "The Lion, and the Meeting", tn: "Mhudi le Tau" },
      text: {
        en: "Days after Kunana fell, Mhudi was alone in the wilderness when she nearly walked into a black-maned lion feeding on an eland. She fled — and ran into Ra-Thaga, the first human being either of them had seen in weeks. He set out after the animal; she refused to stay behind, guided him back to it, and rushed at it beside him, shouting and waving her skin cloak until it bolted. Plaatje leaves the judgement to Ra-Thaga, who had 'believed that women were timid creatures.'",
      },
      childText: {
        en: "After her town was destroyed, Mhudi walked alone for many days. One day she almost stepped on a lion, and she ran — straight into a young man called Ra-Thaga, who was also alone. He went to chase the lion away, and Mhudi would not be left behind. They ran at it together, shouting, until it ran off.",
      },
      imagePrompt:
        "Two young Barolong travellers on the open veld at dusk, a man and a woman side by side shouting and waving skin cloaks to drive off a black-maned lion from its kill, long grass, dust and amber light, cinematic, painterly, 4k, artistic interpretation",
      seed: 2042,
      sourceNote:
        "Plaatje, Mhudi (1930), ch. 2 'Dark Days', pp. 26–31 (Lovedale) — Mhudi and Ra-Thaga meet; she guides him back to the lion and they drive it off together.",
    },
    {
      id: "forest-home",
      title: { en: "The Forest Home", tn: "Legae la Sekgwa" },
      text: {
        en: "After the Matabele attack scattered the Barolong and destroyed the town of Kunana, Mhudi and Ra-Thaga met as survivors in the wilderness. Far from elders and the obligations of the village, they built a home of their own and named it Re-Nosi — 'We-are-alone.' Their union was not arranged by custom but forged in survival, grounded in mutual respect.",
        tn: "Morago ga tlhaselo ya Matebele e e phatlaladitseng Barolong le go senya motse wa Kunana, Mhudi le Ra-Thaga ba kopana e le batshedi mo nageng. Kgakala le bagolwane, ba aga legae la bone mme ba le bitsa Re-Nosi — 'Re le rosi.' Lenyalo la bone le ne le sa rulaganngwa ke ngwao, le tlhomilwe mo go tshedisanang ka tlotlo.",
      },
      childText: {
        en: "Long ago, a great attack scattered Mhudi's people and destroyed her town. Alone in the wild, Mhudi met Ra-Thaga, another survivor. Together they built a little home and called it Re-Nosi, which means 'We are alone.' They cared for and respected each other.",
        tn: "Bogologolo, tlhaselo e kgolo e ne ya phatlalatsa batho ba ga Mhudi. A le esi mo nageng, Mhudi a kopana le Ra-Thaga. Mmogo ba aga legae le bannye ba le bitsa Re-Nosi, e leng 'Re le rosi.' Ba ne ba tlotlana.",
      },
      imagePrompt:
        "A lone homestead at the edge of a vast Southern African savanna at golden dawn, a Barolong man and woman building a shelter together, acacia trees, warm cinematic light, painterly, 4k, historically grounded, artistic interpretation",
      seed: 1017,
      // Was "ch. 5". Chapter 5 of the 1930 edition is "Revels after Victory"; the forest home is
      // chapter 6, pp. 63–70. Corrected against the text itself (issue #33), which is now in the repo
      // at content/sources/mhudi/source.txt — the citation had been taken from a summary site.
      sourceNote: "Plaatje, Mhudi (1930), ch. 6 'The Forest Home', pp. 63–70 (Lovedale) — the valley they name Re-Nosi, 'We-are-alone'.",
    },
  ],
};
