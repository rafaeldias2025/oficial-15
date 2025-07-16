import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Hook para garantir inserções validadas e completas
export const useValidatedInserts = () => {
  const [loading, setLoading] = useState(false);

  const insertPesagemCompleta = async (dados: {
    user_id: string;
    peso_kg: number;
    imc?: number;
    circunferencia_abdominal_cm?: number;
    idade_metabolica?: number;
    origem_medicao: string;
    [key: string]: any;
  }) => {
    try {
      setLoading(true);

      // Validações obrigatórias
      if (!dados.user_id) {
        throw new Error('ID do usuário é obrigatório');
      }
      
      if (!dados.peso_kg || dados.peso_kg <= 0) {
        throw new Error('Peso deve ser maior que zero');
      }

      if (!dados.origem_medicao) {
        throw new Error('Origem da medição é obrigatória');
      }

      // Estrutura completa da pesagem
      const pesagemCompleta = {
        user_id: dados.user_id,
        peso_kg: dados.peso_kg,
        imc: dados.imc || null,
        circunferencia_abdominal_cm: dados.circunferencia_abdominal_cm || null,
        idade_metabolica: dados.idade_metabolica || null,
        gordura_corporal_pct: dados.gordura_corporal_pct || null,
        massa_muscular_kg: dados.massa_muscular_kg || null,
        agua_corporal_pct: dados.agua_corporal_pct || null,
        gordura_visceral: dados.gordura_visceral || null,
        taxa_metabolica_basal: dados.taxa_metabolica_basal || null,
        massa_ossea_kg: dados.massa_ossea_kg || null,
        tipo_corpo: dados.tipo_corpo || null,
        origem_medicao: dados.origem_medicao,
        data_medicao: new Date().toISOString()
      };

      const { error } = await supabase
        .from('pesagens')
        .insert(pesagemCompleta);

      if (error) throw error;

      return pesagemCompleta;

    } catch (error) {
      console.error('Erro na inserção validada:', error);
      toast.error('Erro ao registrar dados');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const insertMissaoDiaria = async (userId: string) => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];

      // Verificar se já existe missão para hoje
      const { data: existing } = await supabase
        .from('missao_dia')
        .select('id')
        .eq('user_id', userId)
        .eq('data', today)
        .maybeSingle();

      if (existing) {
        return existing; // Já existe
      }

      // Criar nova missão do dia
      const novaMissao = {
        user_id: userId,
        data: today,
        concluido: false
      };

      const { data, error } = await supabase
        .from('missao_dia')
        .insert(novaMissao)
        .select()
        .single();

      if (error) throw error;

      return data;

    } catch (error) {
      console.error('Erro ao criar missão do dia:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const insertAvaliacaoSemanal = async (dados: {
    user_id: string;
    week_start_date: string;
    learning_data: any;
    performance_ratings: any;
    next_week_goals?: string;
  }) => {
    try {
      setLoading(true);

      // Validações
      if (!dados.user_id) {
        throw new Error('ID do usuário é obrigatório');
      }

      if (!dados.learning_data || Object.keys(dados.learning_data).length === 0) {
        throw new Error('Dados de aprendizado são obrigatórios');
      }

      if (!dados.performance_ratings || Object.keys(dados.performance_ratings).length === 0) {
        throw new Error('Avaliações de performance são obrigatórias');
      }

      // Estrutura completa da avaliação
      const avaliacaoCompleta = {
        user_id: dados.user_id,
        week_start_date: dados.week_start_date,
        learning_data: dados.learning_data,
        performance_ratings: dados.performance_ratings,
        next_week_goals: dados.next_week_goals || ''
      };

      const { data, error } = await supabase
        .from('weekly_evaluations')
        .upsert(avaliacaoCompleta, {
          onConflict: 'user_id,week_start_date'
        })
        .select()
        .single();

      if (error) throw error;

      return data;

    } catch (error) {
      console.error('Erro ao salvar avaliação semanal:', error);
      toast.error('Erro ao salvar avaliação');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    insertPesagemCompleta,
    insertMissaoDiaria,
    insertAvaliacaoSemanal,
    loading
  };
};