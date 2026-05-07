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
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-white/[0.01] border-white/5 p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:bg-white/[0.03] hover:border-white/10">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className={cn(
              "text-2xl font-bold tracking-tight text-white font-mono",
              trend === "up" ? "text-primary" : trend === "down" ? "text-rose-500" : ""
            )}>
              {value}
            </h3>
          </div>
          {subtitle && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
            </div>
          )}
        </div>
        
        {/* Subtle decorative glow */}
        <div className={cn(
          "absolute -right-4 -top-4 h-16 w-16 rounded-full blur-3xl opacity-10",
          trend === "up" ? "bg-primary" : trend === "down" ? "bg-rose-500" : "bg-slate-500"
        )} />
      </Card>
    </motion.div>
  );
}
