import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { subDays, format } from 'date-fns';
import { useEnhancedPoints, PONTOS_BASE } from './useEnhancedPoints';

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
  const { calcularPontuacaoTotal, getFeedbackAvancado, determinarNivel } = useEnhancedPoints();

  const calcularPontosDiarios = async (missaoDia: any) => {
    let pontos = 0;

    // Líquido ao acordar
    if (missaoDia.liquido_ao_acordar === 'sim') {
      pontos += PONTOS_BASE.liquido_manha;
    }

    // Prática de conexão
    if (missaoDia.pratica_conexao === 'sim') {
      pontos += PONTOS_BASE.conexao_interna;
    }

    // Energia ao acordar
    if (missaoDia.energia_ao_acordar) {
      if (missaoDia.energia_ao_acordar >= 8) {
        pontos += PONTOS_BASE.energia_acordar.alta;
      } else if (missaoDia.energia_ao_acordar >= 5) {
        pontos += PONTOS_BASE.energia_acordar.media;
      } else {
        pontos += PONTOS_BASE.energia_acordar.baixa;
      }
    }

    // Sono
    if (missaoDia.sono_horas) {
      if (missaoDia.sono_horas >= 8) {
        pontos += PONTOS_BASE.sono.mais8;
      } else if (missaoDia.sono_horas >= 6) {
        pontos += PONTOS_BASE.sono.entre6e8;
      } else {
        pontos += PONTOS_BASE.sono.menos6;
      }
    }

    // Água
    if (missaoDia.agua_litros) {
      const litros = parseFloat(missaoDia.agua_litros);
      pontos += Math.floor(litros * PONTOS_BASE.agua.por_litro);
      if (litros >= 2) {
        pontos += PONTOS_BASE.agua.bonus_meta;
      }
    }

    // Atividade física
    if (missaoDia.atividade_fisica) {
      pontos += PONTOS_BASE.atividade_fisica;
    }

    // Nível de estresse
    if (missaoDia.estresse_nivel && missaoDia.estresse_nivel <= 5) {
      pontos += PONTOS_BASE.sem_estresse;
    }

    // Fome emocional
    if (missaoDia.fome_emocional === false) {
      pontos += PONTOS_BASE.controle_fome;
    }

    // Gratidão
    if (missaoDia.gratidao?.length > 10) {
      pontos += PONTOS_BASE.gratidao;
    }

    // Pequena vitória
    if (missaoDia.pequena_vitoria?.length > 5) {
      pontos += PONTOS_BASE.pequena_vitoria;
    }

    // Intenção para amanhã
    if (missaoDia.intencao_para_amanha?.length > 5) {
      pontos += PONTOS_BASE.intencao_amanha;
    }

    // Nota do dia
    if (missaoDia.nota_dia && missaoDia.nota_dia >= 7) {
      pontos += PONTOS_BASE.avaliacao_dia;
    }

    // Aplicar multiplicadores e bônus
    const pontuacaoFinal = await calcularPontuacaoTotal(pontos);

    return {
      pontos_liquido_manha: missaoDia.liquido_ao_acordar === 'sim' ? PONTOS_BASE.liquido_manha : 0,
      pontos_conexao_interna: missaoDia.pratica_conexao === 'sim' ? PONTOS_BASE.conexao_interna : 0,
      pontos_energia_acordar: missaoDia.energia_ao_acordar ? 
        (missaoDia.energia_ao_acordar >= 8 ? PONTOS_BASE.energia_acordar.alta : 
         missaoDia.energia_ao_acordar >= 5 ? PONTOS_BASE.energia_acordar.media : 
         PONTOS_BASE.energia_acordar.baixa) : 0,
      pontos_sono: missaoDia.sono_horas ? 
        (missaoDia.sono_horas >= 8 ? PONTOS_BASE.sono.mais8 : 
         missaoDia.sono_horas >= 6 ? PONTOS_BASE.sono.entre6e8 : 
         PONTOS_BASE.sono.menos6) : 0,
      pontos_agua: missaoDia.agua_litros ? 
        Math.floor(parseFloat(missaoDia.agua_litros) * PONTOS_BASE.agua.por_litro) + 
        (parseFloat(missaoDia.agua_litros) >= 2 ? PONTOS_BASE.agua.bonus_meta : 0) : 0,
      pontos_atividade_fisica: missaoDia.atividade_fisica ? PONTOS_BASE.atividade_fisica : 0,
      pontos_estresse: missaoDia.estresse_nivel && missaoDia.estresse_nivel <= 5 ? PONTOS_BASE.sem_estresse : 0,
      pontos_fome_emocional: missaoDia.fome_emocional === false ? PONTOS_BASE.controle_fome : 0,
      pontos_gratidao: missaoDia.gratidao?.length > 10 ? PONTOS_BASE.gratidao : 0,
      pontos_pequena_vitoria: missaoDia.pequena_vitoria?.length > 5 ? PONTOS_BASE.pequena_vitoria : 0,
      pontos_intencao_amanha: missaoDia.intencao_para_amanha?.length > 5 ? PONTOS_BASE.intencao_amanha : 0,
      pontos_avaliacao_dia: missaoDia.nota_dia && missaoDia.nota_dia >= 7 ? PONTOS_BASE.avaliacao_dia : 0,
      total_pontos_dia: pontuacaoFinal,
      categoria_dia: pontuacaoFinal >= 100 ? 'excelente' : 
                    pontuacaoFinal >= 60 ? 'medio' : 'baixa'
    };
  };

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

  const criarPontuacaoMutation = useMutation({
    mutationFn: async (missaoDia: any) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const pontuacao = await calcularPontosDiarios(missaoDia);

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
      queryClient.invalidateQueries({ queryKey: ['ranking-avancado'] });
    },
  });

  const atualizarPontuacaoMutation = useMutation({
    mutationFn: async (missaoDia: any) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const pontuacao = await calcularPontosDiarios(missaoDia);

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
      queryClient.invalidateQueries({ queryKey: ['ranking-avancado'] });
    },
  });

  return {
    pontuacaoHoje,
    historicoPontuacao,
    isLoadingHoje,
    isLoadingHistorico,
    criarPontuacao: criarPontuacaoMutation.mutate,
    atualizarPontuacao: atualizarPontuacaoMutation.mutate,
    getFeedbackAvancado,
    determinarNivel,
  };
};