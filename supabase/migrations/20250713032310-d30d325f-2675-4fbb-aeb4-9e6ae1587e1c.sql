-- Criar tabela para dados físicos dos usuários
CREATE TABLE public.dados_fisicos_usuario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_completo TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  sexo TEXT NOT NULL CHECK (sexo IN ('Masculino', 'Feminino', 'Outro')),
  peso_atual_kg NUMERIC NOT NULL,
  altura_cm INTEGER NOT NULL,
  circunferencia_abdominal_cm NUMERIC NOT NULL,
  imc NUMERIC GENERATED ALWAYS AS (peso_atual_kg / POWER(altura_cm / 100.0, 2)) STORED,
  risco_cardiometabolico TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN sexo = 'Masculino' AND circunferencia_abdominal_cm >= 102 THEN 'Alto'
      WHEN sexo = 'Feminino' AND circunferencia_abdominal_cm >= 88 THEN 'Alto'
      WHEN sexo = 'Masculino' AND circunferencia_abdominal_cm >= 94 THEN 'Moderado'
      WHEN sexo = 'Feminino' AND circunferencia_abdominal_cm >= 80 THEN 'Moderado'
      ELSE 'Baixo'
    END
  ) STORED,
  categoria_imc TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN peso_atual_kg / POWER(altura_cm / 100.0, 2) < 18.5 THEN 'Abaixo do peso'
      WHEN peso_atual_kg / POWER(altura_cm / 100.0, 2) < 25 THEN 'Peso normal'
      WHEN peso_atual_kg / POWER(altura_cm / 100.0, 2) < 30 THEN 'Sobrepeso'
      WHEN peso_atual_kg / POWER(altura_cm / 100.0, 2) < 35 THEN 'Obesidade grau I'
      WHEN peso_atual_kg / POWER(altura_cm / 100.0, 2) < 40 THEN 'Obesidade grau II'
      ELSE 'Obesidade grau III'
    END
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para perfil comportamental
CREATE TABLE public.perfil_comportamental (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tentativa_emagrecimento TEXT,
  tentativa_emagrecimento_outro TEXT,
  motivo_desistencia TEXT,
  motivo_desistencia_outro TEXT,
  apoio_familiar TEXT CHECK (apoio_familiar IN ('Sim', 'Não', 'Às vezes')),
  nivel_autocuidado INTEGER CHECK (nivel_autocuidado >= 0 AND nivel_autocuidado <= 5),
  nivel_estresse INTEGER CHECK (nivel_estresse >= 1 AND nivel_estresse <= 5),
  sentimento_hoje TEXT,
  motivacao_principal TEXT,
  gratidao_hoje TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para histórico de medidas (para gráficos)
CREATE TABLE public.historico_medidas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  peso_kg NUMERIC NOT NULL,
  circunferencia_abdominal_cm NUMERIC NOT NULL,
  imc NUMERIC GENERATED ALWAYS AS (peso_kg / POWER((SELECT altura_cm FROM dados_fisicos_usuario WHERE dados_fisicos_usuario.user_id = historico_medidas.user_id LIMIT 1) / 100.0, 2)) STORED,
  data_medicao DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.dados_fisicos_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfil_comportamental ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_medidas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para dados_fisicos_usuario
CREATE POLICY "Users can view their own physical data" 
ON public.dados_fisicos_usuario 
FOR SELECT 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own physical data" 
ON public.dados_fisicos_usuario 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own physical data" 
ON public.dados_fisicos_usuario 
FOR UPDATE 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all physical data" 
ON public.dados_fisicos_usuario 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Políticas RLS para perfil_comportamental
CREATE POLICY "Users can view their own behavioral profile" 
ON public.perfil_comportamental 
FOR SELECT 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own behavioral profile" 
ON public.perfil_comportamental 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own behavioral profile" 
ON public.perfil_comportamental 
FOR UPDATE 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all behavioral profiles" 
ON public.perfil_comportamental 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Políticas RLS para historico_medidas
CREATE POLICY "Users can view their own measurement history" 
ON public.historico_medidas 
FOR SELECT 
USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own measurement history" 
ON public.historico_medidas 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all measurement history" 
ON public.historico_medidas 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_dados_fisicos_updated_at
BEFORE UPDATE ON public.dados_fisicos_usuario
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_perfil_comportamental_updated_at
BEFORE UPDATE ON public.perfil_comportamental
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para automaticamente adicionar entrada no histórico quando dados físicos são atualizados
CREATE OR REPLACE FUNCTION public.add_to_measurement_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.historico_medidas (user_id, peso_kg, circunferencia_abdominal_cm, data_medicao)
  VALUES (NEW.user_id, NEW.peso_atual_kg, NEW.circunferencia_abdominal_cm, CURRENT_DATE)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_measurement_to_history
AFTER INSERT OR UPDATE ON public.dados_fisicos_usuario
FOR EACH ROW
EXECUTE FUNCTION public.add_to_measurement_history();