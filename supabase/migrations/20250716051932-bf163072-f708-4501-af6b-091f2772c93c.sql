-- Função trigger para atualizar nome_usuario automaticamente
CREATE OR REPLACE FUNCTION public.update_nome_usuario()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  auth_user_id UUID;
BEGIN
  -- Buscar o auth.user_id correspondente ao user_id da tabela
  SELECT user_id INTO auth_user_id
  FROM public.profiles
  WHERE id = NEW.user_id
  LIMIT 1;
  
  -- Se não encontrar, assumir que user_id já é o auth.user_id
  IF auth_user_id IS NULL THEN
    auth_user_id := NEW.user_id;
  END IF;
  
  -- Buscar o nome do usuário
  user_name := public.get_user_name(auth_user_id);
  
  -- Atualizar o campo nome_usuario
  NEW.nome_usuario := user_name;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para as tabelas principais primeiro
CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_dados_fisicos
  BEFORE INSERT OR UPDATE ON public.dados_fisicos_usuario
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_pesagens
  BEFORE INSERT OR UPDATE ON public.pesagens
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_pontuacao_diaria
  BEFORE INSERT OR UPDATE ON public.pontuacao_diaria
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_user_points
  BEFORE INSERT OR UPDATE ON public.user_points
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();

CREATE OR REPLACE TRIGGER trigger_update_nome_usuario_missao_dia
  BEFORE INSERT OR UPDATE ON public.missao_dia
  FOR EACH ROW EXECUTE FUNCTION public.update_nome_usuario();