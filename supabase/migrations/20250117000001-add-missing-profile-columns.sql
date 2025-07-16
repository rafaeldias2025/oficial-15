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