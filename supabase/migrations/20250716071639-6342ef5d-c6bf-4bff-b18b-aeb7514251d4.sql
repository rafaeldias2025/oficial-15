-- =====================================================
-- LIMPEZA COMPLETA DE DADOS DE TESTE - PRODUÇÃO
-- =====================================================
-- Esta migração remove todos os dados de usuários de teste
-- mantendo apenas a estrutura do banco e políticas RLS

-- ⚠️  ATENÇÃO: Esta operação é IRREVERSÍVEL
-- Todos os dados de usuários serão permanentemente removidos

-- 1. Limpar dados relacionados aos usuários (ordem de dependências)
-- Começar pelas tabelas que referenciam outras

-- Limpar interações
DELETE FROM public.interactions WHERE user_id IS NOT NULL;

-- Limpar comentários
DELETE FROM public.comments WHERE user_id IS NOT NULL;

-- Limpar favoritos
DELETE FROM public.favorites WHERE user_id IS NOT NULL;

-- Limpar progresso de cursos
DELETE FROM public.user_course_progress WHERE user_id IS NOT NULL;

-- Limpar conquistas de usuários
DELETE FROM public.user_achievements WHERE user_id IS NOT NULL;

-- Limpar desafios de usuários
DELETE FROM public.user_challenges WHERE user_id IS NOT NULL;

-- Limpar entradas do diário
DELETE FROM public.diary_entries WHERE user_id IS NOT NULL;

-- Limpar avaliações semanais
DELETE FROM public.weekly_evaluations WHERE user_id IS NOT NULL;

-- Limpar respostas de testes
DELETE FROM public.test_responses WHERE user_id IS NOT NULL;

-- Limpar respostas de roda
DELETE FROM public.wheel_responses WHERE user_id IS NOT NULL;

-- Limpar sessões atribuídas e criadas por usuários
UPDATE public.sessions SET assigned_to = NULL WHERE assigned_to IS NOT NULL;
UPDATE public.sessions SET created_by = NULL WHERE created_by IS NOT NULL;

-- Limpar pontos dos usuários
DELETE FROM public.user_points WHERE user_id IS NOT NULL;

-- Limpar metas
DELETE FROM public.goals WHERE user_id IS NOT NULL;

-- Limpar metas de peso
DELETE FROM public.weight_goals WHERE user_id IS NOT NULL;

-- Limpar missões diárias
DELETE FROM public.daily_missions WHERE user_id IS NOT NULL;

-- Limpar pontuação diária
DELETE FROM public.pontuacao_diaria WHERE user_id IS NOT NULL;

-- Limpar missão do dia
DELETE FROM public.missao_dia WHERE user_id IS NOT NULL;

-- Limpar missões de usuário
DELETE FROM public.missoes_usuario WHERE user_id IS NOT NULL;

-- Limpar perfil comportamental
DELETE FROM public.perfil_comportamental WHERE user_id IS NOT NULL;

-- Limpar histórico de medidas
DELETE FROM public.historico_medidas WHERE user_id IS NOT NULL;

-- Limpar pesagens
DELETE FROM public.pesagens WHERE user_id IS NOT NULL;

-- Limpar informações físicas
DELETE FROM public.informacoes_fisicas WHERE user_id IS NOT NULL;

-- Limpar dados de saúde do usuário
DELETE FROM public.dados_saude_usuario WHERE user_id IS NOT NULL;

-- Limpar dados físicos do usuário
DELETE FROM public.dados_fisicos_usuario WHERE user_id IS NOT NULL;

-- 2. Por último, limpar a tabela profiles (que é referenciada por muitas outras)
DELETE FROM public.profiles WHERE id IS NOT NULL;

-- 3. Limpar cursos criados por usuários (se houver)
UPDATE public.courses SET created_by = NULL WHERE created_by IS NOT NULL;

-- 4. Limpar testes criados por usuários (se houver)  
UPDATE public.tests SET created_by = NULL WHERE created_by IS NOT NULL;

-- =====================================================
-- VERIFICAÇÃO DE LIMPEZA
-- =====================================================

-- Contar registros restantes nas principais tabelas
DO $$
DECLARE
    profiles_count INTEGER;
    dados_fisicos_count INTEGER;
    pesagens_count INTEGER;
    test_responses_count INTEGER;
    weekly_eval_count INTEGER;
    user_points_count INTEGER;
BEGIN
    -- Verificar se as tabelas estão vazias
    SELECT COUNT(*) INTO profiles_count FROM public.profiles;
    SELECT COUNT(*) INTO dados_fisicos_count FROM public.dados_fisicos_usuario;
    SELECT COUNT(*) INTO pesagens_count FROM public.pesagens;
    SELECT COUNT(*) INTO test_responses_count FROM public.test_responses;
    SELECT COUNT(*) INTO weekly_eval_count FROM public.weekly_evaluations;
    SELECT COUNT(*) INTO user_points_count FROM public.user_points;
    
    -- Log dos resultados
    RAISE NOTICE '=== RELATÓRIO DE LIMPEZA ===';
    RAISE NOTICE 'Profiles restantes: %', profiles_count;
    RAISE NOTICE 'Dados físicos restantes: %', dados_fisicos_count;
    RAISE NOTICE 'Pesagens restantes: %', pesagens_count;
    RAISE NOTICE 'Respostas de teste restantes: %', test_responses_count;
    RAISE NOTICE 'Avaliações semanais restantes: %', weekly_eval_count;
    RAISE NOTICE 'Pontos de usuário restantes: %', user_points_count;
    
    IF profiles_count = 0 THEN
        RAISE NOTICE '✅ LIMPEZA CONCLUÍDA: Base de dados limpa e pronta para produção!';
    ELSE
        RAISE NOTICE '⚠️  ATENÇÃO: Ainda existem % profiles na base', profiles_count;
    END IF;
END $$;

-- =====================================================
-- NOTA IMPORTANTE SOBRE auth.users
-- =====================================================
-- ⚠️  A tabela auth.users não pode ser limpa via SQL
-- Para remover usuários da autenticação, use o painel do Supabase:
-- 1. Acesse: https://supabase.com/dashboard/project/skcfeldqipxaomrjfuym/auth/users
-- 2. Selecione os usuários de teste
-- 3. Clique em "Delete user" para cada um
-- 
-- Ou use a funcionalidade de "Bulk delete" se disponível
-- =====================================================