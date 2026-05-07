"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function RecentTrades({ trades = [] }: { trades: any[] }) {
  return (
    <Card className="bg-white/[0.01] border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-white/5">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity</h3>
        <p className="text-xs text-slate-500 font-medium mt-1">Detailed log of your latest executions</p>
      </div>
      
      {trades.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm font-medium">
          No records found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pl-8">Date</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Asset</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Side</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Strategy</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-8">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id} className="border-white/5 group hover:bg-white/[0.02] transition-colors">
                  <TableCell className="text-xs font-mono text-slate-400 pl-8">
                    {new Date(trade.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-white">
                    {trade.asset}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter border-0",
                      trade.side === "Long" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-rose-500/10 text-rose-500"
                    )}>
                      {trade.side}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-400">
                    {trade.strategy || "—"}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right text-sm font-bold font-mono pr-8",
                    trade.pnl >= 0 ? "text-primary" : "text-rose-500"
                  )}>
                    {trade.pnl >= 0 ? "+" : "-"}${Math.abs(trade.pnl).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
