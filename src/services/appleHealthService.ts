// Capacitor será instalado quando necessário para app mobile
// import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

interface AppleHealthData {
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  steps?: number;
  heartRate?: number;
  calories?: number;
  distance?: number;
  activeMinutes?: number;
  sleepHours?: number;
  timestamp: Date;
}

interface AppleHealthAuthResult {
  isAuthorized: boolean;
  permissions: string[];
  error?: string;
}

declare global {
  interface Window {
    HealthKit?: {
      requestAuthorization: (permissions: string[]) => Promise<AppleHealthAuthResult>;
      isAvailable: () => Promise<boolean>;
      getWeight: (startDate: Date, endDate: Date) => Promise<AppleHealthData[]>;
      getSteps: (startDate: Date, endDate: Date) => Promise<AppleHealthData[]>;
      getHeartRate: (startDate: Date, endDate: Date) => Promise<AppleHealthData[]>;
      getCalories: (startDate: Date, endDate: Date) => Promise<AppleHealthData[]>;
      getSleep: (startDate: Date, endDate: Date) => Promise<AppleHealthData[]>;
    };
  }
}

class AppleHealthService {
  private isInitialized = false;
  private isAuthorized = false;

  // Verificar se Apple Health está disponível
  async isAvailable(): Promise<boolean> {
    // Verificar se está em dispositivo iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) {
      return false;
    }

    try {
      if (window.HealthKit) {
        return await window.HealthKit.isAvailable();
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do HealthKit:', error);
      return false;
    }
  }

  // Inicializar serviço
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const available = await this.isAvailable();
    if (!available) {
      throw new Error('Apple Health não está disponível neste dispositivo');
    }

    this.isInitialized = true;
  }

  // Solicitar autorizações
  async requestAuthorization(): Promise<AppleHealthAuthResult> {
    try {
      await this.initialize();

      const permissions = [
        'HKQuantityTypeIdentifierBodyMass',
        'HKQuantityTypeIdentifierHeight',
        'HKQuantityTypeIdentifierBodyFatPercentage',
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierHeartRate',
        'HKQuantityTypeIdentifierActiveEnergyBurned',
        'HKQuantityTypeIdentifierDistanceWalkingRunning',
        'HKQuantityTypeIdentifierAppleExerciseTime',
        'HKCategoryTypeIdentifierSleepAnalysis'
      ];

      if (window.HealthKit) {
        const result = await window.HealthKit.requestAuthorization(permissions);
        this.isAuthorized = result.isAuthorized;
        return result;
      }

      // Simulação para desenvolvimento
      return {
        isAuthorized: true,
        permissions: permissions
      };
    } catch (error) {
      console.error('Erro ao solicitar autorização:', error);
      return {
        isAuthorized: false,
        permissions: [],
        error: error.message
      };
    }
  }

  // Buscar dados de peso
  async getWeightData(startDate: Date, endDate: Date): Promise<AppleHealthData[]> {
    try {
      if (!this.isAuthorized) {
        throw new Error('Apple Health não está autorizado');
      }

      if (window.HealthKit) {
        return await window.HealthKit.getWeight(startDate, endDate);
      }

      // Dados simulados para desenvolvimento
      return this.generateSimulatedWeightData(startDate, endDate);
    } catch (error) {
      console.error('Erro ao buscar dados de peso:', error);
      return [];
    }
  }

  // Buscar dados de passos
  async getStepsData(startDate: Date, endDate: Date): Promise<AppleHealthData[]> {
    try {
      if (!this.isAuthorized) {
        throw new Error('Apple Health não está autorizado');
      }

      if (window.HealthKit) {
        return await window.HealthKit.getSteps(startDate, endDate);
      }

      // Dados simulados para desenvolvimento
      return this.generateSimulatedStepsData(startDate, endDate);
    } catch (error) {
      console.error('Erro ao buscar dados de passos:', error);
      return [];
    }
  }

  // Buscar dados de frequência cardíaca
  async getHeartRateData(startDate: Date, endDate: Date): Promise<AppleHealthData[]> {
    try {
      if (!this.isAuthorized) {
        throw new Error('Apple Health não está autorizado');
      }

      if (window.HealthKit) {
        return await window.HealthKit.getHeartRate(startDate, endDate);
      }

      // Dados simulados para desenvolvimento
      return this.generateSimulatedHeartRateData(startDate, endDate);
    } catch (error) {
      console.error('Erro ao buscar dados de frequência cardíaca:', error);
      return [];
    }
  }

  // Buscar dados de calorias
  async getCaloriesData(startDate: Date, endDate: Date): Promise<AppleHealthData[]> {
    try {
      if (!this.isAuthorized) {
        throw new Error('Apple Health não está autorizado');
      }

      if (window.HealthKit) {
        return await window.HealthKit.getCalories(startDate, endDate);
      }

      // Dados simulados para desenvolvimento
      return this.generateSimulatedCaloriesData(startDate, endDate);
    } catch (error) {
      console.error('Erro ao buscar dados de calorias:', error);
      return [];
    }
  }

  // Buscar dados de sono
  async getSleepData(startDate: Date, endDate: Date): Promise<AppleHealthData[]> {
    try {
      if (!this.isAuthorized) {
        throw new Error('Apple Health não está autorizado');
      }

      if (window.HealthKit) {
        return await window.HealthKit.getSleep(startDate, endDate);
      }

      // Dados simulados para desenvolvimento
      return this.generateSimulatedSleepData(startDate, endDate);
    } catch (error) {
      console.error('Erro ao buscar dados de sono:', error);
      return [];
    }
  }

  // Buscar todos os dados de forma agregada
  async getAllHealthData(startDate: Date, endDate: Date): Promise<AppleHealthData[]> {
    try {
      const [weightData, stepsData, heartRateData, caloriesData, sleepData] = await Promise.all([
        this.getWeightData(startDate, endDate),
        this.getStepsData(startDate, endDate),
        this.getHeartRateData(startDate, endDate),
        this.getCaloriesData(startDate, endDate),
        this.getSleepData(startDate, endDate)
      ]);

      // Combinar dados por timestamp
      const combinedData = new Map<number, AppleHealthData>();

      // Processar dados de peso
      weightData.forEach(data => {
        const key = data.timestamp.getTime();
        combinedData.set(key, { ...combinedData.get(key), ...data });
      });

      // Processar dados de passos
      stepsData.forEach(data => {
        const key = data.timestamp.getTime();
        combinedData.set(key, { ...combinedData.get(key), ...data });
      });

      // Processar dados de frequência cardíaca
      heartRateData.forEach(data => {
        const key = data.timestamp.getTime();
        combinedData.set(key, { ...combinedData.get(key), ...data });
      });

      // Processar dados de calorias
      caloriesData.forEach(data => {
        const key = data.timestamp.getTime();
        combinedData.set(key, { ...combinedData.get(key), ...data });
      });

      // Processar dados de sono
      sleepData.forEach(data => {
        const key = data.timestamp.getTime();
        combinedData.set(key, { ...combinedData.get(key), ...data });
      });

      return Array.from(combinedData.values()).sort((a, b) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      );
    } catch (error) {
      console.error('Erro ao buscar dados agregados:', error);
      return [];
    }
  }

  // Salvar dados no Supabase
  async saveToSupabase(userId: string, data: AppleHealthData[]): Promise<void> {
    try {
      // Buscar profile do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (profileError || !profile) {
        throw new Error('Profile do usuário não encontrado');
      }

      // Salvar dados de peso na tabela pesagens
      const weightData = data.filter(d => d.weight).map(d => ({
        user_id: profile.id,
        peso_kg: d.weight,
        origem_medicao: 'apple_health_sync',
        data_medicao: d.timestamp.toISOString().split('T')[0],
        created_at: d.timestamp.toISOString()
      }));

      if (weightData.length > 0) {
        const { error: weightError } = await supabase
          .from('pesagens')
          .upsert(weightData, { 
            onConflict: 'user_id,data_medicao',
            ignoreDuplicates: true 
          });

        if (weightError) {
          console.error('Erro ao salvar dados de peso:', weightError);
        }
      }

      // Salvar dados de atividade física na tabela pontuacao_diaria
      const activityData = data.filter(d => d.steps || d.heartRate || d.calories).map(d => ({
        user_id: profile.id,
        data: d.timestamp.toISOString().split('T')[0],
        pontos_atividade_fisica: d.steps ? Math.min(Math.floor(d.steps / 1000), 10) : 0,
        created_at: d.timestamp.toISOString()
      }));

      if (activityData.length > 0) {
        const { error: activityError } = await supabase
          .from('pontuacao_diaria')
          .upsert(activityData, { 
            onConflict: 'user_id,data',
            ignoreDuplicates: true 
          });

        if (activityError) {
          console.error('Erro ao salvar dados de atividade:', activityError);
        }
      }

      console.log(`✅ Dados Apple Health salvos no Supabase: ${weightData.length} pesagens, ${activityData.length} registros de atividade`);
    } catch (error) {
      console.error('Erro ao salvar no Supabase:', error);
      throw error;
    }
  }

  // Verificar se está autorizado
  getAuthorizationStatus(): boolean {
    return this.isAuthorized;
  }

  // Dados simulados para desenvolvimento
  private generateSimulatedWeightData(startDate: Date, endDate: Date): AppleHealthData[] {
    const data: AppleHealthData[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(days, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        weight: 70 + Math.random() * 5,
        timestamp: date
      });
    }
    
    return data;
  }

  private generateSimulatedStepsData(startDate: Date, endDate: Date): AppleHealthData[] {
    const data: AppleHealthData[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(days, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        steps: 8000 + Math.random() * 4000,
        timestamp: date
      });
    }
    
    return data;
  }

  private generateSimulatedHeartRateData(startDate: Date, endDate: Date): AppleHealthData[] {
    const data: AppleHealthData[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(days, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        heartRate: 70 + Math.random() * 20,
        timestamp: date
      });
    }
    
    return data;
  }

  private generateSimulatedCaloriesData(startDate: Date, endDate: Date): AppleHealthData[] {
    const data: AppleHealthData[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(days, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        calories: 2000 + Math.random() * 500,
        timestamp: date
      });
    }
    
    return data;
  }

  private generateSimulatedSleepData(startDate: Date, endDate: Date): AppleHealthData[] {
    const data: AppleHealthData[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(days, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        sleepHours: 7 + Math.random() * 2,
        timestamp: date
      });
    }
    
    return data;
  }
}

export const appleHealthService = new AppleHealthService();
export type { AppleHealthData, AppleHealthAuthResult }; 