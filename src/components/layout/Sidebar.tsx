"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart2,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Add Trade", href: "/add-trade", icon: PlusCircle },
  { name: "History", href: "/history", icon: History },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Journal", href: "/journal", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/[0.04] bg-[#050816] transition-all duration-300">
      <div className="flex h-full flex-col py-10">
        <div className="mb-14 px-8">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
             </div>
             <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Ledger</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Trading Journal</p>
             </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 mr-4 h-5 w-5 transition-all duration-300",
                    isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-accent"
                    className="absolute left-[-16px] h-5 w-1 rounded-r-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-8">
          <div className="rounded-2xl bg-white/[0.01] border border-white/[0.04] p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Status</p>
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Cloud sync active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
