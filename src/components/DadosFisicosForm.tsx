
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRegistrationSystem } from '@/hooks/useRegistrationSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UnifiedPhysicalDataForm } from '@/components/unified/UnifiedPhysicalDataForm';

interface PhysicalFormData {
  dataNascimento?: string;
  sexo?: 'masculino' | 'feminino' | 'outro';
  pesoAtual: number;
  altura?: number;
  circunferenciaAbdominal: number;
  metaPeso?: number;
}

export const DadosFisicosForm = () => {
  const { user } = useAuth();
  const { executeCompleteRegistration, executeHealthCheck, isSubmitting } = useRegistrationSystem();
  const [existingData, setExistingData] = useState<any>(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingData();
  }, [user]);

  const checkExistingData = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data: existingPhysicalData } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      if (existingPhysicalData) {
        setExistingData({
          ...existingPhysicalData,
          fullName: profile.full_name
        });
        setHasExistingData(true);
      }
    } catch (error) {
      console.error('Erro ao verificar dados existentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialSubmit = async (data: PhysicalFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar os dados');
      return;
    }

    try {
      // Usar o sistema de cadastro completo com stored procedure
      const result = await executeCompleteRegistration({
        fullName: existingData?.fullName || user.email?.split('@')[0] || 'Usuário',
        email: user.email!,
        dataNascimento: data.dataNascimento!,
        sexo: data.sexo!,
        altura: data.altura!,
        pesoAtual: data.pesoAtual,
        circunferenciaAbdominal: data.circunferenciaAbdominal,
        metaPeso: data.metaPeso
      });

      if (result.success) {
        setHasExistingData(true);
        await checkExistingData();
        
        // Executar health check automático
        await executeHealthCheck();
      }
    } catch (error) {
      console.error('Erro no cadastro completo:', error);
    }
  };

  const handleUpdateSubmit = async (data: PhysicalFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para atualizar os dados');
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile não encontrado');

      // Atualizar apenas peso e circunferência abdominal
      const { error: updateError } = await supabase
        .from('dados_fisicos_usuario')
        .update({
          peso_atual_kg: data.pesoAtual,
          circunferencia_abdominal_cm: data.circunferenciaAbdominal,
          meta_peso_kg: data.metaPeso || data.pesoAtual,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', profile.id);

      if (updateError) throw updateError;

      // Também atualizar dados_saude_usuario
      await supabase
        .from('dados_saude_usuario')
        .upsert({
          user_id: profile.id,
          peso_atual_kg: data.pesoAtual,
          altura_cm: existingData?.altura_cm || 170,
          circunferencia_abdominal_cm: data.circunferenciaAbdominal,
          meta_peso_kg: data.metaPeso || data.pesoAtual,
          data_atualizacao: new Date().toISOString()
        });

      // Criar nova pesagem
      await supabase
        .from('pesagens')
        .insert({
          user_id: profile.id,
          peso_kg: data.pesoAtual,
          circunferencia_abdominal_cm: data.circunferenciaAbdominal,
          data_medicao: new Date().toISOString(),
          origem_medicao: 'manual'
        });

      toast.success('Dados atualizados com sucesso! 🎉');
      await checkExistingData();
      
      // Executar health check após atualização
      await executeHealthCheck();
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Verificando dados existentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <UnifiedPhysicalDataForm
          mode={hasExistingData ? 'update' : 'initial'}
          existingData={existingData ? {
            pesoAtual: existingData.peso_atual_kg,
            altura: existingData.altura_cm,
            circunferenciaAbdominal: existingData.circunferencia_abdominal_cm,
            dataNascimento: existingData.data_nascimento,
            sexo: existingData.sexo,
            metaPeso: existingData.meta_peso_kg
          } : undefined}
          onSubmit={hasExistingData ? handleUpdateSubmit : handleInitialSubmit}
          isSubmitting={isSubmitting}
          requiredFields={hasExistingData ? ['pesoAtual', 'circunferenciaAbdominal'] : ['dataNascimento', 'sexo', 'pesoAtual', 'altura', 'circunferenciaAbdominal']}
        />
      </div>
    </div>
  );
};
