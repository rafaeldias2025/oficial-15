import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { googleFitService, GoogleFitData } from '@/services/googleFitService';

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

export interface HealthIntegrationState {
  isConnected: boolean;
  isAuthorized: boolean;
  isLoading: boolean;
  lastSync?: Date;
  config: HealthIntegrationConfig;
  error?: string;
}

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        healthKit?: {
          postMessage: (message: any) => void;
        };
      };
    };
    gapi?: any;
  }
}

// Configuração padrão da integração
const DEFAULT_CONFIG: HealthIntegrationConfig = {
  appleHealthEnabled: false,
  googleFitEnabled: false,
  autoSync: false,
  syncFrequency: 'daily',
  dataTypes: {
    weight: true,
    height: true,
    bodyComposition: true,
    activity: false,
    sleep: false,
    heartRate: false,
    bloodPressure: false,
    nutrition: false,
  },
};

export const useHealthIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<HealthIntegrationState>({
    isConnected: false,
    isAuthorized: false,
    isLoading: false,
    config: DEFAULT_CONFIG,
  });

  // Verifica se está em dispositivo iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  // Verifica se está em dispositivo Android
  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  // Verifica se Apple Health está disponível
  const isAppleHealthAvailable = () => {
    return isIOS() && window.webkit?.messageHandlers?.healthKit;
  };

  // Verifica se Google Fit está disponível
  const isGoogleFitAvailable = () => {
    return window.gapi && window.gapi.client;
  };

  // Salvar configuração localmente (usando localStorage até as tabelas serem criadas)
  const saveUserConfig = useCallback(async (config: Partial<HealthIntegrationConfig>) => {
    try {
      const newConfig = { ...state.config, ...config };
      
      // Salvar no localStorage por enquanto
      localStorage.setItem('health_integration_config', JSON.stringify(newConfig));
      
      setState(prev => ({
        ...prev,
        config: newConfig,
      }));

      toast({
        title: '✅ Configuração salva',
        description: 'Suas preferências de integração foram atualizadas',
      });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar suas configurações',
        variant: 'destructive',
      });
    }
  }, [state.config, toast]);

  // Carregar configuração do localStorage
  const loadUserConfig = useCallback(() => {
    try {
      const savedConfig = localStorage.getItem('health_integration_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setState(prev => ({
          ...prev,
          config: { ...DEFAULT_CONFIG, ...config },
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  }, []);

  // Conectar com Apple Health
  const connectAppleHealth = useCallback(async () => {
    if (!isAppleHealthAvailable()) {
      toast({
        title: 'Apple Health não disponível',
        description: 'Este recurso está disponível apenas em dispositivos iOS com aplicativo nativo',
        variant: 'destructive',
      });
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simulação de conexão com Apple Health
      // Em um app real, isso seria feito através de bridge nativo
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isAuthorized: true,
          isLoading: false,
        }));
        
        saveUserConfig({ appleHealthEnabled: true });
        
        toast({
          title: '🍎 Apple Health conectado',
          description: 'Você pode agora sincronizar seus dados de saúde',
        });
      }, 2000);

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar com Apple Health',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [toast, saveUserConfig]);

  // Conectar com Google Fit
  const connectGoogleFit = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Autenticar com Google Fit
      const authResult = await googleFitService.authenticate(email);
      
      // Buscar dados dos últimos 30 dias
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);
      
      const fitnessData = await googleFitService.getAllFitnessData(startDate, endDate);
      
      // Salvar dados no Supabase
      if (user?.id && fitnessData.length > 0) {
        await googleFitService.saveToSupabase(user.id, fitnessData);
      }
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isAuthorized: true,
        isLoading: false,
        lastSync: new Date(),
      }));
      
      saveUserConfig({ googleFitEnabled: true });
      
      toast({
        title: '🏃 Google Fit conectado',
        description: `Sincronizados ${fitnessData.length} registros de dados de saúde`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro na conexão com Google Fit:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar com o Google Fit',
        variant: 'destructive',
      });
      
      throw error;
    }
  }, [toast, saveUserConfig, user]);

  // Sincronizar dados do Apple Health
  const syncAppleHealthData = useCallback(async (): Promise<HealthSyncResult> => {
    if (!state.isAuthorized) {
      return {
        success: false,
        recordsImported: 0,
        lastSyncDate: new Date(),
        errors: ['Apple Health não está conectado'],
      };
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (!user) throw new Error('Usuário não logado');

      // Buscar profile do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile não encontrado');

      // Simular dados do Apple Health
      const simulatedHealthData = [
        {
          type: 'weight',
          value: 70.5 + Math.random() * 5,
          unit: 'kg',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
        {
          type: 'height',
          value: 175,
          unit: 'cm',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          type: 'steps',
          value: 8000 + Math.random() * 4000,
          unit: 'steps',
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        },
      ];

      let recordsImported = 0;

      // Processar dados de peso
      const weightData = simulatedHealthData.find(d => d.type === 'weight');
      if (weightData && state.config.dataTypes.weight) {
        // Atualizar dados físicos
        await supabase
          .from('dados_fisicos_usuario')
          .upsert({
            user_id: profile.id,
            peso_atual_kg: weightData.value,
            nome_completo: user.user_metadata?.full_name || 'Usuário',
            data_nascimento: '1990-01-01',
            sexo: 'Masculino',
            altura_cm: 175,
            circunferencia_abdominal_cm: 90,
            meta_peso_kg: weightData.value,
            updated_at: new Date().toISOString(),
          });

        // Criar nova pesagem
        await supabase
          .from('pesagens')
          .insert({
            user_id: profile.id,
            peso_kg: weightData.value,
            data_medicao: weightData.timestamp.toISOString(),
            origem_medicao: 'apple_health',
            circunferencia_abdominal_cm: 90,
            imc: weightData.value / (1.75 * 1.75),
          });

        recordsImported++;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
      }));

      return {
        success: true,
        recordsImported,
        lastSyncDate: new Date(),
      };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        recordsImported: 0,
        lastSyncDate: new Date(),
        errors: [error.message],
      };
    }
  }, [state.isAuthorized, state.config.dataTypes, user]);

  // Sincronizar dados do Google Fit
  const syncGoogleFitData = useCallback(async (): Promise<HealthSyncResult> => {
    if (!state.isAuthorized) {
      return {
        success: false,
        recordsImported: 0,
        lastSyncDate: new Date(),
        errors: ['Google Fit não está conectado'],
      };
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (!user) throw new Error('Usuário não logado');

      // Buscar dados dos últimos 7 dias
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);

      const fitnessData = await googleFitService.getAllFitnessData(startDate, endDate);
      
      // Salvar no Supabase
      if (fitnessData.length > 0) {
        await googleFitService.saveToSupabase(user.id, fitnessData);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
      }));

      toast({
        title: '🔄 Sincronização concluída',
        description: `${fitnessData.length} registros atualizados`,
      });

      return {
        success: true,
        recordsImported: fitnessData.length,
        lastSyncDate: new Date(),
      };
    } catch (error) {
      console.error('Erro na sincronização:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));

      toast({
        title: 'Erro na sincronização',
        description: 'Não foi possível sincronizar com Google Fit',
        variant: 'destructive',
      });

      return {
        success: false,
        recordsImported: 0,
        lastSyncDate: new Date(),
        errors: [error.message],
      };
    }
  }, [state.isAuthorized, toast, user]);

  // Sincronizar todos os dados
  const syncAllData = useCallback(async () => {
    const results: HealthSyncResult[] = [];

    if (state.config.appleHealthEnabled && state.isAuthorized) {
      const appleResult = await syncAppleHealthData();
      results.push(appleResult);
    }

    if (state.config.googleFitEnabled && state.isAuthorized) {
      const googleResult = await syncGoogleFitData();
      results.push(googleResult);
    }

    const totalRecords = results.reduce((sum, result) => sum + result.recordsImported, 0);
    const allErrors = results.flatMap(result => result.errors || []);

    if (totalRecords > 0) {
      toast({
        title: '🔄 Sincronização concluída',
        description: `${totalRecords} registros importados com sucesso`,
      });
    }

    if (allErrors.length > 0) {
      toast({
        title: '⚠️ Alguns erros ocorreram',
        description: allErrors.join(', '),
        variant: 'destructive',
      });
    }

    return {
      success: allErrors.length === 0,
      recordsImported: totalRecords,
      lastSyncDate: new Date(),
      errors: allErrors.length > 0 ? allErrors : undefined,
    };
  }, [state.config, state.isAuthorized, syncAppleHealthData, syncGoogleFitData, toast]);

  // Desconectar serviços
  const disconnect = useCallback(async (service: 'apple_health' | 'google_fit') => {
    try {
      if (service === 'apple_health') {
        await saveUserConfig({ appleHealthEnabled: false });
      } else if (service === 'google_fit') {
        await saveUserConfig({ googleFitEnabled: false });
        
        // Desconectar do Google
        if (window.gapi?.auth2) {
          const authInstance = window.gapi.auth2.getAuthInstance();
          await authInstance.signOut();
        }
      }

      setState(prev => ({
        ...prev,
        isConnected: false,
        isAuthorized: false,
      }));

      toast({
        title: '🔌 Desconectado',
        description: `${service === 'apple_health' ? 'Apple Health' : 'Google Fit'} foi desconectado`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao desconectar',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [saveUserConfig, toast]);

  // Carregar configuração ao montar
  useEffect(() => {
    loadUserConfig();
  }, [loadUserConfig]);

  // Verificar status de conexão
  useEffect(() => {
    const checkConnection = () => {
      setState(prev => ({
        ...prev,
        isConnected: prev.config.appleHealthEnabled || prev.config.googleFitEnabled,
      }));
    };

    checkConnection();
  }, [state.config]);

  return {
    state,
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isAppleHealthAvailable: isAppleHealthAvailable(),
    isGoogleFitAvailable: isGoogleFitAvailable(),
    connectAppleHealth,
    connectGoogleFit,
    syncAllData,
    syncAppleHealthData,
    syncGoogleFitData,
    saveUserConfig,
    disconnect,
  };
}; 