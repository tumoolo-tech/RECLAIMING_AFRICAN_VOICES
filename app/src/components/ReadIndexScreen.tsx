import React from "react";
import { Pressable, StyleSheet, Platform, type GestureResponderEvent } from "react-native";
import { Lang } from "../content/types";
import { modules, atlasModules, moduleById } from "../content";
import { stories, storyById } from "../content/stories";
import { t } from "../i18n";
import { Screen, ScreenHeader, Card, Title, Body, Meta, Muted, SectionLabel } from "../ui";
import { spacing, colors } from "../theme/tokens";
import { readCatalog, type ReadEntry, type ReadGroupId } from "../read-links";

// /read — every book and story in the app, each with its own link, for people who want to read one
// on its own or send it to someone. Reached by its address (and from a link someone shared); the nav
// is not changed (v2 D1). The grouping and the addresses come from read-links.ts, which is tested.
//
// UI strings: machine-quality in the ten non-English languages and not yet reviewed (LANG-13).

const UI = {
  kicker: {
    en: "Read", tn: "Bala", af: "Lees", zu: "Funda", xh: "Funda",
    nso: "Bala", st: "Bala", ss: "Fundza", ts: "Hlaya", nr: "Funda", ve: "Vhala",
  },
  title: {
    en: "All the stories", tn: "Dikanegelo tsotlhe", af: "Al die verhale", zu: "Zonke izindaba", xh: "Onke amabali",
    nso: "Dikanegelo ka moka", st: "Dipale tsohle", ss: "Tonkhe tindzaba", ts: "Mintsheketo hinkwayo", nr: "Zoke iindaba", ve: "Zwiitwa zwoṱhe",
  },
  intro: {
    en: "Every book and story in the app, each with its own link to share.",
    tn: "Buka le kanegelo nngwe le nngwe mo app, nngwe le nngwe e na le linki ya yone go e abelana.",
    af: "Elke boek en verhaal in die app, elk met sy eie skakel om te deel.",
    zu: "Yonke incwadi nendaba ku-app, ngayinye inesixhumanisi sayo sokwabelana.",
    xh: "Yonke incwadi nebali kwi-app, nganye inekhonkco layo lokwabelana.",
    nso: "Puku le kanegelo ye nngwe le ye nngwe ka go app, ye nngwe le ye nngwe e na le linki ya yona ya go abelana.",
    st: "Buka le pale e nngwe le e nngwe ho app, e nngwe le e nngwe e na le sehokelo sa yona sa ho arolelana.",
    ss: "Yonkhe incwadzi nendzaba ku-app, ngayinye inelinki yayo yekwabelana.",
    ts: "Buku ni ntsheketo yin'wana ni yin'wana eka app, yin'wana ni yin'wana yi ni linki ya yona yo avelana.",
    nr: "Yoke incwadi nendaba ku-app, ngayinye inelinki yayo yokwabelana.",
    ve: "Bugu na tshiitwa tshiṅwe na tshiṅwe kha app, tshiṅwe na tshiṅwe tshi na linki yatsho ya u kovhekana.",
  },
  notFound: {
    en: "There is no story at that link. Here is everything you can read.",
    tn: "Ga go na kanegelo mo linking eo. Fa ke tsotlhe tse o ka di balang.",
    af: "Daar is geen verhaal by daardie skakel nie. Hier is alles wat jy kan lees.",
    zu: "Ayikho indaba kulesi sixhumanisi. Nakhu konke ongakufunda.",
    xh: "Akukho bali kweli khonkco. Nantsi yonke into onokuyifunda.",
    nso: "Ga go na kanegelo go linki yeo. Se ke tšohle tšeo o ka di balago.",
    st: "Ha ho pale sehokelong seo. Mona ke tsohle tseo o ka di balang.",
    ss: "Ayikho indzaba kulelinki. Nakhu konkhe longakufundza.",
    ts: "A ku na ntsheketo eka linki yoleyo. Hi leswi hinkwaswo u nga swi hlayaka.",
    nr: "Ayikho indaba kulelinki. Nakhu koke ongakufunda.",
    ve: "A hu na tshiitwa kha linki iyo. Hezwi ndi zwoṱhe zwine wa nga zwi vhala.",
  },
  lives: {
    en: "Lives", tn: "Matshelo", af: "Lewens", zu: "Izimpilo", xh: "Ubomi",
    nso: "Maphelo", st: "Maphelo", ss: "Timphilo", ts: "Vutomi", nr: "Iimpilo", ve: "Matshilo",
  },
  literature: {
    en: "Literature", tn: "Dikwalo", af: "Letterkunde", zu: "Imibhalo", xh: "Uncwadi",
    nso: "Dingwalo", st: "Dingolwa", ss: "Imibhalo", ts: "Matsalwa", nr: "Iincwadi", ve: "Maṅwalwa",
  },
  heritage: {
    en: "Heritage", tn: "Boswa", af: "Erfenis", zu: "Amagugu", xh: "Ilifa",
    nso: "Bohwa", st: "Lefa", ss: "Lifa", ts: "Ndzhaka", nr: "Ilifa", ve: "Ifa",
  },
  stories: {
    en: "Stories told in pictures", tn: "Dikanegelo ka ditshwantsho", af: "Verhale in prente", zu: "Izindaba ngezithombe", xh: "Amabali ngemifanekiso",
    nso: "Dikanegelo ka diswantšho", st: "Dipale ka ditshwantsho", ss: "Tindzaba ngetitfombe", ts: "Mintsheketo hi swifaniso", nr: "Iindaba ngeenthombe", ve: "Zwiitwa nga zwifanyiso",
  },
};

const GROUP_LABEL: Record<ReadGroupId, keyof typeof UI> = {
  lives: "lives",
  literature: "literature",
  heritage: "heritage",
  stories: "stories",
};

const CATALOG = readCatalog(modules, atlasModules, stories);

/** Title, byline and lead for one entry — a module's localized blurb, or a story's standfirst. */
function describe(e: ReadEntry, lang: Lang): { title: string; byline: string; lead: string } | null {
  if (e.route === "story") {
    const s = storyById(e.id);
    return s ? { title: s.title, byline: "", lead: s.standfirst } : null;
  }
  const m = moduleById(e.id);
  if (!m) return null;
  return { title: m.title, byline: m.year ? `${m.author} · ${m.year}` : m.author, lead: t(m.blurb, lang) };
}

export function ReadIndexScreen({
  lang,
  missing,
  onBack,
  onOpen,
}: {
  lang: Lang;
  /** The slug of a link that matched nothing, if that is how the reader got here. */
  missing?: string;
  onBack: () => void;
  onOpen: (e: ReadEntry) => void;
}) {
  // A real link on web — so it can be copied, long-pressed or opened in a new tab — while a plain
  // click still opens the story in place, without reloading the app.
  const press = (e: ReadEntry) => (ev: GestureResponderEvent) => {
    const ne = ev?.nativeEvent as unknown as { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; button?: number };
    if (Platform.OS === "web" && (ne?.metaKey || ne?.ctrlKey || ne?.shiftKey || ne?.button === 1)) return;
    (ev as unknown as { preventDefault?: () => void })?.preventDefault?.();
    onOpen(e);
  };

  return (
    <Screen tone="paper">
      <ScreenHeader kicker={t(UI.kicker, lang)} title={t(UI.title, lang)} lang={lang} onBack={onBack} />
      <Body style={styles.intro}>{t(UI.intro, lang)}</Body>
      {missing ? (
        <Card style={styles.notice}>
          <Muted>{t(UI.notFound, lang)}</Muted>
        </Card>
      ) : null}

      {CATALOG.map((g) => (
        <React.Fragment key={g.id}>
          <SectionLabel style={styles.group}>{t(UI[GROUP_LABEL[g.id]], lang)}</SectionLabel>
          {g.entries.map((e) => {
            const d = describe(e, lang);
            if (!d) return null;
            return (
              <Pressable
                key={e.id}
                onPress={press(e)}
                accessibilityRole="link"
                accessibilityLabel={d.title}
                style={({ pressed }) => [styles.press, pressed && styles.pressed]}
                {...(Platform.OS === "web" ? ({ href: e.path } as object) : {})}
              >
                <Card style={styles.card}>
                  <Title>{d.title}</Title>
                  {d.byline ? <Meta style={styles.meta}>{d.byline}</Meta> : null}
                  <Muted style={styles.lead} numberOfLines={3}>{d.lead}</Muted>
                  <Meta style={styles.path}>{e.path}</Meta>
                </Card>
              </Pressable>
            );
          })}
        </React.Fragment>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: spacing.lg },
  notice: { marginBottom: spacing.lg, borderColor: colors.gold, borderWidth: 1 },
  group: { marginTop: spacing.lg, marginBottom: spacing.sm },
  press: { marginBottom: spacing.md, borderRadius: 12 },
  pressed: { opacity: 0.85 },
  card: {},
  meta: { marginTop: 2 },
  lead: { marginTop: spacing.xs, lineHeight: 20 },
  // A link is typed and read back exactly, so it is shown as it is — not in Meta's capitals.
  path: { marginTop: spacing.sm, color: colors.gold, textTransform: "none", letterSpacing: 0 },
});
