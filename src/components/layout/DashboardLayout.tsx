import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-200">
      <Sidebar />
      <MobileNav />
      <main className="lg:pl-64 transition-all duration-300 min-h-screen flex flex-col pb-32 lg:pb-0">
        <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-16 py-8 md:py-12">
          {children}
        </div>
      </main>
      
      {/* Premium Background Grain Overlay */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
