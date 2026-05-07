"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Check, ChevronDown, Smile, Meh, Frown, AlertCircle, Sparkles, Trash2 } from "lucide-react";
import { useJournalStore } from "@/store/journal-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    const id = Math.random().toString(36).substring(7);
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 max-w-4xl mx-auto pb-20">
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Journal</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Daily reflections and market psychology logs.</p>
        </div>
      </div>

      <Card className="bg-white/[0.01] border-white/5 backdrop-blur-xl shadow-2xl p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Entry Title</Label>
            <Input
              placeholder="e.g. Mid-week market review..."
              className="bg-white/[0.02] border-white/5 focus:border-primary/50 transition-all rounded-xl h-12"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Mood</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-between bg-white/[0.02] border-white/5 rounded-xl hover:bg-white/[0.04] px-4 group">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-lg", selectedMood.bg)}>
                      <selectedMood.icon className={cn("h-4 w-4", selectedMood.color)} />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{selectedMood.label}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] bg-[#0b1120] border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                {moods.map((m) => (
                  <DropdownMenuItem
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer focus:bg-white/[0.05] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                       <div className={cn("p-1.5 rounded-lg transition-transform group-hover:scale-110", m.bg)}>
                          <m.icon className={cn("h-4 w-4", m.color)} />
                       </div>
                       <span className="text-sm font-medium text-slate-300">{m.label}</span>
                    </div>
                    {mood === m.value && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Daily Observations</Label>
          <textarea
            placeholder="Document your thoughts, emotions, and market conditions..."
            className="flex min-h-[240px] w-full rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-4 text-sm placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all resize-none leading-relaxed"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <Button 
            onClick={handleSave} 
            disabled={!title || !notes}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 h-12 font-bold uppercase tracking-wider text-xs shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Archive Entry
          </Button>
        </div>
      </Card>

      <div className="pt-8">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 px-1">Past Reflections</h3>
        {entries.length === 0 ? (
          <Card className="bg-white/[0.01] border-white/5 p-16 flex flex-col items-center justify-center text-center rounded-3xl border-dashed">
            <div className="h-16 w-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
              <BookOpen className="h-7 w-7 text-slate-600" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">No entries yet</h4>
            <p className="text-sm text-slate-500 max-w-[240px] mt-2 font-medium leading-relaxed">
              Start building your trading psychology database by recording your first entry.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="bg-white/[0.01] border-white/5 p-6 backdrop-blur-xl group hover:bg-white/[0.02] transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-white">{entry.title}</h4>
                      <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", moods.find(m => m.value === entry.mood)?.bg, moods.find(m => m.value === entry.mood)?.color)}>
                        {entry.mood}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{new Date(entry.date).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)} className="text-slate-600 hover:text-rose-500 hover:bg-rose-500/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{entry.notes}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
