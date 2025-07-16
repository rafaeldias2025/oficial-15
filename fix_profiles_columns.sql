-- Script para corrigir colunas que faltam na tabela profiles
-- Execute este script no console SQL do Supabase

-- Adicionar colunas que faltam na tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS last_active timestamp with time zone,
ADD COLUMN IF NOT EXISTS achievements jsonb DEFAULT '[]'::jsonb;

-- Atualizar valores padrão
UPDATE profiles 
SET 
    city = COALESCE(city, 'São Paulo'),
    last_active = COALESCE(last_active, NOW()),
    achievements = COALESCE(achievements, '[]'::jsonb)
WHERE city IS NULL OR last_active IS NULL OR achievements IS NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('city', 'last_active', 'achievements');

-- Mostrar estrutura completa da tabela profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position; 