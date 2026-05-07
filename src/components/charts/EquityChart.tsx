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

export function EquityChart({ trades = [] }: { trades: Trade[] }) {
  // Transform trades into cumulative pnl over time
  const data = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], trade) => {
      const lastTotal = acc.length > 0 ? acc[acc.length - 1].total : 0;
      acc.push({
        name: new Date(trade.date).toLocaleDateString(),
        total: lastTotal + (trade.pnl || 0),
      });
      return acc;
    }, []);

  // If no data, show placeholder
  const chartData = data.length > 0 ? data : [
    { name: "Start", total: 0 },
  ];

  return (
    <Card className="p-8 bg-white/[0.01] border-white/5 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Equity Curve</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Growth of your capital over time</p>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              stroke="rgba(255,255,255,0.03)" 
              strokeDasharray="4 4" 
            />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-white/10 bg-[#0b1120] p-3 shadow-2xl backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Equity</p>
                      <p className="text-sm font-bold text-white font-mono">
                        ${Number(payload[0].value).toLocaleString()}
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
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
