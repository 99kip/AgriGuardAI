export interface MarketPrice {
  id: string;
  crop: string;
  market: string;
  price: number;
  unit: string;
  change24h: number;
  status: "Stable" | "Oversupplied" | "Peak";
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  crop: string;
  quantity: number;
  unit: string;
  grade: string;
  harvestDate: string;
  condition: string;
  humidity?: number;
  storageLocation: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: any;
  metadata?: {
    strategy?: string;
    tips?: string[];
  };
}

export interface Buyer {
  id: string;
  name: string;
  distance: number;
  location: string;
  verified: boolean;
  demandLevel: "Normal" | "High Demand";
  capacity: number;
  cropInterests: string[];
}
