const KEY_LABELS: Record<string, string> = {
  bracketleft: "[",
  bracketright: "]",
  shift: "Shift",
  alt: "Alt",
  ctrl: "Ctrl",
  meta: "Meta",
  esc: "Esc",
};

export function isMacPlatform(): boolean {
  return typeof navigator !== "undefined" && /mac/i.test(navigator.userAgent) && !/iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** `react-hotkeys-hook` keys as shown to users, e.g. `shift+bracketright` → `Shift+]`. */
export function formatHotkey(hotkey: string, isMac = isMacPlatform()): string {
  return hotkey
    .split("+")
    .map((key) => (key === "mod" ? (isMac ? "⌘" : "Ctrl") : (KEY_LABELS[key] ?? key.toUpperCase())))
    .join(isMac && hotkey.startsWith("mod+") ? "" : "+");
}
