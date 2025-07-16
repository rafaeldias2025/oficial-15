import { supabase } from '@/integrations/supabase/client';

// Configuração do Google OAuth2
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'seu-google-client-id';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'sua-google-api-key';

// Escopos necessários para acessar dados do Google Fit
const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.body.write',
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.location.read',
  'https://www.googleapis.com/auth/fitness.nutrition.read',
  'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
  'https://www.googleapis.com/auth/fitness.reproductive_health.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

interface GoogleFitData {
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  steps?: number;
  heartRate?: number;
  calories?: number;
  distance?: number;
  activeMinutes?: number;
  timestamp: Date;
}

interface GoogleFitAuthResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  email: string;
  name: string;
}

declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

class GoogleFitService {
  private isInitialized = false;
  private authInstance: any = null;

  // Inicializar o Google API
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Carregar Google API script
    await this.loadGoogleScript();
    
    // Inicializar gapi
    await new Promise<void>((resolve) => {
      window.gapi.load('client:auth2', resolve);
    });

    // Configurar cliente
    await window.gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest',
        'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'
      ],
      scope: GOOGLE_FIT_SCOPES.join(' ')
    });

    this.authInstance = window.gapi.auth2.getAuthInstance();
    this.isInitialized = true;
  }

  // Carregar script do Google API
  private async loadGoogleScript(): Promise<void> {
    if (window.gapi) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar Google API'));
      document.head.appendChild(script);
    });
  }

  // Autenticar usuário
  async authenticate(email: string): Promise<GoogleFitAuthResult> {
    try {
      await this.initialize();

      // Tentar login silencioso primeiro
      let user = this.authInstance.currentUser.get();
      
      if (!user.isSignedIn()) {
        // Fazer login interativo
        user = await this.authInstance.signIn({
          login_hint: email
        });
      }

      if (!user.isSignedIn()) {
        throw new Error('Usuário não autenticado');
      }

      const authResponse = user.getAuthResponse();
      const profile = user.getBasicProfile();

      return {
        accessToken: authResponse.access_token,
        refreshToken: authResponse.refresh_token,
        expiresIn: authResponse.expires_in,
        email: profile.getEmail(),
        name: profile.getName()
      };
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw new Error('Falha na autenticação com Google');
    }
  }

  // Buscar dados de peso
  async getWeightData(startDate: Date, endDate: Date): Promise<GoogleFitData[]> {
    try {
      const response = await window.gapi.client.fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: 'derived:com.google.weight:com.google.android.gms:merge_weight',
        datasetId: `${startDate.getTime()}000000-${endDate.getTime()}000000`
      });

      const data: GoogleFitData[] = [];
      if (response.result.point) {
        response.result.point.forEach((point: any) => {
          data.push({
            weight: point.value[0].fpVal,
            timestamp: new Date(parseInt(point.startTimeNanos) / 1000000)
          });
        });
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados de peso:', error);
      return [];
    }
  }

  // Buscar dados de passos
  async getStepsData(startDate: Date, endDate: Date): Promise<GoogleFitData[]> {
    try {
      const response = await window.gapi.client.fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        datasetId: `${startDate.getTime()}000000-${endDate.getTime()}000000`
      });

      const data: GoogleFitData[] = [];
      if (response.result.point) {
        response.result.point.forEach((point: any) => {
          data.push({
            steps: point.value[0].intVal,
            timestamp: new Date(parseInt(point.startTimeNanos) / 1000000)
          });
        });
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados de passos:', error);
      return [];
    }
  }

  // Buscar dados de frequência cardíaca
  async getHeartRateData(startDate: Date, endDate: Date): Promise<GoogleFitData[]> {
    try {
      const response = await window.gapi.client.fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
        datasetId: `${startDate.getTime()}000000-${endDate.getTime()}000000`
      });

      const data: GoogleFitData[] = [];
      if (response.result.point) {
        response.result.point.forEach((point: any) => {
          data.push({
            heartRate: point.value[0].fpVal,
            timestamp: new Date(parseInt(point.startTimeNanos) / 1000000)
          });
        });
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados de frequência cardíaca:', error);
      return [];
    }
  }

  // Buscar dados de calorias
  async getCaloriesData(startDate: Date, endDate: Date): Promise<GoogleFitData[]> {
    try {
      const response = await window.gapi.client.fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
        datasetId: `${startDate.getTime()}000000-${endDate.getTime()}000000`
      });

      const data: GoogleFitData[] = [];
      if (response.result.point) {
        response.result.point.forEach((point: any) => {
          data.push({
            calories: point.value[0].fpVal,
            timestamp: new Date(parseInt(point.startTimeNanos) / 1000000)
          });
        });
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados de calorias:', error);
      return [];
    }
  }

  // Buscar todos os dados de forma agregada
  async getAllFitnessData(startDate: Date, endDate: Date): Promise<GoogleFitData[]> {
    try {
      const [weightData, stepsData, heartRateData, caloriesData] = await Promise.all([
        this.getWeightData(startDate, endDate),
        this.getStepsData(startDate, endDate),
        this.getHeartRateData(startDate, endDate),
        this.getCaloriesData(startDate, endDate)
      ]);

      // Combinar dados por timestamp
      const combinedData = new Map<number, GoogleFitData>();

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

      return Array.from(combinedData.values()).sort((a, b) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      );
    } catch (error) {
      console.error('Erro ao buscar dados agregados:', error);
      return [];
    }
  }

  // Salvar dados no Supabase
  async saveToSupabase(userId: string, data: GoogleFitData[]): Promise<void> {
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
        origem_medicao: 'google_fit_sync',
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

      console.log(`✅ Dados salvos no Supabase: ${weightData.length} pesagens, ${activityData.length} registros de atividade`);
    } catch (error) {
      console.error('Erro ao salvar no Supabase:', error);
      throw error;
    }
  }

  // Desconectar
  async disconnect(): Promise<void> {
    if (this.authInstance) {
      await this.authInstance.signOut();
    }
  }

  // Verificar se está conectado
  isConnected(): boolean {
    return this.authInstance && this.authInstance.isSignedIn.get();
  }

  // Obter informações do usuário atual
  getCurrentUser(): any {
    if (this.authInstance && this.authInstance.isSignedIn.get()) {
      return this.authInstance.currentUser.get();
    }
    return null;
  }
}

export const googleFitService = new GoogleFitService();
export type { GoogleFitData, GoogleFitAuthResult }; 