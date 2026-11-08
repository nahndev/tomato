import { MapPinIcon } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import { PIN_ICONS } from "../canvas.constants";
import { getPinIcon } from "./pin-icon.utils";

describe("getPinIcon", () => {
  it("returns the icon, or the map pin when missing or unknown", () => {
    expect(getPinIcon(MapPinIcon.FLAG)).toBe(PIN_ICONS[MapPinIcon.FLAG]);
    expect(getPinIcon()).toBe(PIN_ICONS[MapPinIcon.MAP_PIN]);
    expect(getPinIcon("rocket")).toBe(PIN_ICONS[MapPinIcon.MAP_PIN]);
    expect(getPinIcon("constructor")).toBe(PIN_ICONS[MapPinIcon.MAP_PIN]);
  });
});
