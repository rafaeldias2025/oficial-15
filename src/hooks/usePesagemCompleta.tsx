
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface PesagemCompleta {
  peso_kg: number;
  imc?: number;
  circunferencia_abdominal_cm?: number;
  idade_metabolica?: number;
  gordura_corporal_pct?: number;
  massa_muscular_kg?: number;
  agua_corporal_pct?: number;
  gordura_visceral?: number;
  taxa_metabolica_basal?: number;
  massa_ossea_kg?: number;
  tipo_corpo?: string;
  origem_medicao: string;
}

export const usePesagemCompleta = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const salvarPesagemCompleta = async (dados: PesagemCompleta) => {
    if (!user) {
      console.error('Usuário não logado');
      throw new Error('Usuário não logado');
    }

    try {
      setLoading(true);
      console.log('Iniciando salvamento da pesagem:', dados);

      // Buscar profile do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.error('Profile não encontrado');
        throw new Error('Profile não encontrado');
      }

      console.log('Profile encontrado:', profile.id);

      // Calcular IMC se não fornecido mas temos altura
      let imc = dados.imc;
      if (!imc && dados.peso_kg) {
        const { data: dadosFisicos } = await supabase
          .from('dados_fisicos_usuario')
          .select('altura_cm')
          .eq('user_id', profile.id)
          .maybeSingle();

        if (dadosFisicos?.altura_cm) {
          const alturaM = dadosFisicos.altura_cm / 100;
          imc = dados.peso_kg / (alturaM * alturaM);
          console.log('IMC calculado:', imc);
        }
      }

      // Preparar dados da pesagem com validação
      const pesagemData = {
        user_id: profile.id,
        peso_kg: Number(dados.peso_kg),
        imc: imc ? Number(parseFloat(imc.toString()).toFixed(2)) : null,
        circunferencia_abdominal_cm: dados.circunferencia_abdominal_cm ? Number(dados.circunferencia_abdominal_cm) : null,
        idade_metabolica: dados.idade_metabolica ? Number(dados.idade_metabolica) : null,
        gordura_corporal_pct: dados.gordura_corporal_pct ? Number(dados.gordura_corporal_pct) : null,
        massa_muscular_kg: dados.massa_muscular_kg ? Number(dados.massa_muscular_kg) : null,
        agua_corporal_pct: dados.agua_corporal_pct ? Number(dados.agua_corporal_pct) : null,
        gordura_visceral: dados.gordura_visceral ? Number(dados.gordura_visceral) : null,
        taxa_metabolica_basal: dados.taxa_metabolica_basal ? Number(dados.taxa_metabolica_basal) : null,
        massa_ossea_kg: dados.massa_ossea_kg ? Number(dados.massa_ossea_kg) : null,
        tipo_corpo: dados.tipo_corpo || null,
        origem_medicao: dados.origem_medicao,
        data_medicao: new Date().toISOString()
      };

      console.log('Dados da pesagem preparados:', pesagemData);

      // Validar campos obrigatórios
      if (!pesagemData.peso_kg || pesagemData.peso_kg <= 0) {
        throw new Error('Peso deve ser maior que zero');
      }

      if (!pesagemData.origem_medicao) {
        throw new Error('Origem da medição é obrigatória');
      }

      // Inserir pesagem
      const { error: pesagemError } = await supabase
        .from('pesagens')
        .insert(pesagemData);

      if (pesagemError) {
        console.error('Erro ao inserir pesagem:', pesagemError);
        throw pesagemError;
      }

      console.log('Pesagem inserida com sucesso');

      // Buscar dados de saúde existentes
      const { data: existingSaude } = await supabase
        .from('dados_saude_usuario')
        .select('altura_cm, meta_peso_kg, circunferencia_abdominal_cm')
        .eq('user_id', profile.id)
        .maybeSingle();

      // Atualizar dados_saude_usuario
      const saudeData = {
        user_id: profile.id,
        peso_atual_kg: Number(dados.peso_kg),
        altura_cm: existingSaude?.altura_cm || 170,
        meta_peso_kg: existingSaude?.meta_peso_kg || Number(dados.peso_kg),
        circunferencia_abdominal_cm: dados.circunferencia_abdominal_cm ? Number(dados.circunferencia_abdominal_cm) : (existingSaude?.circunferencia_abdominal_cm || 90),
        data_atualizacao: new Date().toISOString()
      };

      const { error: saudeError } = await supabase
        .from('dados_saude_usuario')
        .upsert(saudeData);

      if (saudeError) {
        console.error('Erro ao atualizar dados de saúde:', saudeError);
        // Não fazer throw aqui para não falhar a pesagem se os dados de saúde falharem
      }

      console.log('Dados de saúde atualizados com sucesso');
      toast.success('Pesagem registrada com sucesso!');
      return pesagemData;

    } catch (error) {
      console.error('Erro detalhado ao salvar pesagem:', error);
      toast.error('Erro ao registrar pesagem');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    salvarPesagemCompleta,
    loading
  };
};
