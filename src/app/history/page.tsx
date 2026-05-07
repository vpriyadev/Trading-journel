"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTradeStore } from "@/store/trade-store";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2, Search, FileText, Database, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { trades, deleteTrade, setTrades } = useTradeStore();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredTrades = trades.filter((t) => 
    t.asset.toLowerCase().includes(search.toLowerCase()) ||
    t.strategy?.toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    if (trades.length === 0) return;
    
    const headers = ["Date", "Asset", "Side", "Quantity", "Entry", "Exit", "PNL", "Strategy", "Notes"];
    const rows = trades.map(t => [
      new Date(t.date).toLocaleString(),
      t.asset,
      t.side,
      t.quantity,
      t.entryPrice,
      t.exitPrice || "",
      t.pnl || 0,
      t.strategy || "",
      t.notes || ""
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ledger-trades-${new Date().toISOString().split("T")[0]}.csv`);
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const importedData = JSON.parse(text);
        if (Array.isArray(importedData)) {
          setTrades(importedData);
          alert("Data restored successfully!");
        }
      } catch (err) {
        alert("Invalid backup format.");
      }
    };
    reader.readAsText(file);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ledger-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 pb-24">
      <div className="flex items-end justify-between border-b border-white/[0.04] pb-8">
        <div className="flex items-center gap-5">
           <div className="h-14 w-14 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
              <Database className="h-6 w-6 text-slate-400" />
           </div>
           <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">History</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Archived executions and performance audit.</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportToJSON} className="rounded-full border-white/[0.06] bg-white/[0.02] text-slate-300 hover:text-white px-6 h-11 transition-all hover:bg-white/[0.04]">
            <Download className="mr-2 h-4 w-4" />
            Backup
          </Button>
          <label className="cursor-pointer">
            <div className="inline-flex items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] px-6 py-2.5 text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all">
              <Upload className="mr-2 h-4 w-4" />
              Restore
            </div>
            <input type="file" className="hidden" onChange={handleImport} accept=".json" />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by asset or strategy..." 
            className="pl-12 bg-white/[0.02] border-white/[0.06] rounded-2xl h-12 focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={exportToCSV} variant="outline" className="rounded-2xl border-white/[0.06] bg-white/[0.02] text-slate-400 h-12 px-6 hover:text-white hover:bg-white/[0.04]">
          <FileText className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-white/[0.01] border-white/[0.06] backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.04] hover:bg-transparent bg-white/[0.01]">
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 pl-8 h-12">Date</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Asset</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Side</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Size</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Execution</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">PNL</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                       <Layers className="h-10 w-10 text-slate-700" />
                       <p className="text-sm text-slate-500 font-medium">No archived executions found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrades.map((trade) => (
                  <TableRow key={trade.id} className="border-white/[0.04] group hover:bg-white/[0.02] transition-colors h-16">
                    <TableCell className="text-[13px] font-mono text-slate-400 pl-8">
                      {new Date(trade.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                    </TableCell>
                    <TableCell className="text-[14px] font-bold text-white tracking-tight">
                      {trade.asset}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-0 rounded-lg",
                        trade.side === "Long" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-rose-500/10 text-rose-500"
                      )}>
                        {trade.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[13px] font-mono text-slate-400">
                      {trade.quantity}
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="text-[13px] font-mono text-white">${trade.entryPrice.toFixed(2)}</span>
                          <span className="text-[11px] font-mono text-slate-500">→ {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "Open"}</span>
                       </div>
                    </TableCell>
                    <TableCell className={cn(
                      "text-[14px] font-bold font-mono tracking-tighter",
                      (trade.pnl || 0) >= 0 ? "text-emerald-400" : "text-rose-500"
                    )}>
                      {(trade.pnl || 0) >= 0 ? "+" : "-"}${Math.abs(trade.pnl || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteTrade(trade.id)}
                        className="text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all rounded-xl opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
