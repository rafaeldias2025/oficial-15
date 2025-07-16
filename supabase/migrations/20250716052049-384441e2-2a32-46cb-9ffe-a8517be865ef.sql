-- Adicionar triggers para as demais tabelas
CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_goals
  BEFORE INSERT OR UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_weight_goals
  BEFORE INSERT OR UPDATE ON public.weight_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_dados_saude
  BEFORE INSERT OR UPDATE ON public.dados_saude_usuario
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_historico_medidas
  BEFORE INSERT OR UPDATE ON public.historico_medidas
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

-- Atualizar registros existentes nas demais tabelas
UPDATE public.goals 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = goals.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;

UPDATE public.weight_goals 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = weight_goals.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;

UPDATE public.dados_saude_usuario 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = dados_saude_usuario.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;

UPDATE public.historico_medidas 
SET nome_usuario = public.get_user_name(
  (SELECT user_id FROM public.profiles WHERE id = historico_medidas.user_id LIMIT 1)
)
WHERE nome_usuario IS NULL;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_dados_fisicos_nome_usuario ON public.dados_fisicos_usuario(nome_usuario);
CREATE INDEX IF NOT EXISTS idx_pesagens_nome_usuario ON public.pesagens(nome_usuario);
CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_nome_usuario ON public.pontuacao_diaria(nome_usuario);
CREATE INDEX IF NOT EXISTS idx_user_points_nome_usuario ON public.user_points(nome_usuario);