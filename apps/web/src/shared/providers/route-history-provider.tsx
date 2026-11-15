"use client";

import { createStoreContext } from "@tomato/store-context";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";

interface RouteHistoryState {
  currentRoute: string | null;
  previousRoute: string | null;
  visit: (route: string) => void;
}

const RouteHistoryStore = createStoreContext<Record<never, never>, RouteHistoryState>("RouteHistory", {
  initState: (set, get) => ({
    currentRoute: null,
    previousRoute: null,
    visit: (route) => {
      const { currentRoute } = get();
      if (route === currentRoute) return;
      set({ currentRoute: route, previousRoute: currentRoute });
    },
  }),
});

function RouteTracker() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const visit = RouteHistoryStore.useSelector((state) => state.visit);

  useEffect(() => {
    visit(search ? `${pathname}?${search}` : pathname);
  }, [pathname, search, visit]);

  return null;
}

export function RouteHistoryProvider({ children }: { children: ReactNode }) {
  return (
    <RouteHistoryStore.Provider>
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      {children}
    </RouteHistoryStore.Provider>
  );
}

export function useRouteBeforeMount() {
  const pathname = usePathname();
  const store = RouteHistoryStore.useStoreApi();
  const [route] = useState(() => {
    const { currentRoute, previousRoute } = store.getState();
    return currentRoute?.split("?")[0] === pathname ? previousRoute : currentRoute;
  });
  return route;
}
