
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

export interface Vehicle {
  model: string;
  year: string;
  engineCC: string;
  avgDailyKm: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  method: 'google' | 'phone';
  createdAt: number;
  lastLogin: number;
  deviceInfo: string;
  isAdmin?: boolean;
  vehicle?: Vehicle;
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
  userId: string;
  timestamp: number;
  analysis: AnalysisResult;
}

export interface SystemSnapshot {
  totalUsers: number;
  totalDiagnostics: number;
  activeUsers24h: number;
}
