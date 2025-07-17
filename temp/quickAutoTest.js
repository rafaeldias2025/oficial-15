import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function createFakeProfile() {
    // Criar um profile fictício (sem autenticação)
    const fakeUserId = `fake_user_${Date.now()}`;
    const { data: profile, error } = await supabase.from('profiles').insert({
        user_id: fakeUserId,
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com',
        created_at: new Date().toISOString()
    }).select().single();
    if (error) {
        console.error('Erro ao criar profile:', error);
        return null;
    }
    console.log('Profile criado:', profile);
    return { userId: fakeUserId, profileId: profile.id };
}
async function runAutoTestWithFakeUser() {
    // Criar profile fictício
    const user = await createFakeProfile();
    if (!user)
        return;
    // Buscar primeiro desafio
    const { data: challenge } = await supabase.from('challenges').select('id').limit(1).single();
    if (!challenge) {
        console.error('Nenhum desafio encontrado');
        return;
    }
    console.log('Executando autoteste com:', {
        userId: user.userId,
        profileId: user.profileId,
        challengeId: challenge.id
    });
    // Simular a lógica do autoteste aqui (testando cada tabela uma por vez)
    const testResults = [];
    // Teste 1: Teste Sabotadores
    try {
        const { data, error } = await supabase.from('teste_sabotadores').insert({
            user_id: user.userId,
            pergunta: 'Teste pergunta sabotadores',
            resposta: 'Teste resposta sabotadores',
            created_at: new Date().toISOString()
        }).select();
        testResults.push({ table: 'teste_sabotadores', success: !error, data: data?.[0], error });
        console.log('✅ Teste Sabotadores:', !error ? 'SUCESSO' : 'ERRO', error?.message || '');
    }
    catch (e) {
        testResults.push({ table: 'teste_sabotadores', success: false, error: e });
        console.log('❌ Teste Sabotadores: ERRO', e);
    }
    // Teste 2: Roda da Vida
    try {
        const { data, error } = await supabase.from('roda_vida').insert({
            user_id: user.userId,
            area: 'Saúde',
            nivel: 8,
            comentario: 'Teste roda da vida',
            created_at: new Date().toISOString()
        }).select();
        testResults.push({ table: 'roda_vida', success: !error, data: data?.[0], error });
        console.log('✅ Roda da Vida:', !error ? 'SUCESSO' : 'ERRO', error?.message || '');
    }
    catch (e) {
        testResults.push({ table: 'roda_vida', success: false, error: e });
        console.log('❌ Roda da Vida: ERRO', e);
    }
    // Teste 3: Missão do Dia
    try {
        const { data, error } = await supabase.from('missao_dia').insert({
            user_id: user.userId,
            missao: 'Teste missão',
            completed: false,
            created_at: new Date().toISOString()
        }).select();
        testResults.push({ table: 'missao_dia', success: !error, data: data?.[0], error });
        console.log('✅ Missão do Dia:', !error ? 'SUCESSO' : 'ERRO', error?.message || '');
    }
    catch (e) {
        testResults.push({ table: 'missao_dia', success: false, error: e });
        console.log('❌ Missão do Dia: ERRO', e);
    }
    // Teste 4: Diário de Saúde
    try {
        const { data, error } = await supabase.from('diario_saude').insert({
            user_id: user.userId,
            humor: 8,
            energia: 7,
            sono: 6,
            observacoes: 'Teste diário de saúde',
            created_at: new Date().toISOString()
        }).select();
        testResults.push({ table: 'diario_saude', success: !error, data: data?.[0], error });
        console.log('✅ Diário de Saúde:', !error ? 'SUCESSO' : 'ERRO', error?.message || '');
    }
    catch (e) {
        testResults.push({ table: 'diario_saude', success: false, error: e });
        console.log('❌ Diário de Saúde: ERRO', e);
    }
    // Resumo final
    const successCount = testResults.filter(r => r.success).length;
    console.log(`\n📊 RESUMO DOS TESTES:`);
    console.log(`✅ Sucessos: ${successCount}/${testResults.length}`);
    console.log(`❌ Falhas: ${testResults.length - successCount}/${testResults.length}`);
    return testResults;
}
runAutoTestWithFakeUser().catch(console.error);
