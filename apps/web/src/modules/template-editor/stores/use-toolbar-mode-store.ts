import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ToolbarMode = {
  DOCKED: "docked",
  POPUP: "popup",
} as const;
export type ToolbarMode = (typeof ToolbarMode)[keyof typeof ToolbarMode];

interface ToolbarModeStore {
  mode: ToolbarMode;
  setMode: (mode: ToolbarMode) => void;
}

export const useToolbarModeStore = create<ToolbarModeStore>()(
  persist(
    (set) => ({
      mode: ToolbarMode.DOCKED,
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "tomato:toolbar-mode",
      partialize: (state) => ({ mode: state.mode }),
      skipHydration: true,
    },
  ),
);
