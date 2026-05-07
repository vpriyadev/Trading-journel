"use client";

import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Trade } from "@/types";
import { TrendingUp, LineChart } from "lucide-react";

export function EquityChart({ trades = [] }: { trades: Trade[] }) {
  // Transform trades into cumulative pnl over time
  const data = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], trade) => {
      const lastTotal = acc.length > 0 ? acc[acc.length - 1].total : 0;
      acc.push({
        name: new Date(trade.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        total: lastTotal + (trade.pnl || 0),
      });
      return acc;
    }, []);

  // If no data, show placeholder
  const chartData = data.length > 0 ? data : [
    { name: "Start", total: 0 },
  ];

  return (
    <Card className="p-10 bg-white/[0.01] border-white/[0.06] backdrop-blur-xl shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <LineChart className="h-5 w-5 text-emerald-400" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Equity Curve</h3>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.1em] mt-0.5">Realized cumulative PNL</p>
           </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Current State</span>
           <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Optimized</span>
        </div>
      </div>
      
      <div className="h-[380px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              stroke="rgba(255,255,255,0.03)" 
              strokeDasharray="6 6" 
            />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
              dy={15}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-2xl border border-white/[0.12] bg-[#0b1120]/90 p-4 shadow-3xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Equity Balance</p>
                      <p className="text-lg font-bold text-white font-mono tracking-tighter">
                        ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#22c55e"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorTotal)"
              animationDuration={2500}
              strokeLinecap="round"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute -left-20 -bottom-20 h-64 w-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-1000" />
    </Card>
  );
}
