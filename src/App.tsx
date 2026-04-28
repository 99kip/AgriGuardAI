/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./screens/Dashboard";
import Chat from "./screens/Chat";
import Settings from "./screens/Settings";
import { testConnection } from "./lib/firebase";
import { useAuth } from "./context/AuthContext";
import { useSettings } from "./context/SettingsContext";
import { translations } from "./lib/translations";
import { motion } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading, signIn } = useAuth();
  const { language } = useSettings();
  const t = translations[language].app;

  useEffect(() => {
    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-sand flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-black/5 border-t-emerald-500 animate-spin"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center space-y-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="space-y-6"
        >
          <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-primary/10 border border-primary/20 hover:rotate-12 transition-transform duration-700">
            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">AgriGuard<span className="text-primary ml-1">AI</span></h1>
          <p className="text-slate-400 text-xl font-medium max-w-sm mx-auto leading-relaxed">{t.desc}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-6 w-full max-w-md"
        >
          <button 
            onClick={signIn}
            className="w-full bg-slate-900 text-white font-black py-7 rounded-[2.5rem] shadow-3xl shadow-slate-900/20 flex items-center justify-center gap-4 active:scale-95 transition-all hover:bg-slate-800 text-sm uppercase tracking-[0.3em] border border-white/10"
          >
            <img src="https://www.google.com/favicon.ico" className="w-6 h-6 grayscale invert" alt="Google" />
            {t.login}
          </button>
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em]">{t.security}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-8 w-full max-w-xl pt-16"
        >
          <div className="bg-slate-50 p-8 rounded-[3rem] border border-black/[0.01] flex flex-col items-center gap-4 hover:bg-white hover:shadow-2xl transition-all duration-700">
            <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.featureTrends}</span>
          </div>
          <div className="bg-slate-50 p-8 rounded-[3rem] border border-black/[0.01] flex flex-col items-center gap-4 hover:bg-white hover:shadow-2xl transition-all duration-700">
            <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.featureNegotiator}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case "chat":
        return <Chat />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-sand pb-32">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </main>
      
      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

