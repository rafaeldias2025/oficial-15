import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { subDays, format, differenceInDays } from 'date-fns';

// Configurações do Sistema de Pontuação
export const MULTIPLICADORES = {
  SEQUENCIA_DIAS: 1.5,    // Multiplicador para dias consecutivos
  HORARIO_NOBRE: 2.0,     // Multiplicador para atividades em horários específicos (5-8h)
  DESAFIO_COMPLETO: 3.0,  // Multiplicador para completar desafios
  COMBO_PERFEITO: 4.0     // Multiplicador para completar todas as atividades do dia
};

export const NIVEIS = {
  INICIANTE: { min: 0, max: 1000, titulo: "Borboleta Iniciante", cor: "text-gray-500" },
  BRONZE: { min: 1001, max: 5000, titulo: "Borboleta Bronze", cor: "text-amber-600" },
  PRATA: { min: 5001, max: 10000, titulo: "Borboleta Prata", cor: "text-gray-400" },
  OURO: { min: 10001, max: 20000, titulo: "Borboleta Ouro", cor: "text-yellow-500" },
  PLATINA: { min: 20001, max: 50000, titulo: "Borboleta Platina", cor: "text-cyan-400" },
  DIAMANTE: { min: 50001, max: Infinity, titulo: "Borboleta Diamante", cor: "text-blue-500" }
};

export const PONTOS_BASE = {
  liquido_manha: 20,
  conexao_interna: 25,
  energia_acordar: {
    baixa: 10,
    media: 20,
    alta: 30
  },
  sono: {
    menos6: 10,
    entre6e8: 25,
    mais8: 30
  },
  agua: {
    por_litro: 15,
    bonus_meta: 30
  },
  atividade_fisica: 50,
  sem_estresse: 40,
  controle_fome: 35,
  gratidao: 30,
  pequena_vitoria: 25,
  intencao_amanha: 20,
  avaliacao_dia: 25
};

export const useEnhancedPoints = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Calcula multiplicador baseado na sequência de dias
  const calcularMultiplicadorSequencia = async (userId: string) => {
    const { data: ultimosPontos } = await supabase
      .from('pontuacao_diaria')
      .select('data, total_pontos_dia')
      .eq('user_id', userId)
      .order('data', { ascending: false })
      .limit(30);

    if (!ultimosPontos?.length) return 1;

    let sequencia = 1;
    for (let i = 1; i < ultimosPontos.length; i++) {
      const diff = differenceInDays(
        new Date(ultimosPontos[i-1].data),
        new Date(ultimosPontos[i].data)
      );
      if (diff === 1) sequencia++;
      else break;
    }

    return Math.min(1 + (sequencia * 0.1), MULTIPLICADORES.SEQUENCIA_DIAS);
  };

  // Verifica se é horário nobre (5-8h da manhã)
  const isHorarioNobre = () => {
    const hora = new Date().getHours();
    return hora >= 5 && hora <= 8;
  };

  // Calcula pontuação com multiplicadores
  const calcularPontuacaoTotal = async (pontuacaoBase: number) => {
    if (!user?.id) return pontuacaoBase;

    const multiplicadorSequencia = await calcularMultiplicadorSequencia(user.id);
    const multiplicadorHorario = isHorarioNobre() ? MULTIPLICADORES.HORARIO_NOBRE : 1;

    let pontuacaoFinal = pontuacaoBase * multiplicadorSequencia * multiplicadorHorario;

    // Bônus para pontuação perfeita
    if (pontuacaoBase >= 100) {
      pontuacaoFinal *= MULTIPLICADORES.COMBO_PERFEITO;
    }

    return Math.round(pontuacaoFinal);
  };

  // Determina o nível atual do usuário
  const determinarNivel = (pontuacaoTotal: number) => {
    return Object.entries(NIVEIS).find(
      ([_, nivel]) => pontuacaoTotal >= nivel.min && pontuacaoTotal <= nivel.max
    )?.[1] || NIVEIS.INICIANTE;
  };

  // Busca ranking com níveis e multiplicadores
  const { data: rankingAvancado, isLoading: isLoadingRanking } = useQuery({
    queryKey: ['ranking-avancado'],
    queryFn: async () => {
      const dataInicio = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      
      const { data: pontuacoes } = await supabase
        .from('pontuacao_diaria')
        .select(`
          user_id,
          total_pontos_dia,
          data,
          profiles!inner(full_name, email)
        `)
        .gte('data', dataInicio);

      if (!pontuacoes) return [];

      // Agrupa por usuário e calcula estatísticas
      const rankingProcessado = pontuacoes.reduce((acc: any, item: any) => {
        const userId = item.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            nome: item.profiles.full_name || item.profiles.email,
            pontuacao_total: 0,
            maior_pontuacao: 0,
            dias_consecutivos: 0,
            media_semanal: 0,
            pontuacoes: []
          };
        }

        acc[userId].pontuacao_total += item.total_pontos_dia;
        acc[userId].maior_pontuacao = Math.max(acc[userId].maior_pontuacao, item.total_pontos_dia);
        acc[userId].pontuacoes.push(item.total_pontos_dia);
        
        return acc;
      }, {});

      // Calcula estatísticas finais e níveis
      return Object.values(rankingProcessado)
        .map((usuario: any) => ({
          ...usuario,
          media_semanal: Math.round(usuario.pontuacao_total / usuario.pontuacoes.length),
          nivel: determinarNivel(usuario.pontuacao_total)
        }))
        .sort((a: any, b: any) => b.pontuacao_total - a.pontuacao_total);
    },
  });

  // Feedback personalizado baseado no nível e pontuação
  const getFeedbackAvancado = (pontos: number, nivel: any) => {
    const feedbacks = {
      baixo: {
        mensagem: "Continue tentando! Cada pequeno progresso conta.",
        emoji: "🌱"
      },
      medio: {
        mensagem: "Você está evoluindo! Mantenha o foco!",
        emoji: "🦋"
      },
      alto: {
        mensagem: "Impressionante! Sua dedicação está fazendo a diferença!",
        emoji: "⭐"
      },
      perfeito: {
        mensagem: "EXTRAORDINÁRIO! Você é uma inspiração!",
        emoji: "🌟"
      }
    };

    if (pontos >= 100) return feedbacks.perfeito;
    if (pontos >= 80) return feedbacks.alto;
    if (pontos >= 60) return feedbacks.medio;
    return feedbacks.baixo;
  };

  return {
    rankingAvancado,
    isLoadingRanking,
    calcularPontuacaoTotal,
    determinarNivel,
    getFeedbackAvancado,
    MULTIPLICADORES,
    NIVEIS,
    PONTOS_BASE
  };
}; 