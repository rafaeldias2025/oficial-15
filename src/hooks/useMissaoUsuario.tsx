import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface MissaoUsuario {
  id: string;
  user_id: string;
  data: string;
  bebeu_agua: boolean;
  dormiu_bem: boolean;
  autocuidado: boolean;
  humor: string;
}

// Hook focado apenas em missões do usuário
export const useMissaoUsuario = () => {
  const [missoesDaSemana, setMissoesDaSemana] = useState<MissaoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMissoesDaSemana = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setMissoesDaSemana([]);
        return;
      }

      const profile = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile.error) throw profile.error;

      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
      
      const { data: missoes, error } = await supabase
        .from('missoes_usuario')
        .select('*')
        .eq('user_id', profile.data.id)
        .gte('data', seteDiasAtras.toISOString().split('T')[0])
        .order('data', { ascending: true });

      if (error) throw error;

      setMissoesDaSemana(missoes || []);
    } catch (error) {
      console.error('Erro ao buscar missões da semana:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissoesDaSemana();
  }, [user]);

  return {
    missoesDaSemana,
    loading,
    refetch: fetchMissoesDaSemana
  };
};