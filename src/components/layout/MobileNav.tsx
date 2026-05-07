"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Add Trade", href: "/add-trade", icon: PlusCircle },
  { name: "History", href: "/history", icon: History },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Journal", href: "/journal", icon: BookOpen },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 lg:hidden">
      <div className="mx-auto max-w-md bg-[#0b1120]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-around relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 relative min-w-[64px]",
                  isActive ? "text-primary" : "text-slate-500"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 bg-white/[0.03] border border-white/[0.06] rounded-2xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 mb-1 relative z-10", isActive ? "scale-110" : "opacity-70")} />
                <span className="text-[9px] font-bold uppercase tracking-widest relative z-10">
                  {item.name.split(" ")[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
