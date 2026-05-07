"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { EquityChart } from "@/components/charts/EquityChart";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { useTradeStore } from "@/store/trade-store";
import { 
  calculateTotalPnL, 
  calculateWinRate, 
  calculateAvgRR, 
  calculateMaxDrawdown 
} from "@/lib/calculations";

export default function DashboardPage() {
  const trades = useTradeStore((state) => state.trades);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalPnL = calculateTotalPnL(trades);
  const winRate = calculateWinRate(trades);
  const avgRR = calculateAvgRR(trades);
  const maxDD = calculateMaxDrawdown(trades);

  // Calculate Today's PNL
  const today = new Date().toISOString().split("T")[0];
  const todayTrades = trades.filter(t => t.date.split("T")[0] === today);
  const todayPnL = calculateTotalPnL(todayTrades);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 pb-20">
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Monitoring your trading performance (Local-first).</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-6 h-auto shadow-lg shadow-primary/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <Link href="/add-trade" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="font-bold uppercase tracking-wider text-xs">New Trade</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard 
          title="Total PNL" 
          value={`${totalPnL >= 0 ? "+" : "-"}$${Math.abs(totalPnL).toFixed(2)}`} 
          trend={totalPnL >= 0 ? "up" : "down"} 
        />
        <StatCard title="Win Rate" value={`${winRate.toFixed(1)}%`} trend={winRate >= 50 ? "up" : "down"} />
        <StatCard title="Avg R:R" value={`1:${avgRR.toFixed(1)}`} />
        <StatCard title="Max Drawdown" value={`-$${maxDD.toFixed(2)}`} trend="down" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Today" 
          value={`${todayPnL >= 0 ? "+" : "-"}$${Math.abs(todayPnL).toFixed(2)}`} 
          trend={todayPnL >= 0 ? "up" : "down"} 
          subtitle={`${todayTrades.length} positions`} 
        />
        <StatCard title="All Time Trades" value={trades.length.toString()} subtitle="Total executions" />
        <StatCard title="Best Day" value="+$450.00" trend="up" subtitle="Coming soon" />
      </div>

      <div className="grid gap-8 grid-cols-1">
        <EquityChart trades={trades} />
        <RecentTrades trades={trades} />
      </div>
    </div>
  );
}
