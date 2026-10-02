import type { Module } from "./types";

// "Walter Sisulu" — a life, told as a book (SP-121). Tumo, 2026-09-29: "now do a story for
// sisulu", choosing Walter (not Albertina, not both) — after the Biko, Winnie and Mandela books
// (SP-118–120). The same form, the same rules.
//
// THE ORGANISER. Sisulu is usually a name in someone else's story — Mandela's mentor, Accused No. 2.
// The sources make him the subject: the man who built the ANC into a mass movement as its
// Secretary-General, who helped found its armed wing, and who taught the ANC's history to a
// generation of prisoners in the lime quarry. The hard facts stay in: an attempted railway sabotage
// in 1946, secret membership of the Communist Party, a place on MK's High Command.
//
// A BIOGRAPHY, NOT HIS WORDS. *I Will Go Singing* (2001) and Elinor Sisulu's *Walter and Albertina
// Sisulu: In Our Lifetime* (2002) are in copyright; nothing of them is reproduced. The quotations are
// Lembede's warning at the wedding, his vow at the Rivonia Trial (court testimony), and one sentence
// he gave the press on his release, each as the cited source carries it.
//
// NO HERO PAGE. Unlike Biko and Winnie he has no page in the app to open this from, so today it is
// reached from the Atlas only. The topic scanner will link any scanned page that names "Walter
// Sisulu" here; none does yet (the Eastern Cape's province text names him, but provinces are not
// scanned). The "Mbeki" in these pages is Govan, not Thabo — see topic-exclusions.ts.
//
// WHERE SOURCES DISAGREE, THE BOOK SAYS LESS OR TAKES THE CHECKABLE DATE. Wikipedia puts the Youth
// League in 1943 and SAHO in 1944 — the League was founded in 1944, so 1944. SAHO dates the Congress
// of the People to 1956 — it met at Kliptown in June 1955 (Wikipedia; and the Freedom Charter's own
// date), so 1955. SAHO counts 26 years in prison and Wikipedia "more than 25": arrested July 1963,
// released October 1989, so twenty-six. Wikipedia gives a six-year sentence for his 1963 conviction
// and SAHO none, so no length is given. The year he met Albertina (1941 or 1942) is left out.
//
// PICTURES ARE OF PLACES, NEVER OF HIM. AI interpretations of settings, every prompt forbidding faces.
//
// CHILD MODE CHANGES THE WORDS, NOT THE FACTS.
//
// NOTE(setswana): no translations yet. Every page falls back to English, labelled as such.

export const sisulu: Module = {
  id: "sisulu",
  kind: "atlas",
  title: "Walter Sisulu",
  author: "A life · Reclaimed Voices",
  source: "South African History Online, 'Walter Ulyate Sisulu'; and others — see references.",
  audience: "Teens & adults (Child mode for younger readers) — organising, the armed struggle, and prison",
  blurb: {
    en: "A boy from Engcobo who left school at fifteen, worked the gold mines, and became the organiser who built the ANC into a mass movement — Mandela's mentor, Accused No. 2 at Rivonia, and the teacher of Robben Island. His life, told as his own story, not a chapter of someone else's.",
  },
  archivePrompt: {
    en: "Does your family remember 15 October 1989, when the Rivonia prisoners came home to Soweto? Add their voice to the archive.",
  },
  references: [
    "South African History Online — 'Walter Ulyate Sisulu' (sahistory.org.za/people/walter-ulyate-sisulu, ref. B-0065415)",
    "Wikipedia — 'Walter Sisulu' (for his uncertain birthday, his parents, Mandela's arrival and Evelyn Mase, the Congress of the People, Albertina's detention under the 90-day law, the Rivonia vow, his words on release, Groote Schuur, his death at Linden and funeral; each traced there to its own citation)",
    "Nelson Mandela's tribute on Sisulu's death, May 2003 (via BBC News, news.bbc.co.uk/2/hi/africa/3003849.stm)",
  ],
  // Not built on one work: authored by the project from the references above, in its own words.
  rights: {
    status: "original",
    basis: "Authored by the project from the cited references, in its own words; neither Walter Sisulu's own book nor Elinor Sisulu's biography is reproduced. Short quotations are as the cited sources carry them.",
  },

  scenes: [
    {
      id: "qutubeni",
      title: { en: "Qutubeni" },
      text: {
        en: "Walter Ulyate Max Sisulu was born in the village of Qutubeni, in the Engcobo district of the Transkei. Like many of his generation he was not certain of his birthday, but kept it on 18 May 1912. His mother, Alice Mase Sisulu, was a domestic worker; his father, a white assistant magistrate named Dickinson, took no part in raising him. He grew up with his grandmother and uncle, went to an Anglican mission school, and left it at fifteen, in Standard 4, when his uncle died and the family needed his wages.",
      },
      childText: {
        en: "Walter Sisulu was born in 1912 in a village called Qutubeni, in the Eastern Cape. His grandmother and uncle raised him. When his uncle died, Walter had to leave school at fifteen to go and work for his family.",
      },
      imagePrompt:
        "A village in the Engcobo hills of the Transkei in the 1910s, rondavels on a green slope, a small mission school building, mist in the valley, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4401,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (Qutubeni, Engcobo, 18 May 1912; father an assistant magistrate named Dickenson; raised by grandmother and uncle; Anglican mission school, left in Standard 4 at 15 after his uncle died); Wikipedia, 'Walter Sisulu' (uncertain of his birthday, celebrated on 18 May; his mother Alice Mase Sisulu, a domestic worker; his father took no part in his upbringing). SAHO spells the father's name Dickenson, Wikipedia Dickinson.",
    },
    {
      id: "the-mines",
      title: { en: "The mines" },
      text: {
        en: "He went to Johannesburg to work, first in a dairy. After returning home for initiation, he came back in 1929 to work in a gold mine. Later, in East London, where his mother had found work, he met Clements Kadalie, the leader of the Industrial and Commercial Workers' Union. The mines and Kadalie, Sisulu said later, were what first made him political.",
      },
      childText: {
        en: "Walter went to Johannesburg and worked in a dairy, and then deep underground in a gold mine. He met a famous union leader, Clements Kadalie, who fought for workers' rights. That is when Walter started to care about politics.",
      },
      imagePrompt:
        "A Witwatersrand gold mine in 1929, steel headgear against a dawn sky, pale mine dumps, a row of corrugated-iron hostel buildings, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4402,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (work in a Johannesburg dairy; initiation; a gold mine from 1929; East London with his mother; Clements Kadalie of the ICU; the mines and Kadalie as formative influences, in his own later account).",
    },
    {
      id: "the-strike",
      title: { en: "Fired for a strike" },
      text: {
        en: "Back in Johannesburg from 1933, he worked at a biscuit factory and went to night school at the Bantu Men's Social Centre. In 1940 he was fired from the bakery for organising a strike for higher wages. He went into business as an estate agent, helping Black and Indian people to buy houses. That same year, aged 28, he joined the African National Congress.",
      },
      childText: {
        en: "Walter worked in a bakery and studied at night. In 1940 he was fired for helping the workers ask for fair pay. He started his own business helping Black and Indian families buy homes, and he joined the ANC.",
      },
      imagePrompt:
        "A Johannesburg arcade of small offices in the late 1930s, tiled floor, shopfronts with blurred painted signs, afternoon light through a glass roof, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4403,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (Johannesburg from 1933; the biscuit factory; night school at the Bantu Men's Social Centre; fired in 1940 for organising a strike for higher wages; estate agency; joined the ANC in 1940 at 28); Wikipedia, 'Walter Sisulu' (the agency helped Black and Indian people buy houses).",
    },
    {
      id: "mandela",
      title: { en: "The young man from Mqhekezweni" },
      text: {
        en: "In 1941 a young man from the Transkei, newly arrived in Johannesburg, was introduced to him: Nelson Mandela. Sisulu encouraged him to join the ANC, sometimes helped pay for his law studies, and introduced him to his first wife, Evelyn Mase, who was related to Sisulu through his mother. Sixty-two years later Mandela would say: \"Our paths first intersected in 1941.\"",
      },
      childText: {
        en: "In 1941 Walter met a young man who had just come to Johannesburg — Nelson Mandela. Walter helped him, encouraged him to join the ANC, and became his lifelong friend.",
      },
      imagePrompt:
        "A modest Soweto house in the early 1940s, a wooden gate and a small stoep, a dusty street at golden hour, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4404,
      sourceNote:
        "Wikipedia, 'Walter Sisulu' (Mandela introduced to Sisulu in 1941; encouraged him to join the ANC; occasionally contributed to his law tuition; introduced him to Evelyn Mase, a maternal relative); Nelson Mandela's tribute, May 2003 (via BBC News): 'Our paths first intersected in 1941.'",
    },
    {
      id: "married-to-the-nation",
      title: { en: "Married to the nation" },
      text: {
        en: "In 1944 he was elected to the executive of the new ANC Youth League, with Anton Lembede, Mandela, Oliver Tambo and Ashley Mda. On 15 July that year he married Albertina Thethiwe, a nursing student from the Transkei, at Cofimvaba. At the reception Lembede warned her that she was marrying a man who was already married to the nation. They had five children, and raised three more.",
      },
      childText: {
        en: "In 1944 Walter helped lead the new ANC Youth League. That same year he married Albertina, a nurse. A friend at their wedding warned her that Walter was already 'married to the nation' — because he gave his whole life to the struggle.",
      },
      imagePrompt:
        "A 1940s community hall in Johannesburg decorated for a wedding reception, long tables with white cloths, paper streamers, a wooden stage, warm evening light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4405,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (the Youth League executive of 1944; married Albertina Thethiwe on 15 July 1944 at Cofimvaba, with a reception at the Bantu Men's Social Centre; Lembede's warning; five children and three more raised). Wikipedia dates the Youth League to 1943; the League was founded in 1944.",
    },
    {
      id: "secretary-general",
      title: { en: "Secretary-General" },
      text: {
        en: "In December 1949 he was elected Secretary-General of the ANC, at the conference that adopted the Youth League's militant Programme of Action. With the president far away in the Free State, he ran much of the organisation himself. He helped plan the Defiance Campaign of 1952, led a group of resisters, and was arrested; that December he and nineteen others were convicted for leading it, and given nine months' hard labour, suspended. His strategy and organisation are recognised as the main force that turned the ANC into a mass movement.",
      },
      childText: {
        en: "In 1949 Walter became the ANC's Secretary-General, the person who organises everything. He planned the 1952 campaign where people broke unfair laws on purpose, and was arrested for it. He helped turn the ANC into a movement of millions of people.",
      },
      imagePrompt:
        "A cluttered 1950s organiser's office, a desk with a typewriter, stacks of pamphlets and a telephone, a map pinned to the wall, lamp light at night, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4406,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (elected Secretary-General in December 1949 as the Programme of Action was adopted; took over many of President Moroka's responsibilities; planned the 1952 Defiance Campaign, led resisters, arrested; December 1952 conviction of all 20 accused, nine months' hard labour suspended for two years; his organisation 'the main factor in transforming the ANC into a mass-based militant national organisation').",
    },
    {
      id: "banned",
      title: { en: "Banned, and on trial" },
      text: {
        en: "Banning orders followed, one after another. In 1953 he spent five months travelling to China, the Soviet Union, Israel, Romania and Britain, and on his return he secretly joined the underground South African Communist Party. Banned from gatherings, he watched the Congress of the People adopt the Freedom Charter at Kliptown in 1955 from nearby. In December 1956 he was among 156 people arrested for high treason; on 29 March 1961 he and the last of the accused were acquitted.",
      },
      childText: {
        en: "The government banned Walter again and again, so he could not go to meetings. In 1956 he and 155 others were put on trial for treason. After more than four years, they were all found not guilty.",
      },
      imagePrompt:
        "An open square in Kliptown in the 1950s, a rough stage with flags, rows of empty benches on dusty ground, a wide Highveld sky, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4407,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (repeated banning orders; the five-month tour of 1953; secretly joined the SACP on his return; arrested with 156 others in December 1956; acquitted 29 March 1961); Wikipedia, 'Walter Sisulu' (watched the Congress of the People from nearby, 1955). SAHO dates the Congress of the People to 1956; it met in June 1955.",
    },
    {
      id: "underground",
      title: { en: "Underground" },
      text: {
        en: "Sisulu had considered sabotage long before it was policy: in 1946 he agreed to blow up a railway line during the mineworkers' strike, but the bomb never came. In June 1961 he was one of four who met in secret to form Umkhonto we Sizwe, and he became its political commissar. Arrested six times in 1962, he was convicted in March 1963 of furthering the aims of the banned ANC. On 20 April 1963, out on bail, he went underground at Liliesleaf Farm in Rivonia, and on 26 June he spoke over a secret ANC radio station. Because he had gone underground, the police detained Albertina — the first woman held under the new 90-day law.",
      },
      childText: {
        en: "In 1961 Walter helped start the ANC's secret army, Umkhonto we Sizwe. The police kept arresting him, so in 1963 he went into hiding on a farm called Liliesleaf and spoke to the country on a secret radio. The police locked up his wife Albertina to try to find him.",
      },
      imagePrompt:
        "A farmhouse among trees at Rivonia in 1963, a thatched outbuilding, a radio aerial on the roof, dusk falling over the veld, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4408,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (the failed 1946 railway sabotage during the mineworkers' strike; the June 1961 meeting of four that formed MK's high command; political commissar; six arrests in 1962; convicted March 1963; underground at Liliesleaf from 20 April 1963; the broadcast of 26 June 1963); Wikipedia, 'Walter Sisulu' (Albertina the first woman arrested under the 90-day law of 1963).",
    },
    {
      id: "rivonia",
      title: { en: "Accused No. 2" },
      text: {
        en: "On 11 July 1963 the police raided Liliesleaf and arrested him with Govan Mbeki, Raymond Mhlaba, Ahmed Kathrada and others. They were held in solitary confinement for 88 days, and charged in October. He was Accused No. 2. In the witness box he made a vow: \"As long as I enjoy the confidence of my people, and as long as there is a spark of life and energy in me, I shall fight with courage and determination for the abolition of discriminatory laws and for the freedom of all South Africans.\" On 12 June 1964 he was sentenced to life imprisonment, and that night flown to Robben Island.",
      },
      childText: {
        en: "In July 1963 the police found Walter at Liliesleaf Farm. At his trial he promised to keep fighting for freedom for as long as he lived. In 1964 he was sent to prison for life, on Robben Island, together with Nelson Mandela.",
      },
      imagePrompt:
        "A military transport plane on a dark airfield at night in 1964, runway lights, a cold wind, the silhouette of hangars, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4409,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (arrested at Liliesleaf on 11 July 1963 with Mbeki, Mhlaba, Kathrada and others; 88 days in solitary confinement; charged in October 1963; life sentence 12 June 1964; flown to Robben Island that night); Wikipedia, 'Walter Sisulu' (Accused No. 2; the vow from his testimony at the Rivonia Trial).",
    },
    {
      id: "the-quarry",
      title: { en: "The teacher in the quarry" },
      text: {
        en: "On Robben Island he completed his O levels. In the lime quarry he led the prisoners' first structured political discussions and lectured on the history of the ANC. His lectures grew into 'Syllabus A', a two-year course taught to the young men who came to the island after 1976 — for many of them, the only political education they ever had. In April 1982 he was moved with Mandela and others to Pollsmoor Prison, where Mandela turned to him for advice as talks with the government began.",
      },
      childText: {
        en: "In prison Walter kept learning, and he became a teacher. While the prisoners dug in the lime quarry, he taught them the history of the ANC. Young prisoners learned from him for years. Later he was moved to another prison with Mandela.",
      },
      imagePrompt:
        "A white limestone quarry on Robben Island under a glaring sun, pickaxes leaning against the rock, the sea glittering beyond, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4410,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (O levels; political discussions and ANC history lectures in the lime quarry; 'Syllabus A' for the post-1976 generation, with Mandela's acknowledgement that it was the only political education many received; moved to Pollsmoor in April 1982; Mandela sought his advice).",
    },
    {
      id: "home",
      title: { en: "Home to Soweto" },
      text: {
        en: "On 15 October 1989, one of Mandela's conditions for talks, he and the other Rivonia prisoners were released, after twenty-six years. Soweto celebrated in the streets and a huge ANC flag was draped across the Sisulu house, though the ANC was still banned. \"It was not possible to despair,\" he told reporters, \"because the spirit of the people outside was too great.\" He was part of the ANC delegation at the Groote Schuur talks in May 1990, and in 1991 was elected the ANC's Deputy President.",
      },
      childText: {
        en: "On 15 October 1989 Walter was set free after twenty-six years. Soweto danced in the streets, and a huge ANC flag hung on his house. He said he never gave up hope because the people outside were so strong. Then he helped lead the talks to end apartheid.",
      },
      imagePrompt:
        "A Soweto street in spring 1989, small brick houses, a huge black, green and gold flag draped across a house wall, bunting in the wind, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4411,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (release on 15 October 1989 at Mandela's insistence, after 26 years; the celebrations and the ANC flag on the Sisulu house; the Groote Schuur delegation, May 1990; Deputy President from 1991); Wikipedia, 'Walter Sisulu' (his words on release).",
    },
    {
      id: "last-years",
      title: { en: "Fifty years" },
      text: {
        en: "In April 1994 he and Albertina celebrated the ANC's victory in South Africa's first free election, and that July more than a thousand people came to Soweto to celebrate their fiftieth wedding anniversary. Weakened by age and prison, he declined public office and retired from the ANC's leadership that year, and gave his time to the Albertina Sisulu Foundation's community centre in Orlando West. He died at home in Linden, Johannesburg, on 5 May 2003, a few days before his 91st birthday, with Albertina beside him. A university, a botanical garden and a municipality carry his name.",
      },
      childText: {
        en: "In 1994 South Africa had its first free election, and Walter and Albertina celebrated fifty years of marriage. Walter spent his last years helping children in Soweto. He died on 5 May 2003, nearly 91 years old. A university is named after him.",
      },
      imagePrompt:
        "A community centre in Orlando West, Soweto, on a bright morning, a playground and a mural of abstract shapes, young trees along the fence, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4412,
      sourceNote:
        "South African History Online, 'Walter Ulyate Sisulu' (celebrating the ANC's 1994 election victory; the 50th anniversary celebration in Soweto with over a thousand people; retirement in 1994 through ill health; the Albertina Sisulu Foundation's centre in Orlando West; death on 5 May 2003, a few days before his 91st birthday); Wikipedia, 'Walter Sisulu' (declined public office; died at home in Linden in the presence of his wife; the Walter Sisulu University, National Botanic Garden and Local Municipality).",
    },
  ],
};
