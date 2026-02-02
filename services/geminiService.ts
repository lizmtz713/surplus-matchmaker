import { GoogleGenAI, Type } from "@google/genai";
import { MatchResult, Buyer, ChatMessage } from "../types.ts";

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { mimeType: string, data: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 800;
        if (width > height) {
          if (width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; }
        } else {
          if (height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve({ inlineData: { mimeType: 'image/jpeg', data: dataUrl.split(',')[1] } });
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const matchResultSchema = {
  type: Type.OBJECT,
  properties: {
    itemAnalysis: { type: Type.STRING },
    valuation: {
      type: Type.OBJECT,
      properties: {
        scrapValue: { type: Type.STRING },
        scrapDetails: { type: Type.STRING },
        surplusValue: { type: Type.STRING },
        retailValue: { type: Type.STRING },
        marketInsights: { type: Type.STRING },
      },
      required: ["scrapValue", "surplusValue", "retailValue"]
    },
    topBuyers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          location: { type: Type.STRING },
          phone: { type: Type.STRING },
          email: { type: Type.STRING },
          website: { type: Type.STRING }
        }
      }
    },
    internalBuyerMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.NUMBER },
          reason: { type: Type.STRING }
        }
      }
    },
    cadence: {
      type: Type.OBJECT,
      properties: {
        step1_pitch: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } },
        step2_nudge: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } },
        step3_sms: { type: Type.STRING },
        step4_breakup: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } },
        phone_script: {
          type: Type.OBJECT,
          properties: {
            opener: { type: Type.STRING },
            pitch: { type: Type.STRING },
            objection_handling: { type: Type.STRING },
            closing: { type: Type.STRING }
          }
        }
      }
    }
  },
  required: ["itemAnalysis", "valuation", "topBuyers", "cadence"]
};

export const matchItemToBuyer = async (
  description: string,
  condition: string,
  imageFiles: File[],
  buyers: Buyer[],
  logistics: any,
  referenceUrl: string
): Promise<MatchResult> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) throw new Error("API Key is missing from environment.");

  const ai = new GoogleGenAI({ apiKey });
  const imageParts = await Promise.all(imageFiles.map(fileToGenerativePart));
  const buyerSnippet = buyers.slice(0, 10).map(b => `${b.name}: ${b.preferences}`).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        ...imageParts,
        { text: `Analyze this surplus item. Description: ${description}. Condition: ${condition}. URL: ${referenceUrl}. 
        Match against these internal buyers: 
        ${buyerSnippet}
        
        Provide a detailed industrial surplus valuation report.` }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: matchResultSchema,
      temperature: 0.1
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI.");
  return JSON.parse(text) as MatchResult;
};

export const askSurplusAI = async (
  context: MatchResult,
  history: ChatMessage[],
  question: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) return "API Key missing.";

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Context: ${context.itemAnalysis}. Question: ${question}`,
    config: { temperature: 0.7 }
  });

  return response.text || "I'm not sure about that.";
};
