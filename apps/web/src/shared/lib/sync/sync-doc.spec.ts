import { describe, expect, it, vi } from "vitest";
import { OnSyncEvent, SyncHandler } from "./sync.decorators";
import { SyncDoc } from "./sync-doc";
import { SyncEvent } from "./sync-event";
import type { OnDestroy, OnSynced } from "./sync.types";

class PingEvent extends SyncEvent {
  constructor(readonly value: number) {
    super();
  }
}

@SyncHandler()
class Listener implements OnSynced, OnDestroy {
  received: number[] = [];
  synced = 0;
  destroyed = 0;

  @OnSyncEvent(PingEvent)
  onPing(event: PingEvent) {
    this.received.push(event.value);
  }

  onSynced() {
    this.synced++;
  }

  onDestroy() {
    this.destroyed++;
  }
}

@SyncHandler()
class Throwing {
  @OnSyncEvent(PingEvent)
  onPing() {
    throw new Error("boom");
  }
}

class NotDecorated {}

describe("SyncDoc", () => {
  it("routes an emitted event to the decorated handler method", () => {
    const syncDoc = new SyncDoc();
    const listener = syncDoc.registerHandler(new Listener());

    syncDoc.emit(new PingEvent(1));
    syncDoc.emit(new PingEvent(2));

    expect(listener.received).toEqual([1, 2]);
  });

  it("returns the registered handler instance", () => {
    const syncDoc = new SyncDoc();
    const listener = syncDoc.registerHandler(new Listener());

    expect(syncDoc.getHandler(Listener)).toBe(listener);
  });

  it("rejects a class without @SyncHandler()", () => {
    expect(() => new SyncDoc().registerHandler(new NotDecorated())).toThrow(/@SyncHandler/);
  });

  it("rejects registering the same handler class twice", () => {
    const syncDoc = new SyncDoc();
    syncDoc.registerHandler(new Listener());

    expect(() => syncDoc.registerHandler(new Listener())).toThrow(/already registered/);
  });

  it("throws for a handler that was never registered", () => {
    expect(() => new SyncDoc().getHandler(Listener)).toThrow(/not registered/);
  });

  it("runs onSynced and onDestroy on handlers that implement them", () => {
    const syncDoc = new SyncDoc();
    const listener = syncDoc.registerHandler(new Listener());

    syncDoc.synced();
    syncDoc.destroy();

    expect(listener.synced).toBe(1);
    expect(listener.destroyed).toBe(1);
  });

  it("stops routing events after destroy", () => {
    const syncDoc = new SyncDoc();
    const listener = syncDoc.registerHandler(new Listener());

    syncDoc.destroy();
    syncDoc.emit(new PingEvent(1));

    expect(listener.received).toEqual([]);
  });

  it("keeps the other handlers running when one throws", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const syncDoc = new SyncDoc();
    syncDoc.registerHandler(new Throwing());
    const listener = syncDoc.registerHandler(new Listener());

    syncDoc.emit(new PingEvent(7));

    expect(listener.received).toEqual([7]);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
