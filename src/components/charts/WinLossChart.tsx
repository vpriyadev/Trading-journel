"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Trade } from "@/types";

const COLORS = ["#22c55e", "#ef4444"];

export function WinLossChart({ trades = [] }: { trades: Trade[] }) {
  const wins = trades.filter(t => (t.pnl || 0) > 0).length;
  const losses = trades.filter(t => (t.pnl || 0) <= 0).length;

  const data = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
  ];

  if (trades.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data yet</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          paddingAngle={8}
          dataKey="value"
          stroke="none"
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#0b1120",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          }}
          itemStyle={{ color: "#fff" }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
