-- Verificar e remover possíveis duplicatas futuras na tabela dados_fisicos_usuario
-- Esta tabela já possui um constraint único, mas vamos garantir integridade total

-- Primeiro, verificar se existe constraint único (deve existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'dados_fisicos_usuario_user_id_unique'
    ) THEN
        -- Remover possíveis duplicatas se existirem
        DELETE FROM public.dados_fisicos_usuario a
        USING public.dados_fisicos_usuario b
        WHERE a.id < b.id 
        AND a.user_id = b.user_id;
        
        -- Adicionar constraint única na coluna user_id
        ALTER TABLE public.dados_fisicos_usuario 
        ADD CONSTRAINT dados_fisicos_usuario_user_id_unique UNIQUE (user_id);
    END IF;
END $$;