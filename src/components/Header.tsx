import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { translations } from "../lib/translations";
import SyncStatus from "./SyncStatus";

export default function Header() {
  const { user } = useAuth();
  const { language } = useSettings();
  const t = translations[language].header;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-3xl border-b border-black/[0.02] flex justify-between items-center w-full px-10 py-6 transition-all duration-700">
      <div className="flex items-center gap-5 group cursor-default">
        <div className="w-14 h-14 rounded-[1.75rem] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex items-center justify-center border border-black/[0.01] group-hover:rotate-[15deg] transition-all duration-700 active:scale-95">
          <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-slate-900 font-black text-3xl tracking-tighter leading-none py-1">AgriGuard<span className="text-primary font-black ml-1">AI</span></h1>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">{t.protocolActive}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <SyncStatus />
        
        <div className="hidden md:flex items-center gap-4 border-l border-black/[0.03] pl-8">
          <div className="flex flex-col items-end">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">{t.sessionHost}</p>
            <p className="text-sm font-black text-slate-900 tracking-tight">{user?.displayName?.split(' ')[0]}</p>
          </div>
          <button className="group relative">
            <div className="w-14 h-14 rounded-[1.5rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-50 group-hover:scale-105 transition-all duration-500 ring-1 ring-black/[0.03]">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || "Felix"}`} 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
