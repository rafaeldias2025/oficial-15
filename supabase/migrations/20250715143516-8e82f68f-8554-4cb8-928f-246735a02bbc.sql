-- Verificar se existem triggers problemáticos na tabela missao_dia
-- e corrigir o problema de campo não encontrado

-- Primeiro, vamos remover triggers problemáticos se existirem
DROP TRIGGER IF EXISTS missao_dia_pontuacao_trigger ON missao_dia;
DROP TRIGGER IF EXISTS sync_pontuacao_trigger ON missao_dia;

-- Recriar trigger com verificação correta de campos
CREATE OR REPLACE FUNCTION public.safe_sync_pontuacao_diaria()
RETURNS TRIGGER AS $function$
BEGIN
  -- Verificar se os campos existem antes de tentar usá-los
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
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
  END IF;

  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

-- Criar trigger corrigido
CREATE TRIGGER safe_sync_pontuacao_trigger
  AFTER INSERT OR UPDATE ON missao_dia
  FOR EACH ROW
  EXECUTE FUNCTION public.safe_sync_pontuacao_diaria();