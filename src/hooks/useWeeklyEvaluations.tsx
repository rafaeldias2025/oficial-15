import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfWeek } from 'date-fns';
import { toast } from 'sonner';

export interface WeeklyEvaluation {
  id: string;
  user_id: string;
  week_start_date: string;
  learning_data: {
    melhor_acontecimento?: string;
    maior_desafio?: string;
    conselho_mentor?: string;
    maior_aprendizado_sabotador?: string;
    momento_percebi_sabotando?: string;
    nome_semana?: string;
    relacao_ultima_semana?: string;
  };
  performance_ratings: {
    [key: string]: number;
  };
  next_week_goals?: string;
  created_at: string;
  updated_at: string;
}

export const useWeeklyEvaluations = () => {
  const [evaluations, setEvaluations] = useState<WeeklyEvaluation[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<WeeklyEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setEvaluations([]);
        setCurrentEvaluation(null);
        return;
      }

      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      const { data, error } = await supabase
        .from('weekly_evaluations')
        .select('*')
        .eq('user_id', profile.data.id)
        .order('week_start_date', { ascending: false });

      if (error) throw error;
      setEvaluations(data as WeeklyEvaluation[] || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações semanais:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluationByWeek = async (weekStartDate: Date) => {
    try {
      if (!user) return null;

      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      const weekStartString = weekStartDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('weekly_evaluations')
        .select('*')
        .eq('user_id', profile.data.id)
        .eq('week_start_date', weekStartString)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCurrentEvaluation(data as WeeklyEvaluation);
      return data;
    } catch (error) {
      console.error('Erro ao buscar avaliação da semana:', error);
      return null;
    }
  };

  const saveEvaluation = async (
    weekStartDate: Date,
    learningData: any,
    performanceRatings: any,
    nextWeekGoals: string
  ) => {
    try {
      if (!user) {
        toast.error('Você precisa estar logado para salvar avaliações');
        return;
      }

      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      const weekStartString = weekStartDate.toISOString().split('T')[0];

      const evaluationData = {
        user_id: profile.data.id,
        week_start_date: weekStartString,
        learning_data: learningData,
        performance_ratings: performanceRatings,
        next_week_goals: nextWeekGoals
      };

      // Validar dados antes de salvar
      if (!evaluationData.learning_data || Object.keys(evaluationData.learning_data).length === 0) {
        throw new Error('Dados de aprendizado são obrigatórios');
      }

      if (!evaluationData.performance_ratings || Object.keys(evaluationData.performance_ratings).length === 0) {
        throw new Error('Avaliações de performance são obrigatórias');
      }

      const { data, error } = await supabase
        .from('weekly_evaluations')
        .upsert(evaluationData, {
          onConflict: 'user_id,week_start_date'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentEvaluation(data as WeeklyEvaluation);
      
      // Atualizar lista de avaliações
      setEvaluations(prev => {
        const filtered = prev.filter(evaluation => evaluation.week_start_date !== weekStartString);
        return [data as WeeklyEvaluation, ...filtered].sort((a, b) => 
          new Date(b.week_start_date).getTime() - new Date(a.week_start_date).getTime()
        );
      });

      // Adicionar pontos pela avaliação
      await supabase.rpc('update_user_points', {
        p_user_id: profile.data.id,
        p_points: 50,
        p_activity_type: 'weekly_evaluation'
      });

      toast.success('Avaliação semanal salva com sucesso! +50 pontos');
      return data;
    } catch (error) {
      console.error('Erro ao salvar avaliação semanal:', error);
      toast.error('Erro ao salvar avaliação');
      throw error;
    }
  };

  const getWeekStartDate = (date: Date = new Date()) => {
    return startOfWeek(date, { weekStartsOn: 1 }); // Segunda-feira como início da semana
  };

  useEffect(() => {
    fetchEvaluations();
  }, [user]);

  return {
    evaluations,
    currentEvaluation,
    loading,
    saveEvaluation,
    fetchEvaluationByWeek,
    getWeekStartDate,
    refetch: fetchEvaluations
  };
};