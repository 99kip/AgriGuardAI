import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { getNegotiationAdvice } from "@/src/lib/gemini";
import { ChatMessage } from "@/src/types";
import { useSettings } from "../context/SettingsContext";
import { useFarmer } from "../context/FarmerContext";
import { useAuth } from "../context/AuthContext";
import { translations } from "../lib/translations";
import { getIntelligence, WeatherData } from "../services/intelligenceService";
import { 
  db, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  handleFirestoreError, 
  OperationType,
  serverTimestamp
} from "../lib/firebase";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

export default function Chat() {
  const { language } = useSettings();
  const { profile } = useFarmer();
  const { user } = useAuth();
  const t = translations[language].chat;
  const [messages, setMessages] = useState<Partial<ChatMessage>[]>([]);
  
  useEffect(() => {
    if (!user) return;

    const path = `users/${user.uid}/chats`;
    const q = query(collection(db, path), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Partial<ChatMessage>[];

      if (msgs.length === 0) {
        setMessages([
          {
            role: "assistant",
            content: t.initialMessage,
            createdAt: new Date().toISOString(),
          }
        ]);
      } else {
        setMessages(msgs);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user, language, t.initialMessage]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketContext, setMarketContext] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadIntelligence() {
      if (profile?.location) {
        try {
          const intel = await getIntelligence(profile.location);
          setWeather(intel.weather);
          const ctx = intel.marketInsights.map(m => `${m.crop}: KES ${m.price} (${m.trend})`).join(", ");
          setMarketContext(`Location: ${profile.location}. Local Prices: ${ctx}.`);
        } catch (e) {
          console.error(e);
        }
      }
    }
    loadIntelligence();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      if (recognitionRef.current) {
         recognitionRef.current.stop();
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current!.continuous = false;
      recognitionRef.current!.interimResults = false;
      recognitionRef.current!.lang = language === "english" ? "en-KE" : "sw-KE";

      recognitionRef.current!.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (transcript));
        setIsListening(false);
      };

      recognitionRef.current!.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: language === "english" 
              ? "I can't hear you! Please allow microphone access in your browser settings to use voice input." 
              : "Siwezi kukusikia! Tafadhali ruhusu microphone kwa settings za browser yako ndio uweze kutumia sauti.",
            createdAt: new Date().toISOString(),
          }]);
        }
      };

      recognitionRef.current!.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return;

    const chatPath = `users/${user.uid}/chats`;
    const userMsg: any = {
      userId: user.uid,
      role: "user",
      content: input,
      createdAt: serverTimestamp(),
    };

    // Optimistically empty input and set loading
    setInput("");
    setIsLoading(true);

    try {
      // 1. Save user message to Firestore
      try {
        await addDoc(collection(db, chatPath), userMsg);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, chatPath);
      }

      // 2. Get Advice from Gemini
      const context = marketContext || "Local Kenyan market. Standard seasonal prices.";
      const advice = await getNegotiationAdvice(context, input, weather);
      
      const aiMsg: any = {
        userId: user.uid,
        role: "assistant",
        content: advice,
        createdAt: serverTimestamp(),
      };

      // 3. Save assistant message to Firestore
      try {
        await addDoc(collection(db, chatPath), aiMsg);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, chatPath);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] animate-in fade-in duration-1000 relative">
      <header className="mb-10 flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center shadow-3xl shadow-primary/30 relative transition-all duration-700 hover:rotate-12 group">
            <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">{t.title}</h2>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">{t.status}</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex bg-white px-6 py-3 rounded-[1.5rem] border border-black/[0.03] shadow-sm items-center gap-4 group hover:shadow-2xl transition-all duration-500">
            <span className="material-symbols-outlined text-amber-500 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.strategyActive}</span>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-10 pr-4 scroll-smooth no-scrollbar pb-24"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex items-end gap-4 max-w-[90%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                <div className={cn(
                  "p-8 rounded-[3rem] shadow-2xl transition-all duration-500 border text-base md:text-lg leading-relaxed tracking-tight",
                  msg.role === "assistant" 
                    ? "bg-white border-black/[0.01] rounded-bl-sm text-slate-800 shadow-slate-900/[0.03]" 
                    : "bg-slate-900 border-white/10 rounded-br-sm text-white shadow-slate-900/10"
                )}>
                  <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                </div>
                <div className="flex items-center gap-3 mt-4 px-4">
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      {t.verified}
                    </div>
                  )}
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-60">
                    {msg.createdAt ? (
                      msg.createdAt?.toDate 
                        ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ) : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-3 max-w-[90%]"
          >
            <div className="bg-white p-8 rounded-[3rem] rounded-bl-sm border border-black/[0.02] shadow-2xl shadow-slate-900/[0.02]">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-primary/20 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area Refined */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/60 backdrop-blur-3xl border-t border-black/[0.01] pb-36 pt-8 px-8 md:pb-16">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="flex-1 relative group">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full h-20 bg-white border border-black/[0.03] rounded-[2.5rem] px-10 pr-20 text-base focus:outline-none focus:border-primary/20 focus:ring-[16px] focus:ring-primary/5 transition-all font-bold tracking-tight text-slate-800 shadow-2xl shadow-slate-900/[0.03]" 
              placeholder={t.placeholder} 
              type="text"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white w-12 h-12 rounded-3xl flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-primary/30 group-hover:rotate-6"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
            </button>
          </div>
          <button 
            onClick={() => {
              if (isListening) {
                recognitionRef.current?.stop();
              } else {
                setIsListening(true);
                recognitionRef.current?.start();
              }
            }}
            className={cn(
              "w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all shadow-3xl active:scale-95 group border-none",
              isListening 
                ? "bg-rose-600 text-white animate-pulse" 
                : "bg-white text-slate-900 hover:bg-slate-50 border border-black/[0.02]"
            )}
          >
            <span className="material-symbols-outlined text-[32px] transition-transform group-hover:scale-110">{isListening ? "stop" : "mic"}</span>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-6 font-black uppercase tracking-[0.4em] opacity-40">{t.warning}</p>
      </div>

    </div>
  );
}
