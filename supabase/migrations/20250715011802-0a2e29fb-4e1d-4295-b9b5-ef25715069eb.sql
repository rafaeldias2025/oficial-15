-- Adicionar foreign key entre pontuacao_diaria e profiles para corrigir o relacionamento
ALTER TABLE public.pontuacao_diaria 
ADD CONSTRAINT fk_pontuacao_diaria_user_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Criar índice para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_user_date 
ON public.pontuacao_diaria(user_id, data);

-- Criar índice para ranking semanal
CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_ranking 
ON public.pontuacao_diaria(data, total_pontos_dia);

-- Atualizar as funções de trigger para usar a nova estrutura
CREATE OR REPLACE FUNCTION public.calcular_pontuacao_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_pontos_dia = 
    COALESCE(NEW.pontos_liquido_manha, 0) +
    COALESCE(NEW.pontos_conexao_interna, 0) +
    COALESCE(NEW.pontos_energia_acordar, 0) +
    COALESCE(NEW.pontos_sono, 0) +
    COALESCE(NEW.pontos_agua, 0) +
    COALESCE(NEW.pontos_atividade_fisica, 0) +
    COALESCE(NEW.pontos_estresse, 0) +
    COALESCE(NEW.pontos_fome_emocional, 0) +
    COALESCE(NEW.pontos_gratidao, 0) +
    COALESCE(NEW.pontos_pequena_vitoria, 0) +
    COALESCE(NEW.pontos_intencao_amanha, 0) +
    COALESCE(NEW.pontos_avaliacao_dia, 0);

  -- Definir categoria do dia
  NEW.categoria_dia = CASE 
    WHEN NEW.total_pontos_dia >= 100 THEN 'excelente'
    WHEN NEW.total_pontos_dia >= 60 THEN 'medio'
    ELSE 'baixa'
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para calcular pontuação automaticamente
DROP TRIGGER IF EXISTS trigger_calcular_pontuacao_total ON public.pontuacao_diaria;
CREATE TRIGGER trigger_calcular_pontuacao_total
  BEFORE INSERT OR UPDATE ON public.pontuacao_diaria
  FOR EACH ROW
  EXECUTE FUNCTION public.calcular_pontuacao_total();