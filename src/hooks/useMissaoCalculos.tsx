import { useMemo } from 'react';
import { MissaoDia } from '@/hooks/useMissaoDia';

export interface DetalhePontuacao {
  categoria: string;
  pergunta: string;
  pontos: number;
  pontosMaximos: number;
  respondida: boolean;
}

export interface PontuacaoCalculada {
  total: number;
  detalhes: DetalhePontuacao[];
}

// Hook focado apenas em cálculos de pontuação
export const useMissaoCalculos = (missao: MissaoDia | null) => {
  const pontuacaoCalculada = useMemo((): PontuacaoCalculada => {
    if (!missao) return { total: 0, detalhes: [] };
    
    const detalhes: DetalhePontuacao[] = [
      {
        categoria: 'Ritual da Manhã',
        pergunta: 'Primeiro líquido consumido',
        pontos: missao.liquido_ao_acordar === 'Água morna com limão' ? 10 :
                missao.liquido_ao_acordar === 'Chá natural' ? 10 :
                missao.liquido_ao_acordar === 'Café puro' || missao.liquido_ao_acordar === 'Outro' ? 0 : 0,
        pontosMaximos: 10,
        respondida: !!missao.liquido_ao_acordar,
      },
      {
        categoria: 'Ritual da Manhã',
        pergunta: 'Práticas de conexão interna',
        pontos: (missao.pratica_conexao?.includes('Oração') ? 15 : 0) +
                (missao.pratica_conexao?.includes('Meditação') ? 15 : 0) +
                (missao.pratica_conexao?.includes('Respiração consciente') ? 15 : 0),
        pontosMaximos: 15,
        respondida: !!missao.pratica_conexao,
      },
      {
        categoria: 'Ritual da Manhã',
        pergunta: 'Energia ao acordar',
        pontos: missao.energia_ao_acordar === 5 ? 3 :
                missao.energia_ao_acordar === 4 ? 2 :
                missao.energia_ao_acordar === 3 ? 1 :
                missao.energia_ao_acordar === 2 ? 0 :
                missao.energia_ao_acordar === 1 ? -1 : 0,
        pontosMaximos: 3,
        respondida: !!missao.energia_ao_acordar,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Horas de sono',
        pontos: missao.sono_horas && missao.sono_horas >= 8 ? 10 : 0,
        pontosMaximos: 10,
        respondida: !!missao.sono_horas,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Consumo de água',
        pontos: missao.agua_litros === '2L' ? 10 :
                missao.agua_litros === '3L ou mais' ? 10 : 0,
        pontosMaximos: 10,
        respondida: !!missao.agua_litros,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Atividade física',
        pontos: missao.atividade_fisica === true ? 20 : 0,
        pontosMaximos: 20,
        respondida: missao.atividade_fisica !== undefined,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Nível de estresse',
        pontos: missao.estresse_nivel === 1 || missao.estresse_nivel === 2 ? 10 : 0,
        pontosMaximos: 10,
        respondida: !!missao.estresse_nivel,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Fome emocional',
        pontos: missao.fome_emocional === false ? 10 : 0,
        pontosMaximos: 10,
        respondida: missao.fome_emocional !== undefined,
      },
      {
        categoria: 'Mente & Emoções',
        pergunta: 'Gratidão',
        pontos: missao.gratidao ? 10 : 0,
        pontosMaximos: 10,
        respondida: !!missao.gratidao,
      },
      {
        categoria: 'Mente & Emoções',
        pergunta: 'Pequena vitória',
        pontos: missao.pequena_vitoria && missao.pequena_vitoria.trim() ? 10 : 0,
        pontosMaximos: 10,
        respondida: !!missao.pequena_vitoria?.trim(),
      },
      {
        categoria: 'Mente & Emoções',
        pergunta: 'Intenção para amanhã',
        pontos: missao.intencao_para_amanha ? 10 : 0,
        pontosMaximos: 10,
        respondida: !!missao.intencao_para_amanha,
      },
      {
        categoria: 'Mente & Emoções',
        pergunta: 'Avaliação do dia',
        pontos: missao.nota_dia === 5 ? 10 :
                missao.nota_dia === 4 ? 8 :
                missao.nota_dia === 3 ? 6 :
                missao.nota_dia === 2 ? 4 :
                missao.nota_dia === 1 ? 2 : 0,
        pontosMaximos: 10,
        respondida: !!missao.nota_dia,
      },
    ];

    const total = detalhes.reduce((sum, item) => sum + item.pontos, 0);
    return { total, detalhes };
  }, [missao]);

  const progresso = useMemo(() => {
    if (!missao) return 0;
    
    const campos = [
      missao.liquido_ao_acordar,
      missao.pratica_conexao,
      missao.energia_ao_acordar,
      missao.sono_horas,
      missao.agua_litros,
      missao.atividade_fisica,
      missao.estresse_nivel,
      missao.fome_emocional,
      missao.gratidao,
      missao.pequena_vitoria,
      missao.intencao_para_amanha,
      missao.nota_dia
    ];
    
    const preenchidos = campos.filter(campo => 
      campo !== undefined && campo !== null && campo !== ""
    ).length;
    
    return Math.round((preenchidos / campos.length) * 100);
  }, [missao]);

  return {
    pontuacaoCalculada,
    progresso
  };
};