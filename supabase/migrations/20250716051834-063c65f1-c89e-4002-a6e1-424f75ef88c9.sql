-- Remover triggers e funções problemáticos com CASCADE
DROP FUNCTION IF EXISTS public.atualizar_historico_medidas() CASCADE;

-- Adicionar campos nome_usuario nas tabelas principais
ALTER TABLE public.dados_fisicos_usuario ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.pesagens ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.pontuacao_diaria ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.missao_dia ADD COLUMN IF NOT EXISTS nome_usuario TEXT;

-- Função para buscar nome do usuário
CREATE OR REPLACE FUNCTION public.get_user_name(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Primeiro tenta buscar na tabela dados_fisicos_usuario
  SELECT nome_completo INTO user_name
  FROM public.dados_fisicos_usuario
  WHERE user_id IN (SELECT id FROM public.profiles WHERE user_id = user_uuid)
  LIMIT 1;
  
  -- Se não encontrar, busca na tabela profiles
  IF user_name IS NULL THEN
    SELECT full_name INTO user_name
    FROM public.profiles
    WHERE user_id = user_uuid
    LIMIT 1;
  END IF;
  
  -- Se ainda não encontrar, usa o email como fallback
  IF user_name IS NULL THEN
    SELECT email INTO user_name
    FROM public.profiles
    WHERE user_id = user_uuid
    LIMIT 1;
  END IF;
  
  RETURN COALESCE(user_name, 'Usuário não identificado');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;