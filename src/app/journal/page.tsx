"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen, Check, ChevronDown, Smile, Meh, Frown, AlertCircle, Sparkles, Trash2, PenTool } from "lucide-react";
import { useJournalStore } from "@/store/journal-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

const moods = [
  { value: "great", label: "Great", icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { value: "good", label: "Good", icon: Smile, color: "text-primary", bg: "bg-primary/10" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-slate-400", bg: "bg-slate-400/10" },
  { value: "bad", label: "Bad", icon: Frown, color: "text-orange-400", bg: "bg-orange-400/10" },
  { value: "awful", label: "Awful", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
];

export default function JournalPage() {
  const { entries, addEntry, deleteEntry } = useJournalStore();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("great");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedMood = moods.find((m) => m.value === mood) || moods[0];

  const handleSave = () => {
    if (!title || !notes) return;
    const id = uuidv4();
    addEntry({
      id,
      title,
      notes,
      mood,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    setNotes("");
    setMood("great");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 max-w-4xl mx-auto pb-24">
      <div className="flex items-end justify-between border-b border-white/[0.04] pb-8">
        <div className="flex items-center gap-5">
           <div className="h-14 w-14 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
              <PenTool className="h-6 w-6 text-slate-400" />
           </div>
           <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Journal</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Daily psychological audits and market reflections.</p>
           </div>
        </div>
      </div>

      <Card className="bg-white/[0.01] border-white/[0.06] backdrop-blur-xl shadow-2xl p-10 space-y-10 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-10">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-2">Reflective Title</Label>
            <Input
              placeholder="Mid-session emotional audit..."
              className="bg-white/[0.02] border-white/[0.06] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl h-12 text-sm font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-2">Psychological State</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-between bg-white/[0.02] border-white/[0.06] rounded-2xl hover:bg-white/[0.04] px-5 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-lg", selectedMood.bg)}>
                      <selectedMood.icon className={cn("h-4 w-4", selectedMood.color)} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{selectedMood.label}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-600 group-hover:text-slate-300 transition-all duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] bg-[#0b1120] border-white/[0.08] rounded-2xl shadow-2xl p-2 backdrop-blur-xl">
                {moods.map((m) => (
                  <DropdownMenuItem
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className="flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer focus:bg-white/[0.05] transition-all group mb-1 last:mb-0"
                  >
                    <div className="flex items-center gap-3">
                       <div className={cn("p-2 rounded-lg transition-transform duration-300 group-hover:scale-110", m.bg)}>
                          <m.icon className={cn("h-4 w-4", m.color)} />
                       </div>
                       <span className="text-[13px] font-bold text-slate-300 group-hover:text-white transition-colors">{m.label}</span>
                    </div>
                    {mood === m.value && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-2">Market Observations & Sentiment</Label>
          <textarea
            placeholder="Document your thesis, emotional friction, and key learnings..."
            className="flex min-h-[280px] w-full rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-6 text-sm placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5 focus-visible:border-primary/40 transition-all resize-none leading-relaxed font-medium"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-white/[0.04]">
          <Button 
            onClick={handleSave} 
            disabled={!title || !notes}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12 h-12 font-bold uppercase tracking-[0.15em] text-[11px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Archive Entry
          </Button>
        </div>
      </Card>

      <div className="pt-12">
        <div className="flex items-center gap-3 mb-8 px-2">
           <BookOpen className="h-4 w-4 text-slate-500" />
           <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Chronological Reflections</h3>
        </div>
        
        <AnimatePresence mode="popLayout">
          {entries.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="bg-white/[0.01] border-white/[0.06] p-20 flex flex-col items-center justify-center text-center rounded-[2.5rem] border-dashed">
                <div className="h-16 w-16 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-slate-700" />
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">Pristine Database</h4>
                <p className="text-[13px] text-slate-500 max-w-[280px] mt-2 font-medium leading-relaxed">
                  Your psychological audit trail begins here. Record your first reflection.
                </p>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry, i) => (
                <motion.div 
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-white/[0.01] border-white/[0.06] p-8 backdrop-blur-xl group hover:bg-white/[0.02] transition-all rounded-3xl relative overflow-hidden">
                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h4 className="text-xl font-bold text-white tracking-tight">{entry.title}</h4>
                          <div className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest", moods.find(m => m.value === entry.mood)?.bg, moods.find(m => m.value === entry.mood)?.color)}>
                            {entry.mood}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="h-1 w-1 rounded-full bg-primary/40" />
                           <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">{new Date(entry.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)} className="text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 transition-all rounded-xl opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-6 text-sm text-slate-400 leading-relaxed font-medium whitespace-pre-wrap border-l-2 border-white/[0.03] pl-6">{entry.notes}</p>
                    
                    {/* Subtle Background Glow for Entry Card */}
                    <div className={cn("absolute -right-20 -bottom-20 h-40 w-40 rounded-full blur-[80px] opacity-[0.02] transition-opacity group-hover:opacity-[0.04]", moods.find(m => m.value === entry.mood)?.bg)} />
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
