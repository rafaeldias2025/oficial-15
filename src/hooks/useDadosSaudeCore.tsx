import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DadosSaudeCore {
  id?: string;
  user_id: string;
  peso_atual_kg: number;
  altura_cm: number;
  circunferencia_abdominal_cm: number;
  imc?: number;
  meta_peso_kg: number;
  progresso_percentual?: number;
  data_atualizacao?: string;
}

// Hook focado apenas em dados de saúde
export const useDadosSaudeCore = () => {
  const [dadosSaude, setDadosSaude] = useState<DadosSaudeCore | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDadosSaude = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        const dadosLocal = localStorage.getItem('dados_saude_temp');
        if (dadosLocal) {
          setDadosSaude(JSON.parse(dadosLocal));
        }
        return;
      }

      const profile = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile.error) throw profile.error;

      const { data: saude } = await supabase
        .from('dados_saude_usuario')
        .select('*')
        .eq('user_id', profile.data.id)
        .order('data_atualizacao', { ascending: false })
        .limit(1)
        .single();

      const { data: pesagem } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', profile.data.id)
        .order('data_medicao', { ascending: false })
        .limit(1)
        .single();

      let dadosCombinados = saude;
      
      if (pesagem) {
        const alturaMetros = dadosCombinados?.altura_cm ? dadosCombinados.altura_cm / 100 : 1.7;
        const imcCalculado = pesagem.peso_kg / (alturaMetros * alturaMetros);
        
        dadosCombinados = {
          ...dadosCombinados,
          peso_atual_kg: pesagem.peso_kg,
          imc: Math.round(imcCalculado * 10) / 10,
          data_atualizacao: pesagem.data_medicao
        };
      }

      setDadosSaude(dadosCombinados || null);
    } catch (error) {
      console.error('Erro ao buscar dados de saúde:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvarDadosSaude = async (novosDados: Omit<DadosSaudeCore, 'id' | 'user_id' | 'imc' | 'progresso_percentual' | 'data_atualizacao'>) => {
    try {
      if (!user) {
        const dadosTemp = {
          ...novosDados,
          user_id: 'temp',
          imc: novosDados.peso_atual_kg / Math.pow(novosDados.altura_cm / 100, 2),
          data_atualizacao: new Date().toISOString()
        };
        localStorage.setItem('dados_saude_temp', JSON.stringify(dadosTemp));
        setDadosSaude(dadosTemp);
        return;
      }

      const profile = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile.error) throw profile.error;

      const { error } = await supabase
        .from('dados_saude_usuario')
        .upsert([{
          user_id: profile.data.id,
          ...novosDados
        }]);

      if (error) throw error;

      await fetchDadosSaude();
    } catch (error) {
      console.error('Erro ao salvar dados de saúde:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDadosSaude();
  }, [user]);

  return {
    dadosSaude,
    loading,
    salvarDadosSaude,
    refetch: fetchDadosSaude
  };
};