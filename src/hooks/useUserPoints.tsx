import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  daily_points: number;
  weekly_points: number;
  monthly_points: number;
  current_streak: number;
  best_streak: number;
  completed_challenges: number;
  last_activity_date?: string;
  created_at: string;
  updated_at: string;
}

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
}

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

export const useUserPoints = () => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [currentUserRanking, setCurrentUserRanking] = useState<RankingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserPoints = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setUserPoints(null);
        return;
      }

      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', profile.data.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserPoints(data);
      } else {
        // Criar registro inicial se não existir
        const { data: newRecord, error: insertError } = await supabase
          .from('user_points')
          .insert([{
            user_id: profile.data.id,
            total_points: 0,
            daily_points: 0,
            weekly_points: 0,
            monthly_points: 0,
            current_streak: 0,
            best_streak: 0,
            completed_challenges: 0
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        setUserPoints(newRecord);
      }
    } catch (error) {
      console.error('Erro ao buscar pontos do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRanking = async (timeFilter: 'week' | 'month' | 'all' = 'all') => {
    console.log('🏆 Buscando ranking com filtro:', timeFilter);
    try {
      let pointsField = 'total_points';
      
      switch (timeFilter) {
        case 'week':
          pointsField = 'weekly_points';
          break;
        case 'month':
          pointsField = 'monthly_points';
          break;
      }

      // Buscar TODOS os usuários
      console.log('👥 Buscando TODOS os profiles...');
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          user_id,
          role
        `);

      if (error) {
        console.error('❌ Erro ao buscar profiles:', error);
        throw error;
      }

      console.log('👥 Profiles encontrados:', profilesData?.length || 0);
      console.log('👥 Lista completa de profiles:', profilesData?.map(p => ({ name: p.full_name, email: p.email, role: p.role, user_id: p.user_id })));

      // Buscar pontos de todos os usuários
      console.log('📊 Buscando pontos dos usuários...');
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*');

      if (pointsError) {
        console.error('❌ Erro ao buscar pontos:', pointsError);
        throw pointsError;
      }

      console.log('📊 Pontos encontrados:', pointsData?.length || 0);
      console.log('📊 Lista de pontos:', pointsData?.map(p => ({ user_id: p.user_id, points: p[pointsField] })));

      // Filtrar apenas usuários com role 'client' e mapear TODOS
      const validProfiles = profilesData?.filter((profile: any) => 
        profile.role === 'client' && (profile.full_name || profile.email)
      ) || [];

      console.log('👥 Profiles válidos filtrados:', validProfiles.length);

      // Mapear TODOS os usuários válidos, incluindo aqueles sem pontos
      const allUsers = validProfiles.map((profile: any) => {
        // Buscar pontos pelo profile.id (não user_id)
        const userPoints = pointsData?.find((p: any) => p.user_id === profile.id) || {
          total_points: 0,
          weekly_points: 0,
          monthly_points: 0,
          current_streak: 0,
          completed_challenges: 0
        };

        const points = userPoints[pointsField] || 0;
        const displayName = profile.full_name || profile.email || 'Usuário';
        const mappedUser = {
          id: profile.user_id, // Este é o auth.user.id
          name: displayName,
          points,
          streak: userPoints.current_streak || 0,
          completedChallenges: userPoints.completed_challenges || 0,
          level: calculateLevel(points),
          levelProgress: calculateLevelProgress(points),
        };

        console.log('👤 Mapeando usuário válido:', mappedUser);
        return mappedUser;
      });

      console.log('👥 Total de usuários mapeados:', allUsers.length);

      // Ordenar por pontos (descendente) e atribuir posições
      const sortedUsers = allUsers
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({
          ...user,
          position: index + 1
        }));

      console.log('🏆 Ranking final ordenado:', sortedUsers);
      setRanking(sortedUsers);

      // Encontrar posição do usuário atual
      if (user) {
        const currentUser = sortedUsers.find(u => u.id === user.id);
        console.log('🎯 Usuário atual no ranking:', currentUser);
        setCurrentUserRanking(currentUser || null);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar ranking:', error);
    }
  };

  const initializeAllUserPoints = async () => {
    try {
      console.log('🚀 Inicializando pontos para TODOS os usuários...');
      // Buscar TODOS os usuários que não têm registro na tabela user_points
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, role');

      if (profilesError) throw profilesError;

      console.log('👥 Profiles para inicializar:', profiles?.map(p => ({ name: p.full_name, role: p.role })));

      if (profiles) {
        for (const profile of profiles) {
          // Verificar se já existe registro
          const { data: existingPoints } = await supabase
            .from('user_points')
            .select('id')
            .eq('user_id', profile.id)
            .single();

          // Se não existe, criar registro inicial
          if (!existingPoints) {
            console.log('➕ Criando pontos para:', profile.full_name);
            await supabase
              .from('user_points')
              .insert([{
                user_id: profile.id,
                total_points: 0,
                daily_points: 0,
                weekly_points: 0,
                monthly_points: 0,
                current_streak: 0,
                best_streak: 0,
                completed_challenges: 0
              }]);
          } else {
            console.log('✅ Pontos já existem para:', profile.full_name);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar pontos dos usuários:', error);
    }
  };

  const addPoints = async (points: number, activityType: string = 'general') => {
    try {
      if (!user) return;

      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      await supabase.rpc('update_user_points', {
        p_user_id: profile.data.id,
        p_points: points,
        p_activity_type: activityType
      });

      // Atualizar dados locais e ranking
      await fetchUserPoints();
      await fetchRanking();
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserPoints();
      await initializeAllUserPoints();
      await fetchRanking();
    };
    
    initializeData();
  }, [user]);

  return {
    userPoints,
    ranking,
    currentUserRanking,
    loading,
    addPoints,
    fetchRanking,
    initializeAllUserPoints,
    refetch: fetchUserPoints
  };
};