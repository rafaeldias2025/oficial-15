import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Hook otimizado para verificar dados físicos completos
export const usePhysicalDataComplete = () => {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  // Flag no localStorage para evitar verificações repetidas na mesma sessão
  const getStorageKey = () => `physical_data_complete_${user?.id}`;
  
  const checkPhysicalDataComplete = useCallback(async (force = false) => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Se já verificamos nesta sessão e não é forçado, usar cache
    const storageKey = getStorageKey();
    const cachedResult = localStorage.getItem(storageKey);
    
    if (!force && cachedResult && hasChecked) {
      setIsComplete(cachedResult === 'true');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('🔍 Verificando dados físicos para usuário:', user.id);
      
      // Verificar se é admin primeiro
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('👤 Perfil encontrado:', profile);
      
      // Admins não precisam de dados físicos
      if (profile?.role === 'admin') {
        setIsComplete(true);
        setHasChecked(true);
        localStorage.setItem(storageKey, 'true');
        setIsLoading(false);
        return;
      }
      
      // Verificar dados físicos usando função do banco
      const { data: hasPhysicalData, error } = await supabase
        .rpc('check_physical_data_complete', { user_uuid: user.id });
      
      console.log('📊 Resultado da verificação:', { hasPhysicalData, error });
      
      if (error) {
        console.error('Erro ao verificar dados físicos:', error);
        setIsComplete(false);
      } else {
        setIsComplete(hasPhysicalData);
        // Salvar no localStorage apenas se os dados estão completos
        if (hasPhysicalData) {
          localStorage.setItem(storageKey, 'true');
        } else {
          localStorage.removeItem(storageKey);
        }
      }
      
      setHasChecked(true);
    } catch (error) {
      console.error('Erro ao verificar dados físicos:', error);
      setIsComplete(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, hasChecked]);

  // Marcar dados como completos (chamado após salvar dados físicos)
  const markAsComplete = useCallback(() => {
    if (user) {
      setIsComplete(true);
      setHasChecked(true);
      localStorage.setItem(getStorageKey(), 'true');
    }
  }, [user]);

  // Limpar cache (útil para forçar nova verificação)
  const clearCache = useCallback(() => {
    if (user) {
      localStorage.removeItem(getStorageKey());
      setHasChecked(false);
      setIsComplete(null);
    }
  }, [user]);

  // Verificar automaticamente quando o usuário loggar
  useEffect(() => {
    if (user && !hasChecked) {
      checkPhysicalDataComplete();
    } else if (!user) {
      setIsComplete(null);
      setIsLoading(false);
      setHasChecked(false);
    }
  }, [user, hasChecked, checkPhysicalDataComplete]);

  return {
    isComplete,
    isLoading,
    checkPhysicalDataComplete,
    markAsComplete,
    clearCache,
    hasChecked
  };
};