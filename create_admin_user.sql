-- Script para criar usuário admin diretamente no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Atualizar função handle_new_user para incluir novo email de admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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
    CASE 
      WHEN NEW.email IN ('rafael@admin.com', 'admin@instituto.com', 'admin@sonhos.com') THEN 'admin'::user_role
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
$$;

-- 2. Verificar se o usuário já existe (opcional)
-- SELECT * FROM auth.users WHERE email = 'admin@sonhos.com';

-- 3. Criar usuário diretamente na tabela auth.users (se necessário)
-- NOTA: Normalmente você deve criar usuários via signUp na aplicação
-- Este é apenas um exemplo de como seria a estrutura

-- 4. Criar profile diretamente (apenas se o usuário já existir no auth.users)
-- INSERT INTO public.profiles (user_id, email, full_name, role)
-- VALUES (
--   'USER_ID_AQUI',
--   'admin@sonhos.com',
--   'Administrador Sistema',
--   'admin'::user_role
-- );

/*
INSTRUÇÕES PARA CRIAR O USUÁRIO ADMIN:

1. Vá para https://supabase.com/dashboard/project/skcfeldqipxaomrjfuym
2. Faça login
3. Vá para SQL Editor
4. Execute o script acima (primeira parte)
5. Depois vá para Authentication > Users
6. Clique em "Add User"
7. Use estas credenciais:
   - Email: admin@sonhos.com  
   - Senha: Admin123!
   - Confirme a senha: Admin123!
8. Clique em "Create User"
9. O sistema automaticamente criará o perfil com role 'admin'

OU

Use a página de cadastro da aplicação:
1. Vá para http://localhost:8082/auth
2. Clique em "Cadastrar"
3. Use:
   - Email: admin@sonhos.com
   - Senha: Admin123!
   - Nome: Administrador Sistema
   - Outros campos: preencha conforme necessário
4. O sistema automaticamente dará role 'admin' devido ao email

Para testar o acesso:
1. Vá para http://localhost:8082/auth
2. Faça login com:
   - Email: admin@sonhos.com
   - Senha: Admin123!
3. Clique em "Gerenciar Usuários" para ir direto ao painel
*/ 