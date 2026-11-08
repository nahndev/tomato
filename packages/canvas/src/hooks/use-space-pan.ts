import { useEffect, useState, type RefObject } from "react";
import { PAN_KEY_CODE } from "../canvas.constants";
import { isEditable } from "../utils/event.utils";

/** `true` while the pan key is held with the pointer over `ref`. */
export function useSpacePan(ref: RefObject<HTMLElement | null>): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let isHovered = false;

    const enter = () => (isHovered = true);
    const leave = () => (isHovered = false);
    const release = () => setIsPressed(false);
    const keyDown = (event: KeyboardEvent) => {
      if (event.code !== PAN_KEY_CODE || !isHovered || isEditable(event.target)) return;
      // Keeps the page from scrolling and focused buttons from clicking.
      event.preventDefault();
      setIsPressed(true);
    };
    const keyUp = (event: KeyboardEvent) => {
      if (event.code === PAN_KEY_CODE) release();
    };

    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointerleave", leave);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", release);
    return () => {
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointerleave", leave);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", release);
    };
  }, [ref]);

  return isPressed;
}
