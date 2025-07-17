import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  missions: any[];
  userProgress: any;
  courses: any[];
  lastSync: string;
}

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [pendingActions, setPendingActions] = useState<any[]>([]);
  const { toast } = useToast();

  const loadOfflineData = useCallback(() => {
    try {
      const data = localStorage.getItem('offline_data');
      if (data) {
        setOfflineData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erro ao carregar dados offline:', error);
    }
  }, []);

  const saveOfflineData = useCallback((data: Partial<OfflineData>) => {
    try {
      const currentData = offlineData || {
        missions: [],
        userProgress: {},
        courses: [],
        lastSync: new Date().toISOString()
      };

      const updatedData = {
        ...currentData,
        ...data,
        lastSync: new Date().toISOString()
      };

      localStorage.setItem('offline_data', JSON.stringify(updatedData));
      setOfflineData(updatedData);
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error);
    }
  }, [offlineData]);

  const syncPendingActions = useCallback(async () => {
    if (pendingActions.length === 0) return;

    try {
      // Aqui você processaria as ações pendentes com Supabase
      console.log('Sincronizando ações pendentes:', pendingActions);
      
      // Simular sincronização
      for (const action of pendingActions) {
        console.log('Processando ação:', action);
        // await processAction(action);
      }

      // Limpar ações pendentes após sincronização
      setPendingActions([]);
      localStorage.removeItem('pending_actions');

      toast({
        title: "Sincronização completa ✅",
        description: `${pendingActions.length} ações foram sincronizadas`
      });
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: "Algumas ações não puderam ser sincronizadas",
        variant: "destructive"
      });
    }
  }, [pendingActions, toast]);

  useEffect(() => {
    let isMounted = true;
    
    const handleOnline = () => {
      if (!isMounted) return;
      setIsOnline(true);
      toast({
        title: "Conexão restaurada 🌐",
        description: "Sincronizando dados..."
      });
      syncPendingActions();
    };

    const handleOffline = () => {
      if (!isMounted) return;
      setIsOnline(false);
      toast({
        title: "Modo offline ⚡",
        description: "Você pode continuar usando funcionalidades básicas",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Carregar dados offline do localStorage
    loadOfflineData();

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast, syncPendingActions, loadOfflineData]);

  const addPendingAction = useCallback((action: any) => {
    const newAction = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...action
    };

    setPendingActions(prev => [...prev, newAction]);
    
    // Salvar no localStorage
    try {
      const pending = [...pendingActions, newAction];
      localStorage.setItem('pending_actions', JSON.stringify(pending));
    } catch (error) {
      console.error('Erro ao salvar ação pendente:', error);
    }
  }, [pendingActions]);

  const completeMissionOffline = useCallback((missionId: string) => {
    if (!isOnline) {
      addPendingAction({
        type: 'complete_mission',
        missionId,
        completedAt: new Date().toISOString()
      });

      toast({
        title: "Missão concluída offline ⚡",
        description: "Será sincronizada quando a conexão for restaurada"
      });
    }
  }, [isOnline, addPendingAction, toast]);

  const updateProgressOffline = useCallback((progressData: any) => {
    if (!isOnline) {
      addPendingAction({
        type: 'update_progress',
        data: progressData
      });

      // Atualizar dados locais
      saveOfflineData({
        userProgress: progressData
      });
    }
  }, [isOnline, addPendingAction, saveOfflineData]);

  const getCachedData = useCallback((key: keyof OfflineData) => {
    return offlineData?.[key] || null;
  }, [offlineData]);

  return {
    isOnline,
    offlineData,
    pendingActions: pendingActions.length,
    saveOfflineData,
    completeMissionOffline,
    updateProgressOffline,
    getCachedData,
    syncPendingActions
  };
};