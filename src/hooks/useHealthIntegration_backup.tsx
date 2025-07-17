import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  errors: string[];
}

export interface HealthIntegrationState {
  isConnected: boolean;
  isAuthorized: boolean;
  isLoading: boolean;
  config: HealthIntegrationConfig;
  lastSync?: Date;
  syncResult?: HealthSyncResult;
}

declare global {
  interface Window {
    gapi: any;
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
    return isIOS() && 'HealthKit' in window;
  };

  // Verifica se Google Fit está disponível
  const isGoogleFitAvailable = () => {
    return window.gapi && window.gapi.client;
  };

  // Salvar configuração localmente com cleanup melhorado
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
        description: 'Não foi possível salvar as configurações',
        variant: 'destructive',
      });
    }
  }, [state.config, toast]);

  // Conectar com Apple Health
  const connectAppleHealth = useCallback(async () => {
    if (!isAppleHealthAvailable()) {
      toast({
        title: 'Apple Health não disponível',
        description: 'Recurso disponível apenas em dispositivos iOS',
        variant: 'destructive',
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Implementar integração com Apple Health
      toast({
        title: '🍎 Apple Health em desenvolvimento',
        description: 'Esta funcionalidade será disponibilizada em breve',
      });
    } catch (error) {
      console.error('Erro ao conectar com Apple Health:', error);
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar com Apple Health',
        variant: 'destructive',
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

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
      
      const fitnessData = await googleFitService.getGoogleFitData(startDate, endDate);
      
      // Salvar dados no Supabase se usuário logado
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
        title: '✅ Google Fit conectado',
        description: `${fitnessData.length} registros importados com sucesso`,
      });

    } catch (error: any) {
      console.error('Erro ao conectar Google Fit:', error);
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        isAuthorized: false,
        isLoading: false,
      }));
      
      toast({
        title: 'Erro na conexão',
        description: error.message || 'Não foi possível conectar com Google Fit',
        variant: 'destructive',
      });
    }
  }, [toast, saveUserConfig, user]);

  // Sincronizar dados do Google Fit
  const syncGoogleFitData = useCallback(async () => {
    if (!state.isAuthorized) {
      toast({
        title: 'Não autorizado',
        description: 'Conecte-se ao Google Fit primeiro',
        variant: 'destructive',
      });
      return {
        success: false,
        recordsImported: 0,
        lastSyncDate: new Date(),
        errors: ['Não autorizado'],
      };
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (!user) throw new Error('Usuário não logado');

      // Buscar dados dos últimos 7 dias
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);
      
      const fitnessData = await googleFitService.getGoogleFitData(startDate, endDate);
      
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
        title: '📊 Sincronização completa',
        description: `${fitnessData.length} registros atualizados`,
      });

      return {
        success: true,
        recordsImported: fitnessData.length,
        lastSyncDate: new Date(),
        errors: [],
      };

    } catch (error: any) {
      console.error('Erro na sincronização:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));

      toast({
        title: 'Erro na sincronização',
        description: error.message || 'Não foi possível sincronizar os dados',
        variant: 'destructive',
      });

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
        description: 'Não foi possível desconectar completamente',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Função de desconexão genérica
  const disconnect = useCallback(async () => {
    await disconnectGoogleFit();
  }, [disconnectGoogleFit]);

  // Sincronizar todos os dados
  const syncAllData = useCallback(async () => {
    return await syncGoogleFitData();
  }, [syncGoogleFitData]);

  // Carregar configuração salva no useEffect com cleanup
  useEffect(() => {
    let isMounted = true;
    
    const loadConfig = async () => {
      try {
        const savedConfig = localStorage.getItem('health_integration_config');
        if (savedConfig && isMounted) {
          const config = JSON.parse(savedConfig);
          setState(prev => ({
            ...prev,
            config: { ...DEFAULT_CONFIG, ...config },
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    };

    loadConfig();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-sync se habilitado
  useEffect(() => {
    if (state.config.autoSync && state.isAuthorized && state.config.googleFitEnabled) {
      const interval = setInterval(() => {
        syncGoogleFitData();
      }, 60 * 60 * 1000); // Sincronizar a cada hora

      return () => clearInterval(interval);
    }
  }, [state.config.autoSync, state.isAuthorized, state.config.googleFitEnabled, syncGoogleFitData]);

  return {
    state,
    isIOS,
    isAndroid,
    isAppleHealthAvailable,
    isGoogleFitAvailable,
    connectAppleHealth,
    connectGoogleFit,
    syncGoogleFitData,
    syncAllData,
    saveUserConfig,
    disconnect,
  };
}
