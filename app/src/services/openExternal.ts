// Leaving the app — the one place that does it.
//
// Extracted from ArticleReader so the reader and the visit panel cannot drift apart (SP-039). The
// `noopener,noreferrer` pair is security-relevant: without `noopener` the opened page gets a handle
// on our window via `window.opener` and can navigate it somewhere else. That belongs in one function,
// not copied into every component that ever links out.
//
// T5. Callers must pass the operator's own URL with NO identifiers appended — no query parameters,
// no click IDs. This function deliberately does not accept params to add, so there is no convenient
// place to start tracking people from.

import { Linking, Platform } from "react-native";

export function openExternal(url: string): void {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  // Native: hands off to the system browser (or an in-app browser tab).
  Linking.openURL(url).catch(() => {});
}
