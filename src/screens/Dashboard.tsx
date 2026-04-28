import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn, formatKES } from "@/src/lib/utils";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { useFarmer } from "../context/FarmerContext";
import { translations } from "../lib/translations";
import { getIntelligence, WeatherData, MarketInsight } from "../services/intelligenceService";

export default function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { language } = useSettings();
  const { user } = useAuth();
  const { profile: farmerProfile } = useFarmer();
  const t = translations[language].dashboard;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    weather: WeatherData;
    marketInsights: MarketInsight[];
    advisory: string;
  } | null>(null);

  useEffect(() => {
    async function fetchIntelligence() {
      if (!farmerProfile?.location) return;
      try {
        const result = await getIntelligence(farmerProfile.location);
        setData(result);
      } catch (err) {
        console.error("Dashboard Intelligence Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchIntelligence();
  }, [farmerProfile?.location]);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-24">
      {/* Dynamic Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="px-2"
      >
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">
               {farmerProfile?.location || "Scanning Intelligence..."}
             </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9] py-2">
            {t.greeting},<br/>{farmerProfile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || "Farmer"}
          </h1>
          <p className="text-xl text-slate-400 font-medium tracking-tight opacity-80">{t.motto}</p>
        </div>
      </motion.header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-32">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin shadow-inner"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Neural Sync in Progress</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Intelligence Bento Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-8 premium-card p-12 flex flex-col md:flex-row gap-12 relative overflow-hidden group border-none bg-white"
          >
            <div className="flex-1 space-y-10 relative z-10">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-100/50 shadow-sm transition-transform group-hover:rotate-12">
                    <span className="material-symbols-outlined text-sky-500 text-[22px]">thermostat</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Local Micro-Climate</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-8xl font-black tracking-tighter text-slate-900">{data?.weather.temp}°</span>
                  <span className="text-4xl font-bold text-slate-200">C</span>
                </div>
                <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">{data?.weather.condition}</p>
              </div>
              
              <div className="flex gap-10 mt-4">
                {data?.weather.forecast.map((f, i) => (
                  <div key={i} className="text-center group/forecast">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 group-hover/forecast:text-primary transition-colors">{f.day.slice(0,3)}</p>
                    <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center mb-4 group-hover/forecast:bg-white group-hover/forecast:shadow-[0_12px_24px_rgba(0,0,0,0.06)] group-hover/forecast:-translate-y-1 transition-all duration-500 border border-transparent group-hover/forecast:border-slate-100">
                      <span className="material-symbols-outlined text-slate-400 text-[24px] transition-colors group-hover/forecast:text-sky-400">
                        {f.icon === 'sunny' ? 'wb_sunny' : f.icon === 'rainy' ? 'cloudy_snowing' : 'cloud'}
                      </span>
                    </div>
                    <p className="text-sm font-black text-slate-900">{f.temp}°</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block w-px bg-slate-100 opacity-50"></div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
               <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-black/[0.02] relative group/advisory hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-700">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">AI Insight</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800 leading-snug italic pr-4">
                    "{data?.advisory}"
                  </p>
                  <button 
                    onClick={() => onNavigate("chat")}
                    className="mt-8 flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.4em] hover:gap-5 transition-all group/btn"
                  >
                    Deep Scan Analysis <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
               </div>
            </div>
            
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
          </motion.div>

          {/* Side Shortcuts */}
          <div className="lg:col-span-4 grid grid-cols-1 gap-8">
              {[
                { label: t.stats.account, icon: "person", tab: "settings", color: "text-slate-900", bg: "bg-white", desc: "PROFILE & SECURITY", badge: "Agri ID" },
                { label: t.stats.marketMap, icon: "explore", tab: "markets", color: "text-slate-900", bg: "bg-white", desc: "REGIONAL BUYERS", badge: "Discovery" }
              ].map((action, idx) => (
                <motion.button 
                  key={action.tab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  onClick={() => onNavigate(action.tab)}
                  className="premium-card p-10 flex flex-col justify-between group text-left active:scale-[0.98] transition-all bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-black/[0.02]", action.bg)}>
                      <span className={cn("material-symbols-outlined text-[32px]", action.color)}>{action.icon}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">{action.badge}</span>
                  </div>
                  <div className="mt-8">
                    <span className="text-3xl font-black text-slate-900 tracking-tight block leading-none mb-1">{action.label}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{action.desc}</span>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>
      )}

      {/* Market Intel Section */}
      {!loading && (
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="live-indicator w-3 h-3 rounded-full"></div>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">{t.liveIndicator}</span>
              </div>
              <h2 className="text-5xl font-black tracking-tight text-slate-900 leading-none">{t.pulseTitle}</h2>
              <p className="text-xl text-slate-400 font-medium tracking-tight">Intelligence for {farmerProfile?.location}</p>
            </div>
            <button className="px-10 py-5 bg-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] text-primary border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all">
              View Regional Map
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {data?.marketInsights.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.7 }}
                className="premium-card p-10 group cursor-pointer border-none bg-white hover:ring-1 hover:ring-primary/5"
                onClick={() => onNavigate("chat")}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={cn(
                    "w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-700 group-hover:scale-110",
                    item.trend === 'up' ? 'bg-primary shadow-primary/20' : 'bg-rose-600 shadow-rose-600/20'
                  )}>
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.crop === 'Maize' ? 'grass' : item.crop === 'Tomatoes' ? 'nutrition' : 'bakery_dining'}
                    </span>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm border border-transparent",
                    item.trend === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : "bg-rose-50 text-rose-600 border-rose-100/50"
                  )}>
                    <span className="material-symbols-outlined text-[18px]">
                      {item.trend === 'up' ? 'trending_up' : 'trending_down'}
                    </span>
                    {item.percentage}%
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight text-slate-900 leading-none mb-3">{item.crop}</h3>
                    <div className="flex items-baseline justify-between mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">{formatKES(item.price)}</span>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">/ BAG</span>
                      </div>
                      
                      {item.historicalPrices && item.historicalPrices.length > 0 && (
                        <div className="w-20 h-10 opacity-30 group-hover:opacity-80 transition-opacity duration-700">
                          <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                            <motion.polyline
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.5, delay: 1 }}
                              fill="none"
                              stroke={item.trend === 'up' ? '#10b981' : '#f43f5e'}
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={item.historicalPrices.map((p, i) => {
                                const min = Math.min(...item.historicalPrices.map(hp => hp.price));
                                const max = Math.max(...item.historicalPrices.map(hp => hp.price));
                                const x = (i / (item.historicalPrices.length - 1)) * 100;
                                const y = max === min ? 20 : 40 - ((p.price - min) / (max - min)) * 40;
                                return `${x},${y}`;
                              }).join(' ')}
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-black/[0.01] group-hover:bg-primary group-hover:-translate-y-2 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-3">
                       <span className="material-symbols-outlined text-primary group-hover:text-white text-[18px]">auto_awesome</span>
                       <span className="text-[10px] font-black text-primary group-hover:text-white/60 uppercase tracking-[0.2em]">ALGO-SUGGESTION</span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 group-hover:text-white leading-relaxed italic">
                      "{item.suggestion}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* AI Strategy Assistant (Refined) */}
      {!loading && (
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative overflow-hidden rounded-[4rem] bg-slate-900 p-20 text-white shadow-2xl group border-none"
        >
          <div className="relative z-10 max-w-2xl space-y-12">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-primary-container rounded-[2rem] shadow-3xl shadow-primary-container/30 flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-black tracking-[0.5em] text-primary-container">Market Intelligence Engine</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Neural Link Active</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                Should I sell my <span className="text-primary-container">Maize</span> today?
              </h2>
              <p className="text-white/60 text-2xl font-medium leading-relaxed max-w-xl">
                AgriGuard neural intelligence cross-references regional liquidity, seasonal trends, and upcoming weather patterns to maximize your harvest value.
              </p>
            </div>

            <button 
              onClick={() => onNavigate("chat")}
              className="bg-primary-container hover:bg-emerald-400 text-white font-black px-12 py-7 rounded-[2.5rem] transition-all shadow-2xl shadow-primary-container/20 active:scale-95 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.4em] group/btn"
            >
              Initialize Strategy Session
              <span className="material-symbols-outlined text-[24px] group-hover/btn:translate-x-2 transition-transform">terminal</span>
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none">
             <span className="material-symbols-outlined text-[700px] text-white">agriculture</span>
          </div>
          <div className="absolute -top-64 -right-64 w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[180px] pointer-events-none"></div>
        </motion.section>
      )}
    </div>
  );
}
