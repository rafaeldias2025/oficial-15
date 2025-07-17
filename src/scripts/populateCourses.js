import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - substitua pelas suas credenciais
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const courseData = {
  courses: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Reeducação Alimentar Definitiva',
      description: 'Aprenda os fundamentos de uma alimentação saudável e sustentável para toda a vida. Descubra como fazer escolhas inteligentes e criar hábitos duradouros.',
      image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: 197.00,
      category: 'Nutrição',
      is_active: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      title: 'Mindfulness para Emagrecimento',
      description: 'Técnicas de atenção plena aplicadas ao processo de emagrecimento consciente. Transforme sua relação com a comida e desenvolva uma mentalidade saudável.',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: 167.00,
      category: 'Psicologia',
      is_active: true
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      title: 'Exercícios em Casa: Do Básico ao Avançado',
      description: 'Programa completo de exercícios para fazer em casa, sem equipamentos. Desenvolva força, resistência e flexibilidade.',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: 127.00,
      category: 'Atividade Física',
      is_active: true
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      title: 'Receitas Saudáveis e Deliciosas',
      description: 'Descubra receitas incríveis que são nutritivas e irresistíveis. Cozinhe com prazer e saúde.',
      image_url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: 97.00,
      category: 'Nutrição',
      is_active: true
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      title: 'Yoga para Perda de Peso',
      description: 'Sequências de yoga específicas para acelerar o metabolismo e promover o emagrecimento saudável.',
      image_url: 'https://images.unsplash.com/photo-1506629905826-b2562640e3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: 147.00,
      category: 'Atividade Física',
      is_active: true
    }
  ],
  
  modules: [
    // Reeducação Alimentar
    { id: 'aaaa1111-1111-1111-1111-111111111111', course_id: '11111111-1111-1111-1111-111111111111', title: 'Fundamentos da Nutrição', description: 'Entenda os princípios básicos de uma alimentação equilibrada', order_index: 1 },
    { id: 'aaaa2222-2222-2222-2222-222222222222', course_id: '11111111-1111-1111-1111-111111111111', title: 'Planejamento de Refeições', description: 'Aprenda a organizar suas refeições de forma prática', order_index: 2 },
    { id: 'aaaa3333-3333-3333-3333-333333333333', course_id: '11111111-1111-1111-1111-111111111111', title: 'Receitas Saudáveis', description: 'Prepare pratos deliciosos e nutritivos', order_index: 3 },
    { id: 'aaaa4444-4444-4444-4444-444444444444', course_id: '11111111-1111-1111-1111-111111111111', title: 'Mantendo a Disciplina', description: 'Estratégias para manter a consistência', order_index: 4 },
    
    // Mindfulness
    { id: 'bbbb1111-1111-1111-1111-111111111111', course_id: '22222222-2222-2222-2222-222222222222', title: 'Introdução ao Mindfulness', description: 'Fundamentos da prática de atenção plena', order_index: 1 },
    { id: 'bbbb2222-2222-2222-2222-222222222222', course_id: '22222222-2222-2222-2222-222222222222', title: 'Alimentação Consciente', description: 'Pratique a consciência alimentar', order_index: 2 },
    { id: 'bbbb3333-3333-3333-3333-333333333333', course_id: '22222222-2222-2222-2222-222222222222', title: 'Gerenciando Emoções', description: 'Técnicas para lidar com gatilhos emocionais', order_index: 3 },
    
    // Exercícios em Casa
    { id: 'cccc1111-1111-1111-1111-111111111111', course_id: '33333333-3333-3333-3333-333333333333', title: 'Exercícios Básicos', description: 'Movimentos fundamentais para iniciantes', order_index: 1 },
    { id: 'cccc2222-2222-2222-2222-222222222222', course_id: '33333333-3333-3333-3333-333333333333', title: 'Treino Intermediário', description: 'Evoluindo na intensidade dos exercícios', order_index: 2 },
    { id: 'cccc3333-3333-3333-3333-333333333333', course_id: '33333333-3333-3333-3333-333333333333', title: 'Treino Avançado', description: 'Desafios para atletas experientes', order_index: 3 },
    { id: 'cccc4444-4444-4444-4444-444444444444', course_id: '33333333-3333-3333-3333-333333333333', title: 'Flexibilidade e Recuperação', description: 'Alongamentos e técnicas de recuperação', order_index: 4 },
    
    // Receitas
    { id: 'dddd1111-1111-1111-1111-111111111111', course_id: '44444444-4444-4444-4444-444444444444', title: 'Café da Manhã Nutritivo', description: 'Receitas para começar o dia com energia', order_index: 1 },
    { id: 'dddd2222-2222-2222-2222-222222222222', course_id: '44444444-4444-4444-4444-444444444444', title: 'Almoços Saudáveis', description: 'Pratos principais equilibrados e saborosos', order_index: 2 },
    { id: 'dddd3333-3333-3333-3333-333333333333', course_id: '44444444-4444-4444-4444-444444444444', title: 'Lanches Inteligentes', description: 'Opções nutritivas para os intervalos', order_index: 3 },
    
    // Yoga
    { id: 'eeee1111-1111-1111-1111-111111111111', course_id: '55555555-5555-5555-5555-555555555555', title: 'Fundamentos do Yoga', description: 'Posturas básicas e respiração', order_index: 1 },
    { id: 'eeee2222-2222-2222-2222-222222222222', course_id: '55555555-5555-5555-5555-555555555555', title: 'Sequências Energizantes', description: 'Práticas para acelerar o metabolismo', order_index: 2 },
    { id: 'eeee3333-3333-3333-3333-333333333333', course_id: '55555555-5555-5555-5555-555555555555', title: 'Yoga Restaurativo', description: 'Práticas de relaxamento e recuperação', order_index: 3 }
  ],
  
  lessons: [
    // Reeducação Alimentar - Módulo 1
    { id: '1111aaaa-1111-1111-1111-111111111111', module_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'O que é uma alimentação equilibrada?', description: 'Conceitos fundamentais sobre macronutrientes e micronutrientes', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 25, order_index: 1 },
    { id: '1111aaaa-2222-2222-2222-222222222222', module_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'Lendo rótulos corretamente', description: 'Como interpretar informações nutricionais dos produtos', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 18, order_index: 2 },
    { id: '1111aaaa-3333-3333-3333-333333333333', module_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'Hidratação adequada', description: 'A importância da água e como calcular suas necessidades', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 15, order_index: 3 },
    { id: '1111aaaa-4444-4444-4444-444444444444', module_id: 'aaaa1111-1111-1111-1111-111111111111', title: 'Exercício prático: Monte seu prato ideal', description: 'Atividade hands-on para aplicar os conceitos aprendidos', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 30, order_index: 4 },
    
    // Reeducação Alimentar - Módulo 2
    { id: '2222aaaa-1111-1111-1111-111111111111', module_id: 'aaaa2222-2222-2222-2222-222222222222', title: 'Planejando a semana alimentar', description: 'Estratégias para organizar suas refeições', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 28, order_index: 1 },
    { id: '2222aaaa-2222-2222-2222-222222222222', module_id: 'aaaa2222-2222-2222-2222-222222222222', title: 'Lista de compras inteligente', description: 'Como fazer compras eficientes e saudáveis', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 20, order_index: 2 },
    { id: '2222aaaa-3333-3333-3333-333333333333', module_id: 'aaaa2222-2222-2222-2222-222222222222', title: 'Meal prep: preparando com antecedência', description: 'Técnicas para preparar refeições antecipadamente', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 35, order_index: 3 },
    
    // Mindfulness - Módulo 1
    { id: '1111bbbb-1111-1111-1111-111111111111', module_id: 'bbbb1111-1111-1111-1111-111111111111', title: 'O que é Mindfulness?', description: 'Introdução aos conceitos de atenção plena', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 22, order_index: 1 },
    { id: '1111bbbb-2222-2222-2222-222222222222', module_id: 'bbbb1111-1111-1111-1111-111111111111', title: 'Primeira meditação guiada', description: 'Prática inicial de 10 minutos', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 15, order_index: 2 },
    { id: '1111bbbb-3333-3333-3333-333333333333', module_id: 'bbbb1111-1111-1111-1111-111111111111', title: 'Respiração consciente', description: 'Técnicas de respiração para o dia a dia', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 18, order_index: 3 },
    
    // Exercícios - Módulo 1
    { id: '1111cccc-1111-1111-1111-111111111111', module_id: 'cccc1111-1111-1111-1111-111111111111', title: 'Aquecimento essencial', description: 'Preparando o corpo para o exercício', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 12, order_index: 1 },
    { id: '1111cccc-2222-2222-2222-222222222222', module_id: 'cccc1111-1111-1111-1111-111111111111', title: 'Exercícios de peso corporal', description: 'Flexões, agachamentos e pranchas básicas', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 25, order_index: 2 },
    { id: '1111cccc-3333-3333-3333-333333333333', module_id: 'cccc1111-1111-1111-1111-111111111111', title: 'Cardio em casa', description: 'Exercícios para elevar a frequência cardíaca', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 20, order_index: 3 },
    { id: '1111cccc-4444-4444-4444-444444444444', module_id: 'cccc1111-1111-1111-1111-111111111111', title: 'Alongamento pós-treino', description: 'Relaxamento e recuperação muscular', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 15, order_index: 4 },
    
    // Receitas - Módulo 1
    { id: '1111dddd-1111-1111-1111-111111111111', module_id: 'dddd1111-1111-1111-1111-111111111111', title: 'Smoothie energético', description: 'Receita completa com frutas e vegetais', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 8, order_index: 1 },
    { id: '1111dddd-2222-2222-2222-222222222222', module_id: 'dddd1111-1111-1111-1111-111111111111', title: 'Aveia overnight nutritiva', description: 'Preparação noturna para manhãs práticas', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 10, order_index: 2 },
    { id: '1111dddd-3333-3333-3333-333333333333', module_id: 'dddd1111-1111-1111-1111-111111111111', title: 'Panqueca proteica', description: 'Versão saudável da panqueca tradicional', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 12, order_index: 3 },
    
    // Yoga - Módulo 1
    { id: '1111eeee-1111-1111-1111-111111111111', module_id: 'eeee1111-1111-1111-1111-111111111111', title: 'Saudação ao Sol básica', description: 'Sequência fundamental do yoga', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 20, order_index: 1 },
    { id: '1111eeee-2222-2222-2222-222222222222', module_id: 'eeee1111-1111-1111-1111-111111111111', title: 'Posturas em pé', description: 'Guerreiro I, II e triângulo', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 25, order_index: 2 },
    { id: '1111eeee-3333-3333-3333-333333333333', module_id: 'eeee1111-1111-1111-1111-111111111111', title: 'Relaxamento final', description: 'Savasana e técnicas de respiração', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration_minutes: 15, order_index: 3 }
  ]
};

async function populateDatabase() {
  try {
    console.log('🚀 Iniciando população do banco de dados...');
    
    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    await supabase.from('user_course_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('course_lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('course_modules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Inserir cursos
    console.log('📚 Inserindo cursos...');
    const { error: coursesError } = await supabase
      .from('courses')
      .insert(courseData.courses);
    
    if (coursesError) throw coursesError;
    console.log('✅ Cursos inseridos com sucesso!');
    
    // Inserir módulos
    console.log('📖 Inserindo módulos...');
    const { error: modulesError } = await supabase
      .from('course_modules')
      .insert(courseData.modules);
    
    if (modulesError) throw modulesError;
    console.log('✅ Módulos inseridos com sucesso!');
    
    // Inserir aulas
    console.log('🎥 Inserindo aulas...');
    const { error: lessonsError } = await supabase
      .from('course_lessons')
      .insert(courseData.lessons);
    
    if (lessonsError) throw lessonsError;
    console.log('✅ Aulas inseridas com sucesso!');
    
    console.log('🎉 Banco de dados populado com sucesso!');
    console.log(`
📊 Resumo:
- ${courseData.courses.length} cursos
- ${courseData.modules.length} módulos
- ${courseData.lessons.length} aulas
    `);
    
  } catch (error) {
    console.error('❌ Erro ao popular o banco:', error);
  }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  populateDatabase();
}

export { populateDatabase, courseData };
