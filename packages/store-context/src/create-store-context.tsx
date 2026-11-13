import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createStore, useStore, type StateCreator, type StoreApi } from "zustand";
import { shallow } from "zustand/shallow";

export class StoreProviderMissingError extends Error {
  constructor(name: string) {
    super(`${name} hooks must be used inside <${name}Provider>`);
  }
}

export interface StoreContextOptions<P extends object, S extends object> {
  /** Props used outside the provider; without them the hooks throw there. */
  defaults?: P;
  /** The store's own state and actions, kept next to the props. */
  initState?: StateCreator<P & S, [], [], S>;
}

export type StoreProviderProps<P extends object> = P & { children?: ReactNode };

/** A zustand store per `Provider` instance: its props are written into the store whenever they change. */
export function createStoreContext<P extends object, S extends object = object>(
  name: string,
  { defaults, initState }: StoreContextOptions<P, S> = {},
) {
  type State = P & S;

  const create = (props: P) =>
    createStore<State>((set, get, api) => ({ ...initState?.(set, get, api), ...props }) as State);

  const StoreContext = createContext<StoreApi<State> | null>(defaults ? create(defaults) : null);

  function Provider({ children, ...rest }: StoreProviderProps<P>) {
    const props = rest as unknown as P;
    const [store] = useState(() => create(props));
    const propsRef = useRef(props);

    useLayoutEffect(() => {
      const previous = propsRef.current;
      if (shallow(previous, props)) return;
      propsRef.current = props;
      const removed = Object.keys(previous).filter((key) => !(key in props));
      store.setState({ ...Object.fromEntries(removed.map((key) => [key, undefined])), ...props });
    });

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
  }
  Provider.displayName = `${name}Provider`;

  function useStoreApi(): StoreApi<State> {
    const store = useContext(StoreContext);
    if (!store) throw new StoreProviderMissingError(name);
    return store;
  }

  /** A selector that builds a new object or array must be wrapped in `useShallow`. */
  function useSelector(): State;
  function useSelector<U>(selector: (state: State) => U): U;
  function useSelector<U>(selector?: (state: State) => U): State | U {
    return useStore<StoreApi<State>, State | U>(useStoreApi(), selector ?? ((state) => state));
  }

  return { Provider, useSelector, useStoreApi };
}
