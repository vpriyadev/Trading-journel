import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Settings } from "@/types";

interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  theme: "dark",
  sidebarCollapsed: false,
  dashboardPreferences: {
    showEquityCurve: true,
    showWinLoss: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: "ledger-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
