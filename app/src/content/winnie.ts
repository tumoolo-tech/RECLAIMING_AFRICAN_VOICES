import type { Module } from "./types";

// "Winnie Madikizela-Mandela" — a life, told as a book (SP-119). Tumo, 2026-09-29: "now lets do
// winnie story", after the Steve Biko book (SP-118) — the same form, the same rules.
//
// TOLD WHOLE. Her hero page already says it: South Africans hold two truths about her. She was the
// most visible face of resistance through decades of banning, detention and banishment; and the
// Truth and Reconciliation Commission found her politically and morally accountable for gross
// violations of human rights committed by the Mandela United Football Club. A book that told only
// the first would be hagiography, and one that told only the second would erase her. The humanities
// rule is "neither sanitised nor sensationalised" — so both are here, each in the words of its
// source, and neither is given the last word over the other.
//
// A BIOGRAPHY, NOT HER WRITINGS. Her own books (Part of My Soul Went With Him; 491 Days) are in
// copyright and nothing of them is reproduced. Every scene is the project's own telling, in its own
// words, of facts from the references below; each `sourceNote` names what it rests on. Researched
// 2026-09-29.
//
// THIS RESEARCH CORRECTED THE HERO PAGE, carried into heroes.ts: her Baragwanath post is sourced
// (the first qualified Black person in it — SAHO), the 491 days are sourced (her own account, via
// Wikipedia), and the birth date is added.
//
// WHERE SOURCES DISAGREE, THE BOOK SAYS LESS. SAHO dates the finding of Stompie Seipei's body to 4
// January, Wikipedia to 6 January 1989 — the book says "early January 1989". SAHO misprints the
// burning of her house as 1998; the year used is 1988 (Wikipedia). Her term as a deputy minister is
// left out: the sources give different years.
//
// PICTURES ARE OF PLACES, NEVER OF HER. AI interpretations of settings, every prompt forbidding
// faces. The real photographs in assets/heroes/winnie/ come in only once their sources are recorded.
//
// CHILD MODE CHANGES THE WORDS, NOT THE FACTS — including the hard ones. A child is told that young
// men around her hurt and killed people, including a fourteen-year-old boy, and that the Truth
// Commission found her responsible. Nothing graphic, and nothing left out.
//
// NOTE(setswana): no translations yet. Every page falls back to English, labelled as such.

export const winnie: Module = {
  id: "winnie",
  kind: "atlas",
  title: "Winnie Madikizela-Mandela",
  author: "A life · Reclaimed Voices",
  source: "South African History Online; the TRC final report (via SAPA, 29 October 1998); and others — see references.",
  audience: "Teens & adults (Child mode for younger readers) — resistance, detention, and a contested legacy",
  blurb: {
    en: "A social worker from Bizana who became the face of the struggle while her husband was in prison — banned, jailed for 491 days, banished to Brandfort — and whom the Truth Commission later held accountable for the crimes of the football club around her. Her life, told whole.",
  },
  archivePrompt: {
    en: "Does your family remember Brandfort, Soweto in the 1980s, or the Women's League? Add their voice to the archive.",
  },
  references: [
    "South African History Online — 'Winnie Madikizela-Mandela' (sahistory.org.za/people/winnie-madikizela-mandela)",
    "SAPA — 'Hard-hitting TRC report fingers political leaders on all sides', 29 October 1998, on the TRC's final report (justice.gov.za/trc/media/1998/9810/s1029h.htm)",
    "Truth and Reconciliation Commission of South Africa Report, Vol. 2, ch. 12 — 'Special Investigation into the Mandela United Football Club'",
    "Wikipedia — 'Winnie Madikizela-Mandela' (for the 491 days, the 1988 fire, Stompie Seipei's abduction, the 2003–04 fraud case, her death and funeral; each traced there to its own citation)",
  ],
  // Not built on one work: authored by the project from the references above, in its own words.
  rights: {
    status: "original",
    basis: "Authored by the project from the cited references, in its own words; none of Winnie Madikizela-Mandela's own writings are reproduced.",
  },

  scenes: [
    {
      id: "bizana",
      title: { en: "Mbongweni, Bizana" },
      text: {
        en: "Nomzamo Winnie Madikizela was born on 26 September 1936 in Mbongweni, Bizana, in Pondoland in the Eastern Cape. Her father, Columbus, taught history and later became a minister in the Transkei government; her mother, Gertrude, taught science. She matriculated at Shawbury, a Methodist mission school at Qumbu, where she stood out as a leader.",
      },
      childText: {
        en: "Winnie was born on 26 September 1936 in Bizana, in the Eastern Cape. Her father and mother were both teachers. At school she was a natural leader.",
      },
      imagePrompt:
        "Rolling green hills of Pondoland in the Eastern Cape in the 1940s, scattered rondavels, a winding footpath, morning mist, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4201,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (birth date and place; her parents; Shawbury, Qumbu).",
    },
    {
      id: "baragwanath",
      title: { en: "The social worker" },
      text: {
        en: "In 1953 she went to Johannesburg to study at the Jan Hofmeyr School of Social Work, and finished in 1955 at the top of her class. She was offered the post of medical social worker at Baragwanath Hospital — the first qualified Black person to hold it.",
      },
      childText: {
        en: "Winnie moved to Johannesburg to study how to help families in need. She came top of her class, and became the first Black social worker in her job at Baragwanath Hospital.",
      },
      imagePrompt:
        "A large 1950s hospital building in Johannesburg, long low wards, a covered walkway, late afternoon light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4202,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (Jan Hofmeyr School of Social Work, 1953–55; top of her class; Baragwanath post, the first qualified Black member of staff in it).",
    },
    {
      id: "marriage",
      title: { en: "Marriage" },
      text: {
        en: "She met Nelson Mandela in 1957, and they married on 14 June 1958 in Bizana. That October she was arrested for protesting against the pass laws and spent two weeks in prison. Their daughter Zenani was born on 4 February 1959 and Zindziswa on 23 December 1960.",
      },
      childText: {
        en: "Winnie met Nelson Mandela and they got married in 1958. That same year she was put in prison for two weeks for protesting against unfair laws. They had two daughters, Zenani and Zindziswa.",
      },
      imagePrompt:
        "A small rural church in Bizana in the late 1950s, whitewashed walls, a tin roof, wildflowers in the grass, soft light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4203,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (meeting, 1957; marriage, 14 June 1958, Bizana; arrest in October 1958, two weeks in prison; Zenani and Zindziswa's birth dates).",
    },
    {
      id: "banned",
      title: { en: "Banned" },
      text: {
        en: "On 28 December 1962 she received her first banning order. It confined her to the magisterial district of Johannesburg and forbade her to be with more than two people at a time. With her husband in prison, she raised their daughters under it, and it would not be her last.",
      },
      childText: {
        en: "In 1962 the government 'banned' Winnie. She had to stay in Johannesburg and was not allowed to be with more than two people at once. She raised her daughters while their father was in prison.",
      },
      imagePrompt:
        "A modest Soweto house in the 1960s at dusk, a small gate and a single lit window, a quiet street, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4204,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (first banning order, 28 December 1962: Johannesburg district, no gatherings of more than two people; further banning orders followed).",
    },
    {
      id: "491-days",
      title: { en: "491 days" },
      text: {
        en: "On 12 May 1969 she was arrested under the Terrorism Act and held at Pretoria Central Prison. She was kept in solitary confinement, and for the first 200 days had no formal contact with another human being. Her trial began on 1 December 1969, but she was released without being convicted, after 491 days — and banned again almost as soon as she walked out.",
      },
      childText: {
        en: "In 1969 Winnie was locked up alone in a prison cell. For 200 days she was not allowed to see or talk to anyone. She was never found guilty of anything, but she was kept there for 491 days.",
      },
      imagePrompt:
        "A narrow, empty prison corridor with barred doors and a single high window, harsh light and deep shadow, 1960s, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4205,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (arrest 12 May 1969 under the Terrorism Act; solitary confinement; 200 days without contact; trial from 1 December 1969; released without conviction; banned again); Wikipedia, 'Winnie Madikizela-Mandela' (491 days, Pretoria Central Prison, from her own account, 491 Days).",
    },
    {
      id: "1976",
      title: { en: "1973 – 1976" },
      text: {
        en: "In May 1973 she was arrested for meeting the banned photographer Peter Magubane, sentenced to twelve months, and released from Kroonstad women's prison after six. In May 1976 she helped set up the Soweto Parents' Association with Dr Nthato Motlana. After the uprising of 16 June 1976 she was detained for five months, and released in December without charge.",
      },
      childText: {
        en: "In 1973 Winnie was sent to prison again, for meeting a friend the government had banned. In 1976, when the schoolchildren of Soweto rose up, she helped their parents organise — and she was locked up again for five months without being charged.",
      },
      imagePrompt:
        "A Soweto street in 1976 seen from a distance, school buildings and red dust, an empty road under a heavy sky, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4206,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (May 1973 arrest over Peter Magubane, twelve-month sentence, released from Kroonstad after six; the Soweto Parents' Association, May 1976, with Nthato Motlana; five months' detention after 16 June 1976, released December without charge).",
    },
    {
      id: "brandfort",
      title: { en: "Banished to Brandfort" },
      text: {
        en: "In the early hours of 15 May 1977 the authorities took her from Soweto and banished her to Brandfort, a small town in the Free State. There she started a gardening collective, a soup kitchen, a mobile health unit, a day-care centre, an organisation for orphans and young offenders, and a sewing club. Her banishment ended in 1986.",
      },
      childText: {
        en: "In 1977 the government sent Winnie far away from home, to a small town called Brandfort. Even there she started a soup kitchen, a day-care centre and a health clinic on wheels to help the people around her. She had to stay there until 1986.",
      },
      imagePrompt:
        "A small dusty Free State town in the late 1970s, flat veld, a corrugated-iron house and a vegetable garden, wide empty sky, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4207,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (banishment to Brandfort, 15 May 1977; the projects she started there; banishment ended 1986).",
    },
    {
      id: "football-club",
      title: { en: "The football club" },
      text: {
        en: "Back in Soweto in 1986, she founded the Mandela United Football Club, a club for the young men around her. In 1988 her house was burnt down by high-school students after a conflict with the club. On 29 December 1988 members of the club abducted fourteen-year-old James 'Stompie' Seipei; his body was found in early January 1989 on the outskirts of Soweto.",
      },
      childText: {
        en: "Back in Soweto, Winnie started a football club for young men. But some of the club's members became violent. In 1988 they took away a fourteen-year-old boy called Stompie Seipei, and he was killed.",
      },
      imagePrompt:
        "An empty township football field at dusk in the late 1980s, a bent goalpost, long shadows, a sombre orange sky, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4208,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (the MUFC, founded on her return in 1986; the conflict with Daliwonga High School pupils and the burning of her house; Stompie Seipei's body found on the outskirts of Soweto); Wikipedia, 'Winnie Madikizela-Mandela' (the year 1988 for the fire; the abduction on 29 December 1988; his age). SAHO gives 4 January and Wikipedia 6 January 1989 for the body — hence 'early January'.",
    },
    {
      id: "trial",
      title: { en: "Convicted, and separated" },
      text: {
        en: "Nelson Mandela was released in February 1990. The following year she stood trial with members of the club. She was cleared of the murder, but convicted of kidnapping and of being an accessory to assault, and sentenced to prison; on appeal this became a two-year suspended sentence and a fine of R15,000. On 13 April 1992 Nelson Mandela announced that they were separating, and they divorced in March 1996.",
      },
      childText: {
        en: "Nelson Mandela came out of prison in 1990. The next year a court found Winnie guilty of kidnapping, though not of the murder. Later that sentence was changed to a fine. In 1992 she and Nelson Mandela separated.",
      },
      imagePrompt:
        "An empty 1990s courtroom in Johannesburg, wooden dock and benches, a coat of arms blurred into shadow, grey daylight, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4209,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (Nelson Mandela's release, February 1990; the trial; cleared of the murder, convicted on counts of kidnapping and as an accessory to assault; the two-year suspended sentence and R15,000 fine on appeal; separation announced 13 April 1992; divorce March 1996).",
    },
    {
      id: "truth-commission",
      title: { en: "Before the Truth Commission" },
      text: {
        en: "In 1997 she appeared before the Truth and Reconciliation Commission. She admitted that 'things went horribly wrong', and apologised to the families of Stompie Seipei and of Dr Abu-Baker Asvat. The Commission's report, released on 29 October 1998, found her politically and morally accountable for the gross violations of human rights committed by the Mandela United Football Club, and found that she initiated and took part in the assault on Stompie Seipei and three other young men.",
      },
      childText: {
        en: "Years later Winnie spoke at the Truth and Reconciliation Commission. She said sorry to Stompie's family. The Commission found that she was responsible for harm done by the football club, and that she had hurt Stompie and other young men herself.",
      },
      imagePrompt:
        "An empty public hall set up for hearings in the late 1990s, a long table with microphones and headphones, rows of empty chairs, soft window light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4210,
      sourceNote:
        "South African History Online, 'Winnie Madikizela-Mandela' (appeared before the TRC in 1997; apologised to the families of Stompie Seipei and Dr Abu-Baker Asvat); Wikipedia, 'Winnie Madikizela-Mandela' ('things went horribly wrong'); SAPA, 29 October 1998, reporting the TRC final report (politically and morally accountable; initiated and took part in the assault on Seipei, Kenny Kgase, Pelo Mekgwe and Thabiso Mono). Full finding: TRC Report, Vol. 2, ch. 12.",
    },
    {
      id: "both-truths",
      title: { en: "Both truths" },
      text: {
        en: "She led the ANC Women's League from 1993 to 2003. In April 2003 she was convicted of fraud and theft; on appeal in July 2004 the theft conviction was overturned and the fraud conviction upheld, with a suspended sentence. She died at the Netcare Milpark Hospital in Johannesburg on 2 April 2018, and her public funeral was held at Orlando Stadium on 14 April. South Africans remember her as the woman who kept the struggle's name alive through the years it was banned — and as the woman the Truth Commission held to account. Both are true.",
      },
      childText: {
        en: "Winnie kept working in politics for many more years. She died on 2 April 2018, and her funeral was held in Soweto. People remember her for her great courage, and also for the harm that was done. Both are part of her story.",
      },
      imagePrompt:
        "Orlando Stadium in Soweto seen from outside at dawn, empty stands, a single flag in the wind, quiet and reflective, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4211,
      sourceNote:
        "Wikipedia, 'Winnie Madikizela-Mandela' (ANC Women's League, 1993–2003; fraud and theft conviction, 24 April 2003, and the July 2004 appeal; death at Netcare Milpark Hospital, 2 April 2018; public funeral at Orlando Stadium, 14 April 2018); South African History Online (death, 2 April 2018).",
    },
  ],
};
