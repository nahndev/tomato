# Add a zone layer to the canvas

## Currently

- `@tomato/canvas` ([canvas.types.ts](../../packages/canvas/src/canvas.types.ts)) has only two layer types, `CanvasLayerType.IMAGE` and `CanvasLayerType.PIN`. A pin marks a single point, and an image is a background picture. There is no way to mark an **area** on the map, for example a room, a block, a parking lot or a restricted area.
- The toolbar ([canvas-toolbar.tsx](../../packages/canvas/src/components/toolbar/canvas-toolbar.tsx)) has a single drawing mode, "Add pin" (`isAddingPin`): the next click on `MapLayer` places a pin. No tool lets the user draw a shape by dragging or by clicking point after point.
- Layer helpers ([layer.utils.ts](../../packages/canvas/src/utils/layer.utils.ts)) are written for exactly these two types (`toLayerList`, `duplicateLayer`, `fitLayersToFrame`). Each one checks for `PIN` and treats everything else as an image, so a third type needs explicit handling.
- A zone works like any other layer: it can be selected, moved, locked, duplicated, deleted and reordered, and it shows in the layer list and property panel ([refactor-canvas-panel.md](./refactor-canvas-panel.md)). It has a label, a description and a style (fill and stroke color, opacity), and its vertices can be edited after drawing.
- References: Figma / Excalidraw shape tools, the Google Maps "draw polygon" tool.

## Acceptance Criteria

- [x] Add new toolbar buttons include `square`, `polygon`
- [x] When click on button, open `edit` mode as layer
- [x] When click on button, mouse change type
- [x] Example: allow multiple click, end edit the will add `ZoneLayer`

## Solutions

- [x] Model: `MapLayerType.ZONE` + `MAP_ZONE_MIN_POINTS` (3) / `MAP_ZONE_MAX_POINTS` (100) in `@tomato/constants`; `MapZoneLayer` (`label`, `description`, `points`, `isLocked?`) and `MapPoint` in `@tomato/types`; rectangles are stored as 4 points. Drawing order: images, zones, pins
- [x] API: `MapZoneLayerDto` (label/description like pins, points `MapPointDto` 0–1, 3–100 items) in the layer discriminator, kept by `toMapValue`; no migration (new type only)
- [x] Web: `toCanvasValue` / `fromCanvasValue` map zones; `shouldSaveNow` saves zone label/description changes at once, moves after `MAP_SAVE_DELAY`
- [x] Canvas store: `isAddingPin` → `tool` (`CanvasTool`: `SELECT` | `PIN` | `RECTANGLE` | `POLYGON`) + `setTool`; the toolbar renders the tools from `DRAW_TOOLS`, clicking the active one goes back to select; adding a pin or zone returns to select
- [x] `ZoneDrawLayer` (`useZoneDraw`): above all layers while a zone tool is active, crosshair cursor, dashed preview
  - Rectangle: drag (Shift = square in frame pixels); drags under `MIN_ZONE_DRAG_SIZE` are ignored
  - Polygon: click to add points; finish by clicking the first point (pointer cursor within `ZONE_CLOSE_DISTANCE`), double-click or Enter; Backspace removes the last point; Esc clears the draft, then leaves the tool
- [x] `ZoneLayer`: SVG polygon (`viewBox 0 0 1 1`, non-scaling stroke), select on press, move by drag (`useZoneDrag`, shape kept inside the frame); locked zones are not movable. `LayerTool` (duplicate, lock, delete), `LayersPanel` and `PropertyPanel` (`DetailsForm`, was `PinForm`, + `changeDetails`) handle zones
- [x] Utils: `zone.utils` (`getRectPoints`, `movePoints`, `dedupePoints`, …); `toLayerList`, `duplicateLayer`, `fitLayersToFrame` handle zones; tests for utils, DTO and web mapping
- [ ] Later: vertex editing, style (fill/stroke/opacity), ellipse/circle, reordering
