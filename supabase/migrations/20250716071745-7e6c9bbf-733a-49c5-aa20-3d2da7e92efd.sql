-- =====================================================
-- LIMPEZA COMPLETA DE DADOS DE TESTE - VERSÃO CORRIGIDA
-- =====================================================
-- Esta migração remove todos os dados de usuários de teste
-- mantendo apenas a estrutura do banco e políticas RLS

-- ⚠️  ATENÇÃO: Esta operação é IRREVERSÍVEL
-- Todos os dados de usuários serão permanentemente removidos

-- PRIMEIRO: Limpar referências em tabelas que apontam para profiles
-- =====================================================

-- 1. Limpar testes criados por usuários (ANTES de apagar profiles)
UPDATE public.tests SET created_by = NULL WHERE created_by IS NOT NULL;

-- 2. Limpar cursos criados por usuários (ANTES de apagar profiles)
UPDATE public.courses SET created_by = NULL WHERE created_by IS NOT NULL;

-- 3. Limpar sessões atribuídas e criadas por usuários (ANTES de apagar profiles)
UPDATE public.sessions SET assigned_to = NULL WHERE assigned_to IS NOT NULL;
UPDATE public.sessions SET created_by = NULL WHERE created_by IS NOT NULL;

-- SEGUNDO: Limpar dados relacionados aos usuários
-- =====================================================

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

-- TERCEIRO: Por último, limpar a tabela profiles
-- =====================================================
DELETE FROM public.profiles WHERE id IS NOT NULL;

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
    interactions_count INTEGER;
    total_user_data INTEGER;
BEGIN
    -- Verificar se as tabelas estão vazias
    SELECT COUNT(*) INTO profiles_count FROM public.profiles;
    SELECT COUNT(*) INTO dados_fisicos_count FROM public.dados_fisicos_usuario;
    SELECT COUNT(*) INTO pesagens_count FROM public.pesagens;
    SELECT COUNT(*) INTO test_responses_count FROM public.test_responses;
    SELECT COUNT(*) INTO weekly_eval_count FROM public.weekly_evaluations;
    SELECT COUNT(*) INTO user_points_count FROM public.user_points;
    SELECT COUNT(*) INTO interactions_count FROM public.interactions;
    
    -- Calcular total de dados de usuário restantes
    total_user_data := profiles_count + dados_fisicos_count + pesagens_count + 
                      test_responses_count + weekly_eval_count + user_points_count + interactions_count;
    
    -- Log dos resultados
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '       RELATÓRIO DE LIMPEZA COMPLETA      ';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 TABELAS PRINCIPAIS:';
    RAISE NOTICE '   • Profiles: %', profiles_count;
    RAISE NOTICE '   • Dados físicos: %', dados_fisicos_count;
    RAISE NOTICE '   • Pesagens: %', pesagens_count;
    RAISE NOTICE '   • Respostas de teste: %', test_responses_count;
    RAISE NOTICE '   • Avaliações semanais: %', weekly_eval_count;
    RAISE NOTICE '   • Pontos de usuário: %', user_points_count;
    RAISE NOTICE '   • Interações: %', interactions_count;
    RAISE NOTICE '';
    RAISE NOTICE '📈 TOTAL DE DADOS DE USUÁRIO: %', total_user_data;
    RAISE NOTICE '';
    
    IF total_user_data = 0 THEN
        RAISE NOTICE '✅ LIMPEZA 100%% CONCLUÍDA!';
        RAISE NOTICE '🎯 Base de dados limpa e pronta para PRODUÇÃO!';
        RAISE NOTICE '🚀 Sistema pronto para os primeiros usuários reais.';
    ELSE
        RAISE NOTICE '⚠️  ATENÇÃO: Ainda existem % registros de usuário', total_user_data;
        RAISE NOTICE '❌ Limpeza não foi totalmente concluída.';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
END $$;

-- =====================================================
-- PRÓXIMOS PASSOS PARA LIMPEZA COMPLETA
-- =====================================================
-- ⚠️  IMPORTANTE: A tabela auth.users deve ser limpa manualmente
-- 
-- Para completar a limpeza:
-- 1. Acesse: https://supabase.com/dashboard/project/skcfeldqipxaomrjfuym/auth/users
-- 2. Selecione todos os usuários de teste
-- 3. Delete cada usuário usando o botão "Delete user"
-- 4. Isso removerá completamente os usuários da autenticação
-- 
-- 🎯 Após isso, a base estará 100% limpa para produção!
-- =====================================================