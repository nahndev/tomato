import type { MapPinIcon } from "@tomato/constants";
import { DEFAULT_PIN_ICON, PIN_ICONS } from "../canvas.constants";

/** The map pin for missing or unknown icons. */
export function getPinIcon(icon?: string): (typeof PIN_ICONS)[MapPinIcon] {
  return icon && Object.hasOwn(PIN_ICONS, icon) ? PIN_ICONS[icon as MapPinIcon] : PIN_ICONS[DEFAULT_PIN_ICON];
}
