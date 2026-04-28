import React from "react";
import { useFarmer } from "../context/FarmerContext";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../context/SettingsContext";
import { translations } from "../lib/translations";

export default function SyncStatus() {
  const { isOffline, hasPendingWrites: hasPending } = useFarmer();
  const { language } = useSettings();
  
  const t = translations[language].app;

  return (
    <AnimatePresence>
      {(isOffline || hasPending) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-black/[0.03] shadow-sm transition-all"
        >
          {isOffline ? (
            <>
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] leading-none">Local Mode</span>
            </>
          ) : hasPending ? (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] leading-none">Syncing</span>
            </>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
