import { useDadosSaudeCore } from '@/hooks/useDadosSaudeCore';
import { useMissaoUsuario } from '@/hooks/useMissaoUsuario';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Re-exportar interfaces para compatibilidade
export type { DadosSaudeCore as DadosSaude } from '@/hooks/useDadosSaudeCore';
export type { MissaoUsuario } from '@/hooks/useMissaoUsuario';

// Hook unificado que combina os hooks modulares
export const useDadosSaude = () => {
  const { user } = useAuth();
  const { dadosSaude, loading: saudeLoading, salvarDadosSaude, refetch: refetchSaude } = useDadosSaudeCore();
  const { missoesDaSemana, loading: missoesLoading, refetch: refetchMissoes } = useMissaoUsuario();

  const migrarDadosTemporarios = async () => {
    if (!user) return;

    const dadosTemp = localStorage.getItem('dados_saude_temp');
    if (dadosTemp) {
      try {
        const dados = JSON.parse(dadosTemp);
        await salvarDadosSaude({
          peso_atual_kg: dados.peso_atual_kg,
          altura_cm: dados.altura_cm,
          circunferencia_abdominal_cm: dados.circunferencia_abdominal_cm,
          meta_peso_kg: dados.meta_peso_kg
        });
        localStorage.removeItem('dados_saude_temp');
        toast.success('Dados temporários migrados com sucesso!');
      } catch (error) {
        console.error('Erro ao migrar dados temporários:', error);
      }
    }
  };

  const calcularDiferencaCircunferencia = () => {
    if (!dadosSaude) return null;
    
    // Implementar lógica para comparar com medições anteriores
    const diasDesdeInicio = 15;
    const reducao = 3.4;
    
    return { reducao, dias: diasDesdeInicio };
  };

  const refetch = async () => {
    await Promise.all([refetchSaude(), refetchMissoes()]);
  };

  return {
    dadosSaude,
    missoesDaSemana,
    loading: saudeLoading || missoesLoading,
    salvarDadosSaude,
    calcularDiferencaCircunferencia,
    migrarDadosTemporarios,
    refetch
  };
};