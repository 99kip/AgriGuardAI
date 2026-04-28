import React from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";
import { useSettings } from "../context/SettingsContext";
import { translations } from "../lib/translations";

interface Tab {
  id: string;
  label: keyof typeof translations.english.nav;
  icon: string;
}

export default function Navigation({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const { language } = useSettings();
  const t = translations[language].nav;

  const tabs: Tab[] = [
    { id: "dashboard", label: "dashboard", icon: "grid_view" },
    { id: "chat", label: "chat", icon: "forum" },
    { id: "settings", label: "settings", icon: "person" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-12 pt-6 bg-white/60 backdrop-blur-3xl border-t border-black/[0.02] shadow-[0_-20px_80px_rgba(0,0,0,0.06)] rounded-t-[4rem] transition-all duration-1000">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative flex flex-col items-center justify-center px-8 py-3 rounded-[2.5rem] transition-all duration-700 active:scale-95 group",
            activeTab === tab.id
              ? "text-primary"
              : "text-slate-400 hover:text-primary/60"
          )}
        >
          {activeTab === tab.id && (
            <motion.div 
               layoutId="nav-glow"
               className="absolute inset-0 bg-primary/5 rounded-[2rem] -z-10 shadow-inner"
            />
          )}
          <span 
            className={cn(
              "material-symbols-outlined text-[32px] transition-all duration-700 group-hover:-translate-y-1 group-active:scale-110",
            )}
            style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0" }}
          >
            {tab.icon}
          </span>
          <span className={cn(
            "text-[9px] font-black uppercase tracking-[0.3em] mt-2 transition-all duration-500",
            activeTab === tab.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
          )}>
            {t[tab.label]}
          </span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="nav-dot"
              className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_12px_rgba(16,185,129,1)]"
            />
          )}
        </button>
      ))}
    </nav>
  );
}
