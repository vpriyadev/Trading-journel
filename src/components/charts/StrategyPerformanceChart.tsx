"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function StrategyPerformanceChart({ data = [] }: { data: any[] }) {
  if (data.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data yet</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
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
          cursor={{ fill: "rgba(255,255,255,0.02)" }}
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
        <Bar dataKey="pnl" radius={[4, 4, 0, 0]} animationDuration={1500}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
