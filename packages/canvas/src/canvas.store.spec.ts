import { describe, expect, it } from "vitest";
import { MAX_ZOOM, MIN_ZOOM, SidePanel } from "./canvas.constants";
import { createCanvasStore, selectZoom } from "./canvas.store";

const viewport = { width: 800, height: 600 };
const content = { width: 1600, height: 400 };
const fitted = { scale: 0.5, x: 0, y: 200 };

function createReadyStore() {
  const store = createCanvasStore();
  store.getState().setViewportSize(viewport);
  store.getState().setContentSize(content);
  return store;
}

describe("createCanvasStore", () => {
  it("opens the layers panel first, switches panels, and closes the open one", () => {
    const store = createCanvasStore();
    expect(store.getState().activePanel).toBe(SidePanel.LAYERS);
    store.getState().togglePanel(SidePanel.PROPERTY);
    expect(store.getState().activePanel).toBe(SidePanel.PROPERTY);
    store.getState().togglePanel(SidePanel.PROPERTY);
    expect(store.getState().activePanel).toBeNull();
  });

  it("fits the content once both sizes are known", () => {
    expect(createReadyStore().getState().transform).toEqual(fitted);
  });

  it("refits on resize until the user moves the content", () => {
    const store = createReadyStore();
    store.getState().setViewportSize({ width: 400, height: 600 });
    expect(store.getState().transform.scale).toBe(0.25);

    store.getState().panBy(10, 0);
    store.getState().setViewportSize(viewport);
    expect(store.getState().transform.scale).toBe(0.25);
    expect(store.getState().isFitted).toBe(false);
  });

  it("clamps zoom to the range", () => {
    const store = createReadyStore();
    store.getState().zoomBy(100);
    expect(selectZoom(store.getState())).toBe(MAX_ZOOM);
    store.getState().zoomBy(0.001);
    expect(selectZoom(store.getState())).toBe(MIN_ZOOM);
  });

  it("ignores transforms until both sizes are known", () => {
    const store = createCanvasStore();
    store.getState().setTransform({ scale: 2, x: 10, y: 10 });
    expect(store.getState().transform).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it("is not ready while the viewport is empty", () => {
    const store = createCanvasStore();
    store.getState().setViewportSize({ width: 800, height: 0 });
    store.getState().setContentSize(content);
    expect(store.getState().viewportSize).toBeNull();
    expect(store.getState().transform).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it("refits on reset", () => {
    const store = createReadyStore();
    store.getState().zoomBy(2);
    store.getState().reset();
    expect(store.getState().transform).toEqual(fitted);
    expect(store.getState().isFitted).toBe(true);
  });
});
