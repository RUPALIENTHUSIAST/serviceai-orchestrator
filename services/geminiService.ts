
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ASSIST_SYSTEM_INSTRUCTION = `
You are ServiceNow "Agent Assist" AI for a BT/Openreach environment.
Your task is to analyze incident descriptions and provide:
1. Recommended Configuration Item (CI) from the CMDB context.
2. Search keywords for the Knowledge Base.
3. A summary of the likely technical fault based on Openreach terminology.
4. Suggested Next Action for the resolver.

Return results in a clean JSON format.
`;

export const getAgentAssist = async (description: string, shortDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Analyze this incident: 
        Summary: ${shortDescription}
        Description: ${description}` }] }],
      config: {
        systemInstruction: ASSIST_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedCI: { type: Type.STRING },
            kbKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            faultAnalysis: { type: Type.STRING },
            suggestedNextAction: { type: Type.STRING }
          },
          required: ["suggestedCI", "kbKeywords", "faultAnalysis", "suggestedNextAction"]
        }
      }
    });

    // Access the .text property directly
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Agent Assist failed:", error);
    return null;
  }
};
