import { useState, useEffect, useCallback } from 'react';
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

  // Função para gerar dados fictícios de demonstração
  const generateDemoRanking = (): RankingUser[] => {
    const demoNames = [
      'Ana Silva', 'Carlos Santos', 'Maria Costa', 'João Ferreira', 'Paula Oliveira',
      'Roberto Silva', 'Fernanda Lima', 'Pedro Almeida', 'Juliana Rocha', 'Rafael Mendes',
      'Camila Souza', 'Diego Barbosa', 'Larissa Pereira', 'Thiago Martins', 'Bianca Cardoso',
      'Lucas Rodrigues', 'Mariana Gomes', 'Bruno Nascimento', 'Gabriela Freitas', 'Vinicius Torres'
    ];

    const cities = [
      'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília',
      'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus'
    ];

    return demoNames.map((name, index) => {
      const points = Math.floor(Math.random() * 5000) + 500;
      const level = calculateLevel(points);
      
      return {
        id: `demo_${index + 1}`,
        name,
        points,
        position: index + 1,
        streak: Math.floor(Math.random() * 30) + 1,
        completedChallenges: Math.floor(Math.random() * 50) + 5,
        level,
        levelProgress: calculateLevelProgress(points),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        city: cities[index % cities.length],
        achievements: ['demo_user']
      };
    }).sort((a, b) => b.points - a.points).map((user, index) => ({
      ...user,
      position: index + 1
    }));
  };

  const fetchRanking = useCallback(async (timeFilter: 'week' | 'month' | 'all' = 'all') => {
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
          role
        `);

      if (error) {
        console.error('❌ Erro ao buscar profiles:', error);
        // Em caso de erro, usar dados fictícios para demonstração
        const demoUsers = generateDemoRanking();
        setRanking(demoUsers);
        setLoading(false);
        return;
      }

      // Buscar pontos de todos os usuários
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*');

      if (pointsError) {
        console.error('❌ Erro ao buscar pontos:', pointsError);
        // Em caso de erro, usar dados fictícios para demonstração
        const demoUsers = generateDemoRanking();
        setRanking(demoUsers);
        setLoading(false);
        return;
      }

      // Filtrar apenas usuários ativos e mapear dados
      const validProfiles = profilesData?.filter((profile: any) => 
        profile.role === 'client' && (profile.full_name || profile.email)
      ) || [];

      // Se não há usuários válidos, usar dados fictícios
      if (validProfiles.length === 0) {
        console.log('📊 Nenhum usuário encontrado, usando dados fictícios');
        const demoUsers = generateDemoRanking();
        setRanking(demoUsers);
        setLoading(false);
        return;
      }

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
          lastActive: new Date().toISOString(), // Valor padrão
          city: 'São Paulo', // Valor padrão
          achievements: [], // Valor padrão
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
      // Em caso de erro, usar dados fictícios para demonstração
      const demoUsers = generateDemoRanking();
      setRanking(demoUsers);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
          // Evitar dependência circular - usar callback direto
          fetchRanking('all');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRanking]);

  return {
    ranking,
    currentUserRanking,
    fetchRanking,
    loading
  };
};