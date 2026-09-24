// "Ask Ubuntu" — the LLM half of the chatbot, called from the server so the Anthropic and Gemini keys
// never reach a browser (issue #43). The client still does everything that needs no key: deterministic
// navigation, retrieval over the site's own content, and the plain retrieval answer when this route is
// absent or fails. It sends the retrieved context here; this file writes the reply from it.
//
// The system prompt is built HERE from a fixed template, not taken from the request. A route that
// relayed a caller's own system prompt would be a free general-purpose LLM on our key. The caller
// still supplies the context, so the guard is bounded rather than absolute: size caps on every field,
// the grounding rules below, max_tokens, and the rate limit in ./http.mjs.
//
// Anthropic first when ANTHROPIC_API_KEY is set (navigate_to tool available), else Gemini when
// GEMINI_API_KEY is set (prose only — navigation is already handled client-side before the LLM).

export const DEFAULT_CLAUDE_MODEL = "claude-opus-4-8";
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const MAX_TOKENS = 900;

export const LIMITS = {
  query: 1000,
  historyTurns: 10,
  turnText: 2000,
  context: 12_000,
  langName: 60,
  pages: 80,
  pageId: 40,
  pageLabel: 80,
};

const str = (v, max) => typeof v === "string" && v.length <= max;

/** Pure: validate and normalise a /api/chat body. Returns { error } or { value }. */
export function validateChatBody(body) {
  if (!body || typeof body !== "object") return { error: "body must be an object" };
  const { query, history = [], context = "", lang = {}, pages = [] } = body;
  if (!str(query, LIMITS.query) || !query.trim()) return { error: `query must be 1–${LIMITS.query} characters` };
  if (!Array.isArray(history) || history.length > LIMITS.historyTurns) return { error: `history must be at most ${LIMITS.historyTurns} turns` };
  for (const t of history) {
    if (!t || (t.role !== "user" && t.role !== "assistant") || !str(t.text, LIMITS.turnText)) return { error: "bad history turn" };
  }
  if (!str(context, LIMITS.context)) return { error: `context must be at most ${LIMITS.context} characters` };
  const english = lang?.english ?? "English";
  const endonym = lang?.endonym ?? english;
  if (!str(english, LIMITS.langName) || !str(endonym, LIMITS.langName)) return { error: "bad language" };
  if (!Array.isArray(pages) || pages.length > LIMITS.pages) return { error: `at most ${LIMITS.pages} pages` };
  for (const p of pages) {
    if (!p || !str(p.id, LIMITS.pageId) || !/^[\w-]+$/.test(p.id) || !str(p.label, LIMITS.pageLabel)) return { error: "bad page" };
  }
  return {
    value: {
      query: query.trim(),
      history: history.map((t) => ({ role: t.role, text: t.text })),
      context: context || "(no matching site content found)",
      lang: { english, endonym },
      pages: pages.map((p) => ({ id: p.id, label: p.label })),
    },
  };
}

/** Pure: the guide's system prompt. Unchanged in substance from the client-side version. */
export function systemPrompt({ context, lang, withNavTool }) {
  return (
    `You are "Ubuntu", the friendly in-app guide for the app *Ubuntu Heritage · South Africa* — a ` +
    `cinematic, multilingual archive of South Africa's foundational literature and heritage.\n\n` +
    `RULES:\n` +
    `• Answer ONLY using the CONTEXT below. It is drawn from this website's own grounded, cited content.\n` +
    `• If the answer is not in the CONTEXT, say you don't have that on the site yet and point to a related ` +
    `section. NEVER invent history, dates, names, quotes, or sources — this project's rule is truth only.\n` +
    `• Keep replies short and warm: 2–4 sentences, plain language. Name the section the fact comes from.\n` +
    (withNavTool
      ? `• If the user wants to be taken somewhere, call the navigate_to tool instead of describing it.\n`
      : `• If the user wants to open a section, tell them to say e.g. "take me to the provinces".\n`) +
    `• Write your reply in ${lang.english} (${lang.endonym}). Keep proper nouns, titles, and cited source names ` +
    `in their original form. If you cannot write fluently in ${lang.english}, answer in English instead.\n\n` +
    `CONTEXT:\n${context}`
  );
}

function navTool(pages) {
  return {
    name: "navigate_to",
    description:
      "Open a page/section of the Ubuntu Heritage app for the user. Call this when the user asks to " +
      "go to, open, show, or visit a section. Valid page ids: " +
      pages.map((p) => `${p.id} (${p.label})`).join(", ") +
      ".",
    input_schema: {
      type: "object",
      properties: { page: { type: "string", description: "The id of the page to open, from the valid list." } },
      required: ["page"],
    },
  };
}

/** Pure: the Anthropic Messages API request. Leading assistant turns are dropped — a conversation
 *  sent to the API starts with the user. No `temperature`: Opus 4.8 rejects it. */
export function buildAnthropicRequest(v, { apiKey, model }) {
  const withNavTool = v.pages.length > 0;
  const turns = [...v.history, { role: "user", text: v.query }];
  while (turns.length && turns[0].role !== "user") turns.shift();
  return {
    url: "https://api.anthropic.com/v1/messages",
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: model || DEFAULT_CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt({ context: v.context, lang: v.lang, withNavTool }),
      ...(withNavTool ? { tools: [navTool(v.pages)] } : {}),
      messages: turns.map((t) => ({ role: t.role, content: t.text })),
    }),
  };
}

/** Pure: a navigate result (only to a page the caller listed), a text result, or null. */
export function resultFromAnthropicResponse(json, pages) {
  const content = Array.isArray(json?.content) ? json.content : [];
  const tool = content.find((b) => b?.type === "tool_use" && b.name === "navigate_to");
  const page = tool ? String(tool.input?.page || "") : "";
  if (page && pages.some((p) => p.id === page)) return { type: "navigate", page };
  const text = content
    .filter((b) => b?.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("")
    .trim();
  return text ? { type: "text", text } : null;
}

/** Pure: the Gemini generateContent request. The key goes in a header, not the URL, so it stays out
 *  of any log that records URLs. */
export function buildGeminiRequest(v, { apiKey, model }) {
  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model || DEFAULT_GEMINI_MODEL)}:generateContent`,
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt({ context: v.context, lang: v.lang, withNavTool: false }) }] },
      contents: [...v.history, { role: "user", text: v.query }].map((t) => ({
        role: t.role === "assistant" ? "model" : "user",
        parts: [{ text: t.text }],
      })),
      // thinkingBudget:0 — Gemini 2.5 "thinking" models otherwise spend the output budget on internal
      // reasoning and return EMPTY text for short answers.
      generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: 0.4, thinkingConfig: { thinkingBudget: 0 } },
    }),
  };
}

/** Pure: join the text parts of the first candidate ("" if none / blocked). */
export function textFromGeminiResponse(json) {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((p) => (typeof p?.text === "string" ? p.text : ""))
    .join("")
    .trim();
}

/** Whether this server can hold a conversation at all. */
export function chatConfigured(env) {
  return !!(env.ANTHROPIC_API_KEY || env.GEMINI_API_KEY);
}

/** Ask Claude, then Gemini, for a reply. Returns a result or null (the route answers 502). */
export async function reply(v, env, fetchFn = fetch) {
  const attempts = [];
  if (env.ANTHROPIC_API_KEY) {
    attempts.push(async () => {
      const req = buildAnthropicRequest(v, { apiKey: env.ANTHROPIC_API_KEY, model: env.CHATBOT_MODEL });
      const res = await fetchFn(req.url, { method: req.method, headers: req.headers, body: req.body });
      if (!res.ok) throw new Error(`Anthropic ${res.status}`);
      return resultFromAnthropicResponse(await res.json(), v.pages);
    });
  }
  if (env.GEMINI_API_KEY) {
    attempts.push(async () => {
      const req = buildGeminiRequest(v, { apiKey: env.GEMINI_API_KEY, model: env.GEMINI_CHAT_MODEL });
      const res = await fetchFn(req.url, { method: req.method, headers: req.headers, body: req.body });
      if (!res.ok) throw new Error(`Gemini ${res.status}`);
      const text = textFromGeminiResponse(await res.json());
      return text ? { type: "text", text } : null;
    });
  }
  for (const attempt of attempts) {
    try {
      const got = await attempt();
      if (got) return got;
    } catch (e) {
      console.warn("[api/chat]", e?.message || e);
    }
  }
  return null;
}
