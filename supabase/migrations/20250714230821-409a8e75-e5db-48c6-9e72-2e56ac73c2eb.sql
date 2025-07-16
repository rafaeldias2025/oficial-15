-- Remover duplicatas da tabela historico_medidas antes de criar constraint única
WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY user_id, data_medicao 
    ORDER BY created_at DESC
  ) as rn
  FROM public.historico_medidas
)
DELETE FROM public.historico_medidas 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Agora criar constraint única na tabela historico_medidas
ALTER TABLE public.historico_medidas 
ADD CONSTRAINT historico_medidas_user_data_unique 
UNIQUE (user_id, data_medicao);

-- Consolidação de dados físicos: usar dados_fisicos_usuario como fonte única
-- Migrar dados de informacoes_fisicas para dados_fisicos_usuario (se não existirem)
INSERT INTO public.dados_fisicos_usuario (
  user_id, altura_cm, peso_atual_kg, circunferencia_abdominal_cm, 
  nome_completo, sexo, data_nascimento, meta_peso_kg, created_at, updated_at
)
SELECT 
  if.user_id,
  if.altura_cm,
  if.peso_atual_kg,
  if.circunferencia_abdominal_cm,
  COALESCE(p.full_name, '') as nome_completo,
  -- Normalizar valores do sexo para atender à constraint
  CASE 
    WHEN LOWER(if.sexo) = 'masculino' OR LOWER(if.sexo) = 'masc' OR LOWER(if.sexo) = 'm' THEN 'Masculino'
    WHEN LOWER(if.sexo) = 'feminino' OR LOWER(if.sexo) = 'fem' OR LOWER(if.sexo) = 'f' THEN 'Feminino'
    ELSE 'Outro'
  END as sexo,
  if.data_nascimento,
  if.meta_peso_kg,
  if.created_at,
  if.updated_at
FROM public.informacoes_fisicas if
JOIN public.profiles p ON p.id = if.user_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.dados_fisicos_usuario dfu 
  WHERE dfu.user_id = if.user_id
);

-- Migrar dados de dados_saude_usuario para dados_fisicos_usuario (atualizações mais recentes)
UPDATE public.dados_fisicos_usuario dfu
SET 
  altura_cm = dsu.altura_cm,
  peso_atual_kg = dsu.peso_atual_kg,
  circunferencia_abdominal_cm = dsu.circunferencia_abdominal_cm,
  meta_peso_kg = dsu.meta_peso_kg,
  updated_at = dsu.data_atualizacao
FROM public.dados_saude_usuario dsu
WHERE dfu.user_id = dsu.user_id 
AND dsu.data_atualizacao > dfu.updated_at;