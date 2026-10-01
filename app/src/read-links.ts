// Direct links to every story — /read and /read/<id> — so a story can be shared, bookmarked and read
// on its own, without finding it through the Atlas.
//
// The app has no router: screens live on an in-memory stack and the host sends every path to "/"
// (vercel.json, scripts/serve-dist.mjs, the service worker's navigate fallback). So a link only has
// to be understood twice — once when the app starts (path → screen) and once whenever the screen
// changes (screen → path, written back to the address bar). Both directions live here, as pure
// functions with no React and no content imports, so they run under `node --test` (read-links.test.ts).
//
// The id in the path IS the content id (`/read/tambo`, `/read/soweto-16-june`). No aliases: one name
// per story means a link that works today keeps working, and nothing has to be kept in step by hand.

export const READ_BASE = "/read";

/** What a path asks for. `missing` keeps the slug someone followed, so the list can say it wasn't found. */
export type ReadTarget =
  | { kind: "index"; missing?: string }
  | { kind: "reader"; id: string }
  | { kind: "story"; id: string };

/**
 * Read a pathname. Returns null for anything outside /read — those paths open the app as before.
 * Tolerates a trailing slash, mixed case and percent-encoding, because links get retyped and pasted.
 */
export function parseReadPath(
  pathname: string,
  isModule: (id: string) => boolean,
  isStory: (id: string) => boolean,
): ReadTarget | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0 || parts[0].toLowerCase() !== READ_BASE.slice(1)) return null;
  if (parts.length === 1) return { kind: "index" };
  let slug: string;
  try {
    slug = decodeURIComponent(parts[1]).toLowerCase();
  } catch {
    return { kind: "index", missing: parts[1] };
  }
  if (parts.length > 2) return { kind: "index", missing: slug };
  if (isModule(slug)) return { kind: "reader", id: slug };
  if (isStory(slug)) return { kind: "story", id: slug };
  return { kind: "index", missing: slug };
}

/** The address for a screen: a story's own link, the list, or null for every other screen. */
export function readPathFor(routeName: string, id?: string): string | null {
  if (routeName === "read") return READ_BASE;
  if ((routeName === "reader" || routeName === "story") && id) return `${READ_BASE}/${encodeURIComponent(id)}`;
  return null;
}

/** The shape the list needs — just enough of a Module or Story to group and link it. */
export type Readable = { id: string; title: string; author?: string };

export type ReadGroupId = "lives" | "literature" | "heritage" | "stories";
export type ReadEntry = { id: string; route: "reader" | "story"; path: string };
export type ReadGroup = { id: ReadGroupId; entries: ReadEntry[] };

/** A single life told as a book carries this author label (biko.ts … tambo.ts). */
export const isLifeBook = (m: Readable): boolean => (m.author ?? "").startsWith("A life");

/**
 * Every readable thing, grouped for the list, in the order the app already presents it:
 * the lives first (the newest work), then the four literary pillars, the rest of the Atlas, and the
 * scroll-told stories. Every module and every story appears exactly once (read-links.test.ts).
 */
export function readCatalog(literature: Readable[], atlas: Readable[], stories: Readable[]): ReadGroup[] {
  const entry = (route: "reader" | "story") => (r: Readable): ReadEntry => ({
    id: r.id,
    route,
    path: readPathFor(route, r.id) as string,
  });
  const groups: ReadGroup[] = [
    { id: "lives", entries: atlas.filter(isLifeBook).map(entry("reader")) },
    { id: "literature", entries: literature.map(entry("reader")) },
    { id: "heritage", entries: atlas.filter((m) => !isLifeBook(m)).map(entry("reader")) },
    { id: "stories", entries: stories.map(entry("story")) },
  ];
  return groups.filter((g) => g.entries.length > 0);
}
