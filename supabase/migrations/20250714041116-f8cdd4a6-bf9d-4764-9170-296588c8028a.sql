-- Adicionar constraint única na coluna user_id da tabela dados_fisicos_usuario
-- Isso permitirá que o upsert funcione corretamente

-- Primeiro, remover possíveis duplicatas se existirem
DELETE FROM public.dados_fisicos_usuario a
USING public.dados_fisicos_usuario b
WHERE a.id < b.id 
AND a.user_id = b.user_id;

-- Adicionar constraint única na coluna user_id
ALTER TABLE public.dados_fisicos_usuario 
ADD CONSTRAINT dados_fisicos_usuario_user_id_unique UNIQUE (user_id);