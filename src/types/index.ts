export interface EnergyData {
  timestamp: string;
  demand: number;
  supply: number;
  prediction: number;
}

export interface WaterData {
  timestamp: string;
  flow: number;
  pressure: number;
  quality: number;
}

export interface ZoneData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'normal' | 'warning' | 'critical';
  energyDemand: number;
  waterPressure: number;
  waterFlow: number;
  alert?: string | null;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Alert {
  id: string;
  type: 'energy' | 'water';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}
