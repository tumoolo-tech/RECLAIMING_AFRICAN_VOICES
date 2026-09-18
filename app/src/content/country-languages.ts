// Which languages are spoken in which country — so choosing a country in the header reorders the
// language picker to that country's languages instead of always leading with South Africa's.
//
// INTEGRITY (AGENTS.md §4). Two rules govern this file:
//
//  1. **Every entry cites the instrument that makes the claim.** "What they speak in country X" is a
//     factual, contestable statement, and getting it wrong is exactly the kind of harm this project
//     exists to avoid. Countries are mapped ONLY where the official-language position is documented
//     in a constitution or a government source. Everything else is deliberately absent, and an absent
//     country simply shows the full language list — the behaviour the app had before.
//
//  2. **`notYet` names languages we do NOT have, out loud.** Most of this continent's languages are
//     not in Ubuntu Heritage. Silently omitting them would imply a country speaks only what we happen
//     to support. Naming them says the honest thing: we know, and we don't have it yet.
//
// A NOTE ON A TRAP THIS FILE AVOIDS. Zimbabwe's "Ndebele" is **Northern** Ndebele (isiNdebele
// saseNyakatho, ISO `nd`), which is NOT the Southern Ndebele (`nr`) of South Africa — they are
// different languages. Mapping one onto the other would be a plausible-looking falsehood, so
// Zimbabwe's Ndebele is listed under `notYet`, not under `supported`.

import type { LangCode } from "../i18n/languages";

export type CountryLanguages = {
  /**
   * The one language the picker leads with, and the one the app switches to when a country is
   * chosen before the reader has picked a language for themselves (LANG-04). Always a member of
   * `supported`, and always justified in `sourceNote` — "which language leads" is itself a claim.
   */
  lead: LangCode;
  /**
   * Languages Ubuntu Heritage actually speaks that are official or nationally recognised here,
   * most prominent first. Never a guess — see `sourceNote`.
   */
  supported: LangCode[];
  /** Languages spoken there that the app does not have. Named rather than quietly dropped. */
  notYet: string[];
  /** The instrument or government source the claim rests on. */
  sourceNote: string;
};

export const countryLanguages: Record<string, CountryLanguages> = {
  za: {
    lead: "zu",
    supported: ["zu", "xh", "af", "en", "nso", "tn", "st", "ts", "ss", "ve", "nr"],
    // The twelfth official language. It is in `notYet`, not `supported`, because the app has nothing
    // it could render in it — a LangCode with no text, no audio and no video would be a promise the
    // app cannot keep. It is named here so the picker says so out loud rather than implying eleven.
    notYet: ["South African Sign Language"],
    sourceNote:
      "Constitution of the Republic of South Africa, 1996, §6, as amended by the Constitution Eighteenth Amendment Act, 2023 — twelve official languages: the eleven spoken languages listed in 1996, without ranking, plus South African Sign Language from 2023. Ubuntu Heritage speaks the eleven. The ORDER here is by first home language at the 2022 Census (isiZulu the largest), which is why isiZulu leads; the Constitution is the source for the list, the Census for the order.",
  },
  bw: {
    lead: "tn",
    supported: ["tn", "en"],
    notYet: ["Ikalanga", "Shekgalagari", "Khoisan languages"],
    sourceNote:
      "Botswana: English is the official language and Setswana the national language (Constitution of Botswana; Government of Botswana).",
  },
  ls: {
    // Five official languages since August 2025, not two. The 1993 text named Sesotho and English;
    // the Tenth Amendment rewrote §3(1). isiXhosa is the same language as South Africa's `xh`.
    // SiPhuthi is NOT siSwati (`ss`) — a Nguni language, closely related, but its own; it goes in
    // `notYet`, not `supported`, for the same reason Zimbabwe's Ndebele does. "Sign language" is
    // what the Act says, generically — no name is invented for it here.
    lead: "st",
    supported: ["st", "en", "xh"],
    notYet: ["SiPhuthi", "Sign language"],
    sourceNote:
      "Constitution of Lesotho, 1993, §3(1), as substituted by the Tenth Amendment to the Constitution Act, 2025 (Act No. 2 of 2025, published 13 August 2025) — the official languages are Sesotho, English, isiXhosa, isiPhuthi and sign language. Before the Amendment §3(1) named Sesotho and English only. Sesotho leads as the first-named official language in §3(1).",
  },
  sz: {
    lead: "ss",
    supported: ["ss", "en"],
    notYet: [],
    sourceNote: "Constitution of the Kingdom of Eswatini, 2005, §3(1) — siSwati and English are the official languages.",
  },
  na: {
    // Two instruments, two different claims. The Constitution names ONE language (English) and no
    // list of national languages at all — Article 3(3) only lets Parliament permit others regionally.
    // "Recognised" here therefore means the Ministry's school-language list, which is a government
    // source, not the Constitution; the sourceNote says which claim rests on which. Setswana is on
    // that list, and it is the same language as the app's `tn` — it was missing from this entry
    // until the countries/ research caught it (na-namibia.md).
    lead: "en",
    supported: ["en", "af", "tn"],
    notYet: [
      "Oshiwambo (Oshindonga, Oshikwanyama)",
      "Otjiherero",
      "Khoekhoegowab",
      "Rukwangali",
      "Rumanyo",
      "Thimbukushu",
      "Silozi",
      "Ju|'hoansi",
      "German",
    ],
    sourceNote:
      "Constitution of Namibia, Article 3(1) — English is the sole official language; the Constitution names no other language. The Ministry of Basic Education, Sport and Culture, 'The Language Policy for Schools in Namibia' (Discussion Document, January 2003), §5.10, lists the first-language-level school languages: Afrikaans, English, German, Ju|'hoansi, Khoekhoegowab, Oshikwanyama, Oshindonga, Otjiherero, Rukwangali, Rumanyo, Setswana, Silozi and Thimbukushu. Afrikaans and Setswana are on that list and are languages this app speaks; English leads because it is the official language.",
  },
  zw: {
    // Of Zimbabwe's sixteen officially recognised languages, these are the ones that are the SAME
    // language Ubuntu Heritage already speaks. Shona and Ndebele — the two largest — are not.
    // `lead` is English on an honest technicality: Zimbabwe's two largest languages are Shona and
    // Ndebele, and Ubuntu Heritage has neither. English leads because it is the most used of the
    // languages we actually speak there — not because it is the country's main language.
    //
    // CHECKED AND REJECTED (issue #25, 2026-09-19): the countries/ research relayed an encyclopaedia
    // line that the Constitution "only embraces two of them nationally, Shona and English". It is
    // not in the Act. §6(3)(a) says the opposite — the State must "ensure that all officially
    // recognised languages are treated equitably". The technicality above stays exactly as narrow as
    // it was; it must not be widened into a claim the instrument contradicts.
    lead: "en",
    supported: ["en", "ve", "ts", "st", "tn", "xh"],
    notYet: ["Shona", "Ndebele", "Chewa", "Chibarwe", "Kalanga", "Nambya", "Ndau", "Tonga", "Koisan", "Zimbabwean Sign Language"],
    sourceNote:
      "Constitution of Zimbabwe Amendment (No. 20) Act, 2013, §6(1) — sixteen officially recognised languages, which §6(3)(a) requires the State to treat equitably; the Constitution ranks none of them above the others. Zimbabwe's Shangani corresponds to Xitsonga; its Ndebele is Northern Ndebele, a different language from South Africa's isiNdebele.",
  },
};

/** The language map for a country, or undefined where we have not sourced one. */
export const languagesFor = (countryCode: string): CountryLanguages | undefined =>
  countryLanguages[countryCode];

/** True when we can honestly say anything about this country's languages. */
export const hasLanguageMap = (countryCode: string): boolean => countryCode in countryLanguages;
