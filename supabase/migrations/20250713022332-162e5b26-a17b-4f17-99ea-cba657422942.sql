-- Criar tabela para dados de saúde do usuário
CREATE TABLE public.dados_saude_usuario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  peso_atual_kg DECIMAL(5,2) NOT NULL,
  altura_cm INTEGER NOT NULL,
  circunferencia_abdominal_cm DECIMAL(5,2) NOT NULL,
  imc DECIMAL(4,2) GENERATED ALWAYS AS (peso_atual_kg / POWER(altura_cm / 100.0, 2)) STORED,
  meta_peso_kg DECIMAL(5,2) NOT NULL,
  progresso_percentual DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN peso_atual_kg <= meta_peso_kg THEN 100.0
      ELSE GREATEST(0, (peso_atual_kg - meta_peso_kg) / (peso_atual_kg - meta_peso_kg) * 100.0)
    END
  ) STORED,
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.dados_saude_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view their own health data" 
ON public.dados_saude_usuario 
FOR SELECT 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own health data" 
ON public.dados_saude_usuario 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own health data" 
ON public.dados_saude_usuario 
FOR UPDATE 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all health data" 
ON public.dados_saude_usuario 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Criar tabela para missões do usuário (dados agregados da missão do dia)
CREATE TABLE public.missoes_usuario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL,
  bebeu_agua BOOLEAN DEFAULT false,
  dormiu_bem BOOLEAN DEFAULT false,
  autocuidado BOOLEAN DEFAULT false,
  humor TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, data)
);

-- Habilitar RLS
ALTER TABLE public.missoes_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view their own mission data" 
ON public.missoes_usuario 
FOR SELECT 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own mission data" 
ON public.missoes_usuario 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own mission data" 
ON public.missoes_usuario 
FOR UPDATE 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all mission data" 
ON public.missoes_usuario 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Função para atualizar missões_usuario baseado na missao_dia
CREATE OR REPLACE FUNCTION public.update_missoes_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.missoes_usuario (
    user_id, 
    data, 
    bebeu_agua, 
    dormiu_bem, 
    autocuidado, 
    humor
  )
  VALUES (
    NEW.user_id,
    NEW.data,
    NEW.habito_saudavel ILIKE '%água%' OR NEW.habito_saudavel ILIKE '%hidrat%',
    NEW.habito_saudavel ILIKE '%dormir%' OR NEW.habito_saudavel ILIKE '%sono%',
    NEW.momento_feliz IS NOT NULL OR NEW.gratidao IS NOT NULL,
    NEW.humor
  )
  ON CONFLICT (user_id, data) DO UPDATE SET
    bebeu_agua = NEW.habito_saudavel ILIKE '%água%' OR NEW.habito_saudavel ILIKE '%hidrat%',
    dormiu_bem = NEW.habito_saudavel ILIKE '%dormir%' OR NEW.habito_saudavel ILIKE '%sono%',
    autocuidado = NEW.momento_feliz IS NOT NULL OR NEW.gratidao IS NOT NULL,
    humor = NEW.humor;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar missoes_usuario quando missao_dia for alterada
CREATE TRIGGER update_missoes_usuario_trigger
  AFTER INSERT OR UPDATE ON public.missao_dia
  FOR EACH ROW
  EXECUTE FUNCTION public.update_missoes_usuario();