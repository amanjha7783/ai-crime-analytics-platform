"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, ShieldCheck, FileText, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const DEMO_EVENTS = [
  { text: "AI processing daily crime reports...", icon: Loader2, color: "text-blue-400" },
  { text: "New burglary hotspot detected in Zone B", icon: AlertTriangle, color: "text-red-400" },
  { text: "Intelligence report generated for Mysuru", icon: FileText, color: "text-green-400" },
  { text: "System nominal, models up to date", icon: ShieldCheck, color: "text-[var(--accent)]" },
];

export function LiveDemoFeed() {
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % DEMO_EVENTS.length);
    }, 4000); // Change event every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const currentEvent = DEMO_EVENTS[eventIndex];
  const Icon = currentEvent.icon;

  return (
    <div className="glass px-3 py-2 rounded-md flex items-center gap-2 text-sm overflow-hidden min-w-[250px]">
      <Activity aria-hidden="true" size={16} className="text-[var(--accent)] shrink-0" />
      <div className="text-[var(--muted)] shrink-0 mr-2 border-r border-[var(--glass-border)] pr-2">Live feed</div>
      <div className="relative flex-1 h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={eventIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center gap-2 whitespace-nowrap"
          >
            <Icon size={14} className={`${currentEvent.color} ${Icon === Loader2 ? 'animate-spin' : ''}`} />
            <span className="text-xs">{currentEvent.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
