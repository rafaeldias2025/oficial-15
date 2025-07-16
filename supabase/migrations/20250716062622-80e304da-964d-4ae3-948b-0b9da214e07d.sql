-- 1. Stored Procedure para cadastro completo (corrigida)
CREATE OR REPLACE FUNCTION public.create_complete_user_registration(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_data_nascimento DATE,
  p_sexo TEXT,
  p_altura_cm INTEGER,
  p_peso_atual_kg NUMERIC,
  p_circunferencia_abdominal_cm NUMERIC,
  p_celular TEXT DEFAULT NULL,
  p_meta_peso_kg NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_profile_id UUID;
  v_result JSONB;
  v_imc NUMERIC;
  v_health_check JSONB;
BEGIN
  -- Iniciar transação implícita
  
  -- 1. Buscar ou criar profile
  SELECT id INTO v_profile_id
  FROM public.profiles 
  WHERE user_id = p_user_id;
  
  IF v_profile_id IS NULL THEN
    INSERT INTO public.profiles (
      user_id, email, full_name, celular, data_nascimento, sexo, altura_cm
    ) VALUES (
      p_user_id, p_email, p_full_name, p_celular, p_data_nascimento, p_sexo, p_altura_cm
    ) RETURNING id INTO v_profile_id;
  ELSE
    -- Atualizar dados do profile se já existir
    UPDATE public.profiles SET
      full_name = COALESCE(p_full_name, full_name),
      celular = COALESCE(p_celular, celular),
      data_nascimento = COALESCE(p_data_nascimento, data_nascimento),
      sexo = COALESCE(p_sexo, sexo),
      altura_cm = COALESCE(p_altura_cm, altura_cm),
      updated_at = now()
    WHERE id = v_profile_id;
  END IF;

  -- Calcular IMC
  v_imc := ROUND((p_peso_atual_kg / POWER(p_altura_cm / 100.0, 2))::NUMERIC, 2);
  
  -- 2. Inserir/Atualizar dados físicos
  INSERT INTO public.dados_fisicos_usuario (
    user_id, nome_completo, data_nascimento, sexo, altura_cm, 
    peso_atual_kg, circunferencia_abdominal_cm, meta_peso_kg, imc
  ) VALUES (
    v_profile_id, p_full_name, p_data_nascimento, p_sexo, p_altura_cm,
    p_peso_atual_kg, p_circunferencia_abdominal_cm, 
    COALESCE(p_meta_peso_kg, p_peso_atual_kg), v_imc
  ) ON CONFLICT (user_id) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    peso_atual_kg = EXCLUDED.peso_atual_kg,
    circunferencia_abdominal_cm = EXCLUDED.circunferencia_abdominal_cm,
    meta_peso_kg = EXCLUDED.meta_peso_kg,
    imc = EXCLUDED.imc,
    updated_at = now();

  -- 3. Inserir/Atualizar dados de saúde
  INSERT INTO public.dados_saude_usuario (
    user_id, peso_atual_kg, altura_cm, circunferencia_abdominal_cm, 
    meta_peso_kg, imc
  ) VALUES (
    v_profile_id, p_peso_atual_kg, p_altura_cm, p_circunferencia_abdominal_cm,
    COALESCE(p_meta_peso_kg, p_peso_atual_kg), v_imc
  ) ON CONFLICT (user_id) DO UPDATE SET
    peso_atual_kg = EXCLUDED.peso_atual_kg,
    circunferencia_abdominal_cm = EXCLUDED.circunferencia_abdominal_cm,
    meta_peso_kg = EXCLUDED.meta_peso_kg,
    imc = EXCLUDED.imc,
    data_atualizacao = now();

  -- 4. Criar primeira pesagem
  INSERT INTO public.pesagens (
    user_id, peso_kg, circunferencia_abdominal_cm, imc,
    data_medicao, origem_medicao
  ) VALUES (
    v_profile_id, p_peso_atual_kg, p_circunferencia_abdominal_cm, v_imc,
    now(), 'cadastro_inicial'
  ) ON CONFLICT (user_id, data_medicao) DO UPDATE SET
    peso_kg = EXCLUDED.peso_kg,
    circunferencia_abdominal_cm = EXCLUDED.circunferencia_abdominal_cm,
    imc = EXCLUDED.imc;

  -- 5. Inicializar pontos do usuário
  INSERT INTO public.user_points (
    user_id, total_points, daily_points, weekly_points, monthly_points,
    current_streak, best_streak, completed_challenges, last_activity_date
  ) VALUES (
    v_profile_id, 0, 0, 0, 0, 0, 0, 0, CURRENT_DATE
  ) ON CONFLICT (user_id) DO NOTHING;

  -- 6. Executar health check
  SELECT public.execute_user_health_check(v_profile_id) INTO v_health_check;
  
  -- 7. Preparar resultado
  v_result := jsonb_build_object(
    'success', true,
    'profile_id', v_profile_id,
    'user_id', p_user_id,
    'imc_calculated', v_imc,
    'health_check', v_health_check,
    'message', 'Cadastro completo realizado com sucesso'
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro e retornar erro estruturado
    RAISE LOG 'Error in create_complete_user_registration: %', SQLERRM;
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Erro ao realizar cadastro completo'
    );
END;
$$;

-- 2. Health Check Function
CREATE OR REPLACE FUNCTION public.execute_user_health_check(p_profile_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result JSONB;
  v_profile_exists BOOLEAN := FALSE;
  v_physical_data_exists BOOLEAN := FALSE;
  v_health_data_exists BOOLEAN := FALSE;
  v_weighing_exists BOOLEAN := FALSE;
  v_points_exists BOOLEAN := FALSE;
  v_missing_fields TEXT[] := '{}';
  v_status TEXT := 'healthy';
BEGIN
  -- Verificar profile
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = p_profile_id) INTO v_profile_exists;
  
  -- Verificar dados físicos
  SELECT EXISTS(
    SELECT 1 FROM public.dados_fisicos_usuario 
    WHERE user_id = p_profile_id 
    AND altura_cm IS NOT NULL 
    AND peso_atual_kg IS NOT NULL 
    AND sexo IS NOT NULL
  ) INTO v_physical_data_exists;
  
  -- Verificar dados de saúde
  SELECT EXISTS(
    SELECT 1 FROM public.dados_saude_usuario 
    WHERE user_id = p_profile_id 
    AND peso_atual_kg IS NOT NULL
    AND altura_cm IS NOT NULL
  ) INTO v_health_data_exists;
  
  -- Verificar pesagem
  SELECT EXISTS(SELECT 1 FROM public.pesagens WHERE user_id = p_profile_id) INTO v_weighing_exists;
  
  -- Verificar pontos
  SELECT EXISTS(SELECT 1 FROM public.user_points WHERE user_id = p_profile_id) INTO v_points_exists;
  
  -- Determinar campos ausentes
  IF NOT v_profile_exists THEN v_missing_fields := array_append(v_missing_fields, 'profile'); END IF;
  IF NOT v_physical_data_exists THEN v_missing_fields := array_append(v_missing_fields, 'physical_data'); END IF;
  IF NOT v_health_data_exists THEN v_missing_fields := array_append(v_missing_fields, 'health_data'); END IF;
  IF NOT v_weighing_exists THEN v_missing_fields := array_append(v_missing_fields, 'weighing'); END IF;
  IF NOT v_points_exists THEN v_missing_fields := array_append(v_missing_fields, 'points'); END IF;
  
  -- Determinar status
  IF array_length(v_missing_fields, 1) > 0 THEN
    v_status := 'incomplete';
  END IF;
  
  -- Construir resultado
  v_result := jsonb_build_object(
    'profile_id', p_profile_id,
    'status', v_status,
    'checks', jsonb_build_object(
      'profile_exists', v_profile_exists,
      'physical_data_exists', v_physical_data_exists,
      'health_data_exists', v_health_data_exists,
      'weighing_exists', v_weighing_exists,
      'points_exists', v_points_exists
    ),
    'missing_fields', v_missing_fields,
    'checked_at', now()
  );
  
  -- Log se houver problemas
  IF v_status = 'incomplete' THEN
    RAISE LOG 'Health check failed for profile %: missing %', p_profile_id, v_missing_fields;
  END IF;
  
  RETURN v_result;
END;
$$;

-- 3. Função de monitoramento de integridade
CREATE OR REPLACE FUNCTION public.run_data_integrity_monitor()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result JSONB;
  v_users_without_weighings INTEGER;
  v_records_without_user_id INTEGER;
  v_null_critical_fields INTEGER;
  v_orphaned_profiles INTEGER;
BEGIN
  -- Usuários sem pesagens
  SELECT COUNT(*) INTO v_users_without_weighings
  FROM public.profiles p
  LEFT JOIN public.pesagens pe ON p.id = pe.user_id
  WHERE pe.user_id IS NULL AND p.role = 'client';
  
  -- Registros sem user_id válido (órfãos)
  SELECT COUNT(*) INTO v_records_without_user_id
  FROM (
    SELECT user_id FROM public.dados_fisicos_usuario WHERE user_id NOT IN (SELECT id FROM public.profiles)
    UNION ALL
    SELECT user_id FROM public.dados_saude_usuario WHERE user_id NOT IN (SELECT id FROM public.profiles)
    UNION ALL
    SELECT user_id FROM public.pesagens WHERE user_id NOT IN (SELECT id FROM public.profiles)
  ) orphaned;
  
  -- Campos críticos com valores null
  SELECT COUNT(*) INTO v_null_critical_fields
  FROM public.dados_fisicos_usuario
  WHERE altura_cm IS NULL OR peso_atual_kg IS NULL OR sexo IS NULL;
  
  -- Profiles sem dados físicos (para clientes)
  SELECT COUNT(*) INTO v_orphaned_profiles
  FROM public.profiles p
  LEFT JOIN public.dados_fisicos_usuario dfu ON p.id = dfu.user_id
  WHERE dfu.user_id IS NULL AND p.role = 'client';
  
  v_result := jsonb_build_object(
    'monitor_timestamp', now(),
    'status', CASE 
      WHEN v_users_without_weighings + v_records_without_user_id + v_null_critical_fields + v_orphaned_profiles = 0 
      THEN 'healthy' 
      ELSE 'warning' 
    END,
    'issues', jsonb_build_object(
      'users_without_weighings', v_users_without_weighings,
      'records_without_user_id', v_records_without_user_id,
      'null_critical_fields', v_null_critical_fields,
      'orphaned_profiles', v_orphaned_profiles
    ),
    'recommendations', CASE 
      WHEN v_users_without_weighings > 0 THEN jsonb_build_array('Create initial weighings for users without them')
      ELSE jsonb_build_array()
    END ||
    CASE 
      WHEN v_records_without_user_id > 0 THEN jsonb_build_array('Clean up orphaned records')
      ELSE jsonb_build_array()
    END ||
    CASE 
      WHEN v_null_critical_fields > 0 THEN jsonb_build_array('Fill null critical fields')
      ELSE jsonb_build_array()
    END ||
    CASE 
      WHEN v_orphaned_profiles > 0 THEN jsonb_build_array('Complete physical data for client profiles')
      ELSE jsonb_build_array()
    END
  );
  
  RETURN v_result;
END;
$$;