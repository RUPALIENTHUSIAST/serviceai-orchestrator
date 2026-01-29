
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ASSIST_SYSTEM_INSTRUCTION = `
You are ServiceNow "Agent Assist" AI for a BT/Openreach environment.
Your task is to analyze incident descriptions and provide:
1. Recommended Configuration Item (CI) from the CMDB context.
2. Search keywords for the Knowledge Base.
3. A summary of the likely technical fault based on Openreach terminology.
4. Suggested Next Action for the resolver.
5. Inferred tasks with default assignment groups:
   - 'Field Engineer Task' → 'Openreach Field Ops'
   - 'Estimate / Civils Task' → 'Civils Team'
   - 'Third-Party Dependency Task' → 'Third Party Liaison'
6. Service type classification: Business, Consumer, International, or Corporate.

Return results in a clean JSON format.
`;

export const getAgentAssist = async (description: string, shortDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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
            suggestedNextAction: { type: Type.STRING },
            inferredTasks: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  taskType: { type: Type.STRING },
                  assignmentGroup: { type: Type.STRING }
                }
              }
            },
            serviceType: { type: Type.STRING }
          },
          required: ["suggestedCI", "kbKeywords", "faultAnalysis", "suggestedNextAction", "inferredTasks", "serviceType"]
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
