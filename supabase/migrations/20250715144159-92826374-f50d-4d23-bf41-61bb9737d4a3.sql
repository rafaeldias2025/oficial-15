-- Remover todos os triggers problemáticos da tabela missao_dia
DROP TRIGGER IF EXISTS safe_sync_pontuacao_trigger ON missao_dia;
DROP TRIGGER IF EXISTS sync_daily_score_trigger ON missao_dia;
DROP TRIGGER IF EXISTS update_missoes_usuario_trigger ON missao_dia;

-- Remover também as funções correspondentes
DROP FUNCTION IF EXISTS public.safe_sync_pontuacao_diaria();
DROP FUNCTION IF EXISTS public.sync_daily_score();
DROP FUNCTION IF EXISTS public.update_missoes_usuario();

-- Agora vamos simplificar: criar apenas um trigger que funciona corretamente
CREATE OR REPLACE FUNCTION public.simple_update_points_on_mission()
RETURNS TRIGGER AS $$
BEGIN
  -- Só atualizar pontos quando a missão for concluída
  IF NEW.concluido = true AND (OLD.concluido IS NULL OR OLD.concluido = false) THEN
    -- Calcular pontos simples baseado na conclusão da missão
    PERFORM update_user_points(NEW.user_id, 50, 'mission_completion');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger simplificado
CREATE TRIGGER simple_mission_points_trigger
  AFTER UPDATE ON missao_dia
  FOR EACH ROW
  EXECUTE FUNCTION public.simple_update_points_on_mission();