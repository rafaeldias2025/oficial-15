import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RegistrationData {
  fullName: string;
  email: string;
  dataNascimento: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  altura: number;
  pesoAtual: number;
  circunferenciaAbdominal: number;
  celular?: string;
  metaPeso?: number;
}

interface HealthCheckResult {
  status: 'healthy' | 'incomplete' | 'error';
  checks: {
    profile_exists: boolean;
    physical_data_exists: boolean;
    health_data_exists: boolean;
    weighing_exists: boolean;
    points_exists: boolean;
  };
  missing_fields: string[];
  profile_id: string;
}

interface RegistrationResult {
  success: boolean;
  profile_id: string;
  user_id: string;
  imc_calculated: number;
  health_check: HealthCheckResult;
  message: string;
  error?: string;
}

interface IntegrityMonitorResult {
  monitor_timestamp: string;
  status: 'healthy' | 'warning';
  issues: {
    users_without_weighings: number;
    records_without_user_id: number;
    null_critical_fields: number;
    orphaned_profiles: number;
  };
  recommendations: string[];
}

export const useRegistrationSystem = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [healthCheckResult, setHealthCheckResult] = useState<HealthCheckResult | null>(null);

  const executeCompleteRegistration = async (data: RegistrationData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Iniciando cadastro completo para:', user.id);

      // Chamar a stored procedure para cadastro completo
      const { data: result, error } = await supabase.rpc('create_complete_user_registration', {
        p_user_id: user.id,
        p_full_name: data.fullName,
        p_email: data.email,
        p_data_nascimento: data.dataNascimento,
        p_sexo: data.sexo,
        p_altura_cm: data.altura,
        p_peso_atual_kg: data.pesoAtual,
        p_circunferencia_abdominal_cm: data.circunferenciaAbdominal,
        p_celular: data.celular || null,
        p_meta_peso_kg: data.metaPeso || data.pesoAtual
      });

      if (error) {
        console.error('❌ Erro na stored procedure:', error);
        throw error;
      }

      console.log('✅ Resultado do cadastro:', result);

      const registrationResult = result as unknown as RegistrationResult;

      if (!registrationResult.success) {
        throw new Error(registrationResult.message || 'Erro no cadastro completo');
      }

      // Armazenar resultado do health check
      setHealthCheckResult(registrationResult.health_check);

      // Verificar se health check passou
      if (registrationResult.health_check?.status === 'incomplete') {
        console.warn('⚠️ Health check detectou problemas:', registrationResult.health_check.missing_fields);
        toast.warning(`Cadastro realizado, mas alguns dados podem estar incompletos: ${registrationResult.health_check.missing_fields.join(', ')}`);
      } else {
        toast.success('Cadastro completo realizado com sucesso! 🎉');
      }

      return {
        success: true,
        data: registrationResult,
        healthCheck: registrationResult.health_check
      };

    } catch (error) {
      console.error('❌ Erro no cadastro completo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no cadastro';
      toast.error(`Erro no cadastro: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeHealthCheck = async (profileId?: string) => {
    if (!user && !profileId) {
      return { success: false, error: 'Usuário ou profile ID necessário' };
    }

    try {
      let targetProfileId = profileId;
      
      if (!targetProfileId) {
        // Buscar profile ID do usuário atual
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user!.id)
          .single();
        
        if (!profile) {
          throw new Error('Profile não encontrado');
        }
        
        targetProfileId = profile.id;
      }

      console.log('🩺 Executando health check para profile:', targetProfileId);

      const { data: result, error } = await supabase.rpc('execute_user_health_check', {
        p_profile_id: targetProfileId
      });

      if (error) {
        console.error('❌ Erro no health check:', error);
        throw error;
      }

      console.log('📋 Resultado do health check:', result);
      const healthResult = result as unknown as HealthCheckResult;
      setHealthCheckResult(healthResult);

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('❌ Erro no health check:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro no health check';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const executeDataIntegrityMonitor = async () => {
    try {
      console.log('🔍 Executando monitoramento de integridade dos dados...');

      const { data: result, error } = await supabase.rpc('run_data_integrity_monitor');

      if (error) {
        console.error('❌ Erro no monitoramento:', error);
        throw error;
      }

      console.log('📊 Resultado do monitoramento:', result);

      const monitorResult = result as unknown as IntegrityMonitorResult;

      if (monitorResult.status === 'warning') {
        console.warn('⚠️ Problemas de integridade detectados:', monitorResult.issues);
        toast.warning(`Problemas detectados no sistema: ${Object.keys(monitorResult.issues).filter(key => monitorResult.issues[key as keyof typeof monitorResult.issues] > 0).join(', ')}`);
      } else {
        console.log('✅ Sistema íntegro');
        toast.success('Sistema verificado - todos os dados estão íntegros! ✅');
      }

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('❌ Erro no monitoramento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro no monitoramento';
      toast.error(`Erro no monitoramento: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return {
    isSubmitting,
    healthCheckResult,
    executeCompleteRegistration,
    executeHealthCheck,
    executeDataIntegrityMonitor
  };
};