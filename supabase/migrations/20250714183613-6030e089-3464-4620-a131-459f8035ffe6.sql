-- Correção 1: Criar trigger para automaticamente criar profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, celular, data_nascimento, sexo, altura_cm, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'celular', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'data_nascimento' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'data_nascimento')::DATE 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'sexo', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'altura_cm' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'altura_cm')::INTEGER 
      ELSE NULL 
    END,
    'client'::user_role
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro e re-raise
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RAISE;
END;
$$;

-- Criar trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Correção 2: Atualizar função check_physical_data_complete para usar user_id corretamente
CREATE OR REPLACE FUNCTION public.check_physical_data_complete(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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

-- Correção 3: Habilitar realtime para as tabelas principais
ALTER PUBLICATION supabase_realtime ADD TABLE public.pesagens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dados_fisicos_usuario;
ALTER PUBLICATION supabase_realtime ADD TABLE public.historico_medidas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weight_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Correção 4: Configurar REPLICA IDENTITY para realtime
ALTER TABLE public.pesagens REPLICA IDENTITY FULL;
ALTER TABLE public.dados_fisicos_usuario REPLICA IDENTITY FULL;
ALTER TABLE public.historico_medidas REPLICA IDENTITY FULL;
ALTER TABLE public.weight_goals REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;