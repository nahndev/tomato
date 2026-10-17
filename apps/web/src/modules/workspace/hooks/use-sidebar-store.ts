import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SIDEBAR_STORAGE_KEY } from "../workspace.constants";

interface SidebarState {
  isExtended: boolean;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isExtended: false,
      toggle: () => set((state) => ({ isExtended: !state.isExtended })),
    }),
    {
      name: SIDEBAR_STORAGE_KEY,
    },
  ),
);
