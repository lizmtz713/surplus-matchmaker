import { GoogleGenAI, Type, Schema } from "@google/genai";

// Initialize AI Client securely server-side
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Configuration Error: Missing API_KEY on server.");
  }
  return new GoogleGenAI({ apiKey });
};

async function performMarketResearch(ai: GoogleGenAI, description: string, location: string, referenceUrl?: string) {
  if (!description && !referenceUrl) return { text: "No description provided.", sources: [] };

  // OPTIMIZED: Reduced to 3 buyers to speed up execution
  const researchPrompt = `
    Find **3** commercial buyers for: "${description}"
    ${referenceUrl ? `Reference URL: ${referenceUrl}` : ''}
    Location: ${location || "USA"}
    Find 2 Comparable Sales.
  `;

  try {
    // 6 Second Timeout for Research to prevent Function Timeout
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Research Timeout")), 6000));
    
    const apiPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: researchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const response: any = await Promise.race([apiPromise, timeoutPromise]);

    let textOutput = response.text || "No results.";
    let extractedSources: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) extractedSources.push(chunk.web.uri);
      });
      extractedSources = [...new Set(extractedSources)];
    }
    return { text: textOutput, sources: extractedSources };

  } catch (error) {
    console.warn("Research failed or timed out:", error);
    return { text: "Market research unavailable (Timeout). Relying on internal logic.", sources: [] };
  }
}

// DEFINE SCHEMA for Reliability
const matchResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    itemAnalysis: { type: Type.STRING },
    summary: { type: Type.STRING },
    valuation: {
      type: Type.OBJECT,
      properties: {
        scrapValue: { type: Type.STRING },
        scrapDetails: { type: Type.STRING },
        surplusValue: { type: Type.STRING },
        retailValue: { type: Type.STRING },
        askRange: {
          type: Type.OBJECT,
          properties: {
             min: { type: Type.STRING },
             max: { type: Type.STRING }
          }
        },
        marketInsights: { type: Type.STRING },
        lineItems: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
                name: { type: Type.STRING },
                condition: { type: Type.STRING },
                qty: { type: Type.NUMBER },
                retailPrice: { type: Type.STRING },
                unitPrice: { type: Type.STRING },
                totalPrice: { type: Type.STRING },
                notes: { type: Type.STRING }
             }
          }
        }
      }
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
             website: { type: Type.STRING },
             address: { type: Type.STRING },
             googleMapsUri: { type: Type.STRING }
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
    },
    logistics: {
       type: Type.OBJECT,
       properties: {
          estimatedRange: { type: Type.STRING },
          transportType: { type: Type.STRING },
          detectedSpecs: { type: Type.OBJECT, properties: { weight: { type: Type.STRING }, dimensions: { type: Type.STRING } } },
          criticalQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.STRING },
          freightCallScript: { type: Type.STRING },
          freightQuoteEmail: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } },
          topFreightBrokers: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                   name: { type: Type.STRING },
                   location: { type: Type.STRING },
                   contact: { type: Type.STRING },
                   website: { type: Type.STRING }
                }
             }
          }
       }
    }
  }
};

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const ai = getAIClient();
    const { action, payload } = await req.json();

    if (action === 'research') {
        const { description, location, referenceUrl } = payload;
        const result = await performMarketResearch(ai, description, location, referenceUrl);
        return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
    }

    if (action === 'synthesize') {
      const { description, condition, images, buyers, logistics, referenceUrl, researchText } = payload;
      
      const buyerContext = JSON.stringify(buyers.map((b: any) => ({ name: b.name, preferences: b.preferences, location: b.location })), null, 2); 
      const logisticsContext = `Origin: ${logistics.origin}, Truck: ${logistics.truckType}, Cond: ${condition}`;

      const systemInstruction = `
        You are SurplusMatchmaker. 
        Analyze the item and route to buyers.
        RESEARCH DATA: ${researchText}
        INTERNAL DB: ${buyerContext}
        LOGISTICS: ${logisticsContext}
      `;

      const parts: any[] = [];
      if (images) {
        images.forEach((img: any) => parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } }));
      }
      parts.push({ text: `Analyze Item: ${description} ${referenceUrl || ''}` });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: matchResultSchema, // STRICT SCHEMA ENFORCEMENT
          temperature: 0.4,
        },
      });

      return new Response(response.text, { headers: { "Content-Type": "application/json" } });
    }

    if (action === 'chat') {
        const { context, history, question } = payload;
        // Simplified chat logic to save tokens
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Context: ${context.itemAnalysis}. History: ${history.length} msgs. Q: ${question}`,
        });
        return new Response(JSON.stringify({ text: response.text }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response("Invalid Action", { status: 400 });

  } catch (error: any) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message, details: error.toString() }), { status: 500 });
  }
};