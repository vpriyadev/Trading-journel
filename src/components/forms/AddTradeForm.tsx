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
  "FOMO",
  "Revenge Trading",
  "Over-leveraged",
  "Moved Stop Loss",
  "Early Exit",
  "Late Entry",
  "No Plan",
];

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
    const tradeId = Math.random().toString(36).substring(7);
    addTrade({
      ...data,
      id: tradeId,
      pnl: calculatedPnl || 0,
      createdAt: new Date().toISOString(),
    });
    router.push("/dashboard");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Record Execution</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Local-first persistence enabled.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
                className="rounded-full border-white/5 bg-white/[0.02] text-slate-400 hover:text-white"
             >
               Reset
             </Button>
             <Button 
                type="submit" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-bold uppercase tracking-wider text-xs"
             >
               Commit Trade
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Core Data */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Execution Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} className="bg-white/[0.02] border-white/5 focus:border-primary/50 transition-all rounded-lg" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Asset / Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. BTCUSDT" {...field} className="bg-white/[0.02] border-white/5 focus:border-primary/50 transition-all rounded-lg" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Direction</FormLabel>
                  <FormControl>
                    <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-xl gap-1">
                      <button
                        type="button"
                        onClick={() => field.onChange("Long")}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300",
                          field.value === "Long" 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        LONG
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("Short")}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300",
                          field.value === "Short" 
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                            : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        <TrendingDown className="h-3.5 w-3.5" />
                        SHORT
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Size</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className="bg-white/[0.02] border-white/5 focus:border-primary/50 transition-all rounded-lg" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Entry</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className="bg-white/[0.02] border-white/5 focus:border-primary/50 transition-all rounded-lg" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Exit</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className="bg-white/[0.02] border-white/5 focus:border-primary/50 transition-all rounded-lg" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <AnimatePresence>
              {calculatedPnl !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    "p-6 rounded-2xl border flex items-center justify-between overflow-hidden relative",
                    calculatedPnl >= 0 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-rose-500/5 border-rose-500/20"
                  )}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Expected Result</p>
                    <h4 className={cn(
                      "text-2xl font-bold font-mono mt-1",
                      calculatedPnl >= 0 ? "text-primary" : "text-rose-500"
                    )}>
                      {calculatedPnl >= 0 ? "+" : ""}${calculatedPnl.toFixed(2)}
                    </h4>
                  </div>
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center",
                    calculatedPnl >= 0 ? "bg-primary/10 text-primary" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {calculatedPnl >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Qualitative Data */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Psychology & Execution Errors</Label>
              <div className="flex flex-wrap gap-2">
                {MISTAKE_OPTIONS.map((mistake) => {
                  const isSelected = values.mistakes.includes(mistake);
                  return (
                    <button
                      key={mistake}
                      type="button"
                      onClick={() => toggleMistake(mistake)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border",
                        isSelected
                          ? "bg-primary/10 border-primary/30 text-primary shadow-sm shadow-primary/10"
                          : "bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
                      )}
                    >
                      {mistake}
                    </button>
                  );
                })}
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reflection & Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What was the setup? Why did you enter? What did you learn?" 
                      className="bg-white/[0.02] border-white/5 focus:border-primary/50 transition-all rounded-xl min-h-[160px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
              <Info className="h-5 w-5 text-slate-500 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Detailed reflections help build discipline. Your data stays locally on this device.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
