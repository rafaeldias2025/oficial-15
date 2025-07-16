-- Create weight_goals table for managing user weight targets
CREATE TABLE public.weight_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  peso_inicial numeric NOT NULL,
  peso_meta numeric NOT NULL,
  data_inicio date NOT NULL,
  data_limite date NOT NULL,
  observacoes text,
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'pausado')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weight_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all weight goals" 
ON public.weight_goals 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can create weight goals" 
ON public.weight_goals 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update weight goals" 
ON public.weight_goals 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete weight goals" 
ON public.weight_goals 
FOR DELETE 
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own weight goals" 
ON public.weight_goals 
FOR SELECT 
USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_weight_goals_updated_at
BEFORE UPDATE ON public.weight_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();