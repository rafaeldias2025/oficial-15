-- Primeiro, criar constraint única na tabela historico_medidas
ALTER TABLE public.historico_medidas 
ADD CONSTRAINT historico_medidas_user_data_unique 
UNIQUE (user_id, data_medicao);

-- Agora fazer a consolidação de dados físicos
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

-- Migrar dados do profiles para dados_fisicos_usuario (se campos estiverem vazios)
UPDATE public.dados_fisicos_usuario dfu
SET 
  nome_completo = CASE 
    WHEN dfu.nome_completo IS NULL OR dfu.nome_completo = '' 
    THEN COALESCE(p.full_name, '') 
    ELSE dfu.nome_completo 
  END,
  altura_cm = COALESCE(dfu.altura_cm, p.altura_cm),
  sexo = CASE 
    WHEN dfu.sexo IS NULL OR dfu.sexo = '' THEN
      CASE 
        WHEN LOWER(COALESCE(p.sexo, '')) = 'masculino' OR LOWER(COALESCE(p.sexo, '')) = 'masc' OR LOWER(COALESCE(p.sexo, '')) = 'm' THEN 'Masculino'
        WHEN LOWER(COALESCE(p.sexo, '')) = 'feminino' OR LOWER(COALESCE(p.sexo, '')) = 'fem' OR LOWER(COALESCE(p.sexo, '')) = 'f' THEN 'Feminino'
        ELSE 'Outro'
      END
    ELSE dfu.sexo
  END,
  data_nascimento = COALESCE(dfu.data_nascimento, p.data_nascimento)
FROM public.profiles p
WHERE dfu.user_id = p.id;