import { supabase } from '@/integrations/supabase/client';

const nomesFictícios = [
  'Ana Silva', 'Carlos Santos', 'Maria Costa', 'João Ferreira', 'Paula Oliveira',
  'Roberto Silva', 'Fernanda Lima', 'Pedro Almeida', 'Juliana Rocha', 'Rafael Mendes',
  'Camila Souza', 'Diego Barbosa', 'Larissa Pereira', 'Thiago Martins', 'Bianca Cardoso',
  'Lucas Rodrigues', 'Mariana Gomes', 'Bruno Nascimento', 'Gabriela Freitas', 'Vinicius Torres'
];

const cidadesBrasil = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília',
  'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus',
  'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís',
  'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Natal', 'Teresina'
];

const achievementsSample = [
  ['primeiro_login', 'sequencia_7_dias'],
  ['meta_peso', 'consistente'],
  ['super_pontuacao', 'lider_semanal'],
  ['transformacao_completa'],
  ['mentor', 'inspirador'],
  ['disciplinado', 'perseverante'],
  ['inovador', 'criativo'],
  ['colaborativo', 'motivador']
];

const createDemoUsers = async (quantidade = 20) => {

const nomesFictícios = [
  'Ana Silva', 'Carlos Santos', 'Maria Costa', 'João Ferreira', 'Paula Oliveira',
  'Roberto Silva', 'Fernanda Lima', 'Pedro Almeida', 'Juliana Rocha', 'Rafael Mendes',
  'Camila Souza', 'Diego Barbosa', 'Larissa Pereira', 'Thiago Martins', 'Bianca Cardoso',
  'Lucas Rodrigues', 'Mariana Gomes', 'Bruno Nascimento', 'Gabriela Freitas', 'Vinicius Torres'
];

const cidadesBrasil = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília',
  'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus',
  'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís',
  'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Natal', 'Teresina'
];

const achievementsSample = [
  ['primeiro_login', 'sequencia_7_dias'],
  ['meta_peso', 'consistente'],
  ['super_pontuacao', 'lider_semanal'],
  ['transformacao_completa'],
  ['mentor', 'inspirador'],
  ['disciplinado', 'perseverante'],
  ['inovador', 'criativo'],
  ['colaborativo', 'motivador']
];

  console.log(`🎭 Criando ${quantidade} usuários reais para demonstração...`);
  try {
    // Criar usuários reais na tabela de autenticação do Supabase
    const createdUsers = [];
    for (let i = 0; i < quantidade; i++) {
      const nome = nomesFictícios[i % nomesFictícios.length];
      const email = `${nome.toLowerCase().replace(/ /g, '.')}.${Math.floor(Math.random()*10000)}@demo.com`;
      const password = 'demo1234';
      // Cria usuário real
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: nome,
          role: 'client',
        }
      });
      if (authError) {
        console.error('Erro ao criar usuário real:', authError);
        continue;
      }
      createdUsers.push(authUser.user);
    }

    // Criar profiles vinculados aos usuários reais
    const profilesData = createdUsers.map((user, index) => ({
      user_id: user.id,
      full_name: user.user_metadata?.full_name || nomesFictícios[index],
      email: user.email,
      role: 'client' as 'client',
    }));
    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert(profilesData, { onConflict: 'user_id' });
    if (profilesError) throw profilesError;

    // Criar pontos, missões e pontuações diárias como antes, mas usando os IDs reais
    // ...existing code for points, missions, scores, etc. (igual ao anterior, só mudando para createdUsers)

    console.log('🎉 Usuários reais criados com sucesso!');
    return { success: true, count: createdUsers.length };
  } catch (error) {
    console.error('❌ Erro ao criar usuários reais:', error);
    throw error;
  }
};

// Removido export duplicado para evitar erro

export { createDemoUsers };

// Função para limpar usuários demo (se necessário)
export const cleanDemoUsers = async () => {
  console.log('🧹 Limpando usuários fictícios...');
  
  try {
    // Deletar em cascata: pontuações -> missões -> pontos -> profiles
    const { error: scoresError } = await supabase
      .from('pontuacao_diaria')
      .delete()
      .like('user_id', 'demo_user_%');

    const { error: missionsError } = await supabase
      .from('missao_dia')
      .delete()
      .in('user_id', (await supabase.from('profiles').select('id').like('user_id', 'demo_user_%')).data?.map(p => p.id) || []);

    const { error: pointsError } = await supabase
      .from('user_points')
      .delete()
      .in('user_id', (await supabase.from('profiles').select('id').like('user_id', 'demo_user_%')).data?.map(p => p.id) || []);

    const { error: profilesError } = await supabase
      .from('profiles')
      .delete()
      .like('user_id', 'demo_user_%');

    if (scoresError || missionsError || pointsError || profilesError) {
      console.warn('Alguns erros durante limpeza:', { scoresError, missionsError, pointsError, profilesError });
    }

    console.log('✅ Usuários fictícios removidos');
    return { success: true };

  } catch (error) {
    console.error('❌ Erro ao limpar usuários fictícios:', error);
    throw error;
  }
}; 