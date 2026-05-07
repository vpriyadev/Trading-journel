"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, subtitle, trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className="relative overflow-hidden bg-white/[0.01] border-white/[0.06] p-5 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.03] hover:border-white/[0.12] group">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className={cn(
              "text-2xl font-bold tracking-tight text-white font-mono selection:bg-primary/20",
              trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-500" : ""
            )}>
              {value}
            </h3>
          </div>
          {subtitle && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{subtitle}</p>
            </div>
          )}
        </div>
        
        {/* Elegant Accent Glow */}
        <div className={cn(
          "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-[40px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500",
          trend === "up" ? "bg-emerald-500" : trend === "down" ? "bg-rose-500" : "bg-primary"
        )} />
      </Card>
    </motion.div>
  );
}
