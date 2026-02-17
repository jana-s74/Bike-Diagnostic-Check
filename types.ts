
export enum RidingType {
  CITY = 'City',
  HIGHWAY = 'Highway',
  MIXED = 'Mixed'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface MaintenanceFormData {
  bikeModel: string;
  mileage: number;
  lastServiceDate: string;
  symptoms: string;
  ridingType: RidingType;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  estimatedCostRange: string;
  nextServiceRecommendation: string;
  healthScore: number;
  preventiveTips: string[];
  summary: string;
}

export interface HistoryItem extends MaintenanceFormData {
  id: string;
  timestamp: number;
  analysis: AnalysisResult;
}
