import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 TESTANDO ACESSO ÀS PRINCIPAIS TABELAS DO BANCO\n');

async function testarTabelasPrincipais() {
  const resultados = [];

  // Lista de tabelas para testar (apenas leitura)
  const tabelas = [
    'challenges',
    'courses', 
    'course_modules',
    'course_lessons',
    'profiles',
    'users',
    'missao_dia',
    'diario_saude',
    'pontuacao_diaria',
    'user_challenges',
    'dados_fisicos_usuario',
    'pesagens',
    'google_fit_data',
    'weekly_evaluations',
    'sessions',
    'session_tools',
    'session_notes',
    'session_feedback',
    'mission_habitos_dia',
    'mission_mente_emocoes',
    'mission_ritual_manha',
    'beneficios',
    'avaliacoes',
    'user_goals',
    'teste_sabotadores',
    'roda_vida'
  ];

  for (const tabela of tabelas) {
    try {
      const { data, error, count } = await supabase
        .from(tabela)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${tabela}: ${error.message}`);
        resultados.push({ tabela, status: 'erro', erro: error.message });
      } else {
        console.log(`✅ ${tabela}: ${count || 0} registros encontrados`);
        resultados.push({ tabela, status: 'sucesso', registros: count || 0 });
      }
    } catch (e) {
      console.log(`❌ ${tabela}: ${e.message}`);
      resultados.push({ tabela, status: 'erro', erro: e.message });
    }
  }

  // Resumo
  const sucessos = resultados.filter(r => r.status === 'sucesso');
  const erros = resultados.filter(r => r.status === 'erro');
  
  console.log('\n📊 RESUMO DO TESTE DE TABELAS:');
  console.log('='.repeat(50));
  console.log(`✅ Tabelas acessíveis: ${sucessos.length}/${tabelas.length}`);
  console.log(`❌ Tabelas com erro: ${erros.length}/${tabelas.length}`);
  
  if (sucessos.length > 0) {
    console.log('\n📋 TABELAS FUNCIONAIS:');
    sucessos.forEach(s => {
      console.log(`   • ${s.tabela} (${s.registros} registros)`);
    });
  }
  
  if (erros.length > 0) {
    console.log('\n⚠️  TABELAS COM PROBLEMAS:');
    erros.forEach(e => {
      console.log(`   • ${e.tabela}: ${e.erro}`);
    });
  }

  // Teste de inserção em tabela de teste (se permitido)
  console.log('\n🧪 TESTANDO INSERÇÃO DE DADOS...');
  
  // Tentar inserir em uma tabela de log/teste se existir
  try {
    const { data, error } = await supabase.from('test_logs').insert({
      message: 'Autoteste executado com sucesso',
      timestamp: new Date().toISOString(),
      test_type: 'autotest_user_tools'
    }).select();
    
    if (!error) {
      console.log('✅ Inserção de teste: SUCESSO');
    } else {
      console.log('❌ Inserção de teste: FALHOU -', error.message);
    }
  } catch (e) {
    console.log('❌ Inserção de teste: FALHOU -', e.message);
  }

  console.log('\n🎯 ANÁLISE COMPLETA FINALIZADA!');
  console.log('💡 As tabelas acessíveis podem ser usadas para testes de lógica');
  console.log('🔒 Tabelas protegidas exigem autenticação adequada');
  
  return resultados;
}

testarTabelasPrincipais().catch(console.error);
