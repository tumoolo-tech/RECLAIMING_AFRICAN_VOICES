import type { Module } from "./types";

// "Nelson Mandela" — a life, told as a book (SP-120). Tumo, 2026-09-29: "now do a story for
// mandela", after the Steve Biko (SP-118) and Winnie Madikizela-Mandela (SP-119) books — the same
// form, the same rules.
//
// NOT A SAINT'S LIFE. The easy version of Mandela is the smiling elder who forgave everyone. The
// sources tell a harder story, and the book keeps it: he chose armed struggle in 1961 and led a
// sabotage campaign; the governments of the US and Britain called his ANC terrorist, and the US kept
// him on its watch list until 2008; the Truth Commission he set up investigated the ANC as well as
// the state; and critics said his government did too little against HIV/AIDS — a charge he answered,
// after office, by making it his cause. Each of these is told in the words of its source.
//
// A BIOGRAPHY, NOT HIS WRITINGS. Long Walk to Freedom (1994) is in copyright and nothing of it is
// reproduced. The one quotation is his statement from the dock at the Rivonia Trial, a court record
// already on his president page. Every scene is the project's own telling of facts from the
// references below; each `sourceNote` names what it rests on. Researched 2026-09-29.
//
// THE UNISA THREAD IS REAL, NOT DECORATION. The Nelson Mandela Foundation records that he completed
// his BA through the University of South Africa (graduating at Fort Hare in 1943) and his LLB through
// UNISA in 1989, in prison. The hackathon this project was built for is UNISA's; the book states the
// fact and leaves it there.
//
// THIS RESEARCH CORRECTED THE PRESIDENT PAGE, carried into presidents.ts: exact birth and death
// dates, and where he died (at home in Houghton) and was arrested (near Howick).
//
// PICTURES ARE OF PLACES, NEVER OF HIM. AI interpretations of settings, every prompt forbidding
// faces. No photograph of him is in the book: none in the repo has a recorded source.
//
// CHILD MODE CHANGES THE WORDS, NOT THE FACTS — including the armed struggle and the AIDS criticism.
//
// NOTE(setswana): no translations yet. Every page falls back to English, labelled as such.

export const mandela: Module = {
  id: "mandela",
  kind: "atlas",
  // Not plain "Nelson Mandela": that is his president page's name, and on a tie the topic scanner
  // ranks "module" before "president" — every place page that names him would have linked here
  // instead of to his page. The book is reached from that page's button and from the Atlas.
  title: "The Life of Nelson Mandela",
  author: "A life · Reclaimed Voices",
  source: "South African History Online; the Nelson Mandela Foundation; and others — see references.",
  audience: "Teens & adults (Child mode for younger readers) — resistance, prison, and the making of a democracy",
  blurb: {
    en: "A boy from Mvezo who became a lawyer, a commander of an armed struggle, a prisoner for 27 years and the first president of a democratic South Africa — a UNISA graduate twice over. His life, told without the halo.",
  },
  archivePrompt: {
    en: "Where were you on 11 February 1990, or on 27 April 1994? Add your family's memory of that day to the archive.",
  },
  references: [
    "South African History Online — 'Nelson Rolihlahla Mandela' (sahistory.org.za/people/nelson-rolihlahla-mandela)",
    "Nelson Mandela Foundation — 'Biography of Nelson Mandela' (nelsonmandela.org/biography)",
    "Wikipedia — 'Nelson Mandela' (for the flight from the arranged marriage, the sabotage campaign's aims, the watch list, the 1995 final, the AIDS record and his son's death, the lying in state and funeral; each traced there to its own citation)",
    "Court record, State v. Nelson Mandela and others (the Rivonia Trial), statement from the dock, 20 April 1964",
  ],
  // Not built on one work: authored by the project from the references above, in its own words.
  rights: {
    status: "original",
    basis: "Authored by the project from the cited references, in its own words; none of Nelson Mandela's own books are reproduced. The one quotation is from the Rivonia Trial court record.",
  },

  scenes: [
    {
      id: "mvezo",
      title: { en: "Rolihlahla" },
      text: {
        en: "He was born on 18 July 1918 in Mvezo, in the Eastern Cape, and named Rolihlahla. His father, Henry Mgadla Mandela, was a chief and a councillor to the paramount chief of the Thembu. He grew up in his mother's homestead in the village of Qunu, herding cattle with the other boys. At school his teacher, Miss Mdingane, gave him an English name, as was the custom: Nelson.",
      },
      childText: {
        en: "Nelson Mandela was born on 18 July 1918 in Mvezo, in the Eastern Cape. His first name was Rolihlahla. He grew up in the village of Qunu, looking after cattle with the other boys. His teacher gave him the name Nelson.",
      },
      imagePrompt:
        "Rolling green hills around Qunu in the Eastern Cape in the 1920s, a homestead of rondavels, cattle grazing, a river in the valley, early morning light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4301,
      sourceNote:
        "South African History Online, 'Nelson Rolihlahla Mandela' (18 July 1918, Mvezo; Rolihlahla; his father a chief and councillor to the Thembu paramount chief); Wikipedia, 'Nelson Mandela' (his mother's homestead at Qunu, herding); Nelson Mandela Foundation, 'Biography' (Miss Mdingane and the name Nelson).",
    },
    {
      id: "great-place",
      title: { en: "The Great Place" },
      text: {
        en: "When he was about nine his father died, and his mother took him to the Great Place at Mqhekezweni, to be raised by the Thembu regent, Chief Jongintaba Dalindyebo. He was schooled at Clarkebury and at Healdtown, where he matriculated in 1938, and began a BA at the University of Fort Hare. In 1940 he left Fort Hare after a dispute over student council elections.",
      },
      childText: {
        en: "When Nelson was about nine, his father died. He went to live with a Thembu chief called Jongintaba, who raised him like his own son. He went to good schools and then to university at Fort Hare, but he left after a protest about student elections.",
      },
      imagePrompt:
        "A royal homestead in the Eastern Cape in the late 1920s, a large rondavel and a whitewashed house among trees, a cattle kraal, soft evening light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4302,
      sourceNote:
        "Wikipedia, 'Nelson Mandela' (his father's death when he was about nine; Mqhekezweni; Jongintaba Dalindyebo; Fort Hare from 1939); South African History Online (Clarkebury, 1934; Healdtown, matriculated 1938; left Fort Hare in 1940 over an SRC election dispute).",
    },
    {
      id: "johannesburg",
      title: { en: "Johannesburg" },
      text: {
        en: "Home at Mqhekezweni in December 1940, he found the regent had arranged a marriage for him. He fled, and reached Johannesburg in April 1941. There he completed his BA through the University of South Africa, went back to Fort Hare to graduate in 1943, and began to study law at the University of the Witwatersrand.",
      },
      childText: {
        en: "When Nelson learned that a wife had been chosen for him, he ran away to Johannesburg. There he finished his degree by studying through UNISA, and began to study law.",
      },
      imagePrompt:
        "Johannesburg in the early 1940s seen from a distance, mine dumps and headgear on the horizon, a busy street of low buildings, hazy golden light, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4303,
      sourceNote:
        "Wikipedia, 'Nelson Mandela' (the arranged marriage, December 1940; reaching Johannesburg in April 1941); Nelson Mandela Foundation, 'Biography' (BA through the University of South Africa; graduation at Fort Hare, 1943); South African History Online (law at the University of the Witwatersrand).",
    },
    {
      id: "youth-league",
      title: { en: "The Youth League" },
      text: {
        en: "In 1944 he joined the African National Congress and helped form its Youth League. In the Defiance Campaign of 1952 he was the national 'Volunteer-in-Chief', leading the campaign against unjust laws. In December of that year Oliver Tambo joined him as a partner in his law practice — the first African-run legal partnership in the country.",
      },
      childText: {
        en: "In 1944 Nelson joined the ANC and helped start its Youth League. In 1952 he led a campaign of people who broke unfair laws on purpose, peacefully. He and his friend Oliver Tambo opened a law firm together — the first one run by Black lawyers.",
      },
      imagePrompt:
        "A 1950s Johannesburg street corner with a modest office building, a painted sign too blurred to read, a window with legal books, afternoon light, no people, no faces, cinematic, painterly, artistic interpretation, no readable text",
      seed: 4304,
      sourceNote:
        "South African History Online, 'Nelson Rolihlahla Mandela' (joined the ANC in 1944 and helped form the Youth League; national Volunteer-in-Chief of the 1952 Defiance Campaign; Tambo a partner from December 1952, the first African-run legal partnership).",
    },
    {
      id: "treason-trial",
      title: { en: "The Treason Trial" },
      text: {
        en: "In 1956 he was among the leaders charged with treason. The trial dragged on for more than four years. In the middle of it, in 1958, he married Winnie Madikizela. In March 1961 Justice Rumpff found him and the remaining accused not guilty.",
      },
      childText: {
        en: "In 1956 the government put Nelson and many other leaders on trial, saying they were traitors. The trial lasted more than four years. In 1961 the judge said they were not guilty.",
      },
      imagePrompt:
        "The interior of an old drill hall used as a courtroom in the late 1950s, rows of empty benches and a raised bench for judges, dusty light through tall windows, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4305,
      sourceNote:
        "South African History Online, 'Nelson Rolihlahla Mandela' (the Treason Trial, 1956–1961; acquitted by Justice Rumpff with the remaining 36 accused in March 1961); South African History Online, 'Winnie Madikizela-Mandela' (married 14 June 1958).",
    },
    {
      id: "umkhonto",
      title: { en: "Umkhonto we Sizwe" },
      text: {
        en: "In 1961, having been committed until then to non-violent protest, he helped found Umkhonto we Sizwe, the ANC's armed wing, and became its first Commander-in-Chief. It began a campaign of sabotage against military installations, power plants, telephone lines and transport links, meant to be carried out at night to avoid casualties. That choice is part of his story: the governments of the United States and Britain called the ANC terrorist, and the US kept Mandela on its terrorism watch list until 2008.",
      },
      childText: {
        en: "In 1961 Nelson decided that peaceful protest was not enough. He helped start Umkhonto we Sizwe, a secret army that blew up power lines and government buildings, trying not to hurt people. Some countries called him a terrorist for this — America kept his name on a list until 2008.",
      },
      imagePrompt:
        "An electricity pylon line crossing the empty Highveld at night, a sliver of moon, long grass, a deep blue sky, tense and quiet, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4306,
      sourceNote:
        "South African History Online, 'Nelson Rolihlahla Mandela' (Umkhonto we Sizwe; his appointment as its first Commander-in-Chief); Wikipedia, 'Nelson Mandela' (initially committed to non-violent protest; the sabotage campaign's targets and its aim of minimum casualties; Reagan's and Thatcher's governments considered the ANC a terrorist organisation; the US watch list until 2008).",
    },
    {
      id: "howick",
      title: { en: "Arrested near Howick" },
      text: {
        en: "He went underground. On 5 August 1962 police stopped the car he was travelling in, with Cecil Williams, just outside Howick in the Natal midlands, and arrested him. He was sentenced to five years' imprisonment.",
      },
      childText: {
        en: "Nelson hid from the police. On 5 August 1962 they caught him on a road near a town called Howick, and he was sent to prison for five years.",
      },
      imagePrompt:
        "A quiet country road through the Natal midlands in 1962, rolling green hills, gum trees and a wire fence, a grey afternoon sky, no cars, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4307,
      sourceNote:
        "South African History Online, 'Nelson Rolihlahla Mandela' (arrested 5 August 1962 just outside Howick; five years' imprisonment); Wikipedia, 'Nelson Mandela' (with Cecil Williams).",
    },
    {
      id: "rivonia",
      title: { en: "The Rivonia Trial" },
      text: {
        en: "In October 1963 he was brought from prison to stand trial again, with other leaders arrested at Liliesleaf Farm in Rivonia, charged with sabotage and conspiring to overthrow the government. He admitted to sabotage. On 20 April 1964 he spoke from the dock of a democratic and free society: \"It is an ideal which I hope to live for and to achieve. But if needs be, it is an ideal for which I am prepared to die.\" On 12 June 1964 all the accused were sentenced to life imprisonment.",
      },
      childText: {
        en: "In 1963 Nelson was put on trial again, with other leaders. He told the court that he had fought for a country where everyone is free and equal, and that he was ready to die for it. In 1964 he was sent to prison for life.",
      },
      imagePrompt:
        "The grand stone facade of an old Pretoria court building in the 1960s, wide steps and columns, a heavy overcast sky, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4308,
      sourceNote:
        "South African History Online, 'Nelson Rolihlahla Mandela' (the Rivonia Trial, October 1963 – June 1964; life sentences on 12 June 1964); Wikipedia, 'Nelson Mandela' (Liliesleaf Farm; the charges; he admitted sabotage); the statement from the dock, 20 April 1964 (court record).",
    },
    {
      id: "robben-island",
      title: { en: "Twenty-seven years" },
      text: {
        en: "He spent eighteen years on Robben Island, where the prisoners taught one another what they knew. On 31 March 1982 he was moved to Pollsmoor Prison in Cape Town, and on 7 December 1988, recovering from tuberculosis, to a house at Victor Verster Prison near Paarl. There, in 1989, he completed a law degree through the University of South Africa.",
      },
      childText: {
        en: "Nelson spent eighteen years in prison on Robben Island, an island near Cape Town. Later he was moved to other prisons. While still a prisoner, he finished a law degree through UNISA.",
      },
      imagePrompt:
        "Robben Island seen from the sea, a low limestone prison and a lighthouse, cold grey Atlantic water, a distant mainland shore, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4309,
      sourceNote:
        "Wikipedia, 'Nelson Mandela' (eighteen years on Robben Island; prisoners lecturing one another; tuberculosis); Nelson Mandela Foundation, 'Biography' (Pollsmoor, 31 March 1982; Victor Verster, 7 December 1988; LLB through the University of South Africa, 1989); South African History Online (Robben Island 1964–1982, Pollsmoor 1982–1988, Victor Verster 1988–1990).",
    },
    {
      id: "release",
      title: { en: "11 February 1990" },
      text: {
        en: "On Sunday 11 February 1990, after 27 years in prison, he walked out of Victor Verster, holding Winnie's hand, and the moment was broadcast live around the world. Years of negotiation followed. In 1993 he and President F.W. de Klerk were jointly awarded the Nobel Peace Prize.",
      },
      childText: {
        en: "On 11 February 1990 Nelson walked out of prison after 27 years, and people all over the world watched on television. He then worked with President F.W. de Klerk to end apartheid, and in 1993 they both won the Nobel Peace Prize.",
      },
      imagePrompt:
        "An open prison gate on a sunny road near Paarl, vineyards and mountains beyond, a bright summer morning, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4310,
      sourceNote:
        "South African History Online, 'Nelson Rolihlahla Mandela' (released from Victor Verster on Sunday 11 February, after 27 years); Wikipedia, 'Nelson Mandela' (holding Winnie's hand; broadcast live); Nelson Mandela Foundation, 'Biography' (the 1993 Nobel Peace Prize, jointly with F.W. de Klerk).",
    },
    {
      id: "president",
      title: { en: "President" },
      text: {
        en: "On 27 April 1994, at 75, he voted for the first time in his life. On 9 May he was elected president unopposed, and he was inaugurated the next day. His government set up the Truth and Reconciliation Commission, chaired by Archbishop Tutu, to investigate crimes committed under apartheid by both the state and the ANC, and a new constitution was agreed in May 1996. At the 1995 Rugby World Cup final he wore a Springbok shirt and handed the trophy to the Afrikaner captain, Francois Pienaar. Critics, among them Edwin Cameron, said his government did too little against HIV/AIDS; by 1999 one South African in ten was HIV positive. He stepped down in June 1999, after one term.",
      },
      childText: {
        en: "In 1994 Nelson voted for the very first time — and he was chosen as South Africa's first president elected by all its people. He worked to bring South Africans together. But some people said his government did not do enough to fight the illness HIV/AIDS. After five years he chose to step down.",
      },
      imagePrompt:
        "The Union Buildings in Pretoria on a clear autumn morning, terraced gardens and sandstone colonnades, flags on tall poles, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4311,
      sourceNote:
        "Nelson Mandela Foundation, 'Biography' (voted for the first time on 27 April 1994; stepped down in 1999 after one term); South African History Online (elected unopposed on 9 May, inaugurated the next day; retired in June 1999); Wikipedia, 'Nelson Mandela' (the TRC investigating both the government and the ANC, chaired by Tutu; the constitution agreed in May 1996; the Springbok shirt and Francois Pienaar; Edwin Cameron's criticism and the 10% figure for 1999).",
    },
    {
      id: "qunu",
      title: { en: "Home to Qunu" },
      text: {
        en: "After office he gave much of his time to the fight against HIV/AIDS, through the Nelson Mandela Foundation, founded in 1999. In January 2005 he announced that his son Makgatho had died of AIDS, to break the silence around the disease. He died at his home in Houghton, Johannesburg, on 5 December 2013, aged 95. He lay in state at the Union Buildings, and on 15 December he was buried in Qunu, the village where he grew up.",
      },
      childText: {
        en: "When he was no longer president, Nelson worked hard to help people with HIV/AIDS. When his own son died of AIDS, he told everyone, so that people would stop being ashamed to talk about it. He died on 5 December 2013, aged 95, and was buried in Qunu, where he grew up.",
      },
      imagePrompt:
        "The hills of Qunu at dusk, a quiet homestead and a single tree on a ridge, a wide peaceful sky turning gold, no people, no faces, cinematic, painterly, artistic interpretation, no text",
      seed: 4312,
      sourceNote:
        "Wikipedia, 'Nelson Mandela' (the Nelson Mandela Foundation, founded 1999, and his AIDS work; Makgatho's death announced in January 2005; lying in state at the Union Buildings, 11–13 December; state funeral in Qunu, 15 December 2013); Nelson Mandela Foundation, 'Biography' (died at his home in Johannesburg, 5 December 2013); South African History Online (Houghton Estate).",
    },
  ],
};
