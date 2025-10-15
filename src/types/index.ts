// Energy data for charts and trends
export interface EnergyData {
  timestamp: string;        // ISO date/time string
  demand: number;           // Current energy demand (MW)
  supply: number;           // Current energy supply (MW)
  prediction: number;       // AI-predicted energy demand (MW)
  peakLoad?: number;        // Optional: Peak load prediction
  renewablePercent?: number; // Optional: % renewable energy contribution
}

// Water data for charts and monitoring
export interface WaterData {
  timestamp: string;        // ISO date/time string
  flow: number;             // Water flow rate (L/s)
  pressure: number;         // Water pressure (PSI)
  quality: number;          // Water quality index (0-100)
}

// Zone data for map and insights
export interface ZoneData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'normal' | 'warning' | 'critical';
  energyDemand: number;
  waterPressure: number;
  waterFlow: number;
  renewablePercent?: number;
  power?: string;
  temperature?: number;
  airQuality?: string;
  alert?: string | null;
  
}

// Team members for dashboard or management panel
export interface TeamMember {
  id: string;               // Unique ID for member
  name: string;             // Member name
  role: string;             // Role (Admin, Member, Owner, etc.)
  avatar: string;           // URL or path to avatar image
  email?: string;           // Optional email
  phone?: string;           // Optional contact
}

// Alerts for energy, water, or environmental issues
export interface Alert {
  id: string;               // Unique alert ID
  type: 'energy' | 'water' | 'environment'; // Alert type
  severity: 'low' | 'medium' | 'high'; // Severity level
  message: string;          // Alert message
  timestamp: string;        // ISO date/time of alert
  zoneId?: string;          // Optional: zone related to alert
}
