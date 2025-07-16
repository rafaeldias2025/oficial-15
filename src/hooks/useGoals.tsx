import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  type: string;
  start_date: string;
  target_date: string;
  notes: string;
  progress: number;
  other_type?: string;
  weekly_reminders: boolean;
  automatic_plan: boolean;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setGoals([]);
        return;
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', (await supabase.from('profiles').select('id').eq('user_id', user.id).single()).data?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data as Goal[] || []);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      const { data, error } = await supabase
        .from('goals')
        .insert([{
          ...goalData,
          user_id: profile.data.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => [data as Goal, ...prev]);
      toast.success('Meta criada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      toast.error('Erro ao criar meta');
      throw error;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(goal => goal.id === id ? data as Goal : goal));
      toast.success('Meta atualizada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      toast.error('Erro ao atualizar meta');
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast.success('Meta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast.error('Erro ao excluir meta');
      throw error;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};