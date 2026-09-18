import React from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { Lang } from "../content/types";
import { t } from "../i18n";
import { HERITAGE_ANCHORS, explorerUrl, explorerAddressUrl, shortHash } from "../content/heritage";
import { moduleById } from "../content";
import { Screen, ScreenHeader, Card, Body, Title, Meta, Muted, Icon } from "../ui";
import { colors, spacing, radius, type, fonts } from "../theme/tokens";

// The Heritage Ledger — the app's on-chain provenance. What is fingerprinted (SHA-256 + IPFS CID) and
// anchored on Solana is each module AS THE APP PUBLISHES IT — chain/anchor.mjs hashes
// JSON.stringify(module) — not the original work. So the guarantee is "what the app says about this
// work has not been quietly changed", which is true and useful; "the text is tamper-evident" was
// neither (issue #34). Each card also shows the work's rights status from module.rights, because one
// of the four is in copyright and the screen used to imply all were public.
// by anyone. POPIA-safe: only public works + hashes go on-chain — never a person's recording.
// See docs/11-blockchain-heritage-plan.md. Built on the UI kit.

const UI = {
  title: {
    en: "Heritage Ledger", tn: "Rekoto ya Boswa", af: "Erfenisregister", zu: "Irejista Yamagugu", xh: "Irejista Yelifa",
    nso: "Rejista ya Bohwa", st: "Rejista ya Lefa", ss: "Irejista Yelifa", ts: "Rejista ya Ndzhaka", nr: "Irejista Yelifa", ve: "Rejista ya Ifa",
  },
  // Issue #34. What the ledger fingerprints is chain/anchor.mjs's `JSON.stringify(mod)` — this app's
  // own adaptation module, NOT the original text. And one of the four works is in copyright. Both
  // facts are said here, in the reader's language, instead of "each text" and "public works".
  intro: {
    en: "What is fingerprinted here is this app's own adaptation of each work — the scenes as published — not the original text. Each adaptation carries a SHA-256 hash and an IPFS content ID anchored on a public blockchain, so anyone can check that what the app says about a work has not been quietly changed since. Three of the four works are public domain; one, Indaba, My Children, is still in copyright and is summarised here in our own words.",
    tn: "Se se tshwailweng fano ke phetolelo ya app eno ya tiro nngwe le nngwe — ditiragalo jaaka di phasaladitswe — e seng mokwalo wa ntlha. Phetolelo nngwe le nngwe e na le hash ya SHA-256 le IPFS content ID e e tshwaretsweng mo blockchain ya setšhaba, gore mongwe le mongwe a ka netefatsa gore se app e se buang ka tiro ga se a fetolwa ka sephiri. Ditiro di le tharo tsa tse nne ke tsa setšhaba; nngwe, Indaba, My Children, e sa ntse e na le tshwanelo ya mokwadi mme e sobokantswe fano ka mafoko a rona.",
    af: "Wat hier 'n vingerafdruk kry, is hierdie app se eie verwerking van elke werk — die tonele soos gepubliseer — nie die oorspronklike teks nie. Elke verwerking dra 'n SHA-256-hash en 'n IPFS-inhoud-ID wat op 'n openbare blockchain veranker is, sodat enigiemand kan nagaan dat wat die app oor 'n werk sê nie stilweg verander is nie. Drie van die vier werke is in die openbare domein; een, Indaba, My Children, is steeds onder kopiereg en word hier in ons eie woorde opgesom.",
    zu: "Okunikwa isigxivizo lapha ukuhlelwa kwale-app kwawo wonke umsebenzi — izigcawu njengoba zishicilelwe — hhayi umbhalo wokuqala. Ukuhlelwa ngakunye kuphethe i-hash ye-SHA-256 ne-IPFS content ID emiswe kublockchain yomphakathi, ukuze noma ubani ahlole ukuthi lokho i-app ekushoyo ngomsebenzi akushintshiwe ngasese. Imisebenzi emithathu kwemine ingeyomphakathi; owodwa, Indaba, My Children, usenelungelo lombhali futhi ufingqwe lapha ngamazwi ethu.",
    xh: "Oko kunikwa uphawu apha kukuhlengahlengiswa kwale app komsebenzi ngamnye — iimeko njengoko zipapashiwe — hayi umbhalo wokuqala. Uhlengahlengiso ngalunye luphethe i-hash ye-SHA-256 ne-IPFS content ID emiswe kwiblockchain yoluntu, ukuze nabani na akhangele ukuba oko i-app ikuthethayo ngomsebenzi akutshintshwanga ngasese. Imisebenzi emithathu kwemine yeyoluntu; omnye, Indaba, My Children, usenelungelo lokushicilela kwaye ushwankathelwe apha ngamazwi ethu.",
    nso: "Seo se swaiwago mo ke phetolelo ya app ye ya mošomo wo mongwe le wo mongwe — ditiragalo bjalo ka ge di phatlaladitšwe — e sego sengwalwa sa mathomo. Phetolelo ye nngwe le ye nngwe e na le hash ya SHA-256 le IPFS content ID yeo e tiišeditšwego go blockchain ya setšhaba, gore mang le mang a hlahlobe gore seo app e se bolelago ka mošomo ga se sa fetošwa ka sephiri. Mešomo ye meraro ya ye mene ke ya setšhaba; o tee, Indaba, My Children, o sa na le tokelo ya mongwadi gomme o akaretšwa mo ka mantšu a rena.",
    st: "Se tshwauoang mona ke phetolelo ya app ena ya mosebetsi o mong le o mong — liketsahalo joalo ka ha li phatlalalitsoe — eseng mongolo oa pele. Phetolelo e 'ngoe le e 'ngoe e na le hash ea SHA-256 le IPFS content ID e tiisitsoeng blockchaining ea setjhaba, e le hore mang kapa mang a ka netefatsa hore seo app e se buang ka mosebetsi ha sea fetoloa ka sekhutu. Mesebetsi e meraro ho e mene ke ea setjhaba; o mong, Indaba, My Children, o sa na le tokelo ea mongoli 'me o akaretsoa mona ka mantsoe a rona.",
    ss: "Lokuniketwa luphawu lapha kuhlelwa kwale-app kwawo wonkhe umsebenti — tigcawu njengobe tishicilelwe — hhayi umbhalo wekucala. Kuhlelwa ngakunye kuphetse i-hash ye-SHA-256 ne-IPFS content ID lemiswe kublockchain yemmango, kute nobe ngubani ahlole kutsi loko i-app lekushoko ngemsebenti akushintjwanga ngasese. Imisebenti lemitsatfu kulemine ingeyemmango; munye, Indaba, My Children, usenelilungelo lembhali futsi ufinyetwe lapha ngemavi etfu.",
    ts: "Leswi nyikiwaka xikombiso laha i ku hundzuluxa ka app leyi ka ntirho wun'wana ni wun'wana — swiyimo tanihi leswi swi kandziyisiweke — ku nga ri matsalwa yo sungula. Ku hundzuluxa kun'wana ni kun'wana ku ni hash ya SHA-256 ni IPFS content ID leyi simekiweke eka blockchain ya mani na mani, leswaku un'wana ni un'wana a kambela leswaku leswi app yi swi vulaka hi ntirho a swi cinciwanga hi xihundla. Mintirho yinharhu ya mune i ya mani na mani; wun'we, Indaba, My Children, wa ha ri ni mfanelo ya mutsari naswona wu katsakanyiwile laha hi marito ya hina.",
    nr: "Okunikelwa uphawu lapha kuhlelwa kwale-app kwawo woke umsebenzi — iingcenye njengombana zigadangisiwe — ingasi umtlolo wokuthoma. Ukuhlelwa ngakunye kuphethe i-hash ye-SHA-256 ne-IPFS content ID emiswe kublockchain yomphakathi, ukuze nanyana ngubani ahlole bona lokho i-app ekutjhoko ngomsebenzi akukatjhugululwa ngasese. Imisebenzi emithathu kwemine ingeyomphakathi; munye, Indaba, My Children, usesenelungelo lomtloli begodu urhunyeziwe lapha ngamezwi wethu.",
    ve: "Zwine zwa ṋewa tshiga hafha ndi u shandukisa ha app iyi ha mushumo muṅwe na muṅwe — zwiimo sa zwe zwa andadzwa — hu si maṅwalwa a u thoma. U shandukisa huṅwe na huṅwe hu na hash ya SHA-256 na IPFS content ID yo khwaṱhisedzwaho kha blockchain ya tshitshavha, uri muṅwe na muṅwe a ṱole uri zwine app ya zwi amba nga mushumo a zwo ngo shandulwa nga tshiphiri. Mishumo miraru ya miṋa ndi ya tshitshavha; muthihi, Indaba, My Children, u kha ḓi vha na pfanelo ya muṅwali nahone wo pfufhifhadzwa hafha nga maipfi ashu.",
  },
  popia: {
    en: "Privacy first (POPIA): only the app's adaptations and their hashes go on-chain — public bibliographic data, never a person's data. Community members' voice recordings are NEVER put on the blockchain — they stay in private, erasable storage you control.",
    tn: "Sephiri pele (POPIA): ke diphetolelo tsa app le di-hash tsa tsone fela tse di tsenngwang mo blockchain — dintlha tsa setšhaba tsa dibuka, e seng dintlha tsa motho. Dikgatiso tsa mantswe a maloko a setšhaba GA DI KE di tsenngwa mo blockchain — di sala mo polokelong ya sephiri e e ka phimolwang e o e laolang.",
    af: "Privaatheid eerste (POPIA): net die app se verwerkings en hul hashes gaan op die ketting — openbare bibliografiese data, nooit 'n persoon se data nie. Gemeenskapslede se stemopnames word NOOIT op die blockchain geplaas nie — hulle bly in private, uitveebare berging wat jy beheer.",
    zu: "Ubumfihlo kuqala (POPIA): ukuhlelwa kwe-app kuphela namahashi akho okubekwa kublockchain — imininingwane yomphakathi yezincwadi, hhayi neze imininingwane yomuntu. Ukuqoshwa kwamazwi amalungu omphakathi AKUFAKWA NEZE kublockchain — kuhlala kusitoreji esiyimfihlo, esisusekayo osilawulayo.",
    xh: "Ubumfihlo kuqala (POPIA): uhlengahlengiso lwe-app kuphela namahashi alo abekwa kwityathanga — iinkcukacha zoluntu zeencwadi, hayi konke iinkcukacha zomntu. Ukurekhodwa kwamazwi amalungu oluntu AKUFAKWA konke kwiblockchain — kuhlala kwindawo yokugcina eyimfihlo, enokucinywa oyilawulayo.",
    nso: "Sephiri pele (POPIA): ke diphetolelo tša app fela le di-hash tša tšona tše di bewago go blockchain — tshedimošo ya setšhaba ya dipuku, e sego tshedimošo ya motho le gatee. Direkoto tša mantšu a maloko a setšhaba GA di TSENYWE le gatee go blockchain — di dula ka polokelong ya sephiri, ye e ka phumolwago yeo o e laolago.",
    st: "Lekunutu pele (POPIA): ke liphetolelo tsa app feela le li-hash tsa tsona tse behuoang blockchaining — lintlha tsa setjhaba tsa libuka, eseng lintlha tsa motho le ka mohla. Direkoto tsa mantswe a litho tsa setjhaba HA li KENYUOE le kang blockchaining — li lula polokelong ya lekunutu, e ka hlakoloang eo o e laolang.",
    ss: "Kuyimfihlo kucala (POPIA): kuhlelwa kwe-app kuphela nemahashi ako lokubekwa kublockchain — imininingwane yemmango yetincwadzi, hhayi nakanye imininingwane yemuntfu. Kubhalwa kwemavi emalunga emmango AKUFAKWA nakanye kublockchain — kuhlala kusitoreji lesiyimfihlo, lesisusekako losilawulako.",
    ts: "Vuxihundla xo sungula (POPIA): i ku hundzuluxa ka app ntsena ni tihashi ta kona leti vekiwaka eka blockchain — vuxokoxoko bya mani na mani bya tibuku, ku nga ri vuxokoxoko bya munhu na kan'we. Ku rhekhodiwa ka marito ya swirho swa vaaki A SWI VEKIWI na kan'we eka blockchain — swi tshama eka vuhlayiselo bya xihundla, lebyi nga suriwaka lebyi u byi lawulaka.",
    nr: "Ubumfihlo kuthoma (POPIA): kuhlelwa kwe-app kwaphela namahashi wakho okubekwa kublockchain — imininingwana yomphakathi yeencwadi, ingasi nakanye imininingwana yomuntu. Ukubhalwa kwamezwi wamalunga womphakathi AKUFAKWA nakanye kublockchain — kuhlala kusitoreji esiyimfihlo, esisusekako osilawulako.",
    ve: "Vhudzumbe u thoma (POPIA): ndi u shandukisa ha app fhedzi na dzihash dzaho dzine dza vhewa kha blockchain — mafhungo a tshitshavha a bugu, hu si mafhungo a muthu na luthihi. U rekhodwa ha maipfi a miraḓo ya tshitshavha A ZWI VHEWI na luthihi kha blockchain — zwi dzula kha vhulungelo ha tshiphiri, hune ha nga siswa hune na ho langa.",
  },
  rights: {
    en: "Rights", tn: "Ditshwanelo", af: "Regte", zu: "Amalungelo", xh: "Amalungelo",
    nso: "Ditokelo", st: "Ditokelo", ss: "Emalungelo", ts: "Timfanelo", nr: "Amalungelo", ve: "Pfanelo",
  },
  verify: {
    en: "Verify on Solana", tn: "Netefatsa mo Solana", af: "Verifieer op Solana", zu: "Qinisekisa ku-Solana", xh: "Qinisekisa kwiSolana",
    nso: "Netefatša go Solana", st: "Netefatsa ho Solana", ss: "Cinisekisa ku-Solana", ts: "Tiyisisa eka Solana", nr: "Qinisekisa ku-Solana", ve: "Khwaṱhisedzani kha Solana",
  },
  pending: {
    en: "Anchoring pending", tn: "E emetse go tshwarwa", af: "Verankering hangende", zu: "Kulindwe ukumiswa", xh: "Kulindwe ukumiswa",
    nso: "Go tiišetša go emetše", st: "Ho tiisa ho emetse", ss: "Kulindzelwe kumiswa", ts: "Ku simeka ku ri karhi ku yimela", nr: "Kulindwe ukumiswa", ve: "U khwaṱhisedza hu kha ḓi lindela",
  },
  cidLabel: {
    en: "IPFS content ID", tn: "IPFS content ID", af: "IPFS-inhoud-ID", zu: "I-ID yokuqukethwe ye-IPFS", xh: "I-ID yomxholo ye-IPFS",
    nso: "IPFS content ID", st: "IPFS content ID", ss: "I-ID yalokucuketfwe ye-IPFS", ts: "IPFS content ID", nr: "I-ID yalokuqukethwe ye-IPFS", ve: "IPFS content ID",
  },
  hashLabel: {
    en: "SHA-256 fingerprint", tn: "Letshwao SHA-256", af: "SHA-256-vingerafdruk", zu: "Isigxivizo se-SHA-256", xh: "Uphawu lwe-SHA-256",
    nso: "Leswao la SHA-256", st: "Letshwao la SHA-256", ss: "Luphawu lwe-SHA-256", ts: "Xikombiso xa SHA-256", nr: "Uphawu lwe-SHA-256", ve: "Tshiga tsha SHA-256",
  },
  certLabel: {
    en: "Heritage certificate (token)", tn: "Setifikeiti sa boswa", af: "Erfenissertifikaat (token)", zu: "Isitifiketi samagugu (ithokheni)", xh: "Isatifikethi selifa (ithokheni)",
    nso: "Setifikeiti sa bohwa (thokheni)", st: "Setifikeiti sa lefa (thokheni)", ss: "Isitifiketi semagugu (ithokheni)", ts: "Xitifikheti xa ndzhaka (thokheni)", nr: "Isitifiketi samagugu (ithokheni)", ve: "Tshithifiketsi tsha ifa (thokheni)",
  },
  viewCert: {
    en: "View certificate", tn: "Bona setifikeiti", af: "Bekyk sertifikaat", zu: "Buka isitifiketi", xh: "Jonga isatifikethi",
    nso: "Lebelela setifikeiti", st: "Sheba setifikeiti", ss: "Buka isitifiketi", ts: "Vona xitifikheti", nr: "Buka isitifiketi", ve: "Vhonani tshithifiketsi",
  },
};

export function HeritageLedgerScreen({ lang, onBack }: { lang: Lang; onBack: () => void }) {
  return (
    <Screen tone="paper">
      <ScreenHeader kicker="On-chain provenance" title={t(UI.title, lang)} onBack={onBack} />

      <Body style={styles.intro}>{t(UI.intro, lang)}</Body>

      {HERITAGE_ANCHORS.map((a) => {
        const anchored = a.tx !== "pending" && a.tx.length > 0;
        return (
          <Card key={a.id} style={styles.card}>
            <Title style={styles.workTitle}>{a.title}</Title>
            <Meta style={styles.meta}>
              {a.author} · {a.year}
            </Meta>

            {/* #34 — the work's rights, from the module, so "public domain" is a per-work fact not a heading. */}
            {moduleById(a.id)?.rights ? (
              <>
                <Text style={styles.fieldLabel}>{t(UI.rights, lang)}</Text>
                <Muted style={styles.rightsText}>{moduleById(a.id)!.rights.basis}</Muted>
              </>
            ) : null}

            <Text style={styles.fieldLabel}>{t(UI.cidLabel, lang)}</Text>
            <Text style={styles.mono}>{shortHash(a.cid, 10, 8)}</Text>

            <Text style={styles.fieldLabel}>{t(UI.hashLabel, lang)}</Text>
            <Text style={styles.mono}>{shortHash(a.sha256, 10, 8)}</Text>

            {a.mint !== "pending" && a.mint.length > 0 && (
              <>
                <Text style={styles.fieldLabel}>{t(UI.certLabel, lang)}</Text>
                <Pressable style={styles.linkRow} onPress={() => Linking.openURL(explorerAddressUrl(a.mint, a.cluster))}>
                  <Text style={[styles.mono, styles.link]}>{shortHash(a.mint, 10, 8)}</Text>
                  <Icon.ArrowUpRight size={12} color={colors.orange} />
                </Pressable>
              </>
            )}

            {anchored ? (
              <Pressable style={styles.verifyBtn} onPress={() => Linking.openURL(explorerUrl(a.tx, a.cluster))}>
                <Text style={styles.verifyText}>{t(UI.verify, lang)}</Text>
                <Icon.ArrowUpRight size={13} color={colors.paper} />
              </Pressable>
            ) : (
              <View style={styles.pendingChip}>
                <Icon.Clock size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.pendingText}>{t(UI.pending, lang)}</Text>
              </View>
            )}
          </Card>
        );
      })}

      <Card tone="navy" style={styles.popiaCard}>
        <Icon.Lock size={20} color={colors.gold} />
        <Muted onDark style={styles.popiaText}>
          {t(UI.popia, lang)}
        </Muted>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: spacing.lg },
  workTitle: { fontFamily: fonts.serifSemi, fontSize: type.title + 2 },
  card: { marginBottom: spacing.md },
  meta: { marginTop: 2 },
  rightsText: { marginTop: 2, lineHeight: 18 },
  fieldLabel: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: fonts.bodyBold,
    fontSize: type.small - 1,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: spacing.md,
  },
  mono: { color: "rgba(255,255,255,0.85)", fontFamily: fonts.bodyMedium, fontSize: type.small + 1, marginTop: 2 },
  link: { color: colors.orange, fontFamily: fonts.bodySemi },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  verifyBtn: {
    alignSelf: "flex-start",
    marginTop: spacing.md,
    backgroundColor: "#FFFFFF",
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifyText: {
    color: colors.paper,
    fontFamily: fonts.bodyBold,
    fontSize: type.small,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  pendingChip: {
    alignSelf: "flex-start",
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pendingText: { color: "rgba(255,255,255,0.7)", fontFamily: fonts.bodySemi, fontSize: type.small },
  popiaCard: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg, alignItems: "flex-start" },
  popiaMark: { fontSize: 22 },
  popiaText: { flex: 1, fontStyle: "italic", lineHeight: 20 },
});
