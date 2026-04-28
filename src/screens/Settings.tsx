import React, { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { useFarmer } from "../context/FarmerContext";
import { motion, AnimatePresence } from "motion/react";
import { translations } from "../lib/translations";

export default function Settings() {
  const { language, setLanguage } = useSettings();
  const { user, logout, updateProfile: updateAuthProfile } = useAuth();
  const { profile, updateProfile: updateFarmerProfile, resetData } = useFarmer();
  const t = translations[language].settings;

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (profile && !isEditing) {
      setLocation(profile.location);
    }
  }, [profile, isEditing]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateAuthProfile(displayName);
      await updateFarmerProfile({ location });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    
    setIsLoading(true);
    try {
      await resetData();
      setConfirmReset(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: t.yield, value: "85%", icon: "monitoring", color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: t.trust, value: "9.2/10", icon: "verified_user", color: "text-rose-500", bg: "bg-rose-50" },
    { label: t.savings, value: "12k KES", icon: "savings", color: "text-amber-500", bg: "bg-amber-50" }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-24">
      {/* Premium Profile Header */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="premium-card p-12 md:p-20 relative overflow-hidden group border-none bg-white"
      >
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-50 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-16 text-center md:text-left relative z-10">
          <div className="relative group/avatar">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="w-40 h-40 md:w-56 md:h-56 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl transition-all duration-500 ring-1 ring-black/[0.03]"
            >
               <img 
                 className="w-full h-full object-cover" 
                 src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || "Felix"}`} 
                 alt="Profile" 
               />
            </motion.div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-4 -right-4 bg-slate-900 text-white w-14 h-14 rounded-3xl shadow-2xl transition-all active:scale-90 hover:rotate-12 border-4 border-white flex items-center justify-center group/edit"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">edit</span>
              </button>
            )}
          </div>

          <div className="flex-1 space-y-8">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">{t.nameLabel}</label>
                       <input 
                         type="text" 
                         value={displayName}
                         onChange={(e) => setDisplayName(e.target.value)}
                         className="w-full bg-slate-50 border border-black/[0.03] rounded-3xl px-8 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">{t.locationLabel}</label>
                       <input 
                         type="text" 
                         value={location}
                         onChange={(e) => setLocation(e.target.value)}
                         className="w-full bg-slate-50 border border-black/[0.03] rounded-3xl px-8 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                       />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1 bg-primary text-white font-black text-[10px] uppercase tracking-[0.3em] py-6 rounded-3xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                    >
                      {isLoading ? "Neural Sync..." : t.saveProfile}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-10 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] py-6 rounded-3xl hover:bg-slate-100 transition-all active:scale-95"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-black tracking-[0.5em] text-primary mb-2 block">Professional Farmer</span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">{user?.displayName || "Farmer"}</h1>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 rounded-full text-slate-600 font-black text-[10px] uppercase tracking-widest leading-none border border-black/[0.02]">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {location}
                    </div>
                    <span className="bg-emerald-50 text-primary px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-emerald-100/50 shadow-sm">{t.memberType}</span>
                  </div>
                  <p className="max-w-md text-slate-400 font-medium text-lg leading-relaxed italic opacity-80">"Optimizing Kenyan agriculture through AI-driven market intelligence since 2021."</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid Refined */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 * idx }}
             className="premium-card p-10 flex items-center gap-8 group bg-white border-none"
           >
             <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110", stat.bg, stat.color)}>
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</p>
             </div>
           </motion.div>
        ))}
      </section>

      {/* Settings Grid Refined */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
           <motion.div 
             whileHover={{ y: -4 }}
             className="premium-card p-12 flex flex-col md:flex-row items-center justify-between gap-12 bg-white border-none"
           >
              <div className="space-y-6">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                       <span className="material-symbols-outlined text-[28px]">translate</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-slate-900">{t.languageTitle}</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Interface Configuration</p>
                    </div>
                 </div>
                 <p className="text-lg font-medium text-slate-400 leading-relaxed max-w-sm">{t.languageDesc}</p>
              </div>
              <div className="w-full md:w-auto bg-slate-50 p-2.5 rounded-[3rem] flex gap-2 border border-black/[0.02] shadow-inner">
                {["english", "sheng"].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => setLanguage(lang as any)}
                    className={cn(
                      "flex-1 md:px-12 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all",
                      language === lang 
                        ? "bg-white shadow-2xl shadow-emerald-500/10 text-primary border border-black/[0.01]" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
           </motion.div>
        </div>
      </div>

      <footer className="pt-12 border-t border-black/[0.03] flex flex-col md:flex-row gap-8 justify-between items-center bg-white/40 p-16 rounded-[4rem]">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
             <div className="live-indicator w-2.5 h-2.5 rounded-full"></div>
             <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">{t.accountPulse}</p>
          </div>
          <p className="text-sm font-bold text-slate-400 opacity-60">Connected since April 2024 • AG-INFRA-NET • {user?.uid?.slice(0,8).toUpperCase()}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <button 
            onClick={handleReset}
            disabled={isLoading}
            className={cn(
              "px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 border-2",
              confirmReset 
                ? "bg-rose-600 text-white border-rose-600 animate-pulse shadow-2xl shadow-rose-600/30" 
                : "text-rose-400 border-slate-100 hover:border-rose-100 hover:bg-rose-50/30"
            )}
          >
            {confirmReset ? "Confirm System Wipe?" : t.resetData}
          </button>
          <button 
            onClick={logout}
            className="px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] bg-slate-900 text-white shadow-3xl hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-4 border border-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {t.signOut}
          </button>
        </div>
      </footer>
    </div>
  );
}
