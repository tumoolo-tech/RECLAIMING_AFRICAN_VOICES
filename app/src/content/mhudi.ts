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
  // The edition first, because the scenes are written from it (issue #33). The text is in this repo
  // at content/sources/mhudi/source.txt and every scene cites a chapter and a printed page range.
  // The summary sites that used to head this list — enotes.com and the rest — are gone: one of them
  // is where "ch. 5 'The Forest Home'" and an invented lion rescue came from.
  references: [
    "Sol T. Plaatje, *Mhudi: An Epic of South African Native Life a Hundred Years Ago* (Lovedale Press, 1930) — the first edition, and the text these scenes are written from.",
    "Full text: Wikisource transcription of the 1930 Lovedale edition, proofread against the page scans (en.wikisource.org/wiki/Mhudi). Fetched by `npm run fetch:text`; see sources/mhudi/ for the transcription corrections applied.",
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
      // ⚠️ THE SETSWANA BELOW STILL DESCRIBES THE OLD, INCORRECT ENGLISH — it says Mhudi saved
      // Ra-Thaga from the lion, which the novel does not contain. It is kept rather than deleted
      // (Tumo's call, 2026-09-24: we add to what is already here, we do not remove other people's
      // work), so a Setswana reader currently reads the wrong version of this scene while an English
      // reader reads the right one. That is a real divergence, not a nuance.
      //
      // It cannot be fixed from here: translating the corrected English is work for a Setswana
      // speaker, and machine-translating it is precisely what AGENTS.md §4 forbids. It is therefore
      // the FIRST item on the Setswana review sheet (`npm run review:sheet -- tn`), and the title
      // "Mhudi le Tau" — "Mhudi and the Lion" — needs revisiting with it, since the English title is
      // now "The Lion, and the Meeting".
      id: "the-lion",
      title: { en: "The Lion, and the Meeting", tn: "Mhudi le Tau" },
      text: {
        en: "Days after Kunana fell, Mhudi was alone in the wilderness when she nearly walked into a black-maned lion feeding on an eland. She fled — and ran into Ra-Thaga, the first human being either of them had seen in weeks. He set out after the animal; she refused to stay behind, guided him back to it, and rushed at it beside him, shouting and waving her skin cloak until it bolted. Plaatje leaves the judgement to Ra-Thaga, who had 'believed that women were timid creatures.'",
        tn: "Mo nageng Mhudi a itshupa a lekana le mongwe le mongwe. Fa tau e ne e ba tshosetsa, e ne e le Mhudi yo bopelokgale jwa gagwe bo bolokileng Ra-Thaga — mongwe wa metsotso e Plaatje a bontshang maatla a gagwe.",
      },
      childText: {
        en: "After her town was destroyed, Mhudi walked alone for many days. One day she almost stepped on a lion, and she ran — straight into a young man called Ra-Thaga, who was also alone. He went to chase the lion away, and Mhudi would not be left behind. They ran at it together, shouting, until it ran off.",
        tn: "Letsatsi lengwe tau ya atamela. Mhudi o ne a pelokgale e bile a le botlhale, mme a boloka Ra-Thaga mo kotsing. Mo kanegelong e, Mhudi ke mogaki yo o nonofileng.",
      },
      imagePrompt:
        "Two young Barolong travellers on the open veld at dusk, a man and a woman side by side shouting and waving skin cloaks to drive off a black-maned lion from its kill, long grass, dust and amber light, cinematic, painterly, 4k, artistic interpretation",
      seed: 2042,
      sourceNote:
        "Plaatje, Mhudi (1930), ch. 2 'Dark Days', pp. 26–31 (Lovedale) — Mhudi and Ra-Thaga meet; she guides him back to the lion and they drive it off together.",
    },
    {
      // ch. 3. Plaatje hands the massacre to MHUDI to narrate — the novel's most violent material is
      // in her voice, as testimony, not in the narrator's. Handled here with restraint: the adult text
      // carries her cousin Baile's defiance rather than the mutilations Plaatje also records, and the
      // child text stops at the flight. NOTE: issue #30 (an editorial policy for atrocity) is still
      // open; when it lands, this scene is the first that should be checked against it.
      id: "mhudis-own-story",
      title: { en: "Mhudi Tells Her Own Story" },
      text: {
        en: "Plaatje does not describe the sack of Kunana himself — he gives it to Mhudi to tell. She was pounding corn with the other girls when the watchmen's horns sounded. They had heard that two Matebele envoys were dead and had thought it made them safer: 'ah! that's where we were mistaken.' She fled before sunset with her little brother on her back while her mother carried the baby. What she reports of that night she reports as testimony, including her cousin Baile's answer to the man who stabbed her — 'Kill me, you coward, go back and brag that you have killed a woman in kirtles.'",
      },
      childText: {
        en: "Mhudi was pounding corn with her friends when the warning horns sounded. Everyone had to run. Her mother carried the baby and Mhudi carried her little brother. That night she lost her family, and afterwards she walked alone for many days.",
      },
      imagePrompt:
        "A young Barolong woman fleeing at dusk across open grassland with a small child on her back, distant smoke low on the horizon behind her, long shadows, restrained and dignified, no violence shown, cinematic, painterly, 4k, artistic interpretation",
      seed: 3114,
      sourceNote:
        "Plaatje, Mhudi (1930), ch. 3 'Mhudi's Alarming Experiences', pp. 32–36 (Lovedale) — Mhudi's first-person account of the attack on Kunana and her flight.",
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
    {
      // ch. 10. First contact, staged as a conversation between equals — the Barolong are the hosts
      // and the questioners, not the scenery. Siljay's "no man or woman can rule another", said while
      // looking for land to settle, and his aside that a woman could not lead an army, are left to
      // stand as the novel leaves them: the reader is trusted to notice.
      id: "strangers-from-the-south",
      title: { en: "The Strangers from the South" },
      text: {
        en: "A party of mounted white men rode into Thaba Ncho — Sarel Siljay's Voortrekkers, moving north with their families and wagons 'in search of some unoccupied territory to colonize and to worship God in peace.' Chief Moroka asks why they could not worship God south of the Orange River. 'We could,' Siljay answers, 'but oppression is not conducive to piety.' The Barolong, a few years out of a conquest, listen to a man explain that he is escaping one; they discuss kings and freedom, and Siljay observes that a woman could not lead an army.",
      },
      childText: {
        en: "One day men on horses rode into the town. They were Boers, travelling north with their families and wagons, looking for new land. The chief welcomed them and asked them many questions, and they talked for a long time about kings and about being free.",
      },
      imagePrompt:
        "Mounted travel-stained riders with wide hats and rifles halted before the chief and elders of a Barolong town on the open highveld, hooded ox-wagons in the middle distance, a formal wary meeting under a wide sky, 1830s Southern Africa, cinematic, painterly, 4k, historically grounded, artistic interpretation",
      seed: 4210,
      sourceNote:
        "Plaatje, Mhudi (1930), ch. 10 'Arrival of the Voortrekkers', pp. 93–100 (Lovedale) — Sarel Siljay's party reaches Thaba Ncho and Chief Moroka questions them.",
    },
    {
      // ch. 12. The novel stops the war to describe the enemy king's favourite wife — her standing at
      // court, her co-wives' jealousy, her childlessness. Plaatje reaches for the Song of Songs to
      // render her. A book that wanted a faceless Matebele horde would not contain this chapter.
      id: "queen-umnandi",
      title: { en: "Queen Umnandi" },
      text: {
        en: "Plaatje halts the war to describe Mzilikazi's favourite wife. Umnandi — 'the sweet one', daughter of Umzinyati — is praised by visitors to the royal court for her bearing, her cooking and her beer, and hated by her co-wives for the favouritism that praise brings her. She is childless, and the king's affection cools. To render her beauty, Plaatje quotes the Song of Songs: 'I am black but comely.' The chapter gives his enemy's household an interior life, which is a deliberate refusal: this novel will not supply a faceless horde.",
      },
      childText: {
        en: "The king of the Matebele had a favourite wife called Umnandi, which means 'the sweet one'. Visitors to the palace always praised her. But the king's other wives were jealous of her, and she became very unhappy.",
      },
      imagePrompt:
        "A dignified Ndebele queen in beaded regalia receiving guests at the entrance of a great royal homestead, calm and composed, warm evening light, respectful formal portrait composition, cinematic, painterly, 4k, artistic interpretation",
      seed: 4312,
      sourceNote:
        "Plaatje, Mhudi (1930), ch. 12 'Queen Umnandi', pp. 108–115 (Lovedale) — the portrait of Mzilikazi's favourite wife, her standing at court and her co-wives' jealousy.",
    },
    {
      // ch. 20. THIS is the agency the module used to claim from the lion scene, and it is real: ill
      // with fever, Mhudi dreams her husband speared, rises from the sickbed and crosses a war alone
      // to find him. The chapter's own title names it a leap in the dark.
      id: "mhudis-leap",
      title: { en: "Mhudi's Leap in the Dark" },
      text: {
        en: "Mhudi was ill with malarial fever when the allied armies left Thaba Ncho, and she would not let her illness keep Ra-Thaga from the war he had waited years for. A week later she dreamt she was watching the battle: a Matebele giant closing with her husband, and a second man driving a spear into him. She woke, rose from the sickbed, and set out alone to find him. This is the agency the novel actually gives her — not rescuing a man from a lion, but crossing a war on her own judgement.",
      },
      childText: {
        en: "Mhudi was very ill when her husband went away to the war. One night she dreamed that he was hurt. She got up — even though she was still sick — and went to look for him all by herself.",
      },
      imagePrompt:
        "A determined woman walking alone at first light across empty grassland, a blanket around her shoulders, weak from fever but upright, vast open country ahead, cinematic, painterly, 4k, artistic interpretation",
      seed: 5120,
      sourceNote:
        "Plaatje, Mhudi (1930), ch. 20 'Mhudi's Leap in the Dark', pp. 192–198 (Lovedale) — ill with fever, Mhudi dreams Ra-Thaga is speared and sets out alone to find him.",
    },
    {
      // ch. 22. The novel's sting, and the reason it is a political book and not a romance. Plaatje
      // gives the prophecy of colonial dispossession to the DEFEATED ENEMY, and published it in 1930,
      // seventeen years after the Natives Land Act he had campaigned against in Native Life in South
      // Africa. The reader in 1930 already knew which of Mzilikazi's predictions had come true.
      id: "mzilikazi-prophecy",
      title: { en: "Mzilikazi's Prophecy" },
      text: {
        en: "Driven north, Mzilikazi turns and curses the Barolong for the allies they have chosen. He tells them the story of Zungu, who caught a lion's whelp and raised it on cow's milk expecting a useful hunting dog, and came home one day to find it had eaten his children. Then he foretells what the 'marauding wizards from the sea' will do: rob them of their cattle, their children and their lands; entice their youths to war and refuse them the spoils; turn Bechuana women into beasts of burden and use the whiplash on their skins. Plaatje published this in 1930, seventeen years after the Natives Land Act he had spent his life opposing.",
      },
      childText: {
        en: "When the Matebele king was driven away at last, he gave the Barolong a warning about their new friends. He told them about a man named Zungu, who raised a lion cub like a pet — and came home one day to find it had eaten his family.",
      },
      imagePrompt:
        "A defeated but unbowed king addressing his people from a rise at dusk as a long column of families and cattle moves north behind him, smoke of a burning city far on the horizon, solemn and monumental, cinematic, painterly, 4k, artistic interpretation",
      seed: 5228,
      sourceNote:
        "Plaatje, Mhudi (1930), ch. 22 'The Exodus', pp. 214–224 (Lovedale) — Mzilikazi's parable of Zungu and his prophecy of what the newcomers will do to the Bechuana.",
    },
  ],
};
