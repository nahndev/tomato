"use client";

import { useEffect, useState } from "react";

export function useRequiredText(value: string | undefined, onCommit: (text: string) => void) {
  const [text, setText] = useState(value ?? "");
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => setText(value ?? ""), [value]);

  const isInvalid = isTouched && text.trim() === "";

  function commit() {
    setIsTouched(true);
    if (text.trim() === "" || text === value) return;
    onCommit(text);
  }

  return { text, setText, isInvalid, commit };
}
