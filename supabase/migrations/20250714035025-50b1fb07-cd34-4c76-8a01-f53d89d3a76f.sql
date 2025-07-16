-- Adicionar campo celular na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN celular text;

-- Criar função para verificar se dados físicos estão completos
CREATE OR REPLACE FUNCTION public.check_physical_data_complete(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.dados_fisicos_usuario 
    WHERE user_id IN (
      SELECT id FROM public.profiles WHERE user_id = user_uuid
    )
    AND altura_cm IS NOT NULL 
    AND peso_atual_kg IS NOT NULL 
    AND sexo IS NOT NULL
  );
$$;