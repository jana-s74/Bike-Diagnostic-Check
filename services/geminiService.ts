
import { GoogleGenAI, Type } from "@google/genai";
import { MaintenanceFormData, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBikeMaintenance = async (data: MaintenanceFormData): Promise<AnalysisResult> => {
  const prompt = `
    Analyze the following motorcycle data for maintenance needs:
    - Bike Model: ${data.bikeModel}
    - Current Mileage: ${data.mileage} km
    - Last Service Date: ${data.lastServiceDate}
    - Reported Symptoms: ${data.symptoms}
    - Primary Riding Type: ${data.ridingType}

    Provide a detailed maintenance assessment. The cost range should be in Indian Rupees (INR).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert motorcycle mechanic named Gearhead. Analyze bike data and provide technical maintenance advice. Return valid JSON only with properties: riskLevel, estimatedCostRange, nextServiceRecommendation, healthScore (0-100), preventiveTips (array), and summary.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING },
          estimatedCostRange: { type: Type.STRING },
          nextServiceRecommendation: { type: Type.STRING },
          healthScore: { type: Type.NUMBER },
          preventiveTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
        },
        required: ["riskLevel", "estimatedCostRange", "nextServiceRecommendation", "healthScore", "preventiveTips", "summary"],
      },
    },
  });

  const text = response.text.trim();
  return JSON.parse(text) as AnalysisResult;
};
