// Rights gating for the Ingestion Library (docs/12). v1 scope is LOCKED to public-domain or
// explicitly-licensed works only — rights status is first-class per source. No cleared rights → no
// ingest, no publish. This is a legal guardrail, not a nicety.
//
// Pure logic → unit-tested under `node --test`.

// "in-copyright" was added for issue #34: a work whose author died fewer than 50 years ago. It is
// deliberately NOT accepted by `canIngest` — verbatim reproduction of such a work is exactly what the
// gate exists to stop. A Module may still exist for it (see `ModuleRights` in content/types.ts) when
// the app's text is its own words about the work, which is a different act from reproducing it.
export type RightsStatus = "public-domain" | "in-copyright" | "licensed" | "unverified";

export type SourceRights = {
  /** Stable slug, e.g. "mhudi". Drives file paths + the draft Module id. */
  id: string;
  title: string;
  author: string;
  /** Year the author died — drives the SA life+50 public-domain test. */
  authorDied?: number;
  rights: RightsStatus;
  /** Human-readable justification, e.g. "SA copyright life+50; Plaatje d.1932 → PD from 1983". */
  basis?: string;
};

/** South African copyright runs for the author's life + 50 years (Copyright Act 98 of 1978). A work
 * enters the public domain on 1 January of the year AFTER that 50-year term ends. */
export function isPublicDomainByYear(authorDied: number, currentYear: number): boolean {
  return currentYear > authorDied + 50;
}

/** v1 gate: only works whose rights are cleared (public-domain or explicitly licensed) may be ingested.
 * "unverified" is blocked until a human clears it — a deliberate stop, not a silent pass. */
export function canIngest(s: SourceRights): boolean {
  return s.rights === "public-domain" || s.rights === "licensed";
}

/** Publishing ALSO always requires the human-review gate; this checks only the rights half. */
export function canPublish(s: SourceRights): boolean {
  return canIngest(s);
}
