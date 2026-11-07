# Improve the canvas toolbar

## Currently

- `CanvasToolbar` ([canvas-toolbar.tsx](../../packages/canvas/src/components/canvas-toolbar.tsx)) is a row of outlined text buttons at the right of the `Header`: "Delete image", then the app's `extension` (the web adds "Add image"), then "Add pin".
- The row changes as you use it:
  - "Delete image" is only shown while an image is selected.
  - "Add pin" changes its label to "Click the map to place" while placing a pin.
  - Both make the other buttons jump.
- Tools are not visible:
  - Selecting/moving is the default with no button.
  - Panning only works while Space is held, and nothing in the UI says so.
  - Placing a pin is a toggle with no way to cancel except clicking the button again (no Esc).
- Actions are split and incomplete:
  - Zoom (`ZoomControls`) sits in the bottom-right corner of `CanvasView`, away from the toolbar.
  - Selected pins can only be deleted from the side `Panel`.
  - Images cannot be reordered, even though the `layers` order is their drawing order.
- No tooltips or keyboard shortcuts. The only way to extend the toolbar is the single `extension` slot before "Add pin", so apps cannot add groups or choose where their actions go.
- Goal: a stable, grouped toolbar with clear tools (select, pan, pin), actions for the current selection, zoom, and tooltips/shortcuts, which apps can still extend. Behaviour of the canvas itself (drag, resize, zoom, pin placing) must not change.

## Acceptance Criteria

- [x] Extension add subfix with vertical divider
- [x] All button adjust into icon button with tooltip
- [x] When layer selected -> show `LayerTool` with `delete`, `lock`, `duplicate`
- [x] Add `frame` button with dropdown list, with ui: <square with size> <name of size>
- [x] Cleanup code

## Solutions

- [x] `@tomato/ui`: `Tooltip` added with `pnpm dlx shadcn@latest add tooltip` (theme tokens instead of slate colors, bogus `cn` dependency dropped); `StateProvider` wraps the canvas in a `TooltipProvider`
- [x] Toolbar moved to `components/toolbar/`: `ToolbarButton` (ghost icon button + tooltip, `label` is the accessible name; usable as an `asChild` trigger, exported so apps match), `CanvasToolbar` = `extension` | `LayerTool` (while a layer is selected) | `FrameMenu` + "Add pin", groups split by a vertical `Separator`; "Add pin" keeps its size while placing (only the tooltip and pressed state change)
- [x] `LayerTool`: duplicate (`duplicateLayer`: new id, shifted by `DUPLICATE_OFFSET`, pins kept in the frame), lock/unlock (`isLocked`, `aria-pressed`), delete with a confirmation; works for images and pins. Locked layers stay selectable but `CanvasView` drops their move/resize/drag handlers
- [x] `FrameMenu`: dropdown of `FRAME_PRESETS` (16:9, 4:3, 1:1, 9:16, A4 landscape/portrait), each item = aspect-ratio preview + name + size, current one checked; `changeFrame` scales layers uniformly to fit the new frame, centered (`fitLayersToFrame`), so images keep their aspect ratio and pins stay inside
- [x] Model: `MapValue.frame?` (`MapFrame`) and `isLocked?` on layers in `@tomato/types`; `MAP_FRAME_DEFAULT_SIZE` / `MAP_FRAME_MIN_SIZE` / `MAP_FRAME_MAX_SIZE` in `@tomato/constants` (replace the web `MAP_FRAME_SIZE`); API `MapFrameDto` (integers 100–10 000) + optional `isLocked`, kept by `toMapValue`, new maps start with the default frame; no migration (old values fall back to the default frame)
- [x] Web: `MapExtension` uses `ToolbarButton`; `toCanvasValue` / `fromCanvasValue` map the whole value (frame, locks); `shouldSaveNow` saves frame changes and added/deleted/locked/edited layers at once, moves and zooms after `MAP_SAVE_DELAY`
- [x] Cleanup: `useValueActions` (builds the actions, one `changeLayer` helper) and `useCanvasValue` (reads the value context) replace `useCanvasValue` / `useMapValue`; `createLayerId` uses `crypto.randomUUID()` (ids made in the same millisecond collided); tests for `layer.utils`, the DTO (frame, lock) and the web value mapping
