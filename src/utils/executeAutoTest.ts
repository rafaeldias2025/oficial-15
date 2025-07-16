import { runAutomatedTest } from './testeSabotadoresAutoTest';

// Função para executar o teste automatizado imediatamente
(async () => {
  console.log('🤖 Executando teste automatizado do Teste de Sabotadores...');
  
  try {
    const result = await runAutomatedTest();
    
    if (result.success) {
      console.log('✅ TESTE PASSOU!');
      console.log('📊 Dados salvos:', result.data);
      console.log('💡 Mensagem:', result.message);
    } else {
      console.log('❌ TESTE FALHOU!');
      console.log('🚨 Erros:', result.errors);
      console.log('💡 Mensagem:', result.message);
    }
  } catch (error) {
    console.error('💥 Erro ao executar teste:', error);
  }
})();