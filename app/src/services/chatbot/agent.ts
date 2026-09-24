// The chatbot brain. Wraps the whole app in a conversational guide that (a) answers questions ONLY
// from the website's own grounded content (RAG over knowledge.ts) and (b) can take the user to any
// page (the navigate_to orchestrator tool, answered by Claude tool use on the server).
//
// Design (see the judging notes on "nothing gated behind keys"):
//   • Navigation ("take me to the provinces") is resolved DETERMINISTICALLY first — it needs no key
//     and no network, so the orchestrator always works.
//   • Retrieval over the site's own content happens here, on the device.
//   • The conversational reply comes from our /api/chat proxy (app/api/chat.mjs), which holds the
//     Anthropic / Gemini keys server-side (issue #43 — they used to be compiled into the web bundle).
//     No proxy, or a failed call, and the guide answers with the retrieved site content instead, so it
//     is never dead.

import { buildKnowledge } from "./knowledge";
import { retrieve, matchNavigation } from "./retrieve";
import { PAGES, pageById } from "./pages";
import { languageByCode, type LangCode } from "../../i18n";
import { getProxyConfig, postProxy } from "../proxy";

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type ChatResult =
  | { type: "text"; text: string; sources: string[] }
  | { type: "navigate"; pageId: string; label: string; text: string };

/** Whether a conversational (LLM) reply is on offer from the proxy. Navigation works regardless. */
export async function chatbotHasLlm(): Promise<boolean> {
  return (await getProxyConfig()).chat;
}

const snippet = (s: string) => (s.length > 320 ? s.slice(0, 320).replace(/\s+\S*$/, "") + "…" : s);

/**
 * Ask the guide a question or give it a command. Returns either text to show or a navigation request
 * for the UI to perform.
 */
export async function askChatbot(
  query: string,
  history: ChatTurn[] = [],
  lang: LangCode = "en"
): Promise<ChatResult> {
  const q = query.trim();
  if (!q) return { type: "text", text: "Ask me anything about the app, or say e.g. 'take me to the provinces'.", sources: [] };

  // 1) Deterministic navigation — no key, no network.
  const nav = matchNavigation(q, PAGES);
  if (nav) return { type: "navigate", pageId: nav.id, label: nav.label, text: `Opening ${nav.label}…` };

  // 2) Ground the answer in the site's content.
  const kb = buildKnowledge();
  const hits = retrieve(q, kb, 6);
  const sources = Array.from(new Set(hits.map((h) => h.chunk.title)));

  const retrievalAnswer = (): ChatResult => {
    if (!hits.length) {
      return {
        type: "text",
        text:
          "I can only answer from what's on this site, and I couldn't find that here. Try the four books, " +
          "the Cultural Atlas, the nine provinces, the presidents, national days, totems, or heroes.",
        sources: [],
      };
    }
    return {
      type: "text",
      text: hits.slice(0, 2).map((h) => `**${h.chunk.title}** — ${snippet(h.chunk.body)}`).join("\n\n"),
      sources,
    };
  };

  const context = hits.length
    ? hits.map((h, i) => `[${i + 1}] ${h.chunk.title} — ${h.chunk.body}`).join("\n\n")
    : "";
  const meta = languageByCode(lang);

  // 3) Conversational answer from the proxy, grounded in the retrieved context. The server writes the
  //    system prompt; we send what it needs to fill it and the pages navigate_to may open.
  if (await chatbotHasLlm()) {
    try {
      const res = await postProxy("chat", {
        query: q.slice(0, 1000),
        // Recent conversation memory so the guide remembers what was said earlier in the chat.
        history: history.slice(-10).map((t) => ({ role: t.role, text: t.text.slice(0, 2000) })),
        context: context.slice(0, 12_000),
        lang: { english: meta.english, endonym: meta.endonym },
        pages: PAGES.map((p) => ({ id: p.id, label: p.label })),
      });
      const out = (await res.json()) as { type?: string; text?: string; page?: string };
      if (out.type === "navigate") {
        const page = pageById(String(out.page || ""));
        if (page) return { type: "navigate", pageId: page.id, label: page.label, text: `Opening ${page.label}…` };
      }
      if (out.type === "text" && typeof out.text === "string" && out.text.trim()) {
        return { type: "text", text: out.text.trim(), sources };
      }
    } catch (e: any) {
      console.warn("[chatbot] LLM error:", e?.message || e);
    }
  }

  // No proxy, or it was empty / errored → the site-content answer, so the widget never dies.
  return retrievalAnswer();
}
