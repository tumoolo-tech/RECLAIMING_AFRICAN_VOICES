// Fetch a licensed photograph of a heritage place from Wikimedia Commons (PAGE-04).
//
//   npm run fetch:place-photo -- <place-id> "File:Some Image.jpg"
//   npm run fetch:place-photo -- --search "Vilakazi Street"
//
// WHY A SCRIPT. Places carry REAL photographs or none (SP-086): an AI picture of Vilakazi Street
// would illustrate a real address this app is telling someone to travel to. Real photographs mean
// real licences, and a licence is a factual claim like any other — so the credit and terms come
// from Commons' own metadata rather than from someone's memory of them.
//
// WHAT IT DOES NOT DO. It does not edit places.ts. It downloads the image, converts it to webp,
// and PRINTS the record for you to paste after you have looked at the photograph and judged that
// it actually shows the place. Same division as check-place-links: the machine fetches, the human
// decides (SP-021, SP-047).
//
// It refuses any file whose licence is not one it recognises as free. A wrong licence claim is the
// same class of error as a wrong citation.

import sharp from "sharp";
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = resolve(appDir, "assets/places/photos");
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "UbuntuHeritage/1.0 (heritage education app; sourcing CC-licensed imagery)";
const MAX_W = 1600;
const QUALITY = 78;

/** Licences we will ship. Anything else is refused rather than guessed at. */
const ALLOWED = [/^cc[- ]by(-sa)?[- ]?[0-9.]*$/i, /^public domain$/i, /^cc0/i];
const strip = (h) => String(h ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function api(params) {
  const url = new URL(API);
  for (const [k, v] of Object.entries({ format: "json", ...params })) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Commons API HTTP ${res.status}`);
  return res.json();
}

async function search(term) {
  const d = await api({ action: "query", generator: "search", gsrsearch: term, gsrnamespace: 6, gsrlimit: 10, prop: "imageinfo", iiprop: "url|size" });
  const pages = Object.values(d?.query?.pages ?? {});
  if (!pages.length) return console.log(`\n· nothing found for "${term}"\n`);
  console.log(`\n→ candidates for "${term}"`);
  for (const p of pages) {
    const ii = (p.imageinfo ?? [{}])[0];
    console.log(`  · ${p.title}  (${ii.width ?? "?"}x${ii.height ?? "?"})`);
  }
  console.log("\n  Pick one, look at it, then:\n    npm run fetch:place-photo -- <place-id> \"<File:…>\"\n");
}

async function fetchOne(placeId, title) {
  const d = await api({ action: "query", titles: title, prop: "imageinfo", iiprop: "url|extmetadata|size", iiurlwidth: MAX_W });
  const page = Object.values(d?.query?.pages ?? {})[0];
  if (!page || page.missing !== undefined) throw new Error(`no such file on Commons: ${title}`);
  const ii = (page.imageinfo ?? [])[0];
  if (!ii) throw new Error(`no image info for ${title}`);
  const m = ii.extmetadata ?? {};
  const licence = strip(m.LicenseShortName?.value);
  const author = strip(m.Artist?.value);
  const restrictions = strip(m.Restrictions?.value);

  if (!ALLOWED.some((re) => re.test(licence))) {
    throw new Error(`licence "${licence || "unknown"}" is not one this script will ship. Check the file page and decide by hand.`);
  }
  if (restrictions) console.log(`  ! restrictions noted: ${restrictions}`);
  if (!author) throw new Error("no author recorded on Commons — attribution is a licence obligation, so this cannot ship");

  const src = ii.thumburl || ii.url;
  console.log(`→ ${title}`);
  console.log(`  licence : ${licence}`);
  console.log(`  author  : ${author}`);
  console.log(`  source  : ${ii.descriptionurl}`);

  const res = await fetch(src, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  mkdirSync(OUT_DIR, { recursive: true });
  const file = `${placeId}.webp`;
  const out = resolve(OUT_DIR, file);
  const info = await sharp(buf).resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
  console.log(`  ✓ wrote assets/places/photos/${file} — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}kB`);

  console.log("\n  Paste into places.ts (after looking at the photograph and confirming it shows the place):\n");
  console.log(`    image: {`);
  console.log(`      file: "${file}",`);
  console.log(`      credit: ${JSON.stringify(author)},`);
  console.log(`      licence: ${JSON.stringify(licence)},`);
  console.log(`      source: ${JSON.stringify(ii.descriptionurl)},`);
  console.log(`    },`);
  console.log(`\n  And into place-images.ts:\n    "${file}": require("../../assets/places/photos/${file}"),\n`);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv[0] === "--search") {
    if (!argv[1]) return console.error("\n❌ --search needs a term\n"), 1;
    await search(argv.slice(1).join(" "));
    return 0;
  }
  const [placeId, title] = argv;
  if (!placeId || !title) {
    console.error('\n❌ usage: npm run fetch:place-photo -- <place-id> "File:Some Image.jpg"');
    console.error('          npm run fetch:place-photo -- --search "Vilakazi Street"\n');
    return 1;
  }
  try {
    await fetchOne(placeId, title);
    return 0;
  } catch (e) {
    console.error(`\n❌ ${e.message}\n`);
    return 1;
  }
}

process.exitCode = await main();
