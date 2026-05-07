import { Trade } from "@/types";

export const calculatePnL = (trade: Partial<Trade>): number => {
  if (!trade.quantity || !trade.entryPrice || !trade.exitPrice) return 0;
  
  if (trade.side === "Long") {
    return (trade.exitPrice - trade.entryPrice) * trade.quantity;
  } else {
    return (trade.entryPrice - trade.exitPrice) * trade.quantity;
  }
};

export const calculateWinRate = (trades: Trade[]): number => {
  if (trades.length === 0) return 0;
  const wins = trades.filter((t) => (t.pnl || 0) > 0).length;
  return (wins / trades.length) * 100;
};

export const calculateTotalPnL = (trades: Trade[]): number => {
  return trades.reduce((acc, t) => acc + (t.pnl || 0), 0);
};

export const calculateAvgRR = (trades: Trade[]): number => {
  const tradesWithRR = trades.filter((t) => t.riskReward);
  if (tradesWithRR.length === 0) return 0;
  const totalRR = tradesWithRR.reduce((acc, t) => acc + (t.riskReward || 0), 0);
  return totalRR / tradesWithRR.length;
};

export const calculateMaxDrawdown = (trades: Trade[]): number => {
  if (trades.length === 0) return 0;
  
  let maxPnL = 0;
  let currentPnL = 0;
  let maxDD = 0;
  
  // Sort trades by date ascending for drawdown calculation
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  for (const trade of sortedTrades) {
    currentPnL += trade.pnl || 0;
    if (currentPnL > maxPnL) {
      maxPnL = currentPnL;
    }
    const dd = maxPnL - currentPnL;
    if (dd > maxDD) {
      maxDD = dd;
    }
  }
  
  return maxDD;
};

export const calculateStrategyPerformance = (trades: Trade[]) => {
  const performance: Record<string, number> = {};
  
  trades.forEach((trade) => {
    if (!trade.strategy) return;
    performance[trade.strategy] = (performance[trade.strategy] || 0) + (trade.pnl || 0);
  });
  
  return Object.entries(performance).map(([name, pnl]) => ({ name, pnl }));
};

export const calculateDailyPnL = (trades: Trade[]) => {
  const daily: Record<string, number> = {};
  
  trades.forEach((trade) => {
    const day = new Date(trade.date).toISOString().split("T")[0];
    daily[day] = (daily[day] || 0) + (trade.pnl || 0);
  });
  
  return Object.entries(daily).map(([date, pnl]) => ({ date, pnl }));
};
