import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
}

export interface DailyMissionRecord {
  id: string;
  user_id: string;
  mission_id: string;
  mission_date: string;
  completed: boolean;
  points_earned: number;
  completed_at?: string;
  created_at: string;
}

const defaultMissions: DailyMission[] = [
  {
    id: 'tongue-scraping',
    title: 'Raspar a língua ao acordar',
    description: 'Higiene bucal matinal para eliminar toxinas',
    points: 10,
    icon: '👅',
    completed: false
  },
  {
    id: 'prayer-meditation',
    title: 'Orar ou meditar 5 min',
    description: 'Momento de conexão espiritual e mental',
    points: 15,
    icon: '🧘‍♀️',
    completed: false
  },
  {
    id: 'warm-water',
    title: 'Beber água morna ou chá',
    description: 'Despertar o metabolismo suavemente',
    points: 10,
    icon: '🍵',
    completed: false
  },
  {
    id: 'hydration',
    title: 'Beber 2L de água até 16h',
    description: 'Manter hidratação adequada',
    points: 20,
    icon: '💧',
    completed: false
  },
  {
    id: 'no-sugar',
    title: 'Comer sem açúcar no dia',
    description: 'Evitar açúcar refinado em todas as refeições',
    points: 25,
    icon: '🚫🍭',
    completed: false
  },
  {
    id: 'gratitude',
    title: 'Praticar gratidão',
    description: 'Escrever 3 coisas pelas quais sou grato(a)',
    points: 15,
    icon: '🙏',
    completed: false
  },
  {
    id: 'early-sleep',
    title: 'Dormir antes das 22h',
    description: 'Respeitar o ritmo circadiano natural',
    points: 20,
    icon: '😴',
    completed: false
  }
];

export const useDailyMissions = (onPointsUpdate?: () => void) => {
  const [missions, setMissions] = useState<DailyMission[]>(defaultMissions);
  const [totalPointsToday, setTotalPointsToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTodayMissions = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setMissions(defaultMissions);
        setTotalPointsToday(0);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      // Buscar missões existentes para hoje
      const { data: existingMissions, error: fetchError } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('user_id', profile.data.id)
        .eq('mission_date', today);

      if (fetchError) throw fetchError;

      // Se não existem missões para hoje, criar automaticamente todas as missões padrão
      if (!existingMissions || existingMissions.length === 0) {
        const missionsToCreate = defaultMissions.map(mission => ({
          user_id: profile.data.id,
          mission_id: mission.id,
          mission_date: today,
          completed: false,
          points_earned: 0
        }));

        const { error: insertError } = await supabase
          .from('daily_missions')
          .insert(missionsToCreate);

        if (insertError) {
          console.error('Erro ao criar missões do dia:', insertError);
        }
      }

      // Buscar missões novamente após criação
      const { data, error } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('user_id', profile.data.id)
        .eq('mission_date', today);

      if (error) throw error;

      const completedMissionIds = data?.map(record => record.mission_id) || [];
      const totalPoints = data?.reduce((sum, record) => sum + record.points_earned, 0) || 0;

      const updatedMissions = defaultMissions.map(mission => ({
        ...mission,
        completed: completedMissionIds.includes(mission.id)
      }));

      setMissions(updatedMissions);
      setTotalPointsToday(totalPoints);
    } catch (error) {
      console.error('Erro ao buscar missões do dia:', error);
      setMissions(defaultMissions);
      setTotalPointsToday(0);
    } finally {
      setLoading(false);
    }
  };

  const completeMission = async (missionId: string, onPointsEarned?: (points: number) => void) => {
    try {
      if (!user) {
        toast.error('Você precisa estar logado para completar missões');
        return;
      }

      const mission = missions.find(m => m.id === missionId);
      if (!mission || mission.completed) return;

      const today = new Date().toISOString().split('T')[0];
      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      const { error } = await supabase
        .from('daily_missions')
        .insert([{
          user_id: profile.data.id,
          mission_id: missionId,
          mission_date: today,
          completed: true,
          points_earned: mission.points,
          completed_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Atualizar pontos do usuário
      await supabase.rpc('update_user_points', {
        p_user_id: profile.data.id,
        p_points: mission.points,
        p_activity_type: 'daily_mission'
      });

      setMissions(prev => prev.map(m => 
        m.id === missionId ? { ...m, completed: true } : m
      ));
      
      setTotalPointsToday(prev => prev + mission.points);
      
      // Chamar callback para atualizar ranking
      if (onPointsUpdate) {
        onPointsUpdate();
      }
      
      if (onPointsEarned) {
        onPointsEarned(mission.points);
      }
      
      toast.success(`Missão completada! +${mission.points} XP`);
    } catch (error) {
      console.error('Erro ao completar missão:', error);
      toast.error('Erro ao completar missão');
    }
  };

  useEffect(() => {
    fetchTodayMissions();
  }, [user]);

  return {
    missions,
    totalPointsToday,
    loading,
    completeMission,
    refetch: fetchTodayMissions
  };
};