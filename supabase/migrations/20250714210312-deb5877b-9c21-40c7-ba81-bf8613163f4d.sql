-- Criar tabela de cursos
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Criar tabela de módulos
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de aulas
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de progresso do usuário
CREATE TABLE public.user_course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Habilitar RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para cursos
CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (is_admin(auth.uid()));

-- Políticas para módulos
CREATE POLICY "Anyone can view active modules" ON public.course_modules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage modules" ON public.course_modules
  FOR ALL USING (is_admin(auth.uid()));

-- Políticas para aulas
CREATE POLICY "Anyone can view active lessons" ON public.course_lessons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage lessons" ON public.course_lessons
  FOR ALL USING (is_admin(auth.uid()));

-- Políticas para progresso do usuário
CREATE POLICY "Users can view their own progress" ON public.user_course_progress
  FOR SELECT USING (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own progress" ON public.user_course_progress
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own progress records" ON public.user_course_progress
  FOR UPDATE USING (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all progress" ON public.user_course_progress
  FOR SELECT USING (is_admin(auth.uid()));

-- Triggers para atualizar updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at
  BEFORE UPDATE ON public.user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados de exemplo
INSERT INTO public.courses (title, description, image_url, category) VALUES
('Pílulas do Bem', 'Conteúdo motivacional e transformador', '/lovable-uploads/b82e65b8-c25c-4fd3-b340-edeee3b9c31f.png', 'pilulas'),
('Plataforma dos Sonhos', 'Cursos completos para transformação pessoal', '/lovable-uploads/b82e65b8-c25c-4fd3-b340-edeee3b9c31f.png', 'plataforma'),
('Comunidade dos Sonhos', 'Conteúdo exclusivo da comunidade', '/lovable-uploads/b82e65b8-c25c-4fd3-b340-edeee3b9c31f.png', 'comunidade');