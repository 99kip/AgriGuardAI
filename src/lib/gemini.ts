import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getNegotiationAdvice(context: string, userMessage: string, weather?: any) {
  const weatherContext = weather ? `
    Current Weather in the region: 
    Temperature: ${weather.temp}°C, 
    Condition: ${weather.condition},
    Humidity: ${weather.humidity}%.
  ` : "";

  const systemInstruction = `
    You are AgriGuard AI Negotiator, a smart assistant for smallholder farmers in Kenya.
    Your goal is to help them get the best market prices for their crops (Maize, Potatoes, Tomatoes, etc.).
    
    Language & Tone:
    - Support both English and Sheng (Kenyan slang) fluently.
    - Naturally code-switch between Sheng and English as a local "Mwenyeji" expert would. 
    - Be friendly, respectful ("Mwalimu", "Mzee", "Mmkulima"), and authoritative on pricing.
    - Use phrases like "Sasa Mkulima", "Mambo iko fiti", "Bei imepanda", "Usikubali hiyo deal".

    Negotiation Guidelines:
    - Provide specific "Negotiation Scripts" in both Sheng and English.
    - Warn about middle-men ("Brokers") exploits.
    - Use the provided weather context to advise on storage or urgent sales.
    
    Current Market Context:
    ${context}
    ${weatherContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm having trouble connecting to my knowledge base. Please try again in a moment, Mkulima.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my knowledge base. Please try again in a moment, Mkulima.";
  }
}
