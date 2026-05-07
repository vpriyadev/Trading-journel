import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Trade } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface TradeState {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, trade: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  setTrades: (trades: Trade[]) => void;
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set) => ({
      trades: [],
      addTrade: (trade) =>
        set((state) => ({ trades: [trade, ...state.trades] })),
      updateTrade: (id, updatedTrade) =>
        set((state) => ({
          trades: state.trades.map((t) =>
            t.id === id ? { ...t, ...updatedTrade } : t
          ),
        })),
      deleteTrade: (id) =>
        set((state) => ({
          trades: state.trades.filter((t) => t.id !== id),
        })),
      setTrades: (trades) => set({ trades }),
    }),
    {
      name: "ledger-trades",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
