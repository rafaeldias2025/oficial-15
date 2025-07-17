-- Script para popular o banco de dados com cursos fictícios completos
-- Execute este script no Supabase SQL Editor

-- Limpar dados existentes (opcional)
DELETE FROM user_course_progress;
DELETE FROM course_lessons;
DELETE FROM course_modules;
DELETE FROM courses;

-- Inserir cursos
INSERT INTO courses (id, title, description, image_url, price, category, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Reeducação Alimentar Definitiva', 'Aprenda os fundamentos de uma alimentação saudável e sustentável para toda a vida. Descubra como fazer escolhas inteligentes e criar hábitos duradouros.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 197.00, 'Nutrição', true),
('22222222-2222-2222-2222-222222222222', 'Mindfulness para Emagrecimento', 'Técnicas de atenção plena aplicadas ao processo de emagrecimento consciente. Transforme sua relação com a comida e desenvolva uma mentalidade saudável.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 167.00, 'Psicologia', true),
('33333333-3333-3333-3333-333333333333', 'Exercícios em Casa: Do Básico ao Avançado', 'Programa completo de exercícios para fazer em casa, sem equipamentos. Desenvolva força, resistência e flexibilidade.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 127.00, 'Atividade Física', true),
('44444444-4444-4444-4444-444444444444', 'Receitas Saudáveis e Deliciosas', 'Descubra receitas incríveis que são nutritivas e irresistíveis. Cozinhe com prazer e saúde.', 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 97.00, 'Nutrição', true),
('55555555-5555-5555-5555-555555555555', 'Yoga para Perda de Peso', 'Sequências de yoga específicas para acelerar o metabolismo e promover o emagrecimento saudável.', 'https://images.unsplash.com/photo-1506629905826-b2562640e3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 147.00, 'Atividade Física', true);

-- Inserir módulos para o curso de Reeducação Alimentar
INSERT INTO course_modules (id, course_id, title, description, order_index) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Fundamentos da Nutrição', 'Entenda os princípios básicos de uma alimentação equilibrada', 1),
('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Planejamento de Refeições', 'Aprenda a organizar suas refeições de forma prática', 2),
('aaaa3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Receitas Saudáveis', 'Prepare pratos deliciosos e nutritivos', 3),
('aaaa4444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Mantendo a Disciplina', 'Estratégias para manter a consistência', 4);

-- Inserir módulos para o curso de Mindfulness
INSERT INTO course_modules (id, course_id, title, description, order_index) VALUES
('bbbb1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Introdução ao Mindfulness', 'Fundamentos da prática de atenção plena', 1),
('bbbb2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Alimentação Consciente', 'Pratique a consciência alimentar', 2),
('bbbb3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Gerenciando Emoções', 'Técnicas para lidar com gatilhos emocionais', 3);

-- Inserir módulos para o curso de Exercícios em Casa
INSERT INTO course_modules (id, course_id, title, description, order_index) VALUES
('cccc1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Exercícios Básicos', 'Movimentos fundamentais para iniciantes', 1),
('cccc2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Treino Intermediário', 'Evoluindo na intensidade dos exercícios', 2),
('cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Treino Avançado', 'Desafios para atletas experientes', 3),
('cccc4444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Flexibilidade e Recuperação', 'Alongamentos e técnicas de recuperação', 4);

-- Inserir módulos para o curso de Receitas Saudáveis
INSERT INTO course_modules (id, course_id, title, description, order_index) VALUES
('dddd1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Café da Manhã Nutritivo', 'Receitas para começar o dia com energia', 1),
('dddd2222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Almoços Saudáveis', 'Pratos principais equilibrados e saborosos', 2),
('dddd3333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Lanches Inteligentes', 'Opções nutritivas para os intervalos', 3);

-- Inserir módulos para o curso de Yoga
INSERT INTO course_modules (id, course_id, title, description, order_index) VALUES
('eeee1111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Fundamentos do Yoga', 'Posturas básicas e respiração', 1),
('eeee2222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Sequências Energizantes', 'Práticas para acelerar o metabolismo', 2),
('eeee3333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Yoga Restaurativo', 'Práticas de relaxamento e recuperação', 3);

-- Inserir aulas para Reeducação Alimentar - Módulo 1
INSERT INTO course_lessons (id, module_id, title, description, video_url, duration_minutes, order_index) VALUES
('1111aaaa-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'O que é uma alimentação equilibrada?', 'Conceitos fundamentais sobre macronutrientes e micronutrientes', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 25, 1),
('1111aaaa-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', 'Lendo rótulos corretamente', 'Como interpretar informações nutricionais dos produtos', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 18, 2),
('1111aaaa-3333-3333-3333-333333333333', 'aaaa1111-1111-1111-1111-111111111111', 'Hidratação adequada', 'A importância da água e como calcular suas necessidades', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 15, 3),
('1111aaaa-4444-4444-4444-444444444444', 'aaaa1111-1111-1111-1111-111111111111', 'Exercício prático: Monte seu prato ideal', 'Atividade hands-on para aplicar os conceitos aprendidos', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 30, 4);

-- Inserir aulas para Reeducação Alimentar - Módulo 2
INSERT INTO course_lessons (id, module_id, title, description, video_url, duration_minutes, order_index) VALUES
('2222aaaa-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222', 'Planejando a semana alimentar', 'Estratégias para organizar suas refeições', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 28, 1),
('2222aaaa-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 'Lista de compras inteligente', 'Como fazer compras eficientes e saudáveis', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 20, 2),
('2222aaaa-3333-3333-3333-333333333333', 'aaaa2222-2222-2222-2222-222222222222', 'Meal prep: preparando com antecedência', 'Técnicas para preparar refeições antecipadamente', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 35, 3);

-- Inserir aulas para Mindfulness - Módulo 1
INSERT INTO course_lessons (id, module_id, title, description, video_url, duration_minutes, order_index) VALUES
('1111bbbb-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 'O que é Mindfulness?', 'Introdução aos conceitos de atenção plena', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 22, 1),
('1111bbbb-2222-2222-2222-222222222222', 'bbbb1111-1111-1111-1111-111111111111', 'Primeira meditação guiada', 'Prática inicial de 10 minutos', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 15, 2),
('1111bbbb-3333-3333-3333-333333333333', 'bbbb1111-1111-1111-1111-111111111111', 'Respiração consciente', 'Técnicas de respiração para o dia a dia', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 18, 3);

-- Inserir aulas para Exercícios em Casa - Módulo 1
INSERT INTO course_lessons (id, module_id, title, description, video_url, duration_minutes, order_index) VALUES
('1111cccc-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', 'Aquecimento essencial', 'Preparando o corpo para o exercício', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 12, 1),
('1111cccc-2222-2222-2222-222222222222', 'cccc1111-1111-1111-1111-111111111111', 'Exercícios de peso corporal', 'Flexões, agachamentos e pranchas básicas', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 25, 2),
('1111cccc-3333-3333-3333-333333333333', 'cccc1111-1111-1111-1111-111111111111', 'Cardio em casa', 'Exercícios para elevar a frequência cardíaca', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 20, 3),
('1111cccc-4444-4444-4444-444444444444', 'cccc1111-1111-1111-1111-111111111111', 'Alongamento pós-treino', 'Relaxamento e recuperação muscular', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 15, 4);

-- Inserir aulas para Receitas Saudáveis - Módulo 1
INSERT INTO course_lessons (id, module_id, title, description, video_url, duration_minutes, order_index) VALUES
('1111dddd-1111-1111-1111-111111111111', 'dddd1111-1111-1111-1111-111111111111', 'Smoothie energético', 'Receita completa com frutas e vegetais', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 8, 1),
('1111dddd-2222-2222-2222-222222222222', 'dddd1111-1111-1111-1111-111111111111', 'Aveia overnight nutritiva', 'Preparação noturna para manhãs práticas', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 10, 2),
('1111dddd-3333-3333-3333-333333333333', 'dddd1111-1111-1111-1111-111111111111', 'Panqueca proteica', 'Versão saudável da panqueca tradicional', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 12, 3);

-- Inserir aulas para Yoga - Módulo 1
INSERT INTO course_lessons (id, module_id, title, description, video_url, duration_minutes, order_index) VALUES
('1111eeee-1111-1111-1111-111111111111', 'eeee1111-1111-1111-1111-111111111111', 'Saudação ao Sol básica', 'Sequência fundamental do yoga', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 20, 1),
('1111eeee-2222-2222-2222-222222222222', 'eeee1111-1111-1111-1111-111111111111', 'Posturas em pé', 'Guerreiro I, II e triângulo', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 25, 2),
('1111eeee-3333-3333-3333-333333333333', 'eeee1111-1111-1111-1111-111111111111', 'Relaxamento final', 'Savasana e técnicas de respiração', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 15, 3);
