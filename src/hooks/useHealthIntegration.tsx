import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { googleFitService, GoogleFitData } from '@/services/googleFitService';

export interface HealthIntegrationConfig {
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
    gapi?: any;
  }
}

const DEFAULT_CONFIG: HealthIntegrationConfig = {
  googleFitEnabled: false,
  autoSync: true,
  syncFrequency: 'daily',
  dataTypes: {
    weight: true,
    height: true,
    bodyComposition: true,
    activity: true,
    sleep: true,
    heartRate: true,
    bloodPressure: false,
    nutrition: false,
  },
};

export function useHealthIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<HealthIntegrationState>({
    isConnected: false,
    isAuthorized: false,
    isLoading: false,
    config: DEFAULT_CONFIG,
  });

  // Verifica se está em dispositivo Android
  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
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
      
      // Salvar dados no Supabase
      if (fitnessData.length > 0) {
        await googleFitService.saveToSupabase(user.id, fitnessData);
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
      }));
      
      toast({
        title: '✅ Sincronização concluída',
        description: `${fitnessData.length} registros atualizados do Google Fit`,
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
      
      return {
        success: false,
        recordsImported: 0,
        lastSyncDate: new Date(),
        errors: [error.message],
      };
    }
  }, [state.isAuthorized, user, toast]);

  // Desconectar Google Fit
  const disconnectGoogleFit = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Limpar dados locais
      localStorage.removeItem('health_integration_config');
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        isAuthorized: false,
        isLoading: false,
        lastSync: undefined,
        config: DEFAULT_CONFIG,
      }));
      
      toast({
        title: '🔌 Google Fit desconectado',
        description: 'Integração removida com sucesso',
      });
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: 'Erro ao desconectar',
        description: 'Não foi possível desconectar do Google Fit',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Verificar status da conexão
  const checkConnectionStatus = useCallback(async () => {
    try {
      const savedConfig = localStorage.getItem('health_integration_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (config.googleFitEnabled) {
          setState(prev => ({
            ...prev,
            isConnected: true,
            isAuthorized: true,
            config: { ...DEFAULT_CONFIG, ...config },
          }));
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  }, []);

  // Sincronização automática
  useEffect(() => {
    if (state.config.autoSync && state.isAuthorized && state.config.googleFitEnabled) {
      const interval = setInterval(async () => {
        await syncGoogleFitData();
      }, 60000 * 60); // A cada hora

      return () => clearInterval(interval);
    }
  }, [state.config.autoSync, state.isAuthorized, state.config.googleFitEnabled, syncGoogleFitData]);

  // Carregar configuração inicial
  useEffect(() => {
    loadUserConfig();
    checkConnectionStatus();
  }, [loadUserConfig, checkConnectionStatus]);

  return {
    state,
    isAndroid,
    isGoogleFitAvailable,
    connectGoogleFit,
    syncGoogleFitData,
    disconnectGoogleFit,
    saveUserConfig,
    checkConnectionStatus,
  };
} 