import { MatchResult, Buyer, ChatMessage } from "../types";

// Helper to resize and compress image before base64 conversion
export const fileToGenerativePart = async (file: File): Promise<{ mimeType: string, data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // AGGRESSIVE COMPRESSION for Speed
        const MAX_WIDTH = 600; 
        const MAX_HEIGHT = 600;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG 0.6 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        const base64Data = dataUrl.split(',')[1];
        resolve({
          mimeType: 'image/jpeg',
          data: base64Data
        });
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const matchItemToBuyer = async (
  description: string,
  condition: string,
  imageFiles: File[],
  buyers: Buyer[],
  logistics: any,
  referenceUrl: string
): Promise<MatchResult> => {
  
  // 1. Prepare Data (Resize Images)
  const imageParts = await Promise.all(imageFiles.map(fileToGenerativePart));

  try {
    // STEP 1: RESEARCH PHASE
    // Note: If this fails, we catch it inside the backend and return a partial result, 
    // or we catch it here.
    let researchResult = { text: "Research skipped or timed out.", sources: [] };
    
    try {
        const researchResponse = await fetch('/.netlify/functions/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'research',
                payload: {
                    description,
                    location: logistics.origin,
                    referenceUrl
                }
            })
        });

        if (researchResponse.ok) {
            researchResult = await researchResponse.json();
        } else {
            console.warn("Research phase warning:", await researchResponse.text());
        }
    } catch (e) {
        console.warn("Research phase network error (continuing to synthesis):", e);
    }

    // STEP 2: SYNTHESIS PHASE
    const synthesisResponse = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'synthesize',
            payload: {
                description,
                condition,
                images: imageParts,
                buyers,
                logistics,
                referenceUrl,
                researchText: researchResult.text // Pass the result (or fallback text)
            }
        })
    });

    if (!synthesisResponse.ok) {
        const errorText = await synthesisResponse.text();
        throw new Error(`Synthesis Failed (${synthesisResponse.status}): ${errorText}`);
    }

    const result = await synthesisResponse.json();
    
    // Merge sources back into result
    return {
        ...result,
        researchSources: researchResult.sources || []
    } as MatchResult;

  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "Connection to SurplusAI Server Failed.");
  }
};

export const askSurplusAI = async (
  context: MatchResult,
  history: ChatMessage[],
  question: string
): Promise<string> => {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'chat',
            payload: {
                context,
                history,
                question
            }
        })
    });

    if (!response.ok) {
         throw new Error("Chat server error");
    }

    const data = await response.json();
    return data.text || "I'm not sure how to answer that.";

  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to the consultation server right now.";
  }
};