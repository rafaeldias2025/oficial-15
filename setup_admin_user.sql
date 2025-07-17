-- Script para criar usuário admin automaticamente
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar se já existe um usuário admin
SELECT email, created_at FROM auth.users WHERE email IN (
  'admin@instituto.com',
  'admin@sonhos.com', 
  'rafael@admin.com',
  'rafael@institutodossonhos.com',
  'institutodossonhos@gmail.com',
  'admin@test.com'
);

-- 2. Se não existir, você pode criar um usuário admin diretamente no Auth
-- Vá para Authentication > Users > Add User e use:
-- Email: admin@sonhos.com
-- Senha: Admin123!

-- 3. Depois que criar o usuário, execute este script para garantir que o perfil seja criado:
INSERT INTO profiles (
  id,
  full_name,
  phone,
  birth_date,
  gender,
  height,
  weight,
  activity_level,
  objetivo_principal,
  objetivo_peso,
  role,
  created_at,
  updated_at
) 
SELECT 
  id,
  'Administrador Sistema',
  '(11) 99999-9999',
  '1990-01-01',
  'masculino',
  180,
  75.0,
  'ativo',
  'manter',
  75.0,
  'admin',
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@sonhos.com'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.users.id
);

-- 4. Verificar se o perfil foi criado corretamente
SELECT 
  p.id,
  p.full_name,
  p.role,
  u.email,
  u.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'admin@sonhos.com';
