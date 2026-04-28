import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  forecast: { day: string; temp: number; icon: string }[];
}

export interface MarketInsight {
  crop: string;
  price: number;
  averagePrice: number;
  highestPrice: number;
  trend: "up" | "down" | "stable";
  percentage: number;
  suggestion: string;
  historicalPrices: { date: string; price: number }[];
}

export const getIntelligence = async (location: string): Promise<{
  weather: WeatherData;
  marketInsights: MarketInsight[];
  advisory: string;
}> => {
  const prompt = `
    You are an expert agricultural AI assistant for farmers in Kenya. 
    Location: ${location}.
    
    1. Provide current weather data (estimated for today) and a 3-day forecast.
    2. Provide current market prices for 3 major crops in this specific region (e.g., Maize, Tomatoes, Potatoes).
    3. For each crop, include "averagePrice" (typical regional market average) and "highestPrice" (the peak price observed in top-tier markets).
    4. For each crop, provide a small series of historical prices (last 5 entries, daily or weekly).
    5. Provide a short, actionable agricultural advisory/suggestion for a farmer in this location given the current season and market conditions.
    
    Return ONLY a JSON object with this structure:
    {
      "weather": {
        "temp": number,
        "condition": "Sunny" | "Rainy" | "Cloudy" | "Windy",
        "humidity": number,
        "forecast": [{"day": "Tomorrow", "temp": number, "icon": "sunny" | "cloudy" | "rainy"}]
      },
      "marketInsights": [
        {
          "crop": string, 
          "price": number, 
          "averagePrice": number,
          "highestPrice": number,
          "trend": "up" | "down" | "stable", 
          "percentage": number, 
          "suggestion": string,
          "historicalPrices": [{"date": "YYYY-MM-DD", "price": number}]
        }
      ],
      "advisory": string
    }
    
    Ensure prices are in KES and reflect localized ${location} market reality.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text || "";
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Intelligence Error:", error);
    // Fallback data
    return {
      weather: {
        temp: 24,
        condition: "Cloudy",
        humidity: 65,
        forecast: [
          { day: "Tue", temp: 25, icon: "sunny" },
          { day: "Wed", temp: 23, icon: "rainy" },
          { day: "Thu", temp: 24, icon: "cloudy" }
        ]
      },
      marketInsights: [
        { 
          crop: "Maize", 
          price: 3200, 
          averagePrice: 3100,
          highestPrice: 3450,
          trend: "up", 
          percentage: 4.2, 
          suggestion: "Hold for higher prices next month.",
          historicalPrices: [
            { date: "2024-04-20", price: 3000 },
            { date: "2024-04-22", price: 3100 },
            { date: "2024-04-24", price: 3150 },
            { date: "2024-04-26", price: 3180 },
            { date: "2024-04-28", price: 3200 }
          ]
        },
        { 
          crop: "Tomatoes", 
          price: 4500, 
          averagePrice: 4700,
          highestPrice: 5200,
          trend: "down", 
          percentage: 2.1, 
          suggestion: "Sell now before seasonal glut increases.",
          historicalPrices: [
            { date: "2024-04-20", price: 4800 },
            { date: "2024-04-22", price: 4700 },
            { date: "2024-04-24", price: 4650 },
            { date: "2024-04-26", price: 4600 },
            { date: "2024-04-28", price: 4500 }
          ]
        },
        { 
          crop: "Potatoes", 
          price: 2800, 
          averagePrice: 2800,
          highestPrice: 3000,
          trend: "stable", 
          percentage: 0.5, 
          suggestion: "Direct to consumer for best margins.",
          historicalPrices: [
            { date: "2024-04-20", price: 2750 },
            { date: "2024-04-22", price: 2780 },
            { date: "2024-04-24", price: 2800 },
            { date: "2024-04-26", price: 2800 },
            { date: "2024-04-28", price: 2800 }
          ]
        }
      ],
      advisory: "Focus on early planting to capture the start of the heavy rains."
    };
  }
};
