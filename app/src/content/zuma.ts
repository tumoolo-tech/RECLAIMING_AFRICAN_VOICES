import type { Module } from "./types";

// "The Life of Jacob Zuma" — a life, told as a book (SP-124). Tumo, 2026-10-01: "do Zuma, add the
// controvecy", after the Biko, Winnie, Mandela, two Sisulu and Tambo books (SP-118–123). The same
// form, the same rules — and one more, because he is alive.
//
// A LIVING MAN, AND MOST OF THIS IS LAW. Every controversy here is stated as the body that decided it
// stated it: the Shaik court, the Public Protector, the Constitutional Court, the Zondo Commission.
// Findings are attributed, never narrated as the book's own verdict. Where he was ACQUITTED (the 2006
// rape trial) the book says so plainly. Where he has NOT BEEN TRIED (the arms-deal charges, set down
// for 1 February 2027) the book says so plainly and does not describe the charges as facts. His own
// position is given in his own reported words ("judicial dictatorship").
//
// "GENERALLY CORRUPT RELATIONSHIP" IS NOT USED. The phrase is everywhere and is not in Judge Hilary
// Squires's 2005 judgment: Squires wrote to Business Day to say so (Mail & Guardian, 12 November 2006),
// and the Supreme Court of Appeal's attribution of it to him was an error. Wikipedia's Shaik trial
// article still prints it as his finding. The book uses the words the judgment does contain —
// a "mutually beneficial symbiosis".
//
// THE STORY IS TOLD WHOLE, BOTH WAYS. The herd boy with no schooling, ten years on Robben Island,
// fourteen in exile, the last of them running the ANC's intelligence; and the presidency that expanded HIV treatment
// and announced free higher education for poor students — alongside Nkandla, state capture, a prison
// sentence, and the deadliest unrest of the democratic era.
//
// KHWEZI. The complainant in the 2006 trial is named here by the name she was known by during it.
// Her real name became public after her death in 2016; the book does not need it.
//
// WHERE SOURCES DISAGREE, THE BOOK SAYS LESS:
//   · His arrest — SAHO: June 1963, near Groot Marico; Wikipedia: 1962, near Zeerust, with 45
//     recruits. Both are in the western Transvaal, and both have him convicted and sentenced to ten
//     years in 1963. The book says only that he was caught leaving the country and convicted in 1963.
//   · Joining MK — Wikipedia 1962, SAHO 1963 (recruited by Moses Mabhida). "In the early 1960s".
//   · Chief of intelligence in Lusaka — SAHO 1986, Wikipedia 1987. "In the late 1980s".
//   · Shaik's conviction — 30 May or June 2005. "In 2005".
//   · The Constitutional Court's 2024 ruling barring him from Parliament — 20 or 21 May. "In May 2024".
//
// PICTURES ARE OF PLACES, NEVER OF HIM. AI interpretations of settings, every prompt forbidding faces.
//
// CHILD MODE CHANGES THE WORDS, NOT THE FACTS — the trial, the court orders and the unrest stay in.
//
// NOTE(setswana): no translations yet. Every page falls back to English, labelled as such.

export const zuma: Module = {
  id: "zuma",
  kind: "atlas",
  title: "The Life of Jacob Zuma",
  author: "A life · Reclaimed Voices",
  source: "South African History Online, 'Jacob Gedleyihlekisa Zuma'; the Constitutional Court; and others — see references.",
  audience: "Teens & adults (Child mode for younger readers) — the struggle, the presidency, and the courts",
  blurb: {
    en: "A herd boy from Nkandla who never went to school, spent ten years on Robben Island and fourteen in exile, and became President. Then Nkandla, state capture, a prison sentence and a party of his own. His life, told whole, with every finding credited to the court or commission that made it.",
  },
  archivePrompt: {
    en: "Were you or your family touched by any part of this story — exile, Robben Island, or the July 2021 unrest? Add your story to the archive.",
  },
  references: [
    "South African History Online — 'Jacob Gedleyihlekisa Zuma' (sahistory.org.za/people/jacob-gedleyihlekisa-zuma)",
    "Constitutional Court — Economic Freedom Fighters v Speaker of the National Assembly and Others [2016] ZACC 11 (31 March 2016), the order (saflii.org/za/cases/ZACC/2016/11.html)",
    "Mail & Guardian — 'Squires sets record straight on Shaik', 12 November 2006 (mg.co.za)",
    "AFP — 'Scathing report details how Zuma, ANC gutted South Africa', 23 June 2022, on the Zondo Commission's final report (via Malay Mail)",
    "Wikipedia — 'Jacob Zuma'; 'Jacob Zuma rape trial'; 'Schabir Shaik'; 'Jacob Zuma corruption charges'; 'Nkandla homestead'; 'Presidency of Jacob Zuma'; 'Zondo Commission'; 'Jacob Zuma contempt of court'; '2021 South African unrest'; 'uMkhonto weSizwe (political party)' — each for details traced there to its own citation",
  ],
  // Not built on one work: authored by the project from the references above, in its own words.
  rights: {
    status: "original",
    basis: "Authored by the project from the cited references, in its own words; no biography of Jacob Zuma is reproduced. Short quotations are from court orders and reports as the cited sources carry them.",
  },

  scenes: [
    {
      id: "nkandla",
      title: { en: "Nkandla" },
      text: {
        en: "Jacob Gedleyihlekisa Zuma was born on 12 April 1942 at Nkandla, in the hills of northern Natal. His father, a policeman, died when he was a small boy, and his mother worked as a domestic worker. He herded cattle from the age of about seven and never went to school. He taught himself to read, and later went to night classes.",
      },
      childText: {
        en: "Jacob Zuma was born on 12 April 1942 at Nkandla, in KwaZulu-Natal. His father died when he was small, and his mother cleaned other people's houses for a living. Jacob looked after cattle and never went to school, so he taught himself to read.",
      },
      imagePrompt:
        "Rolling green hills of Nkandla in KwaZulu-Natal in the 1940s, scattered homesteads, cattle grazing on a steep slope, mist in the valleys, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4701,
      sourceNote:
        "South African History Online, 'Jacob Gedleyihlekisa Zuma' (12 April 1942, Nkandla, northern Natal; his father a policeman who died when he was young; herding cattle from about seven; self-taught reading; night school); Wikipedia, 'Jacob Zuma' (his mother a domestic worker; 'He did not receive formal schooling').",
    },
    {
      id: "conspiracy",
      title: { en: "Ten years for conspiracy" },
      text: {
        en: "In 1959, as a teenager, he joined the African National Congress. In the early 1960s he joined its armed wing, uMkhonto we Sizwe. He was caught in the western Transvaal while trying to leave the country with other recruits, and in 1963 he was convicted of conspiring to overthrow the government and sentenced to ten years in prison.",
      },
      childText: {
        en: "As a teenager, Jacob joined the ANC, which was fighting for equal rights. Later he joined its army. He was caught trying to leave South Africa and was sent to prison for ten years.",
      },
      imagePrompt:
        "A dirt road through dry bushveld in the western Transvaal in the early 1960s, thorn trees, a distant border fence, harsh noon light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4702,
      sourceNote:
        "South African History Online, 'Jacob Gedleyihlekisa Zuma' (joined the ANC in 1959; recruited to MK; arrested in June 1963 in the Groot Marico area of the western Transvaal; convicted on 12 August 1963 and sentenced to ten years for conspiracy); Wikipedia, 'Jacob Zuma' (joined MK in 1962; arrested 'with a group of 45 recruits near Zeerust'). The sources differ on the year of arrest and of joining MK, so the book gives neither.",
    },
    {
      id: "robben-island",
      title: { en: "Robben Island" },
      text: {
        en: "He arrived on Robben Island on 30 December 1963 and served the whole ten years. He was released on 29 December 1973 and held for another two weeks in Pietermaritzburg.",
      },
      childText: {
        en: "Jacob spent ten years in prison on Robben Island, from 1963 to 1973.",
      },
      imagePrompt:
        "Robben Island seen from the sea, low limestone prison buildings, a lighthouse, grey Atlantic water, overcast light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4703,
      sourceNote:
        "South African History Online, 'Jacob Gedleyihlekisa Zuma' (entered Robben Island on 30 December 1963; released on 29 December 1973; detained in Pietermaritzburg for two weeks).",
    },
    {
      id: "exile",
      title: { en: "Exile" },
      text: {
        en: "In December 1975 he left for Swaziland. In 1976 he was deported to Mozambique, where he became the ANC's deputy chief representative and then its chief representative. He joined the ANC's National Executive Committee in 1977 and trained in the Soviet Union. When Mozambique expelled him in the 1980s he moved to Lusaka, and by the late 1980s he was head of the ANC's intelligence department.",
      },
      childText: {
        en: "In 1975 Jacob had to leave South Africa. He lived in Swaziland, Mozambique and Zambia, working for the ANC. In the end he ran the ANC's secret intelligence work.",
      },
      imagePrompt:
        "A modest office building in Lusaka in the 1980s, louvred windows, a jacaranda tree in bloom, a parked car in the dusty yard, late afternoon light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4704,
      sourceNote:
        "South African History Online, 'Jacob Gedleyihlekisa Zuma' (left for Swaziland in December 1975; deported to Mozambique in April 1976, deputy chief and then chief representative; co-opted to the NEC in 1977; Soviet training in 1978; expelled from Mozambique and moved to Lusaka as chief of intelligence, 1986); Wikipedia, 'Jacob Zuma' (head of underground structures and chief of intelligence in Lusaka, 1987). The year differs, so the book says 'the late 1980s'.",
    },
    {
      id: "deputy-president",
      title: { en: "Deputy President" },
      text: {
        en: "He came home on 21 March 1990, after the ANC was unbanned. In 1991 he was elected the ANC's deputy secretary-general, and in 1994 he became KwaZulu-Natal's member of the executive council for economic affairs and tourism. In December 1997 the ANC elected him its deputy president, and in June 1999 President Thabo Mbeki made him Deputy President of South Africa.",
      },
      childText: {
        en: "Jacob came home in 1990. He became a leader in the ANC and in KwaZulu-Natal, and in 1999 he became Deputy President of South Africa, second only to the President.",
      },
      imagePrompt:
        "The Union Buildings in Pretoria in late-1990s winter light, sandstone colonnades and terraced gardens, empty lawns, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4705,
      sourceNote:
        "Wikipedia, 'Jacob Zuma' (returned 21 March 1990; Deputy President of South Africa from June 1999); South African History Online, 'Jacob Gedleyihlekisa Zuma' (deputy secretary-general, December 1991; MEC for economic affairs and tourism in KwaZulu-Natal from 1994; ANC deputy president, December 1997).",
    },
    {
      id: "shaik",
      title: { en: "The Shaik judgment" },
      text: {
        en: "In 2005 the Durban High Court convicted his financial adviser, Schabir Shaik, of two counts of corruption and one of fraud, and sentenced him to fifteen years. The payments at the centre of the case were Shaik's payments to Zuma. Judge Hilary Squires found it would fly in the face of common sense to deny that this 'mutually beneficial symbiosis' gave Zuma a sense of obligation to his friend. On 14 June 2005 President Mbeki dismissed Zuma as Deputy President. The corruption case against Zuma himself was struck off the roll in September 2006.",
      },
      childText: {
        en: "In 2005 a court found Jacob's friend and adviser, Schabir Shaik, guilty of corruption for the money he had paid Jacob. President Mbeki then fired Jacob as Deputy President. A case against Jacob himself was started and then stopped.",
      },
      imagePrompt:
        "The exterior of a Durban court building in 2005, colonial facade with columns, palm trees, wet pavement after summer rain, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4706,
      sourceNote:
        "Wikipedia, 'Schabir Shaik trial' and 'Schabir Shaik' (Durban and Coast Local Division of the High Court, Judge Hilary Squires; two counts of corruption and one of fraud; fifteen years; appeals dismissed by the SCA, 6 November 2006, and the Constitutional Court, 2 October 2007); Mail & Guardian, 'Squires sets record straight on Shaik', 12 November 2006 (the judgment's words 'mutually beneficial symbiosis' and 'fly in the face of commonsense'; Squires denied ever finding a 'generally corrupt relationship', the phrase usually attributed to him, which the book therefore does not use); Wikipedia, 'Jacob Zuma' (dismissed on 14 June 2005); 'Jacob Zuma corruption charges' (struck off the roll on 20 September 2006).",
    },
    {
      id: "the-trial",
      title: { en: "The 2006 trial" },
      text: {
        en: "In December 2005 he was charged with rape by a woman known in the trial as Khwezi. On 8 May 2006 Judge Willem van der Merwe acquitted him, finding that the sex had been consensual. Zuma had told the court that he knew she was HIV-positive and had showered afterwards to reduce his risk of infection He had headed the National AIDS Council. The judge said he did not even want to comment on the effect of a shower. Khwezi faced intimidation after the trial, was given asylum in the Netherlands in 2007, and died in 2016.",
      },
      childText: {
        en: "In 2006 Jacob was put on trial, accused of rape. The judge found him not guilty. During the trial Jacob said something about HIV that was wrong and that many people criticised. The woman who accused him was threatened afterwards and had to leave the country.",
      },
      imagePrompt:
        "An empty High Court courtroom in Johannesburg, wood-panelled walls, a raised bench, rows of empty public benches, a shaft of light from a high window, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4707,
      sourceNote:
        "Wikipedia, 'Jacob Zuma rape trial' (charged on 6 December 2005; complainant known as Khwezi; Judge Willem van der Merwe; acquitted on 8 May 2006, the sex found consensual; his testimony that he knew she was HIV-positive and 'took a shower afterwards'; the judge: 'I do not even want to comment on the effect of a shower after having had unprotected sex'; he had been head of the National AIDS Council; her asylum in the Netherlands on 3 July 2007 after intimidation; her death in 2016).",
    },
    {
      id: "polokwane",
      title: { en: "Polokwane" },
      text: {
        en: "On 18 December 2007, at the ANC's conference in Polokwane, he was elected president of the ANC, defeating Thabo Mbeki by 2,329 votes to 1,505. Ten days later the prosecutors charged him again. In April 2009 the acting head of the National Prosecuting Authority, Mokotedi Mpshe, withdrew all the charges, citing prosecutorial misconduct shown, he said, by recorded phone calls that became known as the 'spy tapes'. On 6 May 2009 Parliament elected Zuma President of South Africa, and he was sworn in on 9 May.",
      },
      childText: {
        en: "In 2007 the ANC chose Jacob as its leader instead of Thabo Mbeki. The charges against him were dropped in 2009, and the same year he became President of South Africa.",
      },
      imagePrompt:
        "A large white conference marquee on a university campus in Limpopo at dusk, rows of empty plastic chairs, flags hanging still, floodlights coming on, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4708,
      sourceNote:
        "Wikipedia, 'Jacob Zuma' (elected ANC president at Polokwane, 18 December 2007; sworn in 9 May 2009); '52nd National Conference of the African National Congress' (Zuma 2,329, Mbeki 1,505); 'Jacob Zuma corruption charges' (charges reinstated on 28 December 2007; withdrawn on 6 April 2009 by acting NDPP Mokotedi Mpshe, citing prosecutorial misconduct related to the 'spy tapes'); South African History Online, 'Jacob Gedleyihlekisa Zuma' (elected President on 6 May 2009, inaugurated 9 May).",
    },
    {
      id: "president",
      title: { en: "President" },
      text: {
        en: "On 1 December 2009, World AIDS Day, he announced the expansion of the country's HIV testing and treatment programme, in line with World Health Organization guidelines — a break with the denialism of the years before. His government launched the New Growth Path in 2010, and the ANC endorsed the National Development Plan in 2012. He was elected for a second term on 21 May 2014. In December 2017 he announced that higher education would be free for students from households earning less than R350,000 a year.",
      },
      childText: {
        en: "As President, Jacob made more HIV tests and medicines available to people who needed them. Near the end, he announced that university would be free for students from poorer families.",
      },
      imagePrompt:
        "A public clinic in a South African township, a queue line painted on the floor, red AIDS ribbon posters on a notice board, morning light through the door, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4709,
      sourceNote:
        "Wikipedia, 'Presidency of Jacob Zuma' (1 December 2009 address on 'the expansion of the country's HIV testing and treatment programme, in line with World Health Organisation guidelines', reversing his predecessor's approach; free higher education below R350,000 a year, announced in December 2017); South African History Online, 'Jacob Gedleyihlekisa Zuma' (New Growth Path, 2010; the National Development Plan endorsed at Mangaung, 2012; second term, 21 May 2014).",
    },
    {
      id: "nkandla-homestead",
      title: { en: "Secure in Comfort" },
      text: {
        en: "The state spent about R246 million on his private homestead at Nkandla, for security. On 19 March 2014 the Public Protector, Thuli Madonsela, reported in 'Secure in Comfort' that some of it was not security at all — a visitors' centre, an amphitheatre, a cattle kraal, a chicken run and a swimming pool — and that he should pay back part of the cost. He did not. On 31 March 2016 the Constitutional Court ruled unanimously that his failure to comply was inconsistent with the Constitution, under the section that requires the President to 'uphold, defend and respect' it. Treasury set the amount at R7,814,155, and he paid it in September 2016.",
      },
      childText: {
        en: "The government spent a lot of money on Jacob's home at Nkandla. Some of it paid for things like a swimming pool and a chicken run. The highest court in the country said he had broken the Constitution by not paying that money back, so he paid back R7.8 million.",
      },
      imagePrompt:
        "A rural homestead compound on a hillside in KwaZulu-Natal, several thatched round buildings behind a high security fence, an empty cattle kraal and a round pool, overcast sky, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4710,
      sourceNote:
        "Constitutional Court, Economic Freedom Fighters v Speaker of the National Assembly [2016] ZACC 11, 31 March 2016, order paras 4–10 (failure to comply with the Public Protector's remedial action 'inconsistent with section 83(b) of the Constitution'; Treasury to determine the cost of 'the visitors' centre, the amphitheatre, the cattle kraal, the chicken run and the swimming pool only'; the President to pay personally; the National Assembly's resolution set aside); section 83(b) as quoted in the judgment ('must uphold, defend and respect the Constitution'); Wikipedia, 'Nkandla homestead' ('Secure in Comfort', 19 March 2014; about R246 million; unanimous; R7,814,155 paid in September 2016).",
    },
    {
      id: "state-capture",
      title: { en: "State capture" },
      text: {
        en: "On 9 December 2015 he replaced the finance minister, Nhlanhla Nene, with Des van Rooyen, a backbencher; the rand fell to a record low, and four days later he replaced van Rooyen with Pravin Gordhan. In November 2016 the Public Protector's report 'State of Capture' examined his relationship with the Gupta family. On 31 March 2017 he fired Gordhan, and days later South Africa's credit rating was cut to junk. In January 2018, under a court order, he appointed Deputy Chief Justice Raymond Zondo to investigate. On 14 February 2018, forced out by his own party, he resigned. In June 2022 the Zondo Commission's final report called him 'a critical player' who 'would do anything that the Guptas wanted him to do for them', and found that 'the ANC under President Zuma, permitted, supported and enabled corruption and state capture'.",
      },
      childText: {
        en: "While Jacob was President, a rich family called the Guptas got too much power over the government. Jacob fired finance ministers, and the country's economy was hurt. In 2018 his party made him step down. Later a judge called Raymond Zondo investigated, and his report said Jacob had helped the Guptas.",
      },
      imagePrompt:
        "The National Treasury building in Pretoria at night, rows of lit windows in a tall office block, an empty street with a single traffic light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4711,
      sourceNote:
        "Wikipedia, 'Presidency of Jacob Zuma' (Nene replaced by Des van Rooyen on 9 December 2015; the rand's record low; Gordhan appointed on 13 December; Gordhan dismissed on 31 March 2017; S&P downgrade to junk on 3 April 2017); 'Zondo Commission' (the 'State of Capture' report, November 2016; Zondo appointed in January 2018 under a court order; final report 22 June 2022); 'Jacob Zuma' (resigned 14 February 2018); AFP, 23 June 2022 (the ANC 'forced him to step down'; on the final report: 'a critical player'; 'would do anything that the Guptas wanted him to do for them'; 'The ANC under President Zuma, permitted, supported and enabled corruption and state capture'). These are the commission's findings; the book reports them as such.",
    },
    {
      id: "contempt",
      title: { en: "Contempt of court" },
      text: {
        en: "Zuma walked out of the commission and refused to return. On 28 January 2021 the Constitutional Court ordered him to testify; he would not, and spoke of 'the emergence of a judicial dictatorship in South Africa'. On 29 June 2021 the court found him guilty of contempt and sentenced him to fifteen months in prison. He handed himself in at Estcourt Correctional Centre on 7 July, forty minutes before the police deadline. Two days later, rioting and looting began in KwaZulu-Natal and Gauteng; by the time it ended, the government counted 354 people dead — in AFP's words, the deadliest unrest of the democratic era. He was released on medical parole that September.",
      },
      childText: {
        en: "Jacob refused to answer the judge's questions, even when the highest court ordered him to. So the court sent him to prison for fifteen months. Soon after, there was rioting and looting in KwaZulu-Natal and Gauteng, and 354 people died. Jacob was let out of prison early because he was ill.",
      },
      imagePrompt:
        "A burnt-out shopping centre on a highway outside Durban in July 2021, smoke drifting over an empty parking lot, scattered debris, grey winter light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4712,
      sourceNote:
        "Wikipedia, 'Jacob Zuma contempt of court' (order of 28 January 2021; his statement on 'the emergence of a judicial dictatorship in South Africa'; contempt judgment and fifteen months on 29 June 2021; surrender at Estcourt Correctional Centre on 7 July 2021, forty minutes before the deadline; rescission refused 17 September 2021); 'Zondo Commission' (the walk-out); '2021 South African unrest' (9–18 July 2021, KwaZulu-Natal and Gauteng; '354 people, according to the South African government'); AFP, 23 June 2022 ('the deadliest unrest of the democratic era'); Wikipedia, 'Jacob Zuma' (medical parole, 5 September 2021).",
    },
    {
      id: "unfinished",
      title: { en: "Unfinished" },
      text: {
        en: "On 16 December 2023 he announced he would vote for a new party called uMkhonto weSizwe — the name of the army he had joined in the 1960s. In May 2024 the Constitutional Court ruled that his prison sentence barred him from standing for Parliament, though his face stayed on the ballot. On 29 May the party won 14.58% of the vote and 58 seats, third in the country. In July 2024 the ANC expelled him. The arms-deal charges against him — dropped in 2009, then ruled irrationally dropped by the High Court in 2016 and reinstated in March 2018 — are sixteen counts, including corruption, fraud and racketeering. They have still not come to trial; the trial is set to begin on 1 February 2027. He has not been convicted of any of them.",
      },
      childText: {
        en: "In 2023 Jacob backed a new political party, and in 2024 it came third in the election. The ANC, the party he had belonged to all his life, threw him out. A court case about money from a weapons deal is still waiting to be heard. Until a court decides, he is innocent of those charges.",
      },
      imagePrompt:
        "A rural voting station in a school hall in KwaZulu-Natal, cardboard voting booths and a ballot box on a wooden table, election posters on the wall, morning light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4713,
      sourceNote:
        "Wikipedia, 'uMkhonto weSizwe (political party)' (announced 16 December 2023; the Constitutional Court ruling of May 2024 on his fifteen-month sentence, his image remaining on the ballot; 14.58% and 58 of 400 seats, third; expelled from the ANC in July 2024); 'Jacob Zuma corruption charges' (the 2009 withdrawal set aside as 'irrational' on 29 April 2016, upheld by the SCA on 13 October 2017; reinstated on 16 March 2018; sixteen counts — twelve of fraud, two of corruption, one of racketeering, one of money laundering; Judge Piet Koen's recusal on 13 August 2024; trial set for 1 February 2027). The ruling's date is given as 20 and 21 May, so the book says May.",
    },
  ],
};
