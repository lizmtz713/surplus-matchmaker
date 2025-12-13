
export interface Buyer {
  id: string;
  name: string;
  preferences: string;
  location?: string;
  address?: string; // New: Full street address for static buyers
  budget?: string;
  condition?: string;
  brand?: string;
  contact?: string;
  featured?: boolean; // New flag for premium/paid buyers
  website?: string;
}

export interface PricePoint {
  condition: string; // e.g. "New in Box", "Used", "Scrap"
  tier: "Retail" | "Surplus" | "Scrap";
  price: string;
  notes: string;
}

export interface LineItemValuation {
  name: string;
  condition: string;
  qty: number;
  retailPrice: string; // New: Estimated retail/list price
  unitPrice: string;
  totalPrice: string;
  notes: string;
}

export interface Valuation {
  scrapValue: string;
  scrapDetails: string; 
  surplusValue: string;
  retailValue: string;
  askRange: {
    min: string;
    max: string;
  };
  marketInsights: string;
  lineItems: LineItemValuation[]; // New: Itemized breakdown
  priceBreakdown: PricePoint[]; // Existing: Matrix for lot conditions
}

export interface BuyerMatch {
  name: string;
  score: number;
  reason: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  googleMapsUri?: string;
}

export interface Cadence {
  step1_pitch?: { subject: string; body: string };
  step2_nudge?: { subject: string; body: string };
  step3_sms?: string;
  step4_breakup?: { subject: string; body: string };
  phone_script?: {
    opener: string;
    pitch: string;
    objection_handling: string;
    closing: string;
  };
}

export interface Logistics {
  estimatedRange: string;
  transportType: string;
  detectedSpecs?: {
    weight: string;
    dimensions: string;
  };
  criticalQuestions: string[];
  advice: string;
  freightCallScript?: string;
  freightQuoteEmail?: {
    subject: string;
    body: string;
  };
  topFreightBrokers?: {
    name: string;
    location: string;
    contact: string;
    website?: string;
  }[];
}

export interface MatchResult {
  itemAnalysis: string;
  valuation: Valuation;
  topBuyers: BuyerMatch[]; // Phase 2: Web Research Matches
  internalBuyerMatches?: BuyerMatch[]; // Sidebar: Internal DB Matches
  cadence: Cadence;
  logistics: Logistics;
  summary: string;
  researchSources?: string[]; // New: List of URLs from Google Search Grounding
}

export interface MatchRequest {
  description: string;
  imageBase64?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}