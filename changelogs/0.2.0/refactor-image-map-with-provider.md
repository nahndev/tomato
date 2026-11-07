# Refactor image-map with a provider, simpler classes and components

## Currently

- `TransformWrapper` ([transform-wrapper.tsx](../../packages/image-map/src/transform-wrapper.tsx), ~330 lines) does everything in one component: transform state, viewport resize, wheel/pointer/pinch/keyboard handlers, the context value and the markup. Because the provider and the viewport are the same component, nothing outside the viewport can read or control the transform.
- `TransformControls` and `ImageMapPinMarker` work only when they are rendered inside the transformed tree, via `useTransform()`. The only way to place controls somewhere else is the `overlay` / `controls` prop.
- `ImageMap` takes a flat list of props (`pins`, `selectedPinId`, `isAddingPin`, `onSelectPin`, `onAddPin`, `onMovePin`, `controls`, ...) and passes most of them through the internal `ImageMapLayer`, so the parts can't be composed separately (image, pins layer, controls).
- Drag detection is duplicated: both `TransformWrapper` (`hasDraggedRef`, `DRAG_THRESHOLD`) and `ImageMapPinMarker` (`hasMovedRef`, `DRAG_THRESHOLD`) have their own logic to suppress the click that follows a drag.
- Long, conditional Tailwind class strings are inlined in each component (viewport cursor, pin marker z-index/cursor, label, icon colors), which makes them hard to read and reuse.
- The only consumer is `apps/web/src/modules/map/components/map-page.tsx`, so the public API can still change.
- Goal: split the package into a provider (state + actions) and small composable components with simpler classes. Pan, zoom, pinch, keyboard and pin behaviour must not change.

## Acceptance Criteria

- [x] `Provider` is provider with `zustand` store
- [x] `ViewPort` is wrapper, support drag and zoom
- [x] `Layer` with `ImageLayer`, `MapLayer`, `PinLayer`, ...

## Solutions

- [x] `ImageMapProvider` + `image-map.store.ts`: one vanilla `zustand` store per provider (viewport/content sizes, transform, zoom range, `isFitted`) with actions (`setTransform` clamps, `zoomTo`, `zoomBy`, `panBy`, `reset`, `getContentPoint`, `getRatioPoint`) and selectors (`selectZoom`, `selectCanZoomIn/Out`, `selectIsReady`); read via `useImageMap(selector)`
- [x] `Viewport`: gestures only (drag, wheel, pinch, resize; no keyboard), reads and writes the store; no `overlay` prop, controls go anywhere inside the provider
- [x] Layers: `ImageLayer` (sets the content size), `MapLayer` (`onPointClick` with ratios), `PinLayer` (one pin per layer, `pointer-events-none` so clicks reach `MapLayer`); `ZoomControls` replaces `TransformControls`; `ImageMap` is a preset composing them
- [x] `ImageMap` is controlled: `value` (`layers` of `image` / `pin`, drawn in order, + `viewport`) and `onChangeValue` only; `useTransformSync` keeps `viewport.transform` and the store in sync; zoom range is the `MIN_ZOOM`/`MAX_ZOOM` constants
- [x] `maps` stores `value` jsonb (`{ layers, viewport: { transform } }`, `MapValue`); `map_pins` and `image_file_id` dropped, existing maps cleared (migration `store_map_value`); API: `PATCH /maps/:id { name?, value? }` only (layers validated with a `type` discriminator, new image files checked through storage); pin and image endpoints removed
- [x] Web `modules/map`: value changes update the cache at once and save after `MAP_SAVE_DELAY` (or right away for image and pin edits)
- [x] `Viewport` swallows the click that ends a drag (inline ref, no shared hook)
- [x] `PinLayer` drags with `@dnd-kit/react` (`useDraggable`); `ImageMapProvider` adds a `DragDropProvider` (pointer-only sensor, activated after `DRAG_THRESHOLD`) and a `PinDragOverlay` that shows the dragged `PinMarker` at screen size; the drop point is the overlay's bottom center
- [x] Classes: state through `data-dragging` / `data-movable` / `aria-pressed` variants instead of conditional `cn(...)`
- [x] Source split into `components/`, `hooks/` (`useViewportObserver`, `useZoomPanPinchSync`, `usePinDrag`, `useImageMapValue`) and `utils/`; `Layer` removed (layers are plain `absolute inset-0` divs, the content stays hidden until ready); transform helpers no longer exported
- [x] Store tests in `image-map.store.spec.ts`; `README.md` and `docs/maps.md` updated
