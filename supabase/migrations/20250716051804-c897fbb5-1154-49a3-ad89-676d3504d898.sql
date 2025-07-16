-- Primeiro, remover o trigger problemático que está causando conflito
DROP TRIGGER IF EXISTS atualizar_historico_trigger ON public.dados_fisicos_usuario;
DROP FUNCTION IF EXISTS public.atualizar_historico_medidas();

-- Agora adicionar o campo nome_usuario em algumas tabelas principais primeiro
ALTER TABLE public.dados_fisicos_usuario ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.pesagens ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.pontuacao_diaria ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.missao_dia ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.weight_goals ADD COLUMN IF NOT EXISTS nome_usuario TEXT;