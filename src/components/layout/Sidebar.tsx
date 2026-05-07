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
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/5 bg-[#050816] transition-all duration-300">
      <div className="flex h-full flex-col px-6 py-8">
        <div className="mb-12 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">Ledger</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Trading Journal</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-white/[0.04] border border-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 mr-3 h-4 w-4 transition-colors duration-300",
                    isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-accent"
                    className="absolute left-[-24px] h-4 w-1 rounded-r-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-2">
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] text-slate-300 font-medium">Cloud Sync Active</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
