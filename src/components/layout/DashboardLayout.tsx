import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-200">
      <Sidebar />
      <main className="pl-64 transition-all duration-300">
        <div className="mx-auto max-w-6xl px-12 py-12">
          {children}
        </div>
      </main>
      
      {/* Premium Background Noise/Grain Overlay */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
