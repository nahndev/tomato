import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ToolbarMode } from "../template-editor.constants";

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
