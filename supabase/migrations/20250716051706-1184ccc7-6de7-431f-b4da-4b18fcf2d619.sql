-- Adicionar campo nome_usuario em todas as tabelas que possuem user_id
-- e criar sistema automático de sincronização

-- 1. Adicionar campo nome_usuario nas tabelas principais
ALTER TABLE public.dados_fisicos_usuario ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.dados_saude_usuario ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.daily_missions ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.diary_entries ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.favorites ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.goals ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.historico_medidas ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.informacoes_fisicas ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.interactions ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.missao_dia ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.missoes_usuario ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.perfil_comportamental ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.pesagens ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.pontuacao_diaria ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.test_responses ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.user_achievements ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.user_challenges ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.user_course_progress ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.user_points ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.weekly_evaluations ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.weight_goals ADD COLUMN nome_usuario TEXT;
ALTER TABLE public.wheel_responses ADD COLUMN nome_usuario TEXT;

-- 2. Função para buscar nome do usuário
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

-- 3. Função trigger para atualizar nome_usuario automaticamente
CREATE OR REPLACE FUNCTION public.update_nome_usuario()
RETURNS TRIGGER AS $$
DECLARE
  profile_id UUID;
  user_name TEXT;
BEGIN
  -- Buscar o profile_id correspondente ao user_id
  SELECT id INTO profile_id
  FROM public.profiles
  WHERE user_id = (
    CASE 
      WHEN TG_TABLE_NAME = 'profiles' THEN NEW.user_id
      ELSE NEW.user_id
    END
  );
  
  -- Se não encontrar o profile_id, usar o user_id diretamente
  IF profile_id IS NULL THEN
    profile_id := NEW.user_id;
  END IF;
  
  -- Buscar o nome do usuário
  user_name := public.get_user_name(
    CASE 
      WHEN TG_TABLE_NAME = 'profiles' THEN NEW.user_id
      ELSE (SELECT user_id FROM public.profiles WHERE id = NEW.user_id LIMIT 1)
    END
  );
  
  -- Atualizar o campo nome_usuario
  NEW.nome_usuario := user_name;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar triggers para todas as tabelas
CREATE TRIGGER trigger_update_nome_usuario_dados_fisicos
  BEFORE INSERT OR UPDATE ON public.dados_fisicos_usuario
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_dados_saude
  BEFORE INSERT OR UPDATE ON public.dados_saude_usuario
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_daily_missions
  BEFORE INSERT OR UPDATE ON public.daily_missions
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_diary_entries
  BEFORE INSERT OR UPDATE ON public.diary_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_favorites
  BEFORE INSERT OR UPDATE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_goals
  BEFORE INSERT OR UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_historico_medidas
  BEFORE INSERT OR UPDATE ON public.historico_medidas
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_informacoes_fisicas
  BEFORE INSERT OR UPDATE ON public.informacoes_fisicas
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_interactions
  BEFORE INSERT OR UPDATE ON public.interactions
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_missao_dia
  BEFORE INSERT OR UPDATE ON public.missao_dia
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_missoes_usuario
  BEFORE INSERT OR UPDATE ON public.missoes_usuario
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_perfil_comportamental
  BEFORE INSERT OR UPDATE ON public.perfil_comportamental
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_pesagens
  BEFORE INSERT OR UPDATE ON public.pesagens
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_pontuacao_diaria
  BEFORE INSERT OR UPDATE ON public.pontuacao_diaria
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_test_responses
  BEFORE INSERT OR UPDATE ON public.test_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_user_achievements
  BEFORE INSERT OR UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_user_challenges
  BEFORE INSERT OR UPDATE ON public.user_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_user_course_progress
  BEFORE INSERT OR UPDATE ON public.user_course_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_user_points
  BEFORE INSERT OR UPDATE ON public.user_points
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_weekly_evaluations
  BEFORE INSERT OR UPDATE ON public.weekly_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_weight_goals
  BEFORE INSERT OR UPDATE ON public.weight_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE TRIGGER trigger_update_nome_usuario_wheel_responses
  BEFORE INSERT OR UPDATE ON public.wheel_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

-- 5. Atualizar registros existentes
-- dados_fisicos_usuario
UPDATE public.dados_fisicos_usuario 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = dados_fisicos_usuario.user_id LIMIT 1)
);

-- dados_saude_usuario
UPDATE public.dados_saude_usuario 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = dados_saude_usuario.user_id LIMIT 1)
);

-- daily_missions
UPDATE public.daily_missions 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = daily_missions.user_id LIMIT 1)
);

-- diary_entries
UPDATE public.diary_entries 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = diary_entries.user_id LIMIT 1)
);

-- favorites
UPDATE public.favorites 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = favorites.user_id LIMIT 1)
);

-- goals
UPDATE public.goals 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = goals.user_id LIMIT 1)
);

-- historico_medidas
UPDATE public.historico_medidas 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = historico_medidas.user_id LIMIT 1)
);

-- informacoes_fisicas
UPDATE public.informacoes_fisicas 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = informacoes_fisicas.user_id LIMIT 1)
);

-- interactions
UPDATE public.interactions 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = interactions.user_id LIMIT 1)
);

-- missao_dia
UPDATE public.missao_dia 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = missao_dia.user_id LIMIT 1)
);

-- missoes_usuario
UPDATE public.missoes_usuario 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = missoes_usuario.user_id LIMIT 1)
);

-- perfil_comportamental
UPDATE public.perfil_comportamental 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = perfil_comportamental.user_id LIMIT 1)
);

-- pesagens
UPDATE public.pesagens 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = pesagens.user_id LIMIT 1)
);

-- pontuacao_diaria
UPDATE public.pontuacao_diaria 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = pontuacao_diaria.user_id LIMIT 1)
);

-- test_responses
UPDATE public.test_responses 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = test_responses.user_id LIMIT 1)
);

-- user_achievements
UPDATE public.user_achievements 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = user_achievements.user_id LIMIT 1)
);

-- user_challenges
UPDATE public.user_challenges 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = user_challenges.user_id LIMIT 1)
);

-- user_course_progress
UPDATE public.user_course_progress 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = user_course_progress.user_id LIMIT 1)
);

-- user_points
UPDATE public.user_points 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = user_points.user_id LIMIT 1)
);

-- weekly_evaluations
UPDATE public.weekly_evaluations 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = weekly_evaluations.user_id LIMIT 1)
);

-- weight_goals
UPDATE public.weight_goals 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = weight_goals.user_id LIMIT 1)
);

-- wheel_responses
UPDATE public.wheel_responses 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = wheel_responses.user_id LIMIT 1)
);

-- 6. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_dados_fisicos_nome_usuario ON public.dados_fisicos_usuario(nome_usuario);
CREATE INDEX IF NOT EXISTS idx_pesagens_nome_usuario ON public.pesagens(nome_usuario);
CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_nome_usuario ON public.pontuacao_diaria(nome_usuario);
CREATE INDEX IF NOT EXISTS idx_user_points_nome_usuario ON public.user_points(nome_usuario);