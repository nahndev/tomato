# Add tools to the canvas toolbar

## Currently

- `CanvasTool` ([canvas.constants.ts](../../packages/canvas/src/canvas.constants.ts)) has `SELECT`, `PIN`, `RECTANGLE`, `POLYGON`. `CanvasToolbar` ([canvas-toolbar.tsx](../../packages/canvas/src/components/toolbar/canvas-toolbar.tsx)) only shows buttons for the three draw tools (`DRAW_TOOLS`); clicking the active one again falls back to `SELECT`.
- Tools that exist but are not visible:
  - Select is the default with no button, so there is no way to see or pick it from the toolbar.
  - Panning only works while Space is held (`useKeyPressed("space")` in [viewport.tsx](../../packages/canvas/src/components/viewport.tsx)); there is no hand tool and nothing in the UI says so.
- Shortcuts are limited: [use-canvas-hot-keys.ts](../../packages/canvas/src/hooks/use-canvas-hot-keys.ts) only handles Delete/Backspace, and Esc only cancels a polygon being drawn ([zone-draw-layer.tsx](../../packages/canvas/src/components/layers/zone-draw-layer.tsx)). Tools cannot be picked from the keyboard, and Esc does not leave the pin/rectangle tools.
- `LayerTool` ([layer-tool.tsx](../../packages/canvas/src/components/toolbar/layer-tool.tsx)) has duplicate, lock and delete for the selected layer, but no way to change its drawing order, even though the `layers` order is the drawing order.
- Goal: add the missing tools to `packages/canvas` (select and pan tools in the toolbar, keyboard shortcuts for every tool shown in their tooltip, layer ordering in `LayerTool`), keeping the current drag, resize, zoom and draw behaviour unchanged.

## Acceptance Criteria - Add some tools

- [x] Add `Text` tools -> when click can enter text
- [x] Add `Color` allow choice color for all tools
- [x] Currently `Polygon` using random color, remove it using `color` tool
- [x] Change `Pin` (PinLayer) into `Icon`, when click on `icon`, show dropdown with list icon instead using pin icon
- [x] Suggest some tools, i choice and implement (chosen: select/pan + shortcuts, layer order, ellipse, arrow)

## Solutions

- [x] Model: `MapLayerType.TEXT` / `ARROW`, `MapTextLayer` (`text`, top-left `x`/`y`, `fontSize` in frame pixels, `color?`) and `MapArrowLayer` (`start`, `end` = head, `color?`) in `@tomato/types`; pins keep type `pin` with an optional `icon` (`MapPinIcon`, `map-pin` when missing), so no migration; `MAP_TEXT_MAX_LENGTH`, `MAP_TEXT_MIN/MAX_FONT_SIZE` in `@tomato/constants`
- [x] API: `MapTextLayerDto`, `MapArrowLayerDto` in the layer discriminator, `icon` validated against `MapPinIcon`; `toMapValue` keeps them; DTO and service tests
- [x] Web: `toCanvasValue` / `fromCanvasValue` map texts, arrows and icons; texts still empty while first typed are left out of saves
- [x] `CanvasTool`: `SELECT`, `PAN`, `ICON`, `TEXT`, `RECTANGLE`, `ELLIPSE`, `POLYGON`, `ARROW`; toolbar = `LayerTool` | Select, Pan | Icon, Text, Rectangle, Ellipse, Polygon, Arrow, Color | Frame. Every tool has a key (`TOOL_HOTKEYS`: V, H, I, T, R, O, P, A) shown in its tooltip (`ToolbarButton` `hotkey`, `formatHotkey`); Esc leaves the icon/text/pan tools, clears a shape being drawn then leaves shape tools, and clears the selection with Select
- [x] Pan tool: same as holding Space (`Viewport` pans while `tool === PAN`)
- [x] Icon: `IconMenu` opens a dropdown of `PIN_ICONS` (`PinIconGrid`); picking one turns the icon tool on, new pins use it; `PinMarker` shows the map pin as before, other icons in a badge with a tail (tip still bottom center); icon also editable in the property panel and shown in the layers panel
- [x] Text: click the map to start typing; Enter/Esc/blur finishes, Shift+Enter for a new line; double-click edits. While empty the text is a store draft (`textDraft`), not in the value, since apps rebuild the value from what they save (the web drops empty texts); `TextEditor` stays mounted while `typeText` moves it between the draft and the value. Movable like zones; property panel edits the text and size (`TEXT_FONT_SIZES`); `fitLayersToFrame` scales the size
- [x] Color: `ColorTool` sets the store `color` used by every new icon, text, zone and arrow (replaces the random zone color); with a layer selected it shows and recolors that layer
- [x] Ellipse: dragged like rectangles (Shift for a circle), stored as a `ELLIPSE_SEGMENTS`-point zone (`getEllipsePoints`); `ZoneDrawLayer` / `useZoneDraw` became `ShapeDrawLayer` / `useShapeDraw` for rectangles, ellipses, polygons and arrows
- [x] Arrow: drag from tail to head, Shift snaps to 45° (`getArrowPoints`); `ArrowLayer` draws in frame pixels with a constant on-screen stroke and head, movable as a whole
- [x] Layer order: `LayerTool` "Arrange" menu (front, forward, backward, back; `]`, `[`, Shift+`]`, Shift+`[`) via `moveLayer`, which reorders among the layers of the same type (types are drawn as groups: images, zones, arrows, texts, pins); duplicate also gets Ctrl/⌘+D
- [x] Tests: `moveLayer` / `getLayerPosition`, texts and arrows in `toLayerList` / `duplicateLayer` / `fitLayersToFrame`, `getEllipsePoints`, `getArrowPoints`, `getPinIcon`, `formatHotkey`, DTO, web mapping
