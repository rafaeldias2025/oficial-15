// Tipos para integração com Apple Health/Google Fit
export interface HealthKitData {
  weight: number;
  height: number;
  bodyFat?: number;
  muscleMass?: number;
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  steps?: number;
  activeEnergyBurned?: number;
  dietaryWater?: number;
  sleepHours?: number;
  timestamp: Date;
  source: 'apple_health' | 'google_fit';
}

export interface GoogleFitData {
  weight_kg: number;
  height_m: number;
  body_fat_percentage?: number;
  heart_rate_bpm?: number;
  step_count?: number;
  calories_burned?: number;
  water_intake_ml?: number;
  sleep_duration_minutes?: number;
  timestamp: string;
  dataSource: string;
}

export interface HealthIntegrationConfig {
  appleHealthEnabled: boolean;
  googleFitEnabled: boolean;
  autoSync: boolean;
  syncFrequency: 'daily' | 'weekly' | 'manual';
  dataTypes: {
    weight: boolean;
    height: boolean;
    bodyComposition: boolean;
    activity: boolean;
    sleep: boolean;
    heartRate: boolean;
    bloodPressure: boolean;
    nutrition: boolean;
  };
}

export interface HealthSyncResult {
  success: boolean;
  recordsImported: number;
  lastSyncDate: Date;
  errors?: string[];
}

export interface HealthDataRecord {
  id: string;
  user_id: string;
  data_type: 'weight' | 'height' | 'body_fat' | 'muscle_mass' | 'heart_rate' | 'blood_pressure' | 'steps' | 'calories' | 'water' | 'sleep';
  value: number;
  unit: string;
  timestamp: string;
  source: 'apple_health' | 'google_fit' | 'manual';
  external_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface HealthIntegrationState {
  isConnected: boolean;
  isAuthorized: boolean;
  isLoading: boolean;
  lastSync?: Date;
  config: HealthIntegrationConfig;
  error?: string;
}

// Tipos para Apple HealthKit (iOS)
export interface HealthKitAuthOptions {
  permissions: {
    read: string[];
    write: string[];
  };
}

// Tipos para Google Fit (Android/Web)
export interface GoogleFitAuthOptions {
  scopes: string[];
  clientId: string;
}

// Tipos para dados de saúde unificados
export interface UnifiedHealthData {
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
    timestamp: Date;
  };
  height?: {
    value: number;
    unit: 'cm' | 'in';
    timestamp: Date;
  };
  bodyComposition?: {
    bodyFat?: number;
    muscleMass?: number;
    bodyWater?: number;
    timestamp: Date;
  };
  vitals?: {
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    timestamp: Date;
  };
  activity?: {
    steps?: number;
    calories?: number;
    activeMinutes?: number;
    timestamp: Date;
  };
  sleep?: {
    duration: number; // em minutos
    quality?: 'poor' | 'fair' | 'good' | 'excellent';
    timestamp: Date;
  };
  nutrition?: {
    water?: number; // em ml
    calories?: number;
    timestamp: Date;
  };
} 