// Everything connected to a topic, rendered in tiers that cannot be mistaken for one another.
//
// THE RENDERING IS PART OF THE INTEGRITY ARGUMENT, not decoration. SP-041 already said a `direct`
// link and a `thematic` one must look different, because collapsing them would let the app imply
// that standing somewhere puts you where the history happened when it does not — a false
// historical statement arrived at through layout rather than prose. Mentions add a third tier and
// the same reasoning applies one step further down.
//
// What each tier is allowed to say:
//
//   direct    the event happened here, or the person lived, worked or is memorialised here.
//             Authored, with a reason. Full weight.
//   thematic  a topical association. Authored, with a reason. Marked "related", never offered as
//             a place to visit.
//   mention   this page's own already-sourced prose contains that topic's name. NOT authored, so
//             no reason is shown — the matched words are quoted instead, and they are the whole
//             claim. A reader can see the app is pointing at its own sentence rather than
//             asserting a connection someone vouched for.
//
// The heading for the third tier says MENTIONED, never "related". "Related" is SP-041's reserved
// word for an authored thematic call, and diluting it would collapse the distinction in language
// after taking care to keep it in layout.
//
// Decisions: docs/sim_plan.md §4.12 (SP-090, SP-094, SP-097) · §9 for direct vs thematic.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "../ui";
import { PressScale } from "./Motion";
import { relatedTo, type Related, type RelatedLink, type RelatedMention } from "../content/topics";
import type { ContentRef } from "../content/topic-links";
import { colors, spacing, radius, fonts } from "../theme/tokens";
import { t } from "../i18n";
import type { LangCode } from "../i18n/languages";

const UI = {
  // Two headings for the same tier, because "here" is a claim about location. On a place it is
  // exactly right. On Nelson Mandela's page it said "What happened here" above a list of places
  // he lived and was imprisoned in — he is not somewhere you can stand, and the word quietly
  // turned a person into one. Seen on screen, not caught by any test.
  happenedHere: {
    en: "What happened here", tn: "Se se diragetseng fano", af: "Wat hier gebeur het", zu: "Okwenzeka lapha", xh: "Okwenzeka apha",
    nso: "Se se diregilego mo", st: "Se etsahetseng mona", ss: "Lokwenteka lapha", ts: "Leswi humeleleke laha", nr: "Okwenzeka lapha", ve: "Zwe zwa itea hafha",
  },
  directlyConnected: {
    en: "Directly connected", tn: "Go amana ka tlhamalalo", af: "Direk verbonde", zu: "Okuxhumene ngqo", xh: "Okunxulumene ngokuthe ngqo",
    nso: "Go swaragana ka go lebanya", st: "Ho amana ka kotloloho", ss: "Lokuchumene ngco", ts: "Leswi fambelanaka hi ku kongoma", nr: "Okuhlangene ngqo", ve: "Zwo tshimbidzanaho zwo livhaho",
  },
  related: {
    en: "Related", tn: "Tse di amanang", af: "Verwant", zu: "Okuhlobene", xh: "Okunxulumene",
    nso: "Tše di swanago", st: "Tse amanang", ss: "Lokuhlobene", ts: "Leswi fambelanaka", nr: "Okuhlobeneko", ve: "Zwo elanaho",
  },
  mentionedHere: {
    en: "Also mentioned here", tn: "Go umakilwe gape fano", af: "Ook hier genoem", zu: "Okushiwo nalapha", xh: "Okukhankanywe nalapha",
    nso: "Go boletšwe le mo", st: "Ho boletswe le mona", ss: "Lokuphindze kubalwe lapha", ts: "Leswi nakambe swi boxiweke laha", nr: "Okukhulunywa ngakho lapha", ve: "Zwo dovha zwa bulwa hafha",
  },
  mentionedIn: {
    en: "Mentioned in", tn: "Go umakilwe mo go", af: "Genoem in", zu: "Okushiwo ku", xh: "Ekukhankanywe kuyo",
    nso: "Go boletšwe go", st: "Ho boletswe ho", ss: "Lokubalwa ku", ts: "Swi boxiwe eka", nr: "Okukhulunywa ngakho ku", ve: "Zwo bulwa kha",
  },
  // Spoken to a screen reader so the tier is audible, not only visible (SP-043). A sighted reader
  // gets the distinction from weight and the quotation marks; without this, a blind reader would
  // hear a curated link and a mention as the same thing.
  a11yMention: {
    en: "mentioned in this text", tn: "go umakilwe mo mokwalong ono", af: "in hierdie teks genoem", zu: "okushiwo kulo mbhalo", xh: "ekukhankanywe kulo mbhalo",
    nso: "go boletšwe ka mo sengwalweng se", st: "ho boletswe mongolong ona", ss: "lokubalwe kulombhalo", ts: "swi boxiwile eka tsalwa leri", nr: "okukhulunywa ngakho kulokhu okutlolweko", ve: "zwo bulwa kha ḽiṅwalo ḽino",
  },
};

/** Incoming mentions are capped. One topic can be named by many others — Nelson Mandela is named
 *  by ten places — and an uncapped list would turn his page into a link farm while telling a
 *  reader nothing. Outgoing mentions are NOT capped: those are the words on this page, and hiding
 *  one would mean showing a reader part of their own paragraph. */
const MAX_INCOMING = 8;

function Row({
  name,
  detail,
  quoted,
  tag,
  a11y,
  onPress,
}: {
  name: string;
  detail?: string;
  quoted?: boolean;
  tag?: string;
  a11y: string;
  onPress: () => void;
}) {
  return (
    <PressScale style={quoted ? s.rowQuiet : s.row} onPress={onPress} accessibilityLabel={a11y}>
      <View style={s.rowText}>
        <View style={s.rowHead}>
          <Text style={quoted ? s.nameQuiet : s.name}>{name}</Text>
          {tag ? <Text style={s.tag}>{tag}</Text> : null}
        </View>
        {detail ? <Text style={quoted ? s.detailQuiet : s.detail}>{detail}</Text> : null}
      </View>
      <Icon.ChevronRight size={14} color={quoted ? colors.muted : colors.gold} />
    </PressScale>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.block}>
      <Text style={s.blockLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function RelatedTopics({
  refTo,
  lang,
  onOpenRef,
  related,
}: {
  refTo: ContentRef;
  lang: LangCode;
  onOpenRef: (ref: ContentRef) => void;
  /** Injectable so the resolver can be exercised directly in a test. Defaults to the real data. */
  related?: Related;
}) {
  const { curated, mentions } = related ?? relatedTo(refTo);

  const direct = curated.filter((c) => c.relation === "direct");
  const thematic = curated.filter((c) => c.relation === "thematic");
  const outgoing = mentions.filter((m) => m.direction === "out");
  const incoming = mentions.filter((m) => m.direction === "in").slice(0, MAX_INCOMING);

  if (!direct.length && !thematic.length && !outgoing.length && !incoming.length) return null;

  const open = (r: { topic: { kind: ContentRef["kind"]; id: string } }) =>
    onOpenRef({ kind: r.topic.kind, id: r.topic.id });

  const curatedRow = (c: RelatedLink, tag?: string) => (
    <Row
      key={`c:${c.topic.kind}:${c.topic.id}`}
      name={c.topic.name}
      detail={c.why}
      tag={tag}
      a11y={`${c.topic.name} — ${c.why}`}
      onPress={() => open(c)}
    />
  );

  // Nobody wrote a reason, so none is shown — the matched words are the whole claim (SP-090).
  //
  // The quote appears ONLY when the matched words differ from the topic's name. Most of the time
  // they are identical, and a row reading `Mandela House / "Mandela House"` says the same thing
  // twice and teaches a reader to stop reading the second line. Where they differ — the page said
  // "Mandela" and the topic is "Nelson Mandela" — the quote is doing real work: it shows which
  // words on THIS page were matched, so the reader can find them and judge the link themselves.
  const mentionRow = (m: RelatedMention) => {
    const showsSomethingNew = m.surface !== m.topic.name;
    return (
      <Row
        key={`m:${m.topic.kind}:${m.topic.id}:${m.direction}`}
        name={m.topic.name}
        detail={showsSomethingNew ? `“${m.surface}”` : undefined}
        quoted
        a11y={`${m.topic.name}, ${t(UI.a11yMention, lang)}`}
        onPress={() => open(m)}
      />
    );
  };

  return (
    <>
      {direct.length ? <Block label={t(refTo.kind === "place" ? UI.happenedHere : UI.directlyConnected, lang)}>{direct.map((c) => curatedRow(c))}</Block> : null}
      {thematic.length ? (
        <Block label={t(UI.related, lang)}>{thematic.map((c) => curatedRow(c, t(UI.related, lang)))}</Block>
      ) : null}
      {outgoing.length ? <Block label={t(UI.mentionedHere, lang)}>{outgoing.map(mentionRow)}</Block> : null}
      {incoming.length ? <Block label={t(UI.mentionedIn, lang)}>{incoming.map(mentionRow)}</Block> : null}
    </>
  );
}

const s = StyleSheet.create({
  block: { marginTop: spacing.lg },
  blockLabel: {
    color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2,
    textTransform: "uppercase", marginBottom: spacing.sm,
  },
  // Curated: the accent treatment the tourism layer already uses for something authored.
  row: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs,
    backgroundColor: "rgba(26,133,167,0.10)", borderWidth: 1, borderColor: "rgba(26,133,167,0.55)",
    borderRadius: radius.md, paddingVertical: 10, paddingLeft: 13, paddingRight: 9,
  },
  // Mention: no accent, no fill, a hairline only. Visibly the weakest thing on the page.
  rowQuiet: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs,
    borderWidth: 1, borderColor: colors.line, borderRadius: radius.md,
    paddingVertical: 9, paddingLeft: 13, paddingRight: 9,
  },
  rowText: { flex: 1 },
  rowHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { color: "#fff", fontFamily: fonts.bodyMedium, fontSize: 13 },
  nameQuiet: { color: "rgba(255,255,255,0.82)", fontFamily: fonts.body, fontSize: 12.5 },
  detail: { color: "rgba(255,255,255,0.7)", fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 3 },
  detailQuiet: { color: colors.muted, fontFamily: fonts.body, fontSize: 11.5, lineHeight: 17, marginTop: 2, fontStyle: "italic" },
  tag: {
    color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
