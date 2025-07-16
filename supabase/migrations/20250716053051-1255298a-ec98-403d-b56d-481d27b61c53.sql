-- Função para criar perfil completo do usuário após signUp
CREATE OR REPLACE FUNCTION public.create_complete_user_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_celular TEXT,
  p_data_nascimento DATE,
  p_sexo TEXT,
  p_altura_cm INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_profile_id UUID;
  v_result JSONB;
BEGIN
  -- 1. Buscar o profile criado pelo trigger
  SELECT id INTO v_profile_id
  FROM public.profiles 
  WHERE user_id = p_user_id;
  
  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profile não encontrado para o usuário %', p_user_id;
  END IF;
  
  -- 2. Atualizar dados do profile se fornecidos
  IF p_data_nascimento IS NOT NULL OR p_sexo IS NOT NULL OR p_altura_cm IS NOT NULL THEN
    UPDATE public.profiles SET
      data_nascimento = COALESCE(p_data_nascimento, data_nascimento),
      sexo = COALESCE(p_sexo, sexo),
      altura_cm = COALESCE(p_altura_cm, altura_cm),
      updated_at = now()
    WHERE id = v_profile_id;
  END IF;
  
  -- 3. Criar dados_fisicos_usuario com dados do cadastro
  INSERT INTO public.dados_fisicos_usuario (
    user_id,
    nome_completo,
    data_nascimento,
    sexo,
    altura_cm,
    peso_atual_kg,
    circunferencia_abdominal_cm,
    meta_peso_kg
  ) VALUES (
    v_profile_id,
    COALESCE(p_full_name, 'Usuário'),
    COALESCE(p_data_nascimento, CURRENT_DATE - INTERVAL '30 years'),
    COALESCE(p_sexo, 'outro'),
    COALESCE(p_altura_cm, 170),
    70.0, -- Peso padrão inicial
    90.0, -- Circunferência padrão inicial
    70.0  -- Meta inicial igual ao peso
  ) ON CONFLICT (user_id) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    data_nascimento = EXCLUDED.data_nascimento,
    sexo = EXCLUDED.sexo,
    altura_cm = EXCLUDED.altura_cm,
    updated_at = now();
  
  -- 4. Criar user_points inicial para ranking
  INSERT INTO public.user_points (
    user_id,
    total_points,
    daily_points,
    weekly_points,
    monthly_points,
    current_streak,
    best_streak,
    completed_challenges,
    last_activity_date
  ) VALUES (
    v_profile_id,
    0, 0, 0, 0, 0, 0, 0, CURRENT_DATE
  ) ON CONFLICT (user_id) DO NOTHING;
  
  -- 5. Criar primeira pesagem com dados iniciais
  INSERT INTO public.pesagens (
    user_id,
    peso_kg,
    data_medicao,
    origem_medicao,
    imc
  ) VALUES (
    v_profile_id,
    70.0,
    now(),
    'cadastro_inicial',
    70.0 / POWER(COALESCE(p_altura_cm, 170) / 100.0, 2)
  ) ON CONFLICT (user_id, data_medicao) DO NOTHING;
  
  -- 6. Retornar resultado do processo
  v_result := jsonb_build_object(
    'success', true,
    'profile_id', v_profile_id,
    'message', 'Perfil completo criado com sucesso'
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro e retornar erro estruturado
    RAISE LOG 'Error in create_complete_user_profile: %', SQLERRM;
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Erro ao criar perfil completo'
    );
END;
$$;