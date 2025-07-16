import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ProgressData {
  pesagens: any[];
  dadosFisicos: any;
  historicoMedidas: any[];
  metasPeso: any[];
  loading: boolean;
  error: string | null;
}

export const useProgressData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ProgressData>({
    pesagens: [],
    dadosFisicos: null,
    historicoMedidas: [],
    metasPeso: [],
    loading: true,
    error: null
  });

  const fetchProgressData = React.useCallback(async () => {
    if (!user) return;
    
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Buscar profile do usuário
      let { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) {
        console.warn('Profile não encontrado, criando perfil padrão');
        // Criar perfil padrão temporário
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
            full_name: user.email?.split('@')[0] || 'Usuário',
            email: user.email || ''
          }])
          .select()
          .single();
        
        if (newProfile) {
          profile = newProfile;
        } else {
          throw new Error('Não foi possível criar o perfil');
        }
      }

      // Buscar dados físicos atuais
      const { data: dadosFisicos } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', profile.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Buscar histórico de pesagens (mais recentes primeiro)
      const { data: pesagens } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', profile.id)
        .order('data_medicao', { ascending: false });

      // Buscar histórico de medidas
      const { data: historicoMedidas } = await supabase
        .from('historico_medidas')
        .select('*')
        .eq('user_id', profile.id)
        .order('data_medicao', { ascending: true });

      // Buscar metas de peso
      const { data: metasPeso } = await supabase
        .from('weight_goals')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      setData({
        pesagens: pesagens || [],
        dadosFisicos: dadosFisicos || null,
        historicoMedidas: historicoMedidas || [],
        metasPeso: metasPeso || [],
        loading: false,
        error: null
      });

      console.log('Dados de progresso atualizados:', { 
        pesagens: pesagens?.length || 0, 
        dadosFisicos: !!dadosFisicos,
        historicoMedidas: historicoMedidas?.length || 0,
        metasPeso: metasPeso?.length || 0
      });

    } catch (error) {
      console.error('Erro ao buscar dados de progresso:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  // Real-time updates para pesagens e dados físicos
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('progress-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pesagens'
        },
        () => {
          console.log('Nova pesagem detectada, atualizando dados de progresso...');
          fetchProgressData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dados_fisicos_usuario'
        },
        () => {
          console.log('Dados físicos atualizados, atualizando dados de progresso...');
          fetchProgressData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'historico_medidas'
        },
        () => {
          console.log('Histórico de medidas atualizado, atualizando dados de progresso...');
          fetchProgressData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weight_goals'
        },
        () => {
          console.log('Metas de peso atualizadas, atualizando dados de progresso...');
          fetchProgressData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchProgressData]);

  return data;
};