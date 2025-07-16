-- Criar nova tabela para informações físicas do usuário
CREATE TABLE public.informacoes_fisicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data_nascimento DATE NOT NULL,
  sexo TEXT NOT NULL CHECK (sexo IN ('masculino', 'feminino', 'outro')),
  peso_atual_kg DECIMAL(5,2) NOT NULL,
  altura_cm INTEGER NOT NULL,
  circunferencia_abdominal_cm DECIMAL(5,2) NOT NULL,
  meta_peso_kg DECIMAL(5,2),
  imc DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.informacoes_fisicas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Usuários podem ver seus próprios dados físicos" 
ON public.informacoes_fisicas 
FOR SELECT 
USING (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Usuários podem inserir seus próprios dados físicos" 
ON public.informacoes_fisicas 
FOR INSERT 
WITH CHECK (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Usuários podem atualizar seus próprios dados físicos" 
ON public.informacoes_fisicas 
FOR UPDATE 
USING (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Admins podem ver todos os dados físicos" 
ON public.informacoes_fisicas 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Função para calcular IMC automaticamente
CREATE OR REPLACE FUNCTION public.calcular_imc_informacoes()
RETURNS TRIGGER AS $$
BEGIN
  NEW.imc = ROUND((NEW.peso_atual_kg / POWER(NEW.altura_cm / 100.0, 2))::NUMERIC, 2);
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular IMC automaticamente
CREATE TRIGGER trigger_calcular_imc_informacoes
  BEFORE INSERT OR UPDATE ON public.informacoes_fisicas
  FOR EACH ROW
  EXECUTE FUNCTION public.calcular_imc_informacoes();