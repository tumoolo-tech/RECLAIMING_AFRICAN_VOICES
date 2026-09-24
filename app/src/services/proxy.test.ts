import { test } from "node:test";
import assert from "node:assert/strict";
import { apiUrl, parseProxyConfig, NO_PROXY } from "./proxy.ts";

test("web with no base URL uses the same origin", () => {
  assert.equal(apiUrl("tts", { base: "", isWeb: true }), "/api/tts");
});

test("a configured base URL wins on every platform", () => {
  assert.equal(apiUrl("chat", { base: "https://maloba.example", isWeb: false }), "https://maloba.example/api/chat");
  assert.equal(apiUrl("chat", { base: "https://maloba.example", isWeb: true }), "https://maloba.example/api/chat");
});

test("native with no base URL has no proxy — callers fall back, they do not guess", () => {
  assert.equal(apiUrl("config", { base: "", isWeb: false }), null);
});

test("the config is read defensively: only a literal true counts", () => {
  assert.deepEqual(parseProxyConfig({ elevenlabs: true, elevenlabsVoice: "v1", botlhale: true, chat: true }), {
    elevenlabs: true,
    elevenlabsVoice: "v1",
    botlhale: true,
    chat: true,
  });
  assert.deepEqual(parseProxyConfig({ elevenlabs: "yes", botlhale: 1, chat: "true" }), NO_PROXY);
  assert.deepEqual(parseProxyConfig("<!doctype html>"), NO_PROXY);
  assert.deepEqual(parseProxyConfig(null), NO_PROXY);
  assert.equal(parseProxyConfig({ elevenlabs: false, elevenlabsVoice: "v1" }).elevenlabsVoice, null, "no voice without the engine");
});
