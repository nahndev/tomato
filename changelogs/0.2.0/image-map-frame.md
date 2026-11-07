# Use a fixed frame as the image-map base, with draggable images

## Currently

- The first image layer is the base: its natural size is the content size and pins are ratios of it. A map can show only one image, which can't be moved.
- The viewport pans on drag and zooms on wheel/pinch.
- Goal: the content is a fixed-size frame fitted to the page. Dragging with Space held pans; otherwise it moves layers. A map can hold several image layers, each moved and resized inside the frame.

## Acceptance Criteria

- [x] The frame has a constant size (`MAP_FRAME_SIZE`, 1920×1080) and fits the current page; zoom (wheel, pinch, controls) still works; dragging pans only while Space is held
- [x] Image layers store `x`, `y`, `width`, `height` as ratios of the frame; they are clipped to the frame
- [x] An image is selected with a click, moved by dragging and resized from its corners (aspect ratio kept)
- [x] Several images per map: "Add image" adds one fitted in the frame, "Delete image" removes the selected one
- [x] Pins are ratios of the frame and drawn above images

## Solutions

- [x] `@tomato/image-map`: `ImageMapValue.frame` sizes the content through `FrameLayer` (replaces `BaseLayer`); `viewport.selectedPinId` → `selectedLayerId`; `Viewport` pans only while Space is held over it (`useSpacePan`, layers get `pointer-events: none`); empty sizes are ignored by the store; `ImageLayer` takes the layer and `onSelect`/`onChange`, drags with pointer capture in `useImageDrag`; rect math in `utils/rect.utils.ts` (`fitImageRect`, `moveRect`, `resizeRect`, limited by `MIN_IMAGE_SIZE`, `MAX_IMAGE_RATIO`, `MIN_IMAGE_VISIBLE_SIZE`); `useImageMapValue` adds `changeImage`
- [x] `@tomato/types` `MapImageLayer` + API `MapImageLayerDto`: `x`, `y` (−`MAP_IMAGE_RECT_MAX`…1), `width`, `height` (0…`MAP_IMAGE_RECT_MAX`)
- [x] Web `modules/map`: image map always shown (frame even without images); new images get their rect from `fetchImageSize` + `fitImageRect`
