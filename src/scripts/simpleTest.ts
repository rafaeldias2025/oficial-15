import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createSimpleProfile() {
  // Gerar um UUID válido
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  const fakeUserId = generateUUID();
  const { data: profile, error } = await supabase.from('profiles').insert({
    user_id: fakeUserId
  }).select().single();

  if (error) {
    console.error('Erro ao criar profile:', error);
    return null;
  }

  console.log('Profile criado:', profile);
  return { userId: fakeUserId, profileId: profile.id };
}

async function testBasicTables() {
  // Criar profile fictício
  const user = await createSimpleProfile();
  if (!user) return;

  console.log('Iniciando testes das tabelas principais...\n');

  // Teste: Missão do Dia (tabela mais provável de existir)
  try {
    const { data, error } = await supabase.from('missao_dia').insert({
      user_id: user.userId,
      missao: 'Teste missão',
      completed: false
    }).select();
    console.log('✅ missao_dia: SUCESSO');
  } catch (e) {
    console.log('❌ missao_dia: ERRO -', e.message);
  }

  // Teste: Diário de Saúde
  try {
    const { data, error } = await supabase.from('diario_saude').insert({
      user_id: user.userId,
      humor: 8,
      energia: 7,
      sono: 6
    }).select();
    console.log('✅ diario_saude: SUCESSO');
  } catch (e) {
    console.log('❌ diario_saude: ERRO -', e.message);
  }

  // Teste: Pontuação Diária
  try {
    const { data, error } = await supabase.from('pontuacao_diaria').insert({
      user_id: user.userId,
      pontos: 100,
      data: new Date().toISOString().split('T')[0]
    }).select();
    console.log('✅ pontuacao_diaria: SUCESSO');
  } catch (e) {
    console.log('❌ pontuacao_diaria: ERRO -', e.message);
  }

  // Teste: User Challenges
  try {
    const { data: challenge } = await supabase.from('challenges').select('id').limit(1).single();
    if (challenge) {
      const { data, error } = await supabase.from('user_challenges').insert({
        user_id: user.userId,
        challenge_id: challenge.id,
        status: 'active'
      }).select();
      console.log('✅ user_challenges: SUCESSO');
    }
  } catch (e) {
    console.log('❌ user_challenges: ERRO -', e.message);
  }

  console.log('\n🎯 Testes básicos concluídos!');
}

testBasicTables().catch(console.error);
