
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
      systemInstruction: "You are an expert motorcycle mechanic. Analyze bike data and provide structured maintenance advice. Be precise about potential failures based on common model issues and mileage. Return valid JSON only.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: {
            type: Type.STRING,
            description: "Maintenance risk level: Low, Medium, or High",
          },
          estimatedCostRange: {
            type: Type.STRING,
            description: "Estimated cost range in INR, e.g., '₹1,500 - ₹3,000'",
          },
          nextServiceRecommendation: {
            type: Type.STRING,
            description: "When and what should be serviced next",
          },
          healthScore: {
            type: Type.NUMBER,
            description: "A score out of 100 representing the overall condition",
          },
          preventiveTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of actionable tips to maintain bike health",
          },
          summary: {
            type: Type.STRING,
            description: "A brief technical summary of the findings",
          },
        },
        required: ["riskLevel", "estimatedCostRange", "nextServiceRecommendation", "healthScore", "preventiveTips", "summary"],
      },
    },
  });

  const text = response.text.trim();
  return JSON.parse(text) as AnalysisResult;
};
