
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following chat message to ${targetLanguage}. 
      Maintain the casual tone of a chat message. 
      Do not include any explanations, just the translated text.
      
      Message: "${text}"`,
      config: {
        temperature: 0.1, // Low temperature for consistency
        topP: 0.1,
      }
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text on error
  }
};
