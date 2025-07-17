import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePhysicalDataComplete } from '@/hooks/usePhysicalDataComplete';
import { useDadosSaude } from '@/hooks/useDadosSaude';
import { HealthLayout } from '@/components/layout/HealthLayout';
import HomePage from '@/components/HomePage';

const ProtectedHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isComplete, isLoading, clearCache } = usePhysicalDataComplete();
  const { dadosSaude, refetch } = useDadosSaude();
  const [hasRefetched, setHasRefetched] = useState(false);

  // Forçar refetch quando usuário vem de outro lugar
  useEffect(() => {
    if (user && !hasRefetched) {
      console.log('🔄 Forçando atualização dos dados...');
      
      // Verificar se dados foram recém-salvos
      const dadosRecemSalvos = localStorage.getItem('dados_recem_salvos');
      if (dadosRecemSalvos) {
        console.log('📊 Dados recém-salvos detectados!');
        localStorage.removeItem('dados_recem_salvos');
      }
      
      clearCache();
      refetch();
      setHasRefetched(true);
    }
  }, [user, clearCache, refetch, hasRefetched]);

  useEffect(() => {
    // Se o usuário está logado e os dados estão carregados
    if (user && !isLoading && hasRefetched) {
      console.log('Usuário autenticado detectado na página inicial:', {
        userId: user.id,
        isPhysicalDataComplete: isComplete,
        hasDadosSaude: !!dadosSaude,
        hasRefetched
      });
      
      // Limpar flag de dados recém-salvos se existir
      const dadosRecemSalvos = localStorage.getItem('dados_recem_salvos');
      if (dadosRecemSalvos) {
        localStorage.removeItem('dados_recem_salvos');
      }
      
      // Não redirecionar automaticamente - deixar usuário na home
      console.log('✅ Usuário pode permanecer na home');
    }
  }, [user, isComplete, isLoading, navigate, dadosSaude, hasRefetched]);

  // Mostrar a HomePage com HealthLayout para todos os usuários (logados ou não)
  return (
    <HealthLayout 
      showHealthStats={!!user && !!dadosSaude} 
      enableQuickAccess={!!user}
    >
      <HomePage />
    </HealthLayout>
  );
};

export default ProtectedHomePage;