import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Função para calcular nível baseado na pontuação
const calculateLevel = (points: number) => {
  if (points < 100) return 1;
  if (points < 300) return 2;
  if (points < 600) return 3;
  if (points < 1000) return 4;
  if (points < 1500) return 5;
  if (points < 2100) return 6;
  if (points < 2800) return 7;
  if (points < 3600) return 8;
  if (points < 4500) return 9;
  return 10;
};

// Função para calcular progresso do nível
const calculateLevelProgress = (points: number) => {
  const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
  const level = calculateLevel(points);
  
  if (level >= 10) return 100;
  
  const currentLevelMin = levelThresholds[level - 1];
  const nextLevelMin = levelThresholds[level];
  
  return Math.round(((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100);
};

export interface RankingUser {
  id: string;
  name: string;
  points: number;
  position: number;
  streak: number;
  completedChallenges: number;
  avatar?: string;
  level: number;
  levelProgress: number;
  lastActive?: string;
  city?: string;
  achievements?: string[];
}

export const useUserPoints = () => {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [currentUserRanking, setCurrentUserRanking] = useState<RankingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Inscrever-se para atualizações em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('public_ranking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_points'
        },
        () => {
          console.log('🔄 Atualização detectada no ranking');
          fetchRanking('week'); // Atualiza o ranking quando houver mudanças
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRanking = async (timeFilter: 'week' | 'month' | 'all' = 'all') => {
    console.log('🏆 Buscando ranking com filtro:', timeFilter);
    try {
      setLoading(true);
      let pointsField = 'total_points';
      
      switch (timeFilter) {
        case 'week':
          pointsField = 'weekly_points';
          break;
        case 'month':
          pointsField = 'monthly_points';
          break;
      }

      // Buscar todos os perfis públicos
      console.log('👥 Buscando perfis públicos...');
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          user_id,
          role,
          city,
          last_active,
          achievements
        `);

      if (error) {
        console.error('❌ Erro ao buscar profiles:', error);
        throw error;
      }

      // Buscar pontos de todos os usuários
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*');

      if (pointsError) {
        console.error('❌ Erro ao buscar pontos:', pointsError);
        throw pointsError;
      }

      // Filtrar apenas usuários ativos e mapear dados
      const validProfiles = profilesData?.filter((profile: any) => 
        profile.role === 'client' && (profile.full_name || profile.email)
      ) || [];

      // Mapear todos os usuários com dados enriquecidos
      const allUsers = validProfiles.map((profile: any) => {
        const userPoints = pointsData?.find((p: any) => p.user_id === profile.id) || {
          total_points: 0,
          weekly_points: 0,
          monthly_points: 0,
          current_streak: 0,
          completed_challenges: 0
        };

        const points = userPoints[pointsField] || 0;
        const level = calculateLevel(points);
        
        return {
          id: profile.user_id,
          name: profile.full_name || profile.email?.split('@')[0] || 'Usuário',
          points,
          streak: userPoints.current_streak || 0,
          completedChallenges: userPoints.completed_challenges || 0,
          level,
          levelProgress: calculateLevelProgress(points),
          lastActive: profile.last_active,
          city: profile.city || 'São Paulo',
          achievements: profile.achievements || [],
        };
      });

      // Ordenar por pontos e atribuir posições
      const sortedUsers = allUsers
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({
          ...user,
          position: index + 1
        }));

      setRanking(sortedUsers);

      // Encontrar usuário atual no ranking
      if (user) {
        const currentUser = sortedUsers.find(u => u.id === user.id);
        setCurrentUserRanking(currentUser || null);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ranking,
    currentUserRanking,
    fetchRanking,
    loading
  };
};