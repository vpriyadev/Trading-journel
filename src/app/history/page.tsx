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
import { Download, Upload, Trash2, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

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
        // Simple JSON import for now as it's more reliable for state
        const importedData = JSON.parse(text);
        if (Array.isArray(importedData)) {
          setTrades(importedData);
          alert("Data imported successfully!");
        }
      } catch (err) {
        alert("Invalid file format. Please use a valid Ledger JSON export.");
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 pb-20">
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">History</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Review and manage your execution database.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportToJSON} className="rounded-full border-white/5 bg-white/[0.02] text-slate-300 hover:text-white">
            <Download className="mr-2 h-4 w-4" />
            Backup JSON
          </Button>
          <label className="cursor-pointer">
            <div className="inline-flex items-center justify-center rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <Upload className="mr-2 h-4 w-4" />
              Restore
            </div>
            <input type="file" className="hidden" onChange={handleImport} accept=".json" />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search assets, strategies..." 
            className="pl-10 bg-white/[0.02] border-white/5 rounded-xl h-11 focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={exportToCSV} variant="outline" className="rounded-xl border-white/5 bg-white/[0.02] text-slate-400 h-11">
          <FileText className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-white/[0.01] border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pl-8">Date</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Asset</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Side</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Size</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Entry</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Exit</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">PNL</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="p-12 text-center text-slate-500 text-sm font-medium">
                  No records found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrades.map((trade) => (
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
                  <TableCell className="text-xs font-mono text-slate-400">
                    {trade.quantity}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">
                    ${trade.entryPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">
                    {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className={cn(
                    "text-sm font-bold font-mono",
                    (trade.pnl || 0) >= 0 ? "text-primary" : "text-rose-500"
                  )}>
                    {(trade.pnl || 0) >= 0 ? "+" : "-"}${Math.abs(trade.pnl || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTrade(trade.id)}
                      className="text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
