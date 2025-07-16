-- Criar tabela para pontuação diária da missão do dia
CREATE TABLE public.pontuacao_diaria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  pontos_liquido_manha INTEGER DEFAULT 0,
  pontos_conexao_interna INTEGER DEFAULT 0,
  pontos_energia_acordar INTEGER DEFAULT 0,
  pontos_sono INTEGER DEFAULT 0,
  pontos_agua INTEGER DEFAULT 0,
  pontos_atividade_fisica INTEGER DEFAULT 0,
  pontos_estresse INTEGER DEFAULT 0,
  pontos_fome_emocional INTEGER DEFAULT 0,
  pontos_gratidao INTEGER DEFAULT 0,
  pontos_pequena_vitoria INTEGER DEFAULT 0,
  pontos_intencao_amanha INTEGER DEFAULT 0,
  pontos_avaliacao_dia INTEGER DEFAULT 0,
  total_pontos_dia INTEGER DEFAULT 0,
  categoria_dia TEXT DEFAULT 'baixa',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, data)
);

-- Habilitar RLS
ALTER TABLE public.pontuacao_diaria ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own daily scores"
ON public.pontuacao_diaria
FOR SELECT
USING (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create their own daily scores"
ON public.pontuacao_diaria
FOR INSERT
WITH CHECK (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update their own daily scores"
ON public.pontuacao_diaria
FOR UPDATE
USING (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can view all daily scores"
ON public.pontuacao_diaria
FOR SELECT
USING (is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pontuacao_diaria_updated_at
  BEFORE UPDATE ON public.pontuacao_diaria
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para calcular pontuação automática
CREATE OR REPLACE FUNCTION public.calcular_pontuacao_missao_dia()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular pontos líquido da manhã
  NEW.pontos_liquido_manha = CASE 
    WHEN NEW.liquido_ao_acordar ILIKE '%água morna com limão%' THEN 2
    WHEN NEW.liquido_ao_acordar ILIKE '%chá natural%' THEN 1
    WHEN NEW.liquido_ao_acordar ILIKE '%café puro%' OR NEW.liquido_ao_acordar ILIKE '%outro%' THEN -1
    ELSE 0
  END;

  -- Calcular pontos conexão interna (soma cumulativa)
  NEW.pontos_conexao_interna = 0;
  IF NEW.pratica_conexao ILIKE '%oração%' THEN
    NEW.pontos_conexao_interna = NEW.pontos_conexao_interna + 2;
  END IF;
  IF NEW.pratica_conexao ILIKE '%meditação%' THEN
    NEW.pontos_conexao_interna = NEW.pontos_conexao_interna + 2;
  END IF;
  IF NEW.pratica_conexao ILIKE '%respiração consciente%' THEN
    NEW.pontos_conexao_interna = NEW.pontos_conexao_interna + 2;
  END IF;

  -- Calcular pontos energia ao acordar
  NEW.pontos_energia_acordar = CASE 
    WHEN NEW.energia_ao_acordar = 1 THEN -1
    WHEN NEW.energia_ao_acordar = 2 THEN 0
    WHEN NEW.energia_ao_acordar = 3 THEN 1
    WHEN NEW.energia_ao_acordar = 4 THEN 2
    WHEN NEW.energia_ao_acordar = 5 THEN 3
    ELSE 0
  END;

  -- Calcular pontos sono
  NEW.pontos_sono = CASE 
    WHEN NEW.sono_horas <= 4 THEN -1
    WHEN NEW.sono_horas = 6 THEN 1
    WHEN NEW.sono_horas >= 8 THEN 2
    ELSE 0
  END;

  -- Calcular pontos água
  NEW.pontos_agua = CASE 
    WHEN NEW.agua_litros ILIKE '%<500ml%' OR NEW.agua_litros ILIKE '%menos%' THEN -1
    WHEN NEW.agua_litros ILIKE '%1L%' THEN 1
    WHEN NEW.agua_litros ILIKE '%2L%' THEN 2
    WHEN NEW.agua_litros ILIKE '%3L%' OR NEW.agua_litros ILIKE '%mais%' THEN 3
    ELSE 0
  END;

  -- Calcular pontos atividade física
  NEW.pontos_atividade_fisica = CASE 
    WHEN NEW.atividade_fisica = true THEN 2
    ELSE 0
  END;

  -- Calcular pontos estresse
  NEW.pontos_estresse = CASE 
    WHEN NEW.estresse_nivel = 1 THEN 3
    WHEN NEW.estresse_nivel = 2 THEN 2
    WHEN NEW.estresse_nivel = 3 THEN 1
    WHEN NEW.estresse_nivel = 4 THEN 0
    WHEN NEW.estresse_nivel = 5 THEN -1
    ELSE 0
  END;

  -- Calcular pontos fome emocional
  NEW.pontos_fome_emocional = CASE 
    WHEN NEW.fome_emocional = true THEN -1
    WHEN NEW.fome_emocional = false THEN 2
    ELSE 0
  END;

  -- Calcular pontos gratidão
  NEW.pontos_gratidao = CASE 
    WHEN NEW.gratidao IS NOT NULL AND LENGTH(TRIM(NEW.gratidao)) > 0 THEN 1
    ELSE 0
  END;

  -- Calcular pontos pequena vitória
  NEW.pontos_pequena_vitoria = CASE 
    WHEN NEW.pequena_vitoria IS NOT NULL AND LENGTH(TRIM(NEW.pequena_vitoria)) > 0 THEN 2
    ELSE 0
  END;

  -- Calcular pontos intenção para amanhã
  NEW.pontos_intencao_amanha = CASE 
    WHEN NEW.intencao_para_amanha IS NOT NULL AND LENGTH(TRIM(NEW.intencao_para_amanha)) > 0 THEN 1
    ELSE 0
  END;

  -- Calcular pontos avaliação do dia
  NEW.pontos_avaliacao_dia = CASE 
    WHEN NEW.nota_dia = 1 THEN 0
    WHEN NEW.nota_dia = 2 THEN 1
    WHEN NEW.nota_dia = 3 THEN 2
    WHEN NEW.nota_dia = 4 THEN 3
    WHEN NEW.nota_dia = 5 THEN 4
    ELSE 0
  END;

  -- Calcular total de pontos
  NEW.total_pontos_dia = 
    COALESCE(NEW.pontos_liquido_manha, 0) +
    COALESCE(NEW.pontos_conexao_interna, 0) +
    COALESCE(NEW.pontos_energia_acordar, 0) +
    COALESCE(NEW.pontos_sono, 0) +
    COALESCE(NEW.pontos_agua, 0) +
    COALESCE(NEW.pontos_atividade_fisica, 0) +
    COALESCE(NEW.pontos_estresse, 0) +
    COALESCE(NEW.pontos_fome_emocional, 0) +
    COALESCE(NEW.pontos_gratidao, 0) +
    COALESCE(NEW.pontos_pequena_vitoria, 0) +
    COALESCE(NEW.pontos_intencao_amanha, 0) +
    COALESCE(NEW.pontos_avaliacao_dia, 0);

  -- Definir categoria do dia
  NEW.categoria_dia = CASE 
    WHEN NEW.total_pontos_dia >= 21 THEN 'excelente'
    WHEN NEW.total_pontos_dia >= 11 THEN 'medio'
    ELSE 'baixa'
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar pontuação automaticamente
CREATE TRIGGER calculate_daily_score_trigger
  BEFORE INSERT OR UPDATE ON public.pontuacao_diaria
  FOR EACH ROW
  EXECUTE FUNCTION public.calcular_pontuacao_missao_dia();

-- Inserir pontuação diária quando missão do dia é salva
CREATE OR REPLACE FUNCTION public.sync_pontuacao_diaria()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.pontuacao_diaria (
    user_id, data, pontos_liquido_manha, pontos_conexao_interna, pontos_energia_acordar,
    pontos_sono, pontos_agua, pontos_atividade_fisica, pontos_estresse, pontos_fome_emocional,
    pontos_gratidao, pontos_pequena_vitoria, pontos_intencao_amanha, pontos_avaliacao_dia
  )
  VALUES (
    NEW.user_id, NEW.data, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  )
  ON CONFLICT (user_id, data) DO UPDATE SET
    pontos_liquido_manha = CASE 
      WHEN NEW.liquido_ao_acordar ILIKE '%água morna com limão%' THEN 2
      WHEN NEW.liquido_ao_acordar ILIKE '%chá natural%' THEN 1
      WHEN NEW.liquido_ao_acordar ILIKE '%café puro%' OR NEW.liquido_ao_acordar ILIKE '%outro%' THEN -1
      ELSE 0
    END,
    pontos_conexao_interna = (
      CASE WHEN NEW.pratica_conexao ILIKE '%oração%' THEN 2 ELSE 0 END +
      CASE WHEN NEW.pratica_conexao ILIKE '%meditação%' THEN 2 ELSE 0 END +
      CASE WHEN NEW.pratica_conexao ILIKE '%respiração consciente%' THEN 2 ELSE 0 END
    ),
    pontos_energia_acordar = CASE 
      WHEN NEW.energia_ao_acordar = 1 THEN -1
      WHEN NEW.energia_ao_acordar = 2 THEN 0
      WHEN NEW.energia_ao_acordar = 3 THEN 1
      WHEN NEW.energia_ao_acordar = 4 THEN 2
      WHEN NEW.energia_ao_acordar = 5 THEN 3
      ELSE 0
    END,
    pontos_sono = CASE 
      WHEN NEW.sono_horas <= 4 THEN -1
      WHEN NEW.sono_horas = 6 THEN 1
      WHEN NEW.sono_horas >= 8 THEN 2
      ELSE 0
    END,
    pontos_agua = CASE 
      WHEN NEW.agua_litros ILIKE '%<500ml%' OR NEW.agua_litros ILIKE '%menos%' THEN -1
      WHEN NEW.agua_litros ILIKE '%1L%' THEN 1
      WHEN NEW.agua_litros ILIKE '%2L%' THEN 2
      WHEN NEW.agua_litros ILIKE '%3L%' OR NEW.agua_litros ILIKE '%mais%' THEN 3
      ELSE 0
    END,
    pontos_atividade_fisica = CASE WHEN NEW.atividade_fisica = true THEN 2 ELSE 0 END,
    pontos_estresse = CASE 
      WHEN NEW.estresse_nivel = 1 THEN 3
      WHEN NEW.estresse_nivel = 2 THEN 2
      WHEN NEW.estresse_nivel = 3 THEN 1
      WHEN NEW.estresse_nivel = 4 THEN 0
      WHEN NEW.estresse_nivel = 5 THEN -1
      ELSE 0
    END,
    pontos_fome_emocional = CASE 
      WHEN NEW.fome_emocional = true THEN -1
      WHEN NEW.fome_emocional = false THEN 2
      ELSE 0
    END,
    pontos_gratidao = CASE 
      WHEN NEW.gratidao IS NOT NULL AND LENGTH(TRIM(NEW.gratidao)) > 0 THEN 1
      ELSE 0
    END,
    pontos_pequena_vitoria = CASE 
      WHEN NEW.pequena_vitoria IS NOT NULL AND LENGTH(TRIM(NEW.pequena_vitoria)) > 0 THEN 2
      ELSE 0
    END,
    pontos_intencao_amanha = CASE 
      WHEN NEW.intencao_para_amanha IS NOT NULL AND LENGTH(TRIM(NEW.intencao_para_amanha)) > 0 THEN 1
      ELSE 0
    END,
    pontos_avaliacao_dia = CASE 
      WHEN NEW.nota_dia = 1 THEN 0
      WHEN NEW.nota_dia = 2 THEN 1
      WHEN NEW.nota_dia = 3 THEN 2
      WHEN NEW.nota_dia = 4 THEN 3
      WHEN NEW.nota_dia = 5 THEN 4
      ELSE 0
    END,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para sincronizar pontuação quando missão do dia é salva
CREATE TRIGGER sync_daily_score_trigger
  AFTER INSERT OR UPDATE ON public.missao_dia
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_pontuacao_diaria();