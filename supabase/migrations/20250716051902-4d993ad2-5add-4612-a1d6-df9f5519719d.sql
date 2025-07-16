-- Adicionar campos nome_usuario nas demais tabelas
ALTER TABLE public.dados_saude_usuario ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.daily_missions ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.diary_entries ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.favorites ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.historico_medidas ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.informacoes_fisicas ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.interactions ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.missoes_usuario ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.perfil_comportamental ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.test_responses ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.user_achievements ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.user_challenges ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.user_course_progress ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.weekly_evaluations ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.weight_goals ADD COLUMN IF NOT EXISTS nome_usuario TEXT;
ALTER TABLE public.wheel_responses ADD COLUMN IF NOT EXISTS nome_usuario TEXT;