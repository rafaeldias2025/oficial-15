import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  points: number;
  duration_days: number;
  is_active: boolean;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  target_value: number;
  is_completed: boolean;
  started_at: string;
  completed_at?: string;
  challenge?: Challenge;
}

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Erro ao buscar desafios:', error);
    }
  };

  const fetchUserChallenges = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setUserChallenges([]);
        setCompletedChallenges([]);
        return;
      }

      let { data: profile, error: profileError } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle();
      if (profileError) throw profileError;
      if (!profile) {
        console.warn('Profile não encontrado, criando perfil padrão');
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
            full_name: user.email?.split('@')[0] || 'Usuário',
            email: user.email || ''
          }])
          .select('id')
          .single();
        if (!newProfile) throw new Error('Não foi possível criar o perfil');
        profile = newProfile;
      }

      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenges(*)
        `)
        .eq('user_id', profile.id)
        .order('started_at', { ascending: false });

      if (error) throw error;

      const activeChallenges = data?.filter(uc => !uc.is_completed) || [];
      const completed = data?.filter(uc => uc.is_completed) || [];

      setUserChallenges(activeChallenges);
      setCompletedChallenges(completed);
    } catch (error) {
      console.error('Erro ao buscar desafios do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId: string, targetValue: number = 1) => {
    try {
      if (!user) {
        toast.error('Você precisa estar logado para participar de desafios');
        return;
      }

      let { data: profile, error: profileError } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle();
      if (profileError) throw profileError;
      if (!profile) {
        console.warn('Profile não encontrado, criando perfil padrão');
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
            full_name: user.email?.split('@')[0] || 'Usuário',
            email: user.email || ''
          }])
          .select('id')
          .single();
        if (!newProfile) throw new Error('Não foi possível criar o perfil');
        profile = newProfile;
      }

      const { data, error } = await supabase
        .from('user_challenges')
        .insert([{
          user_id: profile.id,
          challenge_id: challengeId,
          progress: 0,
          target_value: targetValue,
          is_completed: false
        }])
        .select(`
          *,
          challenges(*)
        `)
        .single();

      if (error) throw error;

      setUserChallenges(prev => [data, ...prev]);
      toast.success('Desafio iniciado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao participar do desafio:', error);
      toast.error('Erro ao participar do desafio');
      throw error;
    }
  };

  const updateChallengeProgress = async (userChallengeId: string, newProgress: number) => {
    try {
      const userChallenge = userChallenges.find(uc => uc.id === userChallengeId);
      if (!userChallenge) return;

      const isCompleted = newProgress >= userChallenge.target_value;
      
      const { data, error } = await supabase
        .from('user_challenges')
        .update({
          progress: newProgress,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', userChallengeId)
        .select(`
          *,
          challenges(*)
        `)
        .single();

      if (error) throw error;

      if (isCompleted) {
        // Adicionar pontos ao usuário
        let { data: profile, error: profileError } = await supabase.from('profiles').select('id').eq('user_id', user!.id).maybeSingle();
        if (profileError) throw profileError;
        if (!profile) {
          console.warn('Profile não encontrado, criando perfil padrão');
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert([{
              user_id: user!.id,
              full_name: user!.email?.split('@')[0] || 'Usuário',
              email: user!.email || ''
            }])
            .select('id')
            .single();
          if (!newProfile) throw new Error('Não foi possível criar o perfil');
          profile = newProfile;
        }
        if (profile) {
          await supabase.rpc('update_user_points', {
            p_user_id: profile.id,
            p_points: userChallenge.challenge?.points || 0,
            p_activity_type: 'challenge_completed'
          });
        }

        setUserChallenges(prev => prev.filter(uc => uc.id !== userChallengeId));
        setCompletedChallenges(prev => [data, ...prev]);
        toast.success(`Desafio completado! +${userChallenge.challenge?.points || 0} pontos`);
      } else {
        setUserChallenges(prev => prev.map(uc => uc.id === userChallengeId ? data : uc));
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar progresso do desafio:', error);
      toast.error('Erro ao atualizar progresso');
      throw error;
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchUserChallenges();
  }, [user]);

  return {
    challenges,
    userChallenges,
    completedChallenges,
    loading,
    joinChallenge,
    updateChallengeProgress,
    refetch: () => {
      fetchChallenges();
      fetchUserChallenges();
    }
  };
};