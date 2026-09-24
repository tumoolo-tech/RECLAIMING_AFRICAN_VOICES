import { test } from "node:test";
import assert from "node:assert/strict";
import { bytesToDataUri } from "./remote.ts";

test("bytesToDataUri produces a playable audio data URI", () => {
  // "ID3" — the first three bytes of every MP3 the API returned in testing.
  const uri = bytesToDataUri(new Uint8Array([0x49, 0x44, 0x33, 0x04]));
  assert.equal(uri, "data:audio/mpeg;base64,SUQzBA==");
});

test("bytesToDataUri survives a clip long enough to blow a naive fromCharCode", () => {
  const big = new Uint8Array(200_000).fill(65);
  const uri = bytesToDataUri(big);
  assert.ok(uri.startsWith("data:audio/mpeg;base64,"));
  assert.equal(Buffer.from(uri.split(",")[1], "base64").length, 200_000);
});

test("bytesToDataUri accepts a raw ArrayBuffer as well as a view, and keeps the mime", () => {
  const view = new Uint8Array([1, 2, 3]);
  assert.equal(bytesToDataUri(view.buffer), bytesToDataUri(view));
  assert.ok(bytesToDataUri(view, "audio/wav").startsWith("data:audio/wav;base64,"));
});
