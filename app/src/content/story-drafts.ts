// Story text in the reader's language — the reviewed English from `stories.ts` first, then a
// labelled machine draft from `story-drafts.data.ts`, else an honest English fallback. The same
// `resolveText` the literary Reader uses, so `.lang` is always the language the text is ACTUALLY
// in, and narration never reads a fallback in the wrong voice (SP-115).

import { resolveText, type Resolved } from "../i18n/localize.ts";
import type { LangCode } from "../i18n/languages";
import type { Story, StoryPanel } from "./stories.ts";
import { STORY_DRAFTS } from "./story-drafts.data.ts";

export type StoryField = "title" | "standfirst";
export type PanelField = "kicker" | "headline" | "body";

export function storyText(story: Story, field: StoryField, lang: LangCode): Resolved {
  return resolveText({ en: story[field] }, lang, STORY_DRAFTS[story.id]?.[field]?.[lang]);
}

export function panelText(story: Story, panel: StoryPanel, field: PanelField, lang: LangCode): Resolved {
  return resolveText({ en: panel[field] }, lang, STORY_DRAFTS[story.id]?.panels[panel.id]?.[field]?.[lang]);
}
