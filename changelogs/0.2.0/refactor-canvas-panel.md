# Refactor the canvas panel

## Currently

- `Panel` ([panel.tsx](../../packages/canvas/src/components/panel.tsx)) is the fixed `w-80` side bar that `Canvas` renders to the right of `CanvasView`. It still reflects the old pin-only map:
  - It only knows about pins: images are filtered out, so they can't be seen, selected or reordered from the panel, even though `layers` holds both and its order is the drawing order.
  - The list is a flat "Pins (n)" list of labels; it shows no type, lock state or order, and has no actions (duplicate, lock and delete now live in the toolbar `LayerTool`).
  - The "Selected pin" section shows `PinForm` only for a selected pin; a selected image shows nothing. `PinForm` has its own delete button, which duplicates the `LayerTool` delete.
  - The empty-state text ("Use “Add pin”, then click the map.") refers to the old text button, which is now an icon button with a tooltip.
- Structure: one component does everything: reads the value, filters pins, finds the selection, and renders the details and the list inline. It can't be hidden, resized or replaced, and apps can't extend it the way they extend the toolbar (`extension`).

## Acceptance Criteria

- [x] Sidebar add `menu-bar` with `layers`, `property` panel
- [x] When click on icon, then open this panel

## Solutions

- [x] `Panel` replaced by `components/sidebar/`: `Sidebar` = open panel (`w-80`, title + content) | vertical menu bar of `ToolbarButton`s (tooltip on the left, `aria-pressed` for the open one), driven by a `SIDE_PANELS` list (panel, label, icon, component)
- [x] Store: `activePanel` (`SidePanel` constant: `LAYERS` | `PROPERTY`, `null` = closed, Layers by default) + `togglePanel` (clicking the open panel's icon closes it, so the canvas gets the full width)
- [x] `LayersPanel`: every layer, top-most first (`toLayerList`: pins above images, images named `Image <n>` in drawing order), type icon + label + lock icon; click selects/deselects
- [x] `PropertyPanel`: selected pin → `PinForm`; selected image → position and size in frame pixels (read-only); nothing selected → hint
- [x] `ToolbarButton`: optional `tooltipSide` (default `bottom`); tests for `togglePanel` and `toLayerList`
