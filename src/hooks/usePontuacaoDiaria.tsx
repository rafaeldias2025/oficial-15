import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { subDays, format } from 'date-fns';

export interface PontuacaoDiaria {
  id: string;
  user_id: string;
  data: string;
  pontos_liquido_manha: number;
  pontos_conexao_interna: number;
  pontos_energia_acordar: number;
  pontos_sono: number;
  pontos_agua: number;
  pontos_atividade_fisica: number;
  pontos_estresse: number;
  pontos_fome_emocional: number;
  pontos_gratidao: number;
  pontos_pequena_vitoria: number;
  pontos_intencao_amanha: number;
  pontos_avaliacao_dia: number;
  total_pontos_dia: number;
  categoria_dia: 'baixa' | 'medio' | 'excelente';
  created_at: string;
  updated_at: string;
}

export const usePontuacaoDiaria = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: pontuacaoHoje, isLoading: isLoadingHoje } = useQuery({
    queryKey: ['pontuacao-diaria', user?.id, format(new Date(), 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .select('*')
        .eq('user_id', user.id)
        .eq('data', format(new Date(), 'yyyy-MM-dd'))
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar pontuação de hoje:', error);
        return null;
      }

      return data as PontuacaoDiaria | null;
    },
    enabled: !!user?.id,
  });

  const { data: historicoPontuacao, isLoading: isLoadingHistorico } = useQuery({
    queryKey: ['historico-pontuacao', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const dataInicio = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .select('*')
        .eq('user_id', user.id)
        .gte('data', dataInicio)
        .order('data', { ascending: true });

      if (error) {
        console.error('Erro ao buscar histórico de pontuação:', error);
        return [];
      }

      return data as PontuacaoDiaria[];
    },
    enabled: !!user?.id,
  });

  const { data: rankingSemanal, isLoading: isLoadingRanking } = useQuery({
    queryKey: ['ranking-semanal'],
    queryFn: async () => {
      const dataInicio = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .select(`
          user_id,
          total_pontos_dia,
          data,
          profiles!inner(full_name, email)
        `)
        .gte('data', dataInicio)
        .order('total_pontos_dia', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ranking semanal:', error);
        return [];
      }

      // Agrupar por usuário e calcular média semanal
      const rankingAgrupado = data.reduce((acc: any, item: any) => {
        const userId = item.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            nome: item.profiles.full_name || item.profiles.email,
            pontos: [],
            total_pontos: 0,
            media_semanal: 0,
          };
        }
        acc[userId].pontos.push(item.total_pontos_dia);
        acc[userId].total_pontos += item.total_pontos_dia;
        return acc;
      }, {});

      // Calcular média e ordenar
      const rankingFinal = Object.values(rankingAgrupado).map((user: any) => ({
        ...user,
        media_semanal: Math.round(user.total_pontos / user.pontos.length),
      })).sort((a: any, b: any) => b.media_semanal - a.media_semanal);

      return rankingFinal;
    },
  });

  const criarPontuacaoMutation = useMutation({
    mutationFn: async (pontuacao: Partial<PontuacaoDiaria>) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .insert({
          user_id: user.id,
          data: format(new Date(), 'yyyy-MM-dd'),
          ...pontuacao,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pontuacao-diaria'] });
      queryClient.invalidateQueries({ queryKey: ['historico-pontuacao'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-semanal'] });
    },
  });

  const atualizarPontuacaoMutation = useMutation({
    mutationFn: async (pontuacao: Partial<PontuacaoDiaria>) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .update(pontuacao)
        .eq('user_id', user.id)
        .eq('data', format(new Date(), 'yyyy-MM-dd'))
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pontuacao-diaria'] });
      queryClient.invalidateQueries({ queryKey: ['historico-pontuacao'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-semanal'] });
    },
  });

  const getFeedbackPontuacao = (pontos: number) => {
    if (pontos >= 100) {
      return {
        emoji: '🟢',
        mensagem: 'Perfeito! Sua dedicação está transformando sua vida!',
        cor: 'text-green-600',
        categoria: 'excelente' as const,
      };
    } else if (pontos >= 80) {
      return {
        emoji: '🟡',
        mensagem: 'Excelente progresso! Você está no caminho certo.',
        cor: 'text-yellow-600',
        categoria: 'medio' as const,
      };
    } else if (pontos >= 60) {
      return {
        emoji: '🟠',
        mensagem: 'Bom trabalho! Continue assim.',
        cor: 'text-orange-600',
        categoria: 'medio' as const,
      };
    } else {
      return {
        emoji: '🔴',
        mensagem: 'Hoje foi difícil, mas você não desistiu! Amanhã é uma nova oportunidade.',
        cor: 'text-red-600',
        categoria: 'baixa' as const,
      };
    }
  };

  return {
    pontuacaoHoje,
    historicoPontuacao,
    rankingSemanal,
    isLoadingHoje,
    isLoadingHistorico,
    isLoadingRanking,
    criarPontuacao: criarPontuacaoMutation.mutate,
    atualizarPontuacao: atualizarPontuacaoMutation.mutate,
    getFeedbackPontuacao,
  };
};