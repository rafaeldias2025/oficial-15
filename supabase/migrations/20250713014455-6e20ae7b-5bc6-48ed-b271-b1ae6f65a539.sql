-- Criar tabela para missão do dia
CREATE TABLE public.missao_dia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL,
  inspira TEXT,
  humor TEXT,
  prioridades JSONB DEFAULT '[]'::jsonb,
  mensagem_dia TEXT,
  momento_feliz TEXT,
  tarefa_bem_feita TEXT,
  habito_saudavel TEXT,
  gratidao TEXT,
  concluido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, data)
);

-- Enable Row Level Security
ALTER TABLE public.missao_dia ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own daily missions" 
ON public.missao_dia 
FOR SELECT 
USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

CREATE POLICY "Users can create their own daily missions" 
ON public.missao_dia 
FOR INSERT 
WITH CHECK (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

CREATE POLICY "Users can update their own daily missions" 
ON public.missao_dia 
FOR UPDATE 
USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- Admins can view all missions
CREATE POLICY "Admins can view all daily missions" 
ON public.missao_dia 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_missao_dia_updated_at
BEFORE UPDATE ON public.missao_dia
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();