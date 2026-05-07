"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { WinLossChart } from "@/components/charts/WinLossChart";
import { StrategyPerformanceChart } from "@/components/charts/StrategyPerformanceChart";
import { useTradeStore } from "@/store/trade-store";
import { calculateStrategyPerformance, calculateWinRate } from "@/lib/calculations";
import { TrendingUp, Target, ShieldAlert, Zap, PieChart, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const trades = useTradeStore((state) => state.trades);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const winRate = calculateWinRate(trades);
  const strategyData = calculateStrategyPerformance(trades);

  const stats = [
    { label: "Profit Factor", value: "1.85", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Win Rate", value: `${winRate.toFixed(1)}%`, icon: Zap, color: "text-amber-400" },
    { label: "Total Trades", value: trades.length.toString(), icon: Target, color: "text-primary" },
    { label: "Data Source", value: "Local", icon: ShieldAlert, color: "text-rose-400" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 pb-20">
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Analytics</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Deep insights calculated locally from your data.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((item, i) => (
          <Card key={i} className="bg-white/[0.01] border-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/[0.03]">
             <div className="flex items-center justify-between mb-4">
               <div className={cn("p-2 rounded-lg bg-white/[0.03] border border-white/5", item.color)}>
                 <item.icon className="h-4 w-4" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Metric</span>
             </div>
             <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
             <p className="text-2xl font-bold text-white mt-1 font-mono">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-8 bg-white/[0.01] border-white/5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Win vs Loss Distribution</h3>
              <p className="text-xs text-slate-500 font-medium">Overview of trade outcomes</p>
            </div>
          </div>
          <div className="h-[300px]">
            <WinLossChart trades={trades} />
          </div>
        </Card>

        <Card className="p-8 bg-white/[0.01] border-white/5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
              <BarChart3 className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Strategy Performance</h3>
              <p className="text-xs text-slate-500 font-medium">Effectiveness per execution setup</p>
            </div>
          </div>
          <div className="h-[300px]">
            <StrategyPerformanceChart data={strategyData} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
