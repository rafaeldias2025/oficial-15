import { supabase } from '@/integrations/supabase/client';

export const setupAdminTables = async () => {
  console.log('🔧 Verificando tabelas do painel administrativo...');

  try {
    const missingTables = [];

    // Verificar tabela goals
    const { error: goalsError } = await supabase
      .from('goals')
      .select('id')
      .limit(1);

    if (goalsError && goalsError.message.includes('does not exist')) {
      missingTables.push('goals');
    }

    // Verificar tabela sessions
    const { error: sessionsError } = await supabase
      .from('sessions')
      .select('id')
      .limit(1);

    if (sessionsError && sessionsError.message.includes('does not exist')) {
      missingTables.push('sessions');
    }

    // Verificar tabela dados_saude_usuario
    const { error: saudeError } = await supabase
      .from('dados_saude_usuario')
      .select('id')
      .limit(1);

    if (saudeError && saudeError.message.includes('does not exist')) {
      missingTables.push('dados_saude_usuario');
    }

    // Verificar tabela courses
    const { error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .limit(1);

    if (coursesError && coursesError.message.includes('does not exist')) {
      missingTables.push('courses');
    }

    // Verificar tabela course_modules
    const { error: modulesError } = await supabase
      .from('course_modules')
      .select('id')
      .limit(1);

    if (modulesError && modulesError.message.includes('does not exist')) {
      missingTables.push('course_modules');
    }

    // Verificar tabela course_lessons
    const { error: lessonsError } = await supabase
      .from('course_lessons')
      .select('id')
      .limit(1);

    if (lessonsError && lessonsError.message.includes('does not exist')) {
      missingTables.push('course_lessons');
    }

    if (missingTables.length > 0) {
      console.log('⚠️ Tabelas em falta:', missingTables);
      console.log('💡 Execute o SQL de migração manualmente no Supabase SQL Editor');
      return false;
    }

    console.log('✅ Todas as tabelas necessárias existem!');
    return true;

  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error);
    return false;
  }
};

// Função para inserir dados de exemplo
export const insertSampleData = async () => {
  console.log('🎯 Inserindo dados de exemplo...');

  try {
    // Inserir cursos de exemplo
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .limit(1);

    if (coursesError) {
      console.error('Erro ao verificar cursos:', coursesError);
      return;
    }

    if (!coursesData || coursesData.length === 0) {
      console.log('📚 Inserindo cursos de exemplo...');
      
      const sampleCourses = [
        {
          title: 'Reeducação Alimentar Definitiva',
          description: 'Aprenda os fundamentos de uma alimentação saudável e sustentável para toda a vida.',
          category: 'Nutrição',
          price: 197.00,
          is_active: true
        },
        {
          title: 'Mindfulness para Emagrecimento',
          description: 'Técnicas de atenção plena aplicadas ao processo de emagrecimento consciente.',
          category: 'Psicologia',
          price: 167.00,
          is_active: true
        },
        {
          title: 'Exercícios em Casa: Do Básico ao Avançado',
          description: 'Programa completo de exercícios para fazer em casa, sem equipamentos.',
          category: 'Atividade Física',
          price: 127.00,
          is_active: true
        }
      ];

      const { error: insertError } = await supabase
        .from('courses')
        .insert(sampleCourses);

      if (insertError) {
        console.error('Erro ao inserir cursos:', insertError);
      } else {
        console.log('✅ Cursos de exemplo inseridos com sucesso!');
      }
    }

    console.log('✅ Dados de exemplo configurados!');
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error);
  }
};

// Função para verificar se um usuário é admin
export const verifyAdminAccess = async (userEmail: string) => {
  const adminEmails = [
    'admin@instituto.com',
    'admin@sonhos.com',
    'rafael@admin.com'
  ];

  return adminEmails.includes(userEmail);
}; 