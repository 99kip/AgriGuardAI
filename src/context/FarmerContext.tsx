import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

export interface FarmerProfile {
  uid: string;
  location: string;
  updatedAt: string;
}

interface FarmerContextType {
  profile: FarmerProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<FarmerProfile>) => Promise<void>;
  resetData: () => Promise<void>;
  hasPendingWrites: boolean;
  isOffline: boolean;
}

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

export function FarmerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(db, "farmers", user.uid);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as FarmerProfile);
      } else {
        setProfile({
          uid: user.uid,
          location: "Ruiru East, Kiambu",
          updatedAt: new Date().toISOString()
        });
      }
      setLoading(false);
      setHasPendingWrites(docSnap.metadata.hasPendingWrites);
    }, (error) => {
      console.error("Farmer profile snapshot error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateProfile = async (data: Partial<FarmerProfile>) => {
    if (!user) return;
    const docRef = doc(db, "farmers", user.uid);
    const docSnap = await getDoc(docRef);
    
    const updateData = {
      ...data,
      uid: user.uid,
      updatedAt: new Date().toISOString(),
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, updateData);
    } else {
      await setDoc(docRef, updateData);
    }
  };

  const resetData = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "farmers", user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        location: "Ruiru East, Kiambu",
        updatedAt: new Date().toISOString()
      });
      // Additional cleanup for subcollections could be added here if they were implemented in contexts
    } catch (error) {
      console.error("Error resetting data:", error);
      throw error;
    }
  };

  return (
    <FarmerContext.Provider value={{ profile, loading, updateProfile, resetData, hasPendingWrites, isOffline }}>
      {children}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  const context = useContext(FarmerContext);
  if (context === undefined) {
    throw new Error("useFarmer must be used within a FarmerProvider");
  }
  return context;
}
