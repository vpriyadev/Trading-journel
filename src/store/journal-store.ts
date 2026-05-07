import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { JournalEntry } from "@/types";

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({ entries: [entry, ...state.entries] })),
      updateEntry: (id, updatedEntry) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updatedEntry } : e
          ),
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
    }),
    {
      name: "ledger-journal",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
