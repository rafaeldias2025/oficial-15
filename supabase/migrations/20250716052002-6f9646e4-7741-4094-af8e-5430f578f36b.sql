-- Atualizar registros existentes nas tabelas principais
-- dados_fisicos_usuario
UPDATE public.dados_fisicos_usuario 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = dados_fisicos_usuario.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;

-- pesagens
UPDATE public.pesagens 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = pesagens.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;

-- pontuacao_diaria
UPDATE public.pontuacao_diaria 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = pontuacao_diaria.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;

-- user_points
UPDATE public.user_points 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = user_points.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;

-- missao_dia
UPDATE public.missao_dia 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = missao_dia.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;