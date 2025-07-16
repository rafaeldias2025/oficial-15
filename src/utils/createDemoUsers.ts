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

export const createDemoUsers = async () => {
  console.log('🎭 Criando usuários fictícios para demonstração...');
  
  try {
    // Primeiro, vamos criar os profiles
    const profilesData = nomesFictícios.map((nome, index) => ({
      user_id: `demo_user_${index + 1}`,
      full_name: nome,
      email: `${nome.toLowerCase().replace(' ', '.')}@demo.com`,
      role: 'client' as const,
      // Removendo campos que não existem no schema
      // city: cidadesBrasil[index % cidadesBrasil.length],
      // last_active: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      // achievements: achievementsSample[index % achievementsSample.length]
    }));

    // Inserir profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .upsert(profilesData, { onConflict: 'user_id' })
      .select();

    if (profilesError) throw profilesError;

    console.log(`✅ ${profiles.length} perfis criados`);

    // Agora criar os pontos para cada usuário
    const pointsData = profiles.map((profile, index) => {
      const totalPoints = Math.floor(Math.random() * 5000) + 500; // 500-5500 pontos
      const weeklyPoints = Math.floor(totalPoints * 0.3 + Math.random() * 200); // ~30% dos pontos totais + variação
      const monthlyPoints = Math.floor(totalPoints * 0.6 + Math.random() * 300); // ~60% dos pontos totais + variação
      const dailyPoints = Math.floor(Math.random() * 150) + 20; // 20-170 pontos diários
      const currentStreak = Math.floor(Math.random() * 30) + 1; // 1-30 dias de sequência
      const completedChallenges = Math.floor(Math.random() * 50) + 5; // 5-55 desafios

      return {
        user_id: profile.id,
        total_points: totalPoints,
        weekly_points: weeklyPoints,
        monthly_points: monthlyPoints,
        daily_points: dailyPoints,
        current_streak: currentStreak,
        best_streak: Math.max(currentStreak, Math.floor(Math.random() * 50) + 10),
        completed_challenges: completedChallenges,
        level: Math.floor(totalPoints / 500) + 1, // Nível baseado nos pontos
        updated_at: new Date().toISOString()
      };
    });

    // Inserir pontos
    const { error: pointsError } = await supabase
      .from('user_points')
      .upsert(pointsData, { onConflict: 'user_id' });

    if (pointsError) throw pointsError;

    console.log(`✅ ${pointsData.length} registros de pontos criados`);

    // Criar algumas missões diárias para tornar mais realista
    const missionsData = profiles.flatMap(profile => {
      const numMissions = Math.floor(Math.random() * 7) + 3; // 3-10 missões por usuário
      return Array.from({ length: numMissions }, (_, i) => ({
        user_id: profile.id,
        data: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        humor: (Math.floor(Math.random() * 5) + 1).toString(), // Convertendo para string
        nota_dia: Math.floor(Math.random() * 5) + 1,
        concluido: Math.random() > 0.3, // 70% de chance de estar concluído
        created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }));
    });

    // Inserir missões (em lotes para evitar timeout)
    const batchSize = 50;
    for (let i = 0; i < missionsData.length; i += batchSize) {
      const batch = missionsData.slice(i, i + batchSize);
      const { error: missionError } = await supabase
        .from('missao_dia')
        .upsert(batch, { onConflict: 'user_id,data' });

      if (missionError) {
        console.warn('Erro ao inserir missões:', missionError);
      }
    }

    console.log(`✅ ${missionsData.length} missões diárias criadas`);

    // Criar pontuações diárias
    const dailyScoresData = profiles.flatMap(profile => {
      const numDays = Math.floor(Math.random() * 14) + 7; // 7-21 dias de pontuação
      return Array.from({ length: numDays }, (_, i) => ({
        user_id: profile.id,
        data: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_pontos_dia: Math.floor(Math.random() * 150) + 30, // 30-180 pontos por dia
        pontos_habitos: Math.floor(Math.random() * 50) + 10,
        pontos_mente: Math.floor(Math.random() * 50) + 10,
        pontos_ritual: Math.floor(Math.random() * 50) + 10,
        created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }));
    });

    // Inserir pontuações diárias (em lotes)
    for (let i = 0; i < dailyScoresData.length; i += batchSize) {
      const batch = dailyScoresData.slice(i, i + batchSize);
      const { error: scoresError } = await supabase
        .from('pontuacao_diaria')
        .upsert(batch, { onConflict: 'user_id,data' });

      if (scoresError) {
        console.warn('Erro ao inserir pontuações:', scoresError);
      }
    }

    console.log(`✅ ${dailyScoresData.length} pontuações diárias criadas`);

    console.log('🎉 Usuários fictícios criados com sucesso!');
    return { success: true, count: profiles.length };

  } catch (error) {
    console.error('❌ Erro ao criar usuários fictícios:', error);
    throw error;
  }
};

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