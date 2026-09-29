import type { Module } from "./types";

// "Oliver Tambo" — a life, told as a book (SP-123). Tumo, 2026-09-29: "now do a story for oliver
// tambo", after the Biko, Winnie, Mandela and two Sisulu books (SP-118–122). The same form, the
// same rules.
//
// THE MAN WHO KEPT THE ANC ALIVE ABROAD. Tambo left in 1960 and led the movement from exile for
// thirty years — diplomat, head of an army, father mostly absent from his own children. The book
// follows the sources through all of it, including the parts a tribute would leave out:
//   · CHURCH STREET. In its own submission to the TRC (12 May 1997, reported by SAPA) the ANC said
//     that Tambo gave final approval for the 1983 Church Street car bomb, which killed 19 people.
//     Wikipedia says the TRC "identified" him; the source it cites says it was the ANC's submission,
//     so the book attributes it to the ANC, and gives the ANC's own account of the target alongside.
//   · THE CAMPS. Mutinies in the MK camps in Angola (1983–84), and — in SAHO's words — abuse in the
//     camps that did not stop despite the code of conduct he commissioned.
//
// A BIOGRAPHY, NOT HIS WORDS. Luli Callinicos's *Oliver Tambo: Beyond the Engeli Mountains* (2004) and
// other biographies are in copyright and nothing of them is reproduced. The quotations are short and
// public: "render South Africa ungovernable" (8 January 1985) and the words on his gravestone, both as
// SAHO carries them.
//
// THE UNISA THREAD AGAIN. SAHO records a UNISA scholarship in 1936 and that he studied law by
// correspondence through UNISA, by candlelight. Stated, not decorated — as in mandela.ts.
//
// NO HERO PAGE. He has no page of his own; the book is reached from the Atlas, and from the Mandela
// and Sisulu books, which name him (the topic scanner links "Oliver Tambo").
//
// WHERE SOURCES DISAGREE, THE BOOK SAYS LESS:
//   · Birthplace — SAHO has "Kantilla" and later "Kantolo", Wikipedia "Nkantolo", about 20 km from
//     Bizana. The book says "near Bizana".
//   · The Treason Trial — SAHO says he was "acquitted" after the preliminary hearings, before the
//     trial proper. No other reference here covers it, so the book says only that he was freed.
//   · SAHO puts Luthuli's Nobel ceremony in Stockholm (the Peace Prize is presented in Oslo) and
//     dates Mandela's banning to 1951. Neither detail is used.
//   · His title from 1967 — Wikipedia calls him acting president at first; SAHO has him elected
//     president at Morogoro in 1969. The book says he led the ANC from 1967 to 1991.
//   · His death — SAHO says a heart attack, Wikipedia complications of a stroke. The book gives the
//     date and his age, and the 1989 stroke that took his speech.
//
// PICTURES ARE OF PLACES, NEVER OF HIM. AI interpretations of settings, every prompt forbidding faces.
//
// CHILD MODE CHANGES THE WORDS, NOT THE FACTS — including the bomb and the camps.
//
// NOTE(setswana): no translations yet. Every page falls back to English, labelled as such.

export const tambo: Module = {
  id: "tambo",
  kind: "atlas",
  title: "Oliver Tambo",
  author: "A life · Reclaimed Voices",
  source: "South African History Online, 'Oliver Tambo'; and others — see references.",
  audience: "Teens & adults (Child mode for younger readers) — exile, diplomacy, and the armed struggle",
  blurb: {
    en: "A herd boy from Pondoland who became a teacher, Mandela's law partner, and for thirty years the leader who held the ANC together in exile — diplomat, commander, and a father who saw little of his children. His life, told whole, including the decisions of war.",
  },
  archivePrompt: {
    en: "Did someone in your family go into exile, or listen to Radio Freedom in secret? Add their story to the archive.",
  },
  references: [
    "South African History Online — 'Oliver Tambo' (sahistory.org.za/people/oliver-tambo)",
    "SAPA — 'Tambo ordered Church Street blast: ANC', 12 May 1997, on the ANC's second submission to the TRC (justice.gov.za/trc/media/1997/9705/s970512a.htm, via the Internet Archive)",
    "Wikipedia — 'Oliver Tambo' (for Nkantolo, his leadership from 1967, and his death at 75); 'O. R. Tambo International Airport' (renamed 27 October 2006); each traced there to its own citation",
  ],
  // Not built on one work: authored by the project from the references above, in its own words.
  rights: {
    status: "original",
    basis: "Authored by the project from the cited references, in its own words; no biography of Oliver Tambo is reproduced. Short quotations are as the cited sources carry them.",
  },

  scenes: [
    {
      id: "kaizana",
      title: { en: "Kaizana" },
      text: {
        en: "Oliver Reginald Kaizana Tambo was born on 27 October 1917 in a village near Bizana, in Mpondoland. His father, Mzimeni, named him Kaizana after the German Kaiser, whose armies were then fighting the British — his way of opposing Britain's rule over Pondoland. As a boy he herded his father's cattle, hunted birds, and became good at stick fighting. When he started school at six, his teacher said he needed a school name, and his father chose Oliver.",
      },
      childText: {
        en: "Oliver Tambo was born on 27 October 1917 in a village in Mpondoland, in the Eastern Cape. As a boy he looked after his father's cattle and was very good at stick fighting. When he started school, his father gave him the name Oliver.",
      },
      imagePrompt:
        "The green hills of eastern Mpondoland near Bizana in the 1920s, a homestead of rondavels, cattle on a slope, a herd boy's stick leaning on a kraal fence, morning light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4601,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (27 October 1917, Bizana, Mpondoland; his father Mzimeni; named Kaizana after Kaiser Wilhelm, opposing British rule of Pondoland; herding, bird-hunting, stick fighting; the school name Oliver); Wikipedia, 'Oliver Tambo' (the village of Nkantolo, about 20 km from Bizana). SAHO spells the village two ways, so the book names only Bizana.",
    },
    {
      id: "first-class",
      title: { en: "A first class" },
      text: {
        en: "In 1928 he went to the Anglican Holy Cross mission school at Flagstaff; two Englishwomen he had never met, Joyce and Ruth Goddard, sent £10 a year for his fees. His parents died within a year of each other. In 1934 he went on to St Peter's in Rosettenville, Johannesburg, and in 1936 passed the Junior Certificate with a first class — among the first African students in the Transvaal to do so. The Transkei Bhunga gave him a scholarship, and so did the University of South Africa. He matriculated in 1938, again with a first class.",
      },
      childText: {
        en: "Oliver was a brilliant student. Two kind women in England paid for his school fees. In 1936 he got a first-class pass in his exams, one of the first African students to do so, and won scholarships — one of them from UNISA.",
      },
      imagePrompt:
        "A small Anglican mission school in the Eastern Cape in the late 1920s, a stone church with a bell tower, a dusty cricket pitch, long afternoon shadows, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4602,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (Holy Cross, Flagstaff, April 1928; the Goddard sisters' £10 a year; his parents' deaths within a year; St Peter's, Rosettenville, 1934; the 1936 Junior Certificate first class; scholarships from the Transkei Bhunga and UNISA; first-class matriculation, 1938); Wikipedia, 'Oliver Tambo' ('one of the first African students in the Transvaal' to achieve it).",
    },
    {
      id: "fort-hare",
      title: { en: "Fort Hare" },
      text: {
        en: "He wanted to study medicine, but no medical school would take a Black student, so he read science at Fort Hare, where he met Nelson Mandela. There he developed the asthma he would carry all his life. When a white kitchen manager who had assaulted Black women workers was cleared by an inquiry, Tambo helped lead a boycott of classes. He graduated in mathematics and physics — and was then expelled, with 45 other students, after the students refused to cooperate with the authorities in a dispute over playing tennis on Sundays.",
      },
      childText: {
        en: "Oliver wanted to be a doctor, but Black students were not allowed to study medicine. So he studied science at Fort Hare, where he met Nelson Mandela. He stood up for workers who were treated badly, and was sent away from the university for protesting.",
      },
      imagePrompt:
        "The University of Fort Hare at Alice in the early 1940s, sandstone residence buildings, a newly rebuilt tennis court with a sagging net, the Tyume river valley beyond, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4603,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (medicine closed to Black students; science at Fort Hare; meeting Mandela; asthma; the 1941 kitchen assault and class boycott; BSc in mathematics and physics; expelled with 45 others over the Sunday tennis dispute).",
    },
    {
      id: "the-teacher",
      title: { en: "The teacher" },
      text: {
        en: "Turned away by schools that learned of his expulsion, he was taken back by St Peter's, where for five years he taught mathematics and physics; his pupils remembered an outstanding teacher. In 1942 he met Walter Sisulu, whose office was a gathering place for young intellectuals. The idea of a national league of young people was his, and when the ANC Youth League was inaugurated in September 1944, Tambo was elected its secretary.",
      },
      childText: {
        en: "Oliver became a maths and science teacher, and his pupils loved his lessons. He met Walter Sisulu and Nelson Mandela, and in 1944 they started the ANC Youth League together. Oliver was its secretary.",
      },
      imagePrompt:
        "A 1940s school classroom in Johannesburg, a blackboard covered in chalk equations, wooden desks in rows, a physics apparatus on the teacher's table, warm afternoon light, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4604,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (turned down by employers after the expulsion; five years teaching mathematics and physics at St Peter's; meeting Sisulu in 1942; the Youth League his idea; inaugurated September 1944 with Tambo as secretary).",
    },
    {
      id: "mandela-and-tambo",
      title: { en: "Mandela and Tambo" },
      text: {
        en: "He studied law by correspondence through the University of South Africa, working by candlelight at home, and qualified as an attorney on 24 July 1951. In December 1952 he and Mandela opened Mandela and Tambo in Chancellor House, Johannesburg — the first African-run law partnership in the country. People travelled from across South Africa to be represented by them.",
      },
      childText: {
        en: "Oliver studied law at night by candlelight, through UNISA. He and Nelson Mandela opened a law firm together in Johannesburg — the first run by Black lawyers. People came from all over the country for their help.",
      },
      imagePrompt:
        "A narrow 1950s Johannesburg office building, Chancellor House, a brass nameplate too blurred to read, a queue of empty chairs in a corridor, morning light, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4605,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (law by correspondence through UNISA, by candlelight; qualified 24 July 1951; the firm in Chancellor House; clients from across the country); South African History Online, 'Nelson Rolihlahla Mandela' (partnership from December 1952, the first African-run legal partnership).",
    },
    {
      id: "freedom-charter",
      title: { en: "Watching from a hiding place" },
      text: {
        en: "Elected Secretary-General of the ANC in 1954, he was banned that same year, and kept working behind the scenes on the committee that drafted the Freedom Charter. When the Congress of the People adopted it at Kliptown in June 1955, he watched from a hiding place in a house overlooking the square. On 5 December 1956 he was arrested for treason; on 22 December, out on bail, he married Adelaide Tsukudu, a nurse at Baragwanath Hospital. He was freed from the case after the preliminary hearings, and in 1958 became Deputy President of the ANC.",
      },
      childText: {
        en: "The government banned Oliver, so he had to watch the Freedom Charter being adopted from a hiding place. In 1956 he was arrested for treason — and two weeks later, out on bail, he married Adelaide, a nurse. Later he was set free.",
      },
      imagePrompt:
        "The open square at Kliptown in June 1955 seen from the window of a nearby house, a lace curtain half drawn, a distant stage with flags and banners, winter sunlight, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4606,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (Secretary-General and banned in 1954; the National Action Committee that drafted the Freedom Charter; watching the Congress of the People from Stanley Lollan's house; arrested 5 December 1956; married Adelaide Tsukudu on 22 December 1956; freed after the preliminary hearings; Deputy President). SAHO spells her name Tsukhudu; the book uses Tsukudu, the common spelling.",
    },
    {
      id: "exile",
      title: { en: "Across the border" },
      text: {
        en: "Six days after the Sharpeville massacre, on 27 March 1960, the ANC sent him out of the country to win the world's support. He was driven across the border into Bechuanaland, lived in fear of being kidnapped back, and flew on to Dar es Salaam, where he met Julius Nyerere. In Tunisia he gave his first speech outside South Africa. Adelaide and their three children reached London on 15 September 1960. She worked night shifts as a nurse, sometimes locking the children in alone. He lived on an ANC allowance of £2 a week and saved what he could for their Christmas presents.",
      },
      childText: {
        en: "In 1960 the ANC asked Oliver to leave South Africa secretly and ask the world for help. His wife Adelaide and their children moved to London, where she worked very long hours as a nurse. Oliver was away travelling most of the time and missed his family very much.",
      },
      imagePrompt:
        "A lonely border fence on a dirt road between South Africa and Bechuanaland at night in 1960, thorn trees, a distant car's headlights, stars over the Kalahari, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4607,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (sent on the 'Mission in Exile' after Sharpeville; crossed into Bechuanaland on 27 March 1960 with Ronald Segal; fear of abduction; Dar es Salaam and Nyerere; his first speech abroad in Tunisia; Adelaide and the children in London from 15 September 1960; her night shifts; his £2 weekly allowance and the Christmas presents).",
    },
    {
      id: "the-world",
      title: { en: "Before the world" },
      text: {
        en: "In January 1962 Mandela came to Dar es Salaam to explain the turn to armed struggle, and the two planned the ANC's work abroad. When the leaders inside the country were arrested at Rivonia in July 1963, the leadership of Umkhonto we Sizwe fell to Tambo. In October 1963 he addressed the United Nations; that month the General Assembly called on South Africa to release all political prisoners. He sought help from the Soviet Union and China and from the West alike, and later said that taking Soviet aid did not make the ANC Soviet.",
      },
      childText: {
        en: "Oliver travelled the world telling leaders about apartheid. In 1963 he spoke at the United Nations, and the UN asked South Africa to free its political prisoners. When Mandela and the others were arrested, Oliver became the leader of the ANC's army.",
      },
      imagePrompt:
        "The empty General Assembly hall of the United Nations in New York in the 1960s, the great gold emblem wall, rows of green desks and microphones, soft light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4608,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (meeting Mandela in Dar es Salaam, January 1962; the leadership of MK after the July 1963 arrests; the UN address of October 1963 and Resolution of 11 October 1963 on political prisoners; support from the USSR and China and his remark on alignment; seeking Western support).",
    },
    {
      id: "morogoro",
      title: { en: "Morogoro" },
      text: {
        en: "He set up camps for the ANC's army in Tanzania and Zambia, and in 1968 slept in the open with MK fighters on reconnaissance along the Zambezi. After Chief Luthuli's death in 1967 he led the ANC, and he would lead it until 1991. The Wankie campaign into Rhodesia, the ANC's first significant military campaign, was forced to retreat. A memorandum from Chris Hani's group accused the leadership — Tambo included — of failing democracy, and morale in the camps was low. At the conference he called at Morogoro, Tanzania, on 25 April 1969, he offered his resignation; the conference would not accept it, and re-elected him unanimously.",
      },
      childText: {
        en: "Oliver led the ANC from far away for many years. Some of his fighters were unhappy and criticised the leaders, including him. In 1969 he called a big meeting to listen to them. He offered to step down, but everyone asked him to stay.",
      },
      imagePrompt:
        "The wide Zambezi river at dusk in the late 1960s, dense bush on the banks, a campfire's embers on a sandbank, the sky turning deep orange, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4609,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (camps in Tanzania and Zambia; the Zambezi reconnaissance of 1968; the Luthuli Detachment and the Wankie campaign's retreat; Chris Hani's memorandum; the Morogoro conference of 25 April 1969, his resignation and unanimous re-election); Wikipedia, 'Oliver Tambo' (led the ANC from 1967, after Luthuli's death, to 1991).",
    },
    {
      id: "radio-freedom",
      title: { en: "Radio Freedom" },
      text: {
        en: "After the 1976 uprising, when young people poured out of the country, he asked Tanzania for land for a school for exiles, named after Solomon Mahlangu, an MK soldier hanged by the state. He had Pallo Jordan build up Radio Freedom from Lusaka, and often spoke on it himself. He commissioned a code of conduct to protect the rights of women in the movement, and after a visit to Vietnam in 1978 set the ANC on a course of mass mobilisation at home.",
      },
      childText: {
        en: "After 1976 many young South Africans escaped the country. Oliver started a school for them in Tanzania, and a secret radio station, Radio Freedom, so that people at home could hear the ANC. He also made rules to protect women in the movement.",
      },
      imagePrompt:
        "A 1970s radio studio in Lusaka, a microphone on a stand, reel-to-reel tape machines and a mixing desk, a small red 'on air' lamp glowing, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4610,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (the Solomon Mahlangu school in Tanzania after 1976; Pallo Jordan and Radio Freedom in Lusaka, on which Tambo often spoke; the code of conduct on women's rights; the 1978 Vietnam visit and the strategy of mass mobilisation).",
    },
    {
      id: "decisions-of-war",
      title: { en: "The decisions of war" },
      text: {
        en: "Leading an army meant decisions that cost lives. On 20 May 1983 an MK car bomb exploded outside the South African Air Force headquarters in Church Street, Pretoria, killing 19 people, among them the two MK operatives, and injuring more than 200. In its own submission to the Truth and Reconciliation Commission in 1997, the ANC said that Tambo had given the operation final approval, with instructions to take great care that the target was unmistakably military; the same submission said that by 1983 the unit no longer reported to him directly. In the same years, cadres in the ANC's camps in Angola mutinied, and he appointed a commission to investigate; a code of conduct followed in 1985, but, in the words of South African History Online, abuse in the camps did not stop. In 1988, after MK attacks on fast-food outlets, he insisted that the ANC avoid the loss of civilian life.",
      },
      childText: {
        en: "As the leader of an army, Oliver made hard decisions. In 1983 the ANC set off a bomb outside an air force building in Pretoria, and 19 people were killed. Years later the ANC said Oliver had approved it. In the ANC's camps some fighters were treated badly, and it did not stop. Oliver told his army that ordinary people must not be harmed.",
      },
      imagePrompt:
        "A wide city street in Pretoria at dusk in the 1980s, jacaranda trees and office blocks, a row of empty bus stops, the light fading to grey, sombre, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4611,
      sourceNote:
        "SAPA, 12 May 1997, on the ANC's second submission to the TRC (Tambo gave final approval, 'taking great care that the target was unmistakably military'; by 1983 special operations command no longer reported directly to him; 20 May 1983 at SAAF headquarters, Church Street; 19 killed including the MK operatives; more than 200 injured; ); South African History Online, 'Oliver Tambo' (the Angola mutinies and the Stuart Commission; the 1985 Kabwe code of conduct; 'despite the code, abuse in the camps did not stop'; the 1988 insistence on avoiding civilian loss after attacks on fast-food outlets). Wikipedia says the TRC 'identified' Tambo; the source it cites is the ANC's own submission, which is how this page states it.",
    },
    {
      id: "ungovernable",
      title: { en: "\"Render South Africa ungovernable\"" },
      text: {
        en: "On 8 January 1985 he called on South Africans to \"render South Africa ungovernable\". That year he met a delegation of the country's leading businessmen, and gave evidence to a committee of the British House of Commons. In 1987 he set up a commission of ANC lawyers to draft a constitution, pressing for multiparty democracy and an entrenched bill of rights, and at the same time directed Operation Vula, a secret mission to build networks and arms caches inside the country. In 1989 he led the drafting of the Harare Declaration, setting out the conditions for negotiations — and that year a severe stroke took away his speech.",
      },
      childText: {
        en: "In 1985 Oliver called on people to make South Africa impossible to govern under apartheid. He met business leaders and foreign governments, and asked lawyers to write a plan for a fair constitution. In 1989 he became very ill and lost his ability to speak.",
      },
      imagePrompt:
        "A conference room in Harare in 1989, a long table with papers, water glasses and a single microphone, afternoon light through blinds, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4612,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (the 8 January 1985 call to 'render South Africa ungovernable'; the 1985 meeting with business leaders and the House of Commons evidence; the 1987 constitutional commission, multiparty democracy and a bill of rights; Operation Vula; the Harare Declaration; the 1989 stroke and loss of speech).",
    },
    {
      id: "home",
      title: { en: "Home" },
      text: {
        en: "In December 1990, after thirty years away, he came home. He could not speak to the crowd at the airport; 70,000 people welcomed him at Orlando Stadium. At the ANC's 1991 conference he stood for no office, the post of National Chairperson was created for him, and Mandela became president. He was installed as Chancellor of Fort Hare, the university that had expelled him. He died on 24 April 1993, aged 75. His gravestone carries his own words: \"It is our responsibility to break down barriers of division and create a country where there will be neither Whites nor Blacks, just South Africans, free and united in diversity.\" On what would have been his 89th birthday, 27 October 2006, Johannesburg's international airport was renamed O. R. Tambo.",
      },
      childText: {
        en: "In 1990 Oliver came home after thirty years. He could not speak any more, but 70,000 people came to welcome him. He died on 24 April 1993. Today South Africa's biggest airport is named after him: O. R. Tambo International.",
      },
      imagePrompt:
        "Orlando Stadium in Soweto on a summer afternoon in 1990, a stage with flags in black, green and gold, the stands empty and waiting, bright sun, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4613,
      sourceNote:
        "South African History Online, 'Oliver Tambo' (return in December 1990; unable to address the crowd at the airport; 70,000 at Orlando Stadium; the 1991 conference and the National Chairperson post; Chancellor of Fort Hare; death on 24 April 1993; his epitaph); Wikipedia, 'Oliver Tambo' (aged 75); Wikipedia, 'O. R. Tambo International Airport' (renamed on 27 October 2006). SAHO gives a heart attack as the cause, Wikipedia complications of a stroke; the book gives neither.",
    },
  ],
};
