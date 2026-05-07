"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useTradeStore } from "@/store/trade-store";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { calculatePnL } from "@/lib/calculations";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  date: z.string(),
  asset: z.string().min(1, "Required"),
  side: z.enum(["Long", "Short"]),
  quantity: z.coerce.number().min(0.00001, "Invalid"),
  entryPrice: z.coerce.number().min(0.00001, "Invalid"),
  exitPrice: z.coerce.number().optional(),
  stopLoss: z.coerce.number().optional(),
  takeProfit: z.coerce.number().optional(),
  strategy: z.string().optional(),
  emotion: z.string().optional(),
  mistakes: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MISTAKE_OPTIONS = [
  "overtrading",
  "early exit",
  "no stop loss",
  "moved stop",
  "revenge trade",
  "no plan",
];

const STRATEGY_OPTIONS = ["breakout", "trend follow", "mean reversion", "scalp", "fvg gap"];
const EMOTION_OPTIONS = ["calm", "confident", "anxious", "greedy", "fearful"];

export function AddTradeForm() {
  const router = useRouter();
  const addTrade = useTradeStore((state) => state.addTrade);
  const [calculatedPnl, setCalculatedPnl] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
      asset: "",
      side: "Long",
      quantity: 0,
      entryPrice: 0,
      mistakes: [],
      notes: "",
      strategy: "breakout",
      emotion: "calm",
    },
  });

  const { watch, setValue } = form;
  const values = watch();

  useEffect(() => {
    if (values.quantity && values.entryPrice && values.exitPrice) {
      const pnl = calculatePnL(values as any);
      setCalculatedPnl(pnl);
    } else {
      setCalculatedPnl(null);
    }
  }, [values]);

  const toggleMistake = (mistake: string) => {
    const current = new Set(values.mistakes);
    if (current.has(mistake)) {
      current.delete(mistake);
    } else {
      current.add(mistake);
    }
    setValue("mistakes", Array.from(current));
  };

  const onSubmit = (data: FormValues) => {
    const tradeId = uuidv4();
    addTrade({
      ...data,
      id: tradeId,
      pnl: calculatedPnl || 0,
      createdAt: new Date().toISOString(),
    });
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Add Trade</h1>
        <p className="text-sm text-slate-400">Log a position to track and learn from</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 glass-morphism rounded-[2rem] p-10">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {/* Row 1: Date & Asset */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} className="bg-white/[0.02] border-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl h-12 font-mono" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Asset</FormLabel>
                  <FormControl>
                    <Input placeholder="AAPL, NQ, BTC..." {...field} className="bg-white/[0.02] border-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl h-12" />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Row 2: Side & Quantity */}
            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Side</FormLabel>
                  <FormControl>
                    <div className="flex bg-white/[0.02] border border-white/[0.08] rounded-xl p-1 gap-1">
                      <button
                        type="button"
                        onClick={() => field.onChange("Long")}
                        className={cn(
                          "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-300",
                          field.value === "Long" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm" 
                            : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        Buy / Long
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("Short")}
                        className={cn(
                          "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-300",
                          field.value === "Short" 
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm" 
                            : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        Sell / Short
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} className="bg-white/[0.02] border-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl h-12" />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Row 3: Entry & Exit */}
            <FormField
              control={form.control}
              name="entryPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Entry Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} className="bg-white/[0.02] border-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl h-12" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Exit Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} className="bg-white/[0.02] border-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl h-12" />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Row 4: SL & TP */}
            <FormField
              control={form.control}
              name="stopLoss"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Stop Loss</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} className="bg-white/[0.02] border-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl h-12" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="takeProfit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Take Profit</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} className="bg-white/[0.02] border-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl h-12" />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Row 5: Strategy & Emotion */}
            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Strategy</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl h-12 px-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none appearance-none transition-all cursor-pointer">
                      {STRATEGY_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0b1120] uppercase">{s}</option>)}
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emotion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Emotion</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl h-12 px-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none appearance-none transition-all cursor-pointer">
                      {EMOTION_OPTIONS.map(e => <option key={e} value={e} className="bg-[#0b1120] uppercase">{e}</option>)}
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Row 6: Mistakes (Full Width) */}
            <div className="col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Mistakes (Optional)</Label>
              <div className="flex flex-wrap gap-2.5">
                {MISTAKE_OPTIONS.map((mistake) => {
                  const isSelected = values.mistakes.includes(mistake);
                  return (
                    <button
                      key={mistake}
                      type="button"
                      onClick={() => toggleMistake(mistake)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border",
                        isSelected
                          ? "bg-primary/10 border-primary/40 text-primary"
                          : "bg-white/[0.02] border-white/[0.08] text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {mistake}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 7: Notes (Full Width) */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2.5 block">Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What happened? What did you learn?" 
                      className="bg-white/[0.02] border-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl min-h-[140px] resize-none leading-relaxed"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Bottom Section: PNL, RR, Buttons */}
          <div className="pt-10 mt-10 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex gap-12">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-2">PNL (Calculated)</p>
                  <p className={cn(
                    "text-lg font-bold font-mono tracking-tighter",
                    calculatedPnl === null ? "text-slate-700" : (calculatedPnl >= 0 ? "text-emerald-400" : "text-rose-500")
                  )}>
                    {calculatedPnl === null ? "—" : `${calculatedPnl >= 0 ? "+" : ""}$${Math.abs(calculatedPnl).toFixed(2)}`}
                  </p>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-2">Risk : Reward</p>
                  <p className="text-lg font-bold font-mono text-slate-400">
                    —
                  </p>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => router.push("/dashboard")}
                  className="text-slate-400 hover:text-white hover:bg-white/[0.04] px-8"
               >
                 Cancel
               </Button>
               <Button 
                  type="submit" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 h-11 font-bold uppercase tracking-wider text-xs shadow-lg shadow-primary/10"
               >
                 Save trade
               </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
