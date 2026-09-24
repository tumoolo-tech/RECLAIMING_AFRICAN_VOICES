// POST /api/chat  { query, history, context, lang: { english, endonym }, pages: [{ id, label }] }
//   -> { type: "text", text } | { type: "navigate", page }
//
// The "Ask Ubuntu" LLM proxy (issue #43). Keys come from the server environment only:
//   ANTHROPIC_API_KEY, CHATBOT_MODEL?, GEMINI_API_KEY, GEMINI_CHAT_MODEL?
// A non-2xx tells the client to show its own retrieval answer instead — the widget never dies.

import { createRateLimiter, guardPost, json } from "./_lib/http.mjs";
import { chatConfigured, reply, validateChatBody } from "./_lib/chat.mjs";

const perIp = createRateLimiter({ limit: 20, windowMs: 10 * 60_000 });
const global = createRateLimiter({ limit: 400, windowMs: 60 * 60_000 });

export async function POST(request) {
  return handle(request);
}

export async function OPTIONS(request) {
  return handle(request);
}

async function handle(request, env = process.env, fetchFn = fetch) {
  const g = await guardPost(request, { perIp, global, maxBytes: 48 * 1024, env });
  if (g.response) return g.response;

  const checked = validateChatBody(g.body);
  if (checked.error) return json(400, { error: checked.error }, g.cors);
  if (!chatConfigured(env)) return json(503, { error: "chat is not configured" }, g.cors);

  const result = await reply(checked.value, env, fetchFn);
  if (!result) return json(502, { error: "upstream failed" }, g.cors);
  return json(200, result, g.cors);
}

/** For tests: the same handler with an injected environment and fetch. */
export { handle as _handle };
