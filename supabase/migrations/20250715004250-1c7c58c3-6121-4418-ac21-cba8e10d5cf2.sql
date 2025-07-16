-- Criar tabela para armazenar respostas das ferramentas de roda
CREATE TABLE public.wheel_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  wheel_type TEXT NOT NULL CHECK (wheel_type IN ('energia_vital', 'roda_vida', 'saude_energia')),
  responses JSONB NOT NULL DEFAULT '{}',
  reflection_answers JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.wheel_responses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver suas próprias respostas de roda"
ON public.wheel_responses
FOR SELECT
USING (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Usuários podem criar suas próprias respostas de roda"
ON public.wheel_responses
FOR INSERT
WITH CHECK (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Usuários podem atualizar suas próprias respostas de roda"
ON public.wheel_responses
FOR UPDATE
USING (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Admins podem ver todas as respostas de roda"
ON public.wheel_responses
FOR SELECT
USING (is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_wheel_responses_updated_at
BEFORE UPDATE ON public.wheel_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();