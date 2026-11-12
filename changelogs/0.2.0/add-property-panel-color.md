# Add color support for property panel

## Currently

- The property panel ([property-panel.tsx](../../packages/canvas/src/components/sidebar/property-panel.tsx)) shows position/size for image layers and, for pins and zones, only a `DetailsForm` ([details-form.tsx](../../packages/canvas/src/components/details-form.tsx)) with `label` and `description`. There is no way to change how a layer looks.
- Layer colors are hard-coded to the theme: a zone ([zone-layer.tsx](../../packages/canvas/src/components/layers/zone-layer.tsx)) is always `fill-primary/15 stroke-primary`. Every zone and pin on a map looks the same, so the user cannot tell areas apart (e.g. rooms vs. parking vs. restricted areas) or match the colors of the background image.
- The model has no color field: `CanvasZoneLayer` / `CanvasPin` ([canvas.types.ts](../../packages/canvas/src/canvas.types.ts)) and the shared `MapZoneLayer` / `MapPinLayer` (`@tomato/types`, API DTOs) only hold label, description and geometry.
- Style (fill/stroke/opacity) was left as "Later" in [add-canvas-zone-layer.md](./add-canvas-zone-layer.md).
- References: Figma / Excalidraw fill & stroke pickers, Google My Maps layer style.

## Acceptance Criteria

- [x] Add `packages/color` support for `pin` and `zone`
- [x] When change color, change color of pin and zone
- [x] Add color picker to property panel

## Solutions

- [x] Model: one optional hex `color` on `MapPinLayer` and `MapZoneLayer` (`@tomato/types`; a zone uses it for fill and stroke); `MapPinLayerDto` / `MapZoneLayerDto` validate them with `IsHexColor` (normalized to lowercase hex), `toMapValue` keeps them; no migration (fields are optional, missing = theme color)
- [x] Web: `toCanvasValue` / `fromCanvasValue` keep colors; color changes save after `MAP_SAVE_DELAY` like moves
- [x] Canvas: `CanvasPin.color`, `CanvasZoneLayer.color` + `changeColor`; `PinMarker` and `ZoneLayer` read the color from a CSS variable defaulting to `--color-primary` (zone fill keeps 15% / 25% selected)
- [x] Property panel: `StyleForm` under `DetailsForm` with `ColorField` (`ColorPicker` from `@tomato/ui/client`, `LAYER_COLOR_PRESETS`, hex input applied once valid, reset to default); one Color field for pins and zones
- [ ] Later: fill opacity
