export type Side = "Long" | "Short";

export interface Trade {
  id: string;
  asset: string;
  side: Side;
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl?: number;
  riskReward?: number;
  strategy?: string;
  emotion?: string;
  mistakes: string[];
  notes?: string;
  createdAt: string;
  date: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  notes: string;
  mood: string;
  createdAt: string;
  date: string;
}

export interface Settings {
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
  dashboardPreferences: {
    showEquityCurve: boolean;
    showWinLoss: boolean;
  };
}
