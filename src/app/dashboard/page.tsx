"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate, Activity } from "lucide-react";
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-3 duration-1000 pb-24">
      <div className="flex items-end justify-between border-b border-white/[0.04] pb-8">
        <div className="flex items-center gap-5">
           <div className="h-14 w-14 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary" />
           </div>
           <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium italic">High-performance trading terminal</p>
           </div>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 h-auto shadow-lg shadow-primary/20 transition-all duration-400 hover:scale-[1.03] active:scale-[0.98]">
          <Link href="/add-trade" className="flex items-center gap-2.5">
            <Plus className="h-5 w-5" />
            <span className="font-bold uppercase tracking-[0.15em] text-[11px]">Record Execution</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard 
          title="Net Equity PNL" 
          value={`${totalPnL >= 0 ? "+" : "-"}$${Math.abs(totalPnL).toFixed(2)}`} 
          trend={totalPnL >= 0 ? "up" : "down"} 
        />
        <StatCard title="Global Win Rate" value={`${winRate.toFixed(1)}%`} trend={winRate >= 50 ? "up" : "down"} />
        <StatCard title="Profit Expectancy" value={`1:${avgRR.toFixed(1)}`} />
        <StatCard title="Realized Drawdown" value={`-$${maxDD.toFixed(2)}`} trend="down" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Daily Result" 
          value={`${todayPnL >= 0 ? "+" : "-"}$${Math.abs(todayPnL).toFixed(2)}`} 
          trend={todayPnL >= 0 ? "up" : "down"} 
          subtitle={`${todayTrades.length} positions closed`} 
        />
        <StatCard title="Total Executions" value={trades.length.toString()} subtitle="Verified records" />
        <StatCard title="Edge Status" value="Optimized" trend="up" subtitle="Strategy validation" />
      </div>

      <div className="grid gap-10 grid-cols-1">
        <EquityChart trades={trades} />
        <div className="pt-4">
           <RecentTrades trades={trades} />
        </div>
      </div>
    </div>
  );
}
