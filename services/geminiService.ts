import { GoogleGenAI } from "@google/genai";
import { MatchResult, Buyer, ChatMessage } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      if (base64String) {
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Step 1: Perform Web Research (Text Output)
async function performMarketResearch(description: string, location: string): Promise<string> {
  if (!description) return "No description provided for research.";

  const researchPrompt = `
    You are an expert industrial procurement specialist.
    
    **OBJECTIVE 1: BUYER FINDING**
    Conduct deep web research to find 15 high-potential active commercial buyers, dealers, or liquidation companies that would buy this specific item:
    "${description}"
    
    Search Context:
    - Location: ${location || "United States (National)"}
    - Target: Look for Direct End-Users, Local Specialized Dealers, and National Equipment Resellers.
    
    For each company, you MUST find:
    1. Company Name
    2. Full Street Address (City, State, Zip)
    3. **Phone Number** (Main line or purchasing dept)
    4. **Email Address** (Sales, Info, or Purchasing)
    5. Website URL

    **OBJECTIVE 2: MARKET VALUE & COMPARABLES**
    - Identify the specific Make and Model of the item if possible from the description.
    - Search for recent sold listings (Auctions, eBay, IronPlanet) or active dealer listings (Machinio, EquipmentTrader) for this specific item.
    - Find 3-5 specific comparable items ("Comps") with their prices.
    
    **OBJECTIVE 3: FREIGHT**
    - Find 3 specific freight brokers or logistics companies suitable for heavy equipment in this region.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: researchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text || "No research results found.";
  } catch (error) {
    console.warn("Research phase failed:", error);
    return "Research unavailable (Internal data only).";
  }
}

// Step 2: Synthesize Analysis (JSON Output)
export const matchItemToBuyer = async (
  description: string,
  condition: string,
  imageFiles: File[],
  buyers: Buyer[],
  logistics: { 
    origin: string; 
    weight: string; 
    dimensions: string;
    truckType: string;
    requiresTarps: boolean;
    requiresChains: boolean;
    requiresLiftgate: boolean;
    pickupDate: string;
    pickupContact: string;
    loadingHours: string;
  }
): Promise<MatchResult> => {
  
  // 1. Run Research First
  const researchResults = await performMarketResearch(description, logistics.origin);

  // 2. Prepare Context for Synthesis
  // IMPORTANT: Send the FULL buyers list (do not slice) to ensure we find the best match from the entire database.
  const buyerContext = JSON.stringify(buyers, null, 2); 
  const logisticsContext = `
    User Provided Logistics Data:
    - Origin Location: ${logistics.origin || "Not provided (Assume general US standard)"}
    - Pickup Contact: ${logistics.pickupContact || "Not provided"}
    - Pickup Date: ${logistics.pickupDate || "Not provided"}
    - Loading Hours: ${logistics.loadingHours || "Standard 9am-4pm M-F"}
    - User Entered Weight: ${logistics.weight || "BLANK - ESTIMATE BASED ON ITEM"}
    - User Entered Dimensions: ${logistics.dimensions || "BLANK - ESTIMATE BASED ON ITEM"}
    - Truck Type Preference: ${logistics.truckType}
    - Requires Tarps: ${logistics.requiresTarps ? "YES" : "No"}
    - Requires Chains: ${logistics.requiresChains ? "YES" : "No"}
    - Requires Liftgate: ${logistics.requiresLiftgate ? "YES" : "No"}
    - Item Condition: ${condition}
  `;
  
  const systemInstruction = `
    You are "SurplusMatchmaker," a hyper-efficient Industrial Equipment Broker & Valuator.
    
    **OBJECTIVE:** Analyze the inventory, value it, find NEW buyers via web research, match against INTERNAL database, create a sales cadence, and estimate freight.
    
    **INPUT SOURCES:**
    1. **LIVE WEB RESEARCH RESULTS (Primary Source for Phase 2 & Valuation):**
    ${researchResults}
    
    2. **INTERNAL BUYER NETWORK (Source for Sidebar Matches):**
    ${buyerContext}
    
    3. **LOGISTICS DETAILS:**
    ${logisticsContext}

    **INSTRUCTIONS BY PHASE:**

    ### PHASE 0: ANALYSIS
    - Identify the items.
    - Estimate specs (weight/dims) if not provided.

    ### PHASE 1: VALUATION
    - **Line Items:** For each distinct item type, estimate Retail vs Surplus values.
    - **Total Lot Value:** Sum of all line items.
    - **Scrap Floor:** Estimate raw material weight * scrap rate.
    - **Market Insights:** This field MUST be detailed. 
       1. **Identification:** State the specific Make/Model identified from research.
       2. **Comparables:** List specific recent sales or active listings found in the web research (include Price, Source, and Date if available).
       3. **Justification:** Explain how these comps support your estimated values.

    ### PHASE 2: MATCHING (TWO DISTINCT LISTS)
    
    **Part A: WEB MATCHES (Populate "topBuyers")**
    - **Source:** STRICTLY "LIVE WEB RESEARCH RESULTS".
    - **Goal:** Find 10 NEW buyers from the web that are NOT in the internal list.
    - **Details:** MUST include Phone, Email, Address from research.
    
    **Part B: INTERNAL NETWORK MATCHES (Populate "internalBuyerMatches")**
    - **Source:** STRICTLY the "INTERNAL BUYER NETWORK" JSON provided above.
    - **Goal:** Identify the top 3-5 existing buyers from this specific list who would be most interested.
    - **Selection Criteria:** 
       1. **Category Match:** Does the buyer's "preferences" field specifically mention the type of item (e.g. "Generators", "Switchgear", "Scrap Metal")?
       2. **Fit:** Rank by how well their preferences align with the item description.
    - **Output Requirement:** You MUST return the **EXACT** "name" as it appears in the internal list. Do not alter the name, or the system will not link them.

    ### PHASE 3: OUTREACH CADENCE
    - Generate a "Pocket Listing" email sequence and Phone Script.
    - Tone: Professional, direct, urgent.

    ### PHASE 4: LOGISTICS
    - **Estimate Freight:** Based on the Origin -> Destination.
    - **Broker List:** Use the "LIVE WEB RESEARCH RESULTS" to list real freight brokers found.
    - **Email:** Draft a "Request for Quote" email.

    **OUTPUT FORMAT:**
    Return a single JSON object. Do not include markdown formatting.
    
    Structure:
    {
      "itemAnalysis": "String",
      "valuation": {
        "scrapValue": "String",
        "scrapDetails": "String",
        "surplusValue": "String",
        "retailValue": "String",
        "askRange": { "min": "String", "max": "String" },
        "marketInsights": "String",
        "lineItems": [
           { "name": "String", "condition": "String", "qty": Number, "retailPrice": "String", "unitPrice": "String", "totalPrice": "String", "notes": "String" }
        ],
        "priceBreakdown": [
           { "condition": "String", "tier": "Retail" | "Surplus" | "Scrap", "price": "String", "notes": "String" }
        ]
      },
      "topBuyers": [
        { "name": "String", "score": Number, "reason": "String", "location": "String", "address": "String", "phone": "String", "email": "String", "website": "String", "googleMapsUri": "String" }
      ],
      "internalBuyerMatches": [
        { "name": "String", "score": Number, "reason": "String" }
      ],
      "cadence": {
        "step1_pitch": { "subject": "String", "body": "String" },
        "step2_nudge": { "subject": "String", "body": "String" },
        "step3_sms": "String",
        "step4_breakup": { "subject": "String", "body": "String" },
        "phone_script": { "opener": "String", "pitch": "String", "objection_handling": "String", "closing": "String" }
      },
      "logistics": {
        "estimatedRange": "String",
        "transportType": "String",
        "detectedSpecs": { "weight": "String", "dimensions": "String" },
        "criticalQuestions": ["String"],
        "advice": "String",
        "freightCallScript": "String",
        "freightQuoteEmail": { "subject": "String", "body": "String" },
        "topFreightBrokers": [ { "name": "String", "location": "String", "contact": "String", "website": "String" } ]
      },
      "summary": "String"
    }
  `;

  const parts: any[] = [];

  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
        const base64Data = await fileToGenerativePart(file);
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: file.type,
            },
        });
    }
  }

  if (description) {
    parts.push({
      text: `Item/Inventory Description: ${description}`,
    });
  } else if (!imageFiles || imageFiles.length === 0) {
     throw new Error("Please provide a description or at least one image.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    let resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from AI.");
    }

    // Clean up if the model still adds markdown blocks
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedResult = JSON.parse(resultText) as MatchResult;
    return parsedResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze item. Please try again.");
  }
};

// Step 3: Chat with the Consultant
export const askSurplusAI = async (
  context: MatchResult,
  history: ChatMessage[],
  question: string
): Promise<string> => {
  const contextString = JSON.stringify(context);
  
  // Build history string for the prompt
  const conversationHistory = history.map(msg => 
    `${msg.role === 'user' ? 'Client' : 'SurplusMatchmaker'}: ${msg.text}`
  ).join('\n');

  const chatPrompt = `
    You are SurplusMatchmaker, a senior industrial assets consultant.
    
    CONTEXT (The current asset analysis you performed):
    ${contextString}

    CONVERSATION HISTORY:
    ${conversationHistory}

    CLIENT QUESTION:
    "${question}"

    INSTRUCTIONS:
    - Answer specifically based on the provided analysis context.
    - Be brief, professional, and actionable.
    - If asked about pricing, reference the specific valuation numbers in the context.
    - If asked about buyers, refer to the specific buyers found in the topBuyers or internalBuyerMatches lists.
    - If asked about freight, refer to the logistics section.
    - Do not make up new facts if they contradict the analysis, but you can add general industry knowledge.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatPrompt,
    });

    return response.text || "I'm not sure how to answer that based on the current data.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to the consultation server right now.";
  }
};