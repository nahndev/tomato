import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { createStoreContext, StoreProviderMissingError } from "./create-store-context";

const Counter = createStoreContext<{ count: number; label?: string }>("Counter");
const Theme = createStoreContext<{ theme: string }>("Theme", { defaults: { theme: "light" } });
const Selection = createStoreContext<{ items: string[] }, { selected: string | null; select: (item: string) => void }>(
  "Selection",
  { initState: (set) => ({ selected: null, select: (item) => set({ selected: item }) }) },
);

function CountView() {
  return <p>{Counter.useSelector((state) => state.count)}</p>;
}

describe("createStoreContext", () => {
  it("reads the state given as the provider's props", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Counter.Provider count={1} label="Clicks">
        {children}
      </Counter.Provider>
    );

    expect(renderHook(() => Counter.useSelector(), { wrapper }).result.current).toEqual({ count: 1, label: "Clicks" });
  });

  it("follows the provider's props", () => {
    const { rerender } = render(
      <Counter.Provider count={1}>
        <CountView />
      </Counter.Provider>,
    );
    expect(screen.getByText("1")).toBeInTheDocument();

    rerender(
      <Counter.Provider count={2}>
        <CountView />
      </Counter.Provider>,
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("clears a prop the provider no longer gets", () => {
    let label: string | undefined;
    function LabelView() {
      label = Counter.useSelector((state) => state.label);
      return null;
    }

    const { rerender } = render(
      <Counter.Provider count={1} label="Clicks">
        <LabelView />
      </Counter.Provider>,
    );
    rerender(
      <Counter.Provider count={1}>
        <LabelView />
      </Counter.Provider>,
    );

    expect(label).toBeUndefined();
  });

  it("gives each provider its own store", () => {
    render(
      <>
        <Counter.Provider count={1}>
          <CountView />
        </Counter.Provider>
        <Counter.Provider count={2}>
          <CountView />
        </Counter.Provider>
      </>,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("keeps the store's own state and actions next to the props", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Selection.Provider items={["a", "b"]}>{children}</Selection.Provider>
    );
    const { result } = renderHook(() => Selection.useSelector(), { wrapper });

    act(() => result.current.select("b"));

    expect(result.current).toMatchObject({ items: ["a", "b"], selected: "b" });
  });

  it("throws outside the provider without defaults", () => {
    expect(() => renderHook(() => Counter.useSelector())).toThrow(StoreProviderMissingError);
    expect(() => renderHook(() => Counter.useSelector())).toThrow("Counter hooks must be used inside <CounterProvider>");
  });

  it("falls back to the defaults outside the provider", () => {
    expect(renderHook(() => Theme.useSelector((state) => state.theme)).result.current).toBe("light");
  });
});
