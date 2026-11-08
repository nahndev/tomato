import { useState } from "react";
import { Keys, useHotkeys } from "react-hotkeys-hook";

/** `true` while the pan key is held with the pointer over `ref`. */
export function useKeyPressed(keys: Keys): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useHotkeys(keys, (event) => setIsPressed(event.type === "keydown"), {
    keydown: true,
    keyup: true,
    preventDefault: true,
  });

  return isPressed;
}
