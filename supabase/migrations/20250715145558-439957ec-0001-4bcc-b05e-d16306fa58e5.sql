-- Remover o trigger simples atual
DROP TRIGGER IF EXISTS simple_mission_points_trigger ON missao_dia;
DROP FUNCTION IF EXISTS public.simple_update_points_on_mission();

-- Criar função que calcula pontos detalhados
CREATE OR REPLACE FUNCTION public.calcular_pontos_missao_detalhado(missao_data missao_dia)
RETURNS INTEGER AS $$
DECLARE
  total_pontos INTEGER := 0;
  praticas_conexao_pontos INTEGER := 0;
BEGIN
  -- Ritual da Manhã
  -- Primeiro líquido consumido
  CASE missao_data.liquido_ao_acordar
    WHEN 'Água morna com limão' THEN total_pontos := total_pontos + 10;
    WHEN 'Chá natural' THEN total_pontos := total_pontos + 10;
    WHEN 'Café puro', 'Outro' THEN total_pontos := total_pontos + 0;
  END CASE;

  -- Práticas de conexão interna (cumulativo)
  IF missao_data.pratica_conexao ILIKE '%Oração%' THEN
    praticas_conexao_pontos := praticas_conexao_pontos + 15;
  END IF;
  IF missao_data.pratica_conexao ILIKE '%Meditação%' THEN
    praticas_conexao_pontos := praticas_conexao_pontos + 15;
  END IF;
  IF missao_data.pratica_conexao ILIKE '%Respiração consciente%' THEN
    praticas_conexao_pontos := praticas_conexao_pontos + 15;
  END IF;
  -- Máximo de 15 pontos para práticas de conexão
  total_pontos := total_pontos + LEAST(praticas_conexao_pontos, 15);

  -- Energia ao acordar
  CASE missao_data.energia_ao_acordar
    WHEN 5 THEN total_pontos := total_pontos + 3;
    WHEN 4 THEN total_pontos := total_pontos + 2;
    WHEN 3 THEN total_pontos := total_pontos + 1;
    WHEN 2 THEN total_pontos := total_pontos + 0;
    WHEN 1 THEN total_pontos := total_pontos - 1;
  END CASE;

  -- Hábitos do Dia
  -- Horas de sono
  IF missao_data.sono_horas >= 8 THEN
    total_pontos := total_pontos + 10;
  END IF;

  -- Consumo de água
  CASE missao_data.agua_litros
    WHEN '2L', '3L ou mais' THEN total_pontos := total_pontos + 10;
  END CASE;

  -- Atividade física
  IF missao_data.atividade_fisica = true THEN
    total_pontos := total_pontos + 20;
  END IF;

  -- Nível de estresse
  IF missao_data.estresse_nivel IN (1, 2) THEN
    total_pontos := total_pontos + 10;
  END IF;

  -- Fome emocional
  IF missao_data.fome_emocional = false THEN
    total_pontos := total_pontos + 10;
  END IF;

  -- Mente & Emoções
  -- Gratidão
  IF missao_data.gratidao IS NOT NULL AND LENGTH(TRIM(missao_data.gratidao)) > 0 THEN
    total_pontos := total_pontos + 10;
  END IF;

  -- Pequena vitória
  IF missao_data.pequena_vitoria IS NOT NULL AND LENGTH(TRIM(missao_data.pequena_vitoria)) > 0 THEN
    total_pontos := total_pontos + 10;
  END IF;

  -- Intenção para amanhã
  IF missao_data.intencao_para_amanha IS NOT NULL AND LENGTH(TRIM(missao_data.intencao_para_amanha)) > 0 THEN
    total_pontos := total_pontos + 10;
  END IF;

  -- Avaliação do dia
  CASE missao_data.nota_dia
    WHEN 5 THEN total_pontos := total_pontos + 10;
    WHEN 4 THEN total_pontos := total_pontos + 8;
    WHEN 3 THEN total_pontos := total_pontos + 6;
    WHEN 2 THEN total_pontos := total_pontos + 4;
    WHEN 1 THEN total_pontos := total_pontos + 2;
  END CASE;

  RETURN total_pontos;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger integrado que usa pontos calculados
CREATE OR REPLACE FUNCTION public.integrated_mission_points_trigger()
RETURNS TRIGGER AS $$
DECLARE
  pontos_calculados INTEGER;
BEGIN
  -- Só atualizar pontos quando a missão for concluída
  IF NEW.concluido = true AND (OLD.concluido IS NULL OR OLD.concluido = false) THEN
    -- Calcular pontos detalhados
    pontos_calculados := calcular_pontos_missao_detalhado(NEW);
    
    -- Atualizar pontos do usuário com valor calculado
    PERFORM update_user_points(NEW.user_id, pontos_calculados, 'mission_completion');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger integrado
CREATE TRIGGER integrated_mission_points_trigger
  AFTER UPDATE ON missao_dia
  FOR EACH ROW
  EXECUTE FUNCTION public.integrated_mission_points_trigger();