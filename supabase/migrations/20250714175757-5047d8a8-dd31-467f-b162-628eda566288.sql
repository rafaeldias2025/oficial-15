-- Adicionar campos obrigatórios na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS sexo TEXT,
ADD COLUMN IF NOT EXISTS altura_cm INTEGER;

-- Atualizar função handle_new_user para incluir os novos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    CASE 
      WHEN NEW.email IN ('rafael@admin.com', 'admin@instituto.com') THEN 'admin'::user_role
      ELSE 'client'::user_role
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise it
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RAISE;
END;
$function$;