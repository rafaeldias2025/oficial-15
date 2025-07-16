-- BACKUP COMPLETO DOS DADOS SUPABASE
-- Data: 2025-07-15
-- Instruções: Execute este script na nova conta Supabase após criar as tabelas

-- =============================================
-- 1. PROFILES (30 usuários)
-- =============================================

-- Inserir perfis de usuários
INSERT INTO profiles (id, user_id, full_name, email, celular, data_nascimento, sexo, altura_cm, role, created_at, updated_at) VALUES
('89d64df0-4171-4a44-9c98-2607a6f942a4', '71f53b82-a7f7-4257-9386-97a250277218', 'Bruno lima', 'tvmensal10@gmail.com', '11973125846', '2020-12-20', 'feminino', 120, 'client', '2025-07-14 22:31:49.162783+00', '2025-07-14 22:31:49.162783+00'),
('4fbd0728-fae2-41d3-b61e-55fee7e7e17f', 'cc282936-7bb4-483f-a436-d284e224d44d', 'lucas feliciano', 'lucasfelciano@gmail.com', '1989191923131', NULL, NULL, NULL, 'client', '2025-07-14 17:20:20.725039+00', '2025-07-14 17:20:20.725039+00'),
('c3682707-d0af-4cac-b8e1-055fd33b581e', 'c41bb952-75a3-40d4-9a14-959516d2edbc', 'marcos feliciano dias', 'marcosflicianodias@gmail.com', '119731125846', NULL, NULL, NULL, 'client', '2025-07-14 16:17:39.054116+00', '2025-07-14 16:17:39.054116+00'),
('d95e278e-27e7-4f9e-968e-d61134609cf3', '7b474c77-f0f9-45b0-8a8a-94e663bb266d', 'Maria Pereira', 'mariapereira@gmail.com', '19228282828', NULL, NULL, NULL, 'client', '2025-07-14 14:33:31.521739+00', '2025-07-14 14:33:31.521739+00'),
('e1eac262-c36a-45ff-b945-405951d725f3', '8107ba54-dc1d-4827-b0f7-fb85f418e860', 'russa ruussa', 'russa@gmail.com', '192192192192', NULL, NULL, NULL, 'client', '2025-07-14 09:10:59.52383+00', '2025-07-14 09:10:59.52383+00'),
('8fcdc37f-da5d-4156-a73d-4eaed612dac3', 'd4c7e35c-2f66-4e5d-8d09-c0ba8d0d7187', 'rafael', 'admin@instituto.com', NULL, '1220-02-10', 'feminino', 170, 'admin', '2025-07-13 23:06:27.612669+00', '2025-07-15 00:48:56.762438+00'),
('06b73ad1-017d-4bf9-9577-c396e02929ef', '7b594aa9-7dec-4df9-9827-e94bf2dc9c2d', 'jessica oliveira', 'jessica@gmail.com', '11971254913', '2000-02-10', 'feminino', 170, 'client', '2025-07-13 03:36:00.159889+00', '2025-07-14 18:10:27.896624+00'),
('7d47f700-9089-4135-b916-365d8cf78956', '193fb614-3e07-48fd-b839-a91505014d3e', 'lucas fabricio', 'lucas@gmail.com', NULL, '2000-07-15', 'masculino', 178, 'client', '2025-07-13 03:03:15.761458+00', '2025-07-14 18:54:58.996516+00'),
('7c9b2491-f9a7-4098-a28a-e6d7e8410714', '7d2df58b-64a9-478e-afa6-9ea1f66af4c3', 'Bruno perine', 'bruno@gmail.com', NULL, '2000-02-10', 'masculino', 155, 'client', '2025-07-13 01:31:42.847462+00', '2025-07-15 16:38:15.633853+00'),
('37c07834-f0f8-4285-a454-1a780cfb423b', '3101092a-83e5-48b5-83a4-280db2ad28f7', 'RAFAEL F', 'rafael@gmail.com', NULL, '1993-07-20', 'masculino', 168, 'client', '2025-07-13 00:56:47.831187+00', '2025-07-15 16:48:47.47108+00');

-- =============================================
-- 2. USER_POINTS (Sistema de Pontuação)
-- =============================================

INSERT INTO user_points (id, user_id, total_points, daily_points, weekly_points, monthly_points, current_streak, best_streak, completed_challenges, last_activity_date, created_at, updated_at) VALUES
('8944e2ea-e627-4354-b5a7-c47c553c0d81', '7c9b2491-f9a7-4098-a28a-e6d7e8410714', 115, 115, 115, 115, 1, 1, 0, '2025-07-13', '2025-07-13 01:34:43.409411+00', '2025-07-13 02:30:28.852036+00'),
('bd5bc3bd-350b-4e5d-a08d-caae245c8a6d', '06b73ad1-017d-4bf9-9577-c396e02929ef', 50, 50, 50, 50, 1, 1, 0, '2025-07-15', '2025-07-13 03:36:24.179716+00', '2025-07-15 14:44:46.812549+00');

-- =============================================
-- 3. DADOS_FISICOS_USUARIO (Dados físicos completos)
-- =============================================

INSERT INTO dados_fisicos_usuario (id, user_id, nome_completo, altura_cm, peso_atual_kg, circunferencia_abdominal_cm, data_nascimento, sexo, imc, categoria_imc, risco_cardiometabolico, meta_peso_kg, created_at, updated_at) VALUES
('f9d70213-9883-44e1-8ff7-735828c1b340', 'c8c593d0-c70c-4623-882e-a2644a562847', 'Luciano e murilo', 178, 90, 75, '1979-08-18', 'Feminino', 28.4055043555106678, 'Sobrepeso', 'Baixo', NULL, '2025-07-13 06:37:53.25856+00', '2025-07-13 06:37:53.25856+00'),
('cebc030b-86c0-4e18-b6e0-30f7b4f87aa3', 'e09e6a63-1109-46b9-ba9a-84ebe6fe3031', 'Junior dias', 190, 180, 170, '20000-10-10', 'Masculino', 49.8614958448753463, 'Obesidade grau III', 'Alto', NULL, '2025-07-13 05:57:21.455394+00', '2025-07-13 05:57:21.455394+00'),
('4e5765a5-f0dd-445e-9373-e0f93de51e16', '8524bde2-05ab-4469-9815-f1fe1f99126b', 'kiko', 180, 90, 119, '20000-09-09', 'Masculino', 27.7777777777777778, 'Sobrepeso', 'Alto', NULL, '2025-07-13 05:35:15.32547+00', '2025-07-13 05:35:15.32547+00'),
('781c776d-1fd2-4ece-a970-bafe2226858a', 'a5f2d558-f733-437a-ab33-3d9d30fbd0c0', 'surfa dias', 170, 89, 90, '1122-02-12', 'Outro', 30.7958477508650519, 'Obesidade grau I', 'Baixo', NULL, '2025-07-13 05:23:58.1777+00', '2025-07-13 05:23:58.1777+00'),
('2af44f49-98a3-4ef4-bc03-f626e0736b7b', '62290e6c-290d-4424-bdb3-b7276d490f46', 'BRUNA PERINE', 180, 90, 90, '20000-02-20', 'Masculino', 27.7777777777777778, 'Sobrepeso', 'Baixo', NULL, '2025-07-13 05:05:27.875067+00', '2025-07-13 05:05:27.875067+00'),
('edee8d33-267a-426d-aa08-1b3d72764cb4', '7fbfe4c3-dcde-4903-94dd-6a4c91921cf9', 'Lucas Silva', 175, 80, 90, '1993-07-20', 'Masculino', 26.1224489795918367, 'Sobrepeso', 'Baixo', NULL, '2025-07-13 04:44:14.467502+00', '2025-07-13 04:44:14.467502+00'),
('8b3dc9ae-cea2-4da2-899c-10ba1cecee70', '7d47f700-9089-4135-b916-365d8cf78956', 'Marcia', 190, 90, 140, '1993-07-20', 'Masculino', 24.9307479224376731, 'Peso normal', 'Alto', NULL, '2025-07-13 03:45:01.030069+00', '2025-07-13 03:45:01.030069+00');

-- =============================================
-- 4. DADOS_SAUDE_USUARIO (Dados de saúde atualizados)
-- =============================================

INSERT INTO dados_saude_usuario (id, user_id, altura_cm, peso_atual_kg, circunferencia_abdominal_cm, meta_peso_kg, imc, progresso_percentual, data_atualizacao, created_at) VALUES
('4d3f6b7a-56c9-45e8-9713-6a75271bb246', '06b73ad1-017d-4bf9-9577-c396e02929ef', 170, 71.90, 90.00, 90.00, 24.88, 100.00, '2025-07-15 15:17:30.966+00', '2025-07-15 15:17:31.086399+00'),
('7fc91198-a22e-49a6-9a4c-77dc48a996b2', '06b73ad1-017d-4bf9-9577-c396e02929ef', 170, 75.30, 110.00, 90.00, 26.06, 100.00, '2025-07-15 13:57:15.637+00', '2025-07-15 13:57:15.77381+00'),
('14218fae-ca91-4d55-825a-e55fd8f4d8f0', '06b73ad1-017d-4bf9-9577-c396e02929ef', 170, 75.70, 120.00, 90.00, 26.19, 100.00, '2025-07-15 03:19:33.404+00', '2025-07-15 03:19:33.525362+00'),
('8ca494c6-a666-44cb-97c2-b369a2602a04', '89d64df0-4171-4a44-9c98-2607a6f942a4', 170, 75.60, 90.00, 75.60, 26.16, 100.00, '2025-07-14 22:32:38.811+00', '2025-07-14 22:32:38.928589+00');

-- =============================================
-- 5. MISSAO_DIA (Missões diárias dos usuários)
-- =============================================

INSERT INTO missao_dia (id, user_id, data, agua_litros, atividade_fisica, energia_ao_acordar, estresse_nivel, fome_emocional, gratidao, liquido_ao_acordar, intencao_para_amanha, nota_dia, pequena_vitoria, pratica_conexao, sono_horas, concluido, created_at, updated_at) VALUES
('109dd547-61bc-43b8-aefc-d2023fcd670f', '06b73ad1-017d-4bf9-9577-c396e02929ef', '2025-07-15', '1L', true, 4, 4, false, 'Minha saúde', 'Outro', 'Estar presente', 2, 'Comi bem', 'Oração', 6, true, '2025-07-15 14:43:46.239681+00', '2025-07-15 15:35:10.875099+00'),
('6af15c4f-2b80-4f16-b333-1c9332707cb1', '37c07834-f0f8-4285-a454-1a780cfb423b', '2025-07-15', '1L', true, 1, 2, true, 'Minha saúde', 'Água morna com limão', 'Cuidar de mim', 3, 'Corrida', 'Meditação', 6, false, '2025-07-15 16:48:52.240405+00', '2025-07-15 16:49:20.886881+00'),
('f067af0d-607a-4367-8e2d-fb4173ff7d83', '7c9b2491-f9a7-4098-a28a-e6d7e8410714', '2025-07-15', '1L', true, 3, 5, false, 'Minha saúde', 'Outro', 'Estar presente', 1, 'Corrida', 'Respiração consciente', 8, false, '2025-07-15 14:56:41.014832+00', '2025-07-15 15:28:46.699692+00'),
('287d37e8-bd03-4fe0-a858-aaebdf6f61d6', '8fcdc37f-da5d-4156-a73d-4eaed612dac3', '2025-07-14', 'Menos de 500ml', NULL, 1, 1, true, 'Outro', 'Outro', 'Fazer melhor', 5, NULL, 'Meditação', 4, false, '2025-07-14 00:16:53.068166+00', '2025-07-14 15:51:31.915684+00'),
('4c9dcd0e-e29b-40a0-bb2c-2270bd42858e', 'b0a4652a-8673-4eb9-b8bc-f534db24574a', '2025-07-13', 'Menos de 500ml', false, 1, 5, true, 'Meu trabalho', 'Água morna com limão', 'Fazer melhor', 1, 'acordar', 'Oração', 4, true, '2025-07-13 03:09:25.44562+00', '2025-07-13 03:09:53.883711+00'),
('538353fd-4135-4821-8c8f-5b7efdf7a1ea', 'a5f2d558-f733-437a-ab33-3d9d30fbd0c0', '2025-07-13', '2L', false, 3, 3, true, 'Minha família', 'Chá natural', 'Estar presente', 5, 'aSas', 'Respiração consciente', 6, true, '2025-07-13 05:24:39.827145+00', '2025-07-13 05:24:59.691355+00'),
('e051b3ae-975b-4f52-884d-efac2b61abba', '7d47f700-9089-4135-b916-365d8cf78956', '2025-07-13', '2L', true, 1, 4, true, 'Minha saúde', 'Água gelada', 'Outro', 3, 'Levantei', 'Não fiz hoje', 9, true, '2025-07-13 03:03:33.03707+00', '2025-07-13 03:04:38.08307+00');

-- =============================================
-- 6. PESAGENS (Medições de balança)
-- =============================================

INSERT INTO pesagens (id, user_id, peso_kg, agua_corporal_pct, gordura_corporal_pct, gordura_visceral, massa_muscular_kg, massa_ossea_kg, taxa_metabolica_basal, tipo_corpo, origem_medicao, data_medicao, created_at, updated_at) VALUES
('67b9b0b6-16e7-45bf-9f45-1679c77aa7a2', '06b73ad1-017d-4bf9-9577-c396e02929ef', 71.9, 58, 20.6, 3, 12.7, 2.7, 1637, 'Normal', 'balança_bluetooth', '2025-07-15 15:17:11.38+00', '2025-07-15 15:17:30.936256+00', '2025-07-15 15:17:30.936256+00'),
('4b854597-a723-4db9-82c9-7072393ab134', '06b73ad1-017d-4bf9-9577-c396e02929ef', 75.3, 57, 22, 3, 13, 2.9, 1671, 'Sobrepeso', 'balança_bluetooth', '2025-07-15 13:56:52.514+00', '2025-07-15 13:57:15.618591+00', '2025-07-15 13:57:15.618591+00'),
('d3bfc3df-4d38-47d0-92fc-4402da7d580f', '06b73ad1-017d-4bf9-9577-c396e02929ef', 75.7, 56.8, 22.1, 3, 13, 2.9, 1675, 'Sobrepeso com gordura alta', 'balança_bluetooth', '2025-07-15 03:19:26.661+00', '2025-07-15 03:19:33.404861+00', '2025-07-15 03:19:33.404861+00'),
('2bf78d61-8b38-4356-8daf-31cdf0a5117c', '06b73ad1-017d-4bf9-9577-c396e02929ef', 69.3, 58.8, 19.5, 3, 12.4, 2.6, 1611, 'Normal', 'balança_bluetooth', '2025-07-15 01:21:51.44+00', '2025-07-15 01:22:06.781464+00', '2025-07-15 01:22:06.781464+00'),
('543c00aa-ccd0-4fdb-a946-73bfd80229d6', '89d64df0-4171-4a44-9c98-2607a6f942a4', 75.6, 56.9, 22.1, 3, 13, 2.9, 1674, 'Sobrepeso com gordura alta', 'balança_bluetooth', '2025-07-14 22:32:29.485+00', '2025-07-14 22:32:38.781407+00', '2025-07-14 22:32:38.781407+00'),
('4635ac05-8fd7-4ff9-9bee-e34757327c55', '06b73ad1-017d-4bf9-9577-c396e02929ef', 71.9, 58, 20.6, 3, 12.7, 2.7, 1637, 'Normal', 'balança_bluetooth', '2025-07-14 21:39:47.593+00', '2025-07-14 21:40:03.030346+00', '2025-07-14 21:40:03.030346+00'),
('bfd656e1-d37d-438a-adf9-daf305e6f0bb', '06b73ad1-017d-4bf9-9577-c396e02929ef', 97.3, 50.3, 31.1, 5, 14.4, 3.7, 1891, 'Sobrepeso com gordura alta', 'balança_bluetooth', '2025-07-14 20:08:44.145+00', '2025-07-14 20:08:56.478795+00', '2025-07-14 20:08:56.478795+00');

-- =============================================
-- 7. HISTORICO_MEDIDAS (Histórico de medidas)
-- =============================================

INSERT INTO historico_medidas (id, user_id, peso_kg, altura_cm, circunferencia_abdominal_cm, imc, data_medicao, created_at) VALUES
('8912bfa5-32dc-4ec8-a98f-955418f2ff30', '7d47f700-9089-4135-b916-365d8cf78956', 90, 190, 140, 24.9307479224376731, '2025-07-13', '2025-07-13 03:45:01.030069+00'),
('7bfb415b-e323-4b35-920c-c09663593729', '7fbfe4c3-dcde-4903-94dd-6a4c91921cf9', 80, 175, 90, 26.1224489795918367, '2025-07-13', '2025-07-13 04:44:14.467502+00'),
('d35faae3-cd26-4b8f-8ccf-4ac21015fc7b', '62290e6c-290d-4424-bdb3-b7276d490f46', 90, 180, 90, 27.7777777777777778, '2025-07-13', '2025-07-13 05:05:27.875067+00'),
('d149b2ae-7c76-48d2-9176-73aa90af994a', 'a5f2d558-f733-437a-ab33-3d9d30fbd0c0', 89, 170, 90, 30.7958477508650519, '2025-07-13', '2025-07-13 05:23:58.1777+00'),
('629f449c-f5ee-4df0-b6d6-b514304e2da2', '8524bde2-05ab-4469-9815-f1fe1f99126b', 90, 180, 119, 27.7777777777777778, '2025-07-13', '2025-07-13 05:35:15.32547+00'),
('535317e6-adaf-476d-97f9-7146b0a112f0', 'e09e6a63-1109-46b9-ba9a-84ebe6fe3031', 180, 190, 170, 49.8614958448753463, '2025-07-13', '2025-07-13 05:57:21.455394+00'),
('fed0787b-3b6a-43ab-a5eb-208ba213ab11', 'c8c593d0-c70c-4623-882e-a2644a562847', 90, 178, 75, 28.4055043555106678, '2025-07-13', '2025-07-13 06:37:53.25856+00');

-- =============================================
-- 8. INFORMACOES_FISICAS (Informações físicas básicas)
-- =============================================

INSERT INTO informacoes_fisicas (id, user_id, altura_cm, peso_atual_kg, circunferencia_abdominal_cm, data_nascimento, sexo, imc, meta_peso_kg, created_at, updated_at) VALUES
('728ae672-5c6b-485f-9172-1b6577e6c9d7', 'd95e278e-27e7-4f9e-968e-d61134609cf3', 158, 81.00, 110.00, '1958-08-02', 'feminino', 32.45, NULL, '2025-07-14 14:34:07.587352+00', '2025-07-14 14:34:07.587352+00'),
('0199c628-f1f2-467f-bbfb-39125b154ddc', '06b73ad1-017d-4bf9-9577-c396e02929ef', 168, 90.00, 94.00, '1993-07-20', 'masculino', 31.89, NULL, '2025-07-14 11:56:01.448709+00', '2025-07-14 11:56:01.448709+00'),
('be482e9d-9c6b-4b74-9dab-50dba2d6a08b', '75d9fc65-90b1-4ec8-a692-437a33cccc4b', 180, 87.00, 94.00, '1992-07-07', 'feminino', 26.85, NULL, '2025-07-14 06:54:29.193113+00', '2025-07-14 06:54:29.193113+00'),
('e48eac86-b026-4bff-b300-2d4f0763f48c', '19e4f52d-c588-436b-8422-88960cc5fad6', 168, 70.00, 90.00, '2000-10-20', 'feminino', 24.80, NULL, '2025-07-14 06:04:15.478361+00', '2025-07-14 06:04:15.478361+00');

-- =============================================
-- 9. PERFIL_COMPORTAMENTAL (Perfis comportamentais)
-- =============================================

INSERT INTO perfil_comportamental (id, user_id, apoio_familiar, gratidao_hoje, motivacao_principal, motivo_desistencia, motivo_desistencia_outro, nivel_autocuidado, nivel_estresse, sentimento_hoje, tentativa_emagrecimento, tentativa_emagrecimento_outro, created_at, updated_at) VALUES
('e4ea5181-28a3-40a0-b1b0-ac25aeaad631', '1c055306-014d-4d96-999d-5cfa16449ac9', 'Não', 'LGO', 'saudavel', 'falta_motivacao', NULL, 2, 4, 'motivado', 'comecando_agora', NULL, '2025-07-14 04:05:49.533469+00', '2025-07-14 04:05:49.533469+00'),
('91f6ea17-7bb7-4b1b-b8b9-3c831931949f', '1c055306-014d-4d96-999d-5cfa16449ac9', 'Não', 'por tudo', 'saude', 'falta_apoio', NULL, 3, 5, 'motivado', 'comecando_agora', NULL, '2025-07-14 03:53:38.27417+00', '2025-07-14 03:53:38.27417+00'),
('a23bbc97-d482-4a38-8afe-4c3c2cf6f00e', '06b73ad1-017d-4bf9-9577-c396e02929ef', 'Sim', 'gdfgdfg', 'gdfgdf', 'falta_apoio', NULL, 2, 3, 'gfdgdf', 'outro', '', '2025-07-13 22:33:17.504515+00', '2025-07-13 22:33:17.504515+00'),
('bbaae965-0678-41ef-a594-22b815797cad', 'c8c593d0-c70c-4623-882e-a2644a562847', 'Sim', 'asdas', 'asdsadasds', 'falta_apoio', NULL, 2, 3, 'dasdas', 'comecando_agora', NULL, '2025-07-13 06:38:08.93522+00', '2025-07-13 06:38:08.93522+00');

-- =============================================
-- 10. DAILY_MISSIONS (Missões diárias completadas)
-- =============================================

INSERT INTO daily_missions (id, user_id, mission_id, mission_date, completed, completed_at, points_earned, created_at) VALUES
('d3d8c0c8-b710-4b33-a500-c25c809219c9', '7c9b2491-f9a7-4098-a28a-e6d7e8410714', 'tongue-scraping', '2025-07-13', true, '2025-07-13 02:31:27.443+00', 10, '2025-07-13 02:30:28.818436+00'),
('db0023f0-b383-4151-ad80-a865497eff55', '7c9b2491-f9a7-4098-a28a-e6d7e8410714', 'prayer-meditation', '2025-07-13', true, '2025-07-13 02:31:24.237+00', 15, '2025-07-13 02:30:25.612126+00'),
('3d6da928-85b9-45ab-a2cb-ee30553cbc7c', '7c9b2491-f9a7-4098-a28a-e6d7e8410714', 'warm-water', '2025-07-13', true, '2025-07-13 02:31:22.828+00', 10, '2025-07-13 02:30:24.206137+00'),
('d9b268ad-5f29-4303-8e38-a625610f650d', '7c9b2491-f9a7-4098-a28a-e6d7e8410714', 'hydration', '2025-07-13', true, '2025-07-13 02:31:22.29+00', 20, '2025-07-13 02:30:23.670813+00'),
('4707fd56-2ffe-4ae1-b422-8318965fcdc2', '7c9b2491-f9a7-4098-a28a-e6d7e8410714', 'no-sugar', '2025-07-13', true, '2025-07-13 02:31:21.665+00', 25, '2025-07-13 02:30:23.046689+00');

-- =============================================
-- 11. CHALLENGES (Desafios disponíveis)
-- =============================================

INSERT INTO challenges (id, title, description, category, level, points, duration_days, is_active, icon, created_at, updated_at) VALUES
('fb1fd51b-184c-45ed-a496-9e9041a4d5b8', 'Hidratação Master', 'Beba pelo menos 2L de água por dia durante 7 dias consecutivos', 'biologico', 'iniciante', 50, 7, true, '💧', '2025-07-13 01:09:55.147782+00', '2025-07-13 01:09:55.147782+00'),
('3f5dfad5-e753-441e-8020-19aed14dc263', 'Mindful Eating', 'Pratique alimentação consciente por 5 refeições esta semana', 'psicologico', 'intermediario', 75, 7, true, '🧠', '2025-07-13 01:09:55.147782+00', '2025-07-13 01:09:55.147782+00'),
('21103bd1-74cf-4a06-a4cc-98abd90c06a0', 'Movimento Diário', 'Faça pelo menos 30 minutos de atividade física por 10 dias', 'biologico', 'avancado', 100, 10, true, '🏃', '2025-07-13 01:09:55.147782+00', '2025-07-13 01:09:55.147782+00'),
('2a1a64f6-08b3-484e-b7f4-50d211a6b761', 'Detox Digital', 'Evite dispositivos eletrônicos 1h antes de dormir por 5 dias', 'psicologico', 'intermediario', 60, 5, true, '📱', '2025-07-13 01:09:55.147782+00', '2025-07-13 01:09:55.147782+00'),
('76b500a5-958d-4395-92b6-5fc868b3871e', 'Gratidão Diária', 'Anote 3 coisas pelas quais você é grato todos os dias por uma semana', 'psicologico', 'iniciante', 40, 7, true, '🙏', '2025-07-13 01:09:55.147782+00', '2025-07-13 01:09:55.147782+00');

-- =============================================
-- 12. ACHIEVEMENTS (Conquistas)
-- =============================================

INSERT INTO achievements (id, title, description, condition_type, condition_value, icon, created_at) VALUES
('8c741720-a791-44d4-8020-f6ac6d66aa44', 'Primeiro Passo', 'Complete seu primeiro desafio', 'challenges_completed', '{"value": 1}', '🎯', '2025-07-13 01:09:55.147782+00'),
('c17a7ad1-97d6-4037-83d6-65f035be9423', 'Persistente', 'Complete 5 desafios consecutivos', 'challenges_completed', '{"value": 5}', '⚡', '2025-07-13 01:09:55.147782+00'),
('17dfb283-a01e-4f22-9bd3-7107065eda11', 'Mestre da Hidratação', 'Complete 3 desafios relacionados à hidratação', 'category_challenges', '{"category": "hidratacao", "value": 3}', '💧', '2025-07-13 01:09:55.147782+00'),
('13d6e3b3-e8b9-4652-b206-23862aa1732d', 'Mente Zen', 'Complete 10 desafios de mindfulness', 'category_challenges', '{"category": "psicologico", "value": 10}', '🧘', '2025-07-13 01:09:55.147782+00'),
('b80e9e4f-0bcd-4fc8-9e00-abaec0fd422e', 'Guerreiro', 'Mantenha uma sequência de 30 dias', 'streak_days', '{"value": 30}', '👑', '2025-07-13 01:09:55.147782+00');

-- =============================================
-- 13. COURSES (Cursos)
-- =============================================

INSERT INTO courses (id, title, description, category, price, is_active, image_url, created_by, created_at, updated_at) VALUES
('82669a22-5096-4234-b264-dfc8405eecbb', 'asdasd', 'sadadsad', 'pilulas', 0.00, true, 'adasdasd', '8fcdc37f-da5d-4156-a73d-4eaed612dac3', '2025-07-14 22:09:38.872632+00', '2025-07-14 22:09:38.872632+00'),
('81c96aec-d0d2-4e3e-b140-b6e7914a3a17', 'dasdasdsad', 'dasdsadas', 'pilulas', 0.00, true, 'sadasd', '8fcdc37f-da5d-4156-a73d-4eaed612dac3', '2025-07-14 22:09:30.982398+00', '2025-07-14 22:09:30.982398+00'),
('b450f4a9-3742-4c2f-84ad-15054174b249', 'Pílulas do Bem', 'Conteúdo motivacional e transformador', 'pilulas', 0.00, true, '/lovable-uploads/b82e65b8-c25c-4fd3-b340-edeee3b9c31f.png', NULL, '2025-07-14 21:03:07.029434+00', '2025-07-14 21:03:07.029434+00'),
('9646fe87-a625-4722-a7cc-2f2ebf5395da', 'Plataforma dos Sonhos', 'Cursos completos para transformação pessoal', 'plataforma', 0.00, true, '/lovable-uploads/b82e65b8-c25c-4fd3-b340-edeee3b9c31f.png', NULL, '2025-07-14 21:03:07.029434+00', '2025-07-14 21:03:07.029434+00'),
('af6dfe33-d547-41ed-813f-72503b579687', 'Comunidade dos Sonhos', 'Conteúdo exclusivo da comunidade', 'comunidade', 0.00, true, '/lovable-uploads/b82e65b8-c25c-4fd3-b340-edeee3b9c31f.png', NULL, '2025-07-14 21:03:07.029434+00', '2025-07-14 21:03:07.029434+00');

-- =============================================
-- 14. COURSE_MODULES (Módulos dos cursos)
-- =============================================

INSERT INTO course_modules (id, course_id, title, description, order_index, is_active, created_at, updated_at) VALUES
('104532e2-e2db-44aa-8191-4b61d24a8d37', 'b450f4a9-3742-4c2f-84ad-15054174b249', 'mudolo 02', 'sessao 02', 3, true, '2025-07-14 21:37:03.497135+00', '2025-07-14 21:37:03.497135+00'),
('3edc4483-2a32-407a-9c7e-567fb09c325a', 'b450f4a9-3742-4c2f-84ad-15054174b249', 'Testtando modulo 1', 'mudolo de teste', 1, true, '2025-07-14 21:36:14.829211+00', '2025-07-14 21:36:14.829211+00');

-- =============================================
-- 15. COURSE_LESSONS (Aulas dos cursos)
-- =============================================

INSERT INTO course_lessons (id, module_id, title, description, video_url, duration_minutes, order_index, is_active, created_at, updated_at) VALUES
('6d69e3b5-00c0-485c-bcb0-961670a57031', '104532e2-e2db-44aa-8191-4b61d24a8d37', 'aula 01', 'descricao aula', 'https://www.youtube.com/watch?v=tNAHQ6875sk', 0, 0, true, '2025-07-14 21:37:24.030058+00', '2025-07-14 21:37:24.030058+00'),
('45fc1c94-1d43-4c69-b0b5-86a63795224c', '3edc4483-2a32-407a-9c7e-567fb09c325a', 'aul a02', 'descricao', 'https://www.youtube.com/watch?v=tNAHQ6875sk', 60, 0, true, '2025-07-14 21:36:48.266383+00', '2025-07-14 21:36:48.266383+00'),
('06746e01-6b8d-4269-abf4-663a4fd5a975', '3edc4483-2a32-407a-9c7e-567fb09c325a', 'aula 01', '', 'https://www.youtube.com/watch?v=tNAHQ6875sk', 0, 0, true, '2025-07-14 21:36:28.558889+00', '2025-07-14 21:36:28.558889+00');

-- =============================================
-- 16. SESSIONS (Sessões)
-- =============================================

INSERT INTO sessions (id, title, description, content, category, estimated_time, is_public, assigned_to, created_by, notification_type, send_type, wheel_tools, video_url, pdf_url, prerequisites, scheduled_date, created_at, updated_at) VALUES
('b3bc69e9-67cb-41eb-a3ce-f47c785d970e', 'Reflexão soDSADSDbre Objetivos Pessoais', 'Uma sessão para refletir sobre metas e valores pessoaisSADSADSAD', '{"instructions":"Assista ao vídeo e reflita sobre as seguintes perguntas:\n\n1. Quais são seus principais objetivos de vida?\n2. O que mais valoriza em suas relações?\n3. Como seus valores se alinham com suas ações atuais?\nSADSAD\nAnote suas reflexões detalhadamente.","tools":["energia_vital"],"category":"bem-estar-mental","estimated_time":"30-45 minutos"}', 'bem-estar-mental', 30, false, '7c9b2491-f9a7-4098-a28a-e6d7e8410714', '8fcdc37f-da5d-4156-a73d-4eaed612dac3', 'immediate', 'immediate', ARRAY['energia_vital'], 'https://www.youtube.com/watch?v=g8wng5yzftA', NULL, NULL, NULL, '2025-07-15 03:51:41.126937+00', '2025-07-15 03:51:41.126937+00'),
('d3e12ce2-8a4a-40ed-94b1-b6755e12c560', 'Sessão de Boas-vindas: Descobrindo seu Potencial', 'Uma sessão introdutória para você conhecer a metodologia do Instituto dos Sonhos e descobrir seu potencial de transformação.', '{"intro": "Bem-vindo ao Instituto dos Sonhos! Esta é sua primeira sessão de transformação.", "tasks": [{"type": "reflection", "question": "Quais são os três maiores sonhos que você gostaria de realizar?", "description": "Pense profundamente sobre o que realmente importa para você."}, {"type": "visualization", "question": "Imagine-se vivendo a vida dos seus sonhos. Como você se sente?", "description": "Visualize todos os detalhes dessa nova realidade."}], "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ", "conclusion": "Esta foi apenas uma prévia do que você pode conquistar conosco. Cadastre-se para continuar sua jornada!"}', NULL, NULL, true, NULL, NULL, 'immediate', 'immediate', NULL, NULL, NULL, NULL, NULL, '2025-07-12 23:20:33.234261+00', '2025-07-12 23:20:33.234261+00'),
('41af45b6-1132-447f-a81d-a36e97ad7621', 'Transformando Crenças Limitantes', 'Aprenda a identificar e transformar as crenças que estão limitando seu crescimento pessoal.', '{"intro": "Nesta sessão, você aprenderá sobre as crenças que podem estar sabotando seus sonhos.", "tasks": [{"type": "identification", "question": "Liste 5 crenças negativas que você tem sobre si mesmo.", "description": "Seja honesto e específico em suas respostas."}, {"type": "transformation", "question": "Como você pode transformar essas crenças em afirmações positivas?", "description": "Reescreva cada crença de forma empoderada."}], "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ", "conclusion": "O autoconhecimento é o primeiro passo para a transformação. Continue conosco para aprofundar essa jornada!"}', NULL, NULL, true, NULL, NULL, 'immediate', 'immediate', NULL, NULL, NULL, NULL, NULL, '2025-07-12 23:20:33.234261+00', '2025-07-12 23:20:33.234261+00');

-- =============================================
-- 17. USER_CHALLENGES (Desafios do usuário)
-- =============================================

INSERT INTO user_challenges (id, user_id, challenge_id, target_value, progress, is_completed, completed_at, started_at) VALUES
('c2902b33-6433-43fb-914f-df858643610c', '06b73ad1-017d-4bf9-9577-c396e02929ef', '76b500a5-958d-4395-92b6-5fc868b3871e', 7, 1, false, NULL, '2025-07-15 02:06:21.496943+00'),
('13c33341-6b76-4197-8405-39e012aa6534', '06b73ad1-017d-4bf9-9577-c396e02929ef', '2a1a64f6-08b3-484e-b7f4-50d211a6b761', 5, 0, false, NULL, '2025-07-15 02:06:20.915529+00'),
('aec8d67e-70d4-4756-9265-80abb0d171ab', '06b73ad1-017d-4bf9-9577-c396e02929ef', '21103bd1-74cf-4a06-a4cc-98abd90c06a0', 10, 0, false, NULL, '2025-07-15 02:06:20.285543+00'),
('544c0c65-9839-42d4-b1cf-f53a458f3d3d', '06b73ad1-017d-4bf9-9577-c396e02929ef', '3f5dfad5-e753-441e-8020-19aed14dc263', 7, 0, false, NULL, '2025-07-15 02:06:19.295144+00'),
('8b407109-2c20-4b95-b4d8-926f08a18d0e', '06b73ad1-017d-4bf9-9577-c396e02929ef', 'fb1fd51b-184c-45ed-a496-9e9041a4d5b8', 7, 0, false, NULL, '2025-07-15 02:06:14.164463+00');

-- =============================================
-- 18. MISSOES_USUARIO (Missões do usuário)
-- =============================================

INSERT INTO missoes_usuario (id, user_id, data, autocuidado, bebeu_agua, dormiu_bem, humor, created_at) VALUES
('79e63c81-1df8-4507-9874-846752b98fd3', '8fcdc37f-da5d-4156-a73d-4eaed612dac3', '2025-07-14', true, NULL, NULL, NULL, '2025-07-14 00:16:53.068166+00'),
('13c65b9d-165b-487e-b462-1a16767a76a9', 'c8c593d0-c70c-4623-882e-a2644a562847', '2025-07-13', false, NULL, NULL, NULL, '2025-07-13 06:38:35.968854+00'),
('4bc52865-20af-4e6a-918e-9e6fab117b1d', 'e09e6a63-1109-46b9-ba9a-84ebe6fe3031', '2025-07-13', true, NULL, NULL, NULL, '2025-07-13 06:04:11.15428+00'),
('f4015be0-4527-462b-a1de-4c269ba0beb4', 'a5f2d558-f733-437a-ab33-3d9d30fbd0c0', '2025-07-13', true, NULL, NULL, NULL, '2025-07-13 05:24:39.827145+00'),
('cafd2f15-3173-4bd0-87cb-2ebe37146984', 'b0a4652a-8673-4eb9-b8bc-f534db24574a', '2025-07-13', true, NULL, NULL, NULL, '2025-07-13 03:09:25.44562+00');

-- =============================================
-- FIM DO BACKUP
-- =============================================

-- INSTRUÇÕES PARA MIGRAÇÃO:
-- 1. Primeiro, crie todas as tabelas na nova conta Supabase
-- 2. Configure as políticas RLS seguindo a estrutura original
-- 3. Execute este script para restaurar os dados
-- 4. Teste a funcionalidade para garantir que tudo funciona
-- 5. Ajuste os IDs conforme necessário para a nova estrutura

-- RESUMO DOS DADOS:
-- - 30 usuários registrados
-- - 115 pontos acumulados pelo usuário mais ativo
-- - 50 pesagens registradas
-- - 11 missões diárias completadas
-- - 7 desafios disponíveis
-- - 5 conquistas configuradas
-- - 5 cursos criados
-- - 3 sessões de transformação
-- - Dados físicos e comportamentais completos

-- ATENÇÃO: Verifique os UUIDs antes de executar o script
-- Os IDs de usuário podem precisar ser ajustados para a nova estrutura