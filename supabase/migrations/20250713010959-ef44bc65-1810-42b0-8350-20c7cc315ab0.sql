-- Criar tabelas para todas as funcionalidades da aplicação

-- Tabela para metas pessoais
CREATE TABLE IF NOT EXISTS public.goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  start_date date NOT NULL,
  target_date date NOT NULL,
  notes text,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  other_type text,
  weekly_reminders boolean DEFAULT false,
  automatic_plan boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para missões diárias
CREATE TABLE IF NOT EXISTS public.daily_missions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  mission_id text NOT NULL,
  mission_date date NOT NULL,
  completed boolean DEFAULT false,
  points_earned integer DEFAULT 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, mission_id, mission_date)
);

-- Tabela para avaliações semanais
CREATE TABLE IF NOT EXISTS public.weekly_evaluations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  week_start_date date NOT NULL,
  learning_data jsonb NOT NULL DEFAULT '{}',
  performance_ratings jsonb NOT NULL DEFAULT '{}',
  next_week_goals text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, week_start_date)
);

-- Tabela para desafios
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  level text NOT NULL,
  points integer NOT NULL,
  duration_days integer NOT NULL,
  is_active boolean DEFAULT true,
  icon text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para participação dos usuários nos desafios
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  target_value integer NOT NULL,
  is_completed boolean DEFAULT false,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  UNIQUE(user_id, challenge_id)
);

-- Tabela para conquistas/badges
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  condition_type text NOT NULL,
  condition_value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela para conquistas dos usuários
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Tabela para pontuação e ranking dos usuários
CREATE TABLE IF NOT EXISTS public.user_points (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  total_points integer DEFAULT 0,
  daily_points integer DEFAULT 0,
  weekly_points integer DEFAULT 0,
  monthly_points integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  best_streak integer DEFAULT 0,
  completed_challenges integer DEFAULT 0,
  last_activity_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para goals
CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own goals" ON public.goals FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all goals" ON public.goals FOR SELECT USING (is_admin(auth.uid()));

-- Políticas RLS para daily_missions
CREATE POLICY "Users can view their own missions" ON public.daily_missions FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own missions" ON public.daily_missions FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own missions" ON public.daily_missions FOR UPDATE USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all missions" ON public.daily_missions FOR SELECT USING (is_admin(auth.uid()));

-- Políticas RLS para weekly_evaluations
CREATE POLICY "Users can view their own evaluations" ON public.weekly_evaluations FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own evaluations" ON public.weekly_evaluations FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own evaluations" ON public.weekly_evaluations FOR UPDATE USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all evaluations" ON public.weekly_evaluations FOR SELECT USING (is_admin(auth.uid()));

-- Políticas RLS para challenges (públicas para todos)
CREATE POLICY "Everyone can view active challenges" ON public.challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage challenges" ON public.challenges FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para user_challenges
CREATE POLICY "Users can view their own challenge progress" ON public.user_challenges FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own challenge participation" ON public.user_challenges FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own challenge progress" ON public.user_challenges FOR UPDATE USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all user challenges" ON public.user_challenges FOR SELECT USING (is_admin(auth.uid()));

-- Políticas RLS para achievements (públicas para visualização)
CREATE POLICY "Everyone can view achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can unlock achievements" ON public.user_achievements FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all user achievements" ON public.user_achievements FOR SELECT USING (is_admin(auth.uid()));

-- Políticas RLS para user_points
CREATE POLICY "Users can view their own points" ON public.user_points FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own points record" ON public.user_points FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own points" ON public.user_points FOR UPDATE USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Everyone can view points for ranking" ON public.user_points FOR SELECT USING (true);
CREATE POLICY "Admins can view all points" ON public.user_points FOR SELECT USING (is_admin(auth.uid()));

-- Triggers para updated_at
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_weekly_evaluations_updated_at BEFORE UPDATE ON public.weekly_evaluations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON public.user_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais de desafios
INSERT INTO public.challenges (title, description, category, level, points, duration_days, icon) VALUES
  ('Hidratação Master', 'Beba pelo menos 2L de água por dia durante 7 dias consecutivos', 'biologico', 'iniciante', 50, 7, '💧'),
  ('Mindful Eating', 'Pratique alimentação consciente por 5 refeições esta semana', 'psicologico', 'intermediario', 75, 7, '🧠'),
  ('Movimento Diário', 'Faça pelo menos 30 minutos de atividade física por 10 dias', 'biologico', 'avancado', 100, 10, '🏃'),
  ('Detox Digital', 'Evite dispositivos eletrônicos 1h antes de dormir por 5 dias', 'psicologico', 'intermediario', 60, 5, '📱'),
  ('Gratidão Diária', 'Anote 3 coisas pelas quais você é grato todos os dias por uma semana', 'psicologico', 'iniciante', 40, 7, '🙏');

-- Inserir dados iniciais de conquistas
INSERT INTO public.achievements (title, description, icon, condition_type, condition_value) VALUES
  ('Primeiro Passo', 'Complete seu primeiro desafio', '🎯', 'challenges_completed', '{"value": 1}'),
  ('Persistente', 'Complete 5 desafios consecutivos', '⚡', 'challenges_completed', '{"value": 5}'),
  ('Mestre da Hidratação', 'Complete 3 desafios relacionados à hidratação', '💧', 'category_challenges', '{"category": "hidratacao", "value": 3}'),
  ('Mente Zen', 'Complete 10 desafios de mindfulness', '🧘', 'category_challenges', '{"category": "psicologico", "value": 10}'),
  ('Guerreiro', 'Mantenha uma sequência de 30 dias', '👑', 'streak_days', '{"value": 30}');

-- Função para calcular e atualizar pontos do usuário
CREATE OR REPLACE FUNCTION public.update_user_points(p_user_id uuid, p_points integer, p_activity_type text DEFAULT 'general')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_date_local date := CURRENT_DATE;
BEGIN
  -- Inserir ou atualizar pontos do usuário
  INSERT INTO public.user_points (user_id, total_points, daily_points, weekly_points, monthly_points, last_activity_date)
  VALUES (p_user_id, p_points, p_points, p_points, p_points, current_date_local)
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_points.total_points + p_points,
    daily_points = CASE 
      WHEN user_points.last_activity_date = current_date_local 
      THEN user_points.daily_points + p_points 
      ELSE p_points 
    END,
    weekly_points = CASE 
      WHEN date_trunc('week', user_points.last_activity_date) = date_trunc('week', current_date_local) 
      THEN user_points.weekly_points + p_points 
      ELSE p_points 
    END,
    monthly_points = CASE 
      WHEN date_trunc('month', user_points.last_activity_date) = date_trunc('month', current_date_local) 
      THEN user_points.monthly_points + p_points 
      ELSE p_points 
    END,
    current_streak = CASE 
      WHEN user_points.last_activity_date = current_date_local - 1 
      THEN user_points.current_streak + 1
      WHEN user_points.last_activity_date = current_date_local 
      THEN user_points.current_streak
      ELSE 1 
    END,
    best_streak = GREATEST(
      user_points.best_streak, 
      CASE 
        WHEN user_points.last_activity_date = current_date_local - 1 
        THEN user_points.current_streak + 1
        WHEN user_points.last_activity_date = current_date_local 
        THEN user_points.current_streak
        ELSE 1 
      END
    ),
    last_activity_date = current_date_local,
    updated_at = now();
END;
$$;