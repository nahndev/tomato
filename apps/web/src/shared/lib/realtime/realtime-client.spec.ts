import { RealtimeEvent } from "@tomato/constants";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class FakeEventSource extends EventTarget {
  static instances: FakeEventSource[] = [];
  isClosed = false;

  constructor(readonly url: string) {
    super();
    FakeEventSource.instances.push(this);
  }

  close() {
    this.isClosed = true;
  }

  get rooms() {
    return new URL(this.url, "http://localhost").searchParams.get("rooms");
  }

  send(type: string, data: unknown) {
    this.dispatchEvent(new MessageEvent(type, { data: JSON.stringify(data) }));
  }
}

async function load() {
  vi.resetModules();
  return import("./realtime-client");
}

const flush = () => Promise.resolve();

describe("realtime client", () => {
  beforeEach(() => {
    FakeEventSource.instances = [];
    vi.stubGlobal("EventSource", FakeEventSource);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens one stream for the rooms joined in the same tick", async () => {
    const { joinRealtimeRooms } = await load();

    joinRealtimeRooms(["submission:a"]);
    joinRealtimeRooms(["submission:a", "board:b"]);
    await flush();

    expect(FakeEventSource.instances.map((source) => source.rooms)).toEqual(["submission:a,board:b"]);
  });

  it("reconnects only when the set of rooms changes, and closes the old stream once the new one is open", async () => {
    const { joinRealtimeRooms } = await load();
    joinRealtimeRooms(["submission:a"]);
    const leaveB = joinRealtimeRooms(["submission:a"]);
    await flush();
    const [first] = FakeEventSource.instances;

    leaveB();
    await flush();
    expect(FakeEventSource.instances).toHaveLength(1);

    joinRealtimeRooms(["board:b"]);
    await flush();
    const second = FakeEventSource.instances[1];
    expect(second.rooms).toBe("submission:a,board:b");
    expect(first.isClosed).toBe(false);

    second.dispatchEvent(new Event("open"));
    expect(first.isClosed).toBe(true);
  });

  it("closes every stream when the last room is left", async () => {
    const { joinRealtimeRooms } = await load();
    const leave = joinRealtimeRooms(["submission:a"]);
    await flush();

    leave();
    await flush();

    expect(FakeEventSource.instances[0].isClosed).toBe(true);
  });

  it("hands the parsed payload to the listeners of its event", async () => {
    const { joinRealtimeRooms, onRealtimeEvent } = await load();
    const listener = vi.fn();
    const off = onRealtimeEvent(RealtimeEvent.SUBMISSION_SUMMARY, listener);
    joinRealtimeRooms(["submission:a"]);
    await flush();
    const [source] = FakeEventSource.instances;

    source.send(RealtimeEvent.SUBMISSION_SUMMARY, { id: "a" });
    source.send(RealtimeEvent.SUBMISSION_GRAPH_CHANGED, { id: "a" });
    off();
    source.send(RealtimeEvent.SUBMISSION_SUMMARY, { id: "a" });

    expect(listener.mock.calls).toEqual([[{ id: "a" }]]);
  });
});
