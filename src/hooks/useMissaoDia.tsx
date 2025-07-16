import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface MissaoDia {
  id?: string;
  user_id: string;
  data: string;
  inspira?: string;
  humor?: string;
  prioridades?: string[];
  mensagem_dia?: string;
  momento_feliz?: string;
  tarefa_bem_feita?: string;
  habito_saudavel?: string;
  gratidao?: string;
  concluido?: boolean;
  // Novos campos
  liquido_ao_acordar?: string;
  pratica_conexao?: string;
  energia_ao_acordar?: number;
  sono_horas?: number;
  agua_litros?: string;
  atividade_fisica?: boolean;
  estresse_nivel?: number;
  fome_emocional?: boolean;
  pequena_vitoria?: string;
  intencao_para_amanha?: string;
  nota_dia?: number;
}

export const useMissaoDia = (isVisitor = false) => {
  const [missao, setMissao] = useState<MissaoDia | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  // Buscar perfil do usuário
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setUserProfile(data);
    };

    fetchProfile();
  }, [user?.id]);

  const fetchMissaoDodia = async () => {
    // Para visitantes, usar localStorage
    if (isVisitor || !user) {
      try {
        const localMissao = localStorage.getItem(`missao_dia_${today}`);
        if (localMissao) {
          setMissao(JSON.parse(localMissao));
        } else {
          // Criar nova missão local para visitante
          const novaMissao: MissaoDia = {
            user_id: 'visitor',
            data: today,
            prioridades: [],
            concluido: false
          };
          setMissao(novaMissao);
        }
      } catch (error) {
        console.error('Erro ao carregar missão local:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!userProfile?.id) return;

    try {
      const { data, error } = await supabase
        .from('missao_dia')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('data', today)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setMissao({
          ...data,
          prioridades: Array.isArray(data.prioridades) ? 
            data.prioridades.map(p => String(p)) : []
        });
      } else {
        // Criar nova missão para hoje
        const novaMissao: MissaoDia = {
          user_id: userProfile.id,
          data: today,
          prioridades: [],
          concluido: false
        };
        setMissao(novaMissao);
      }
    } catch (error) {
      console.error('Erro ao buscar missão do dia:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar sua missão do dia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMissao = async (updates: Partial<MissaoDia>) => {
    if (!missao) return;

    console.log('Atualizando missão:', updates);
    const updatedMissao = { ...missao, ...updates };
    setMissao(updatedMissao);

    // Para visitantes, salvar no localStorage
    if (isVisitor || !user) {
      try {
        localStorage.setItem(`missao_dia_${today}`, JSON.stringify(updatedMissao));
      } catch (error) {
        console.error('Erro ao salvar missão local:', error);
      }
      return;
    }

    if (!userProfile?.id) {
      console.error('UserProfile não encontrado');
      return;
    }

    try {
      console.log('Tentando atualizar missão no banco:', { userProfile: userProfile?.id, missaoId: missao.id });
      if (missao.id) {
        // Atualizar existente
        console.log('Atualizando missão existente com updates:', updates);
        const { error } = await supabase
          .from('missao_dia')
          .update(updates)
          .eq('id', missao.id);

        if (error) {
          console.error('Erro ao atualizar missão existente:', error);
          throw error;
        }
        console.log('Missão atualizada com sucesso!');
      } else {
        // Criar nova
        console.log('Criando nova missão com dados:', {
          user_id: userProfile.id,
          data: today,
          ...updates
        });
        const { data, error } = await supabase
          .from('missao_dia')
          .insert([{
            user_id: userProfile.id,
            data: today,
            ...updates
          }])
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar nova missão:', error);
          throw error;
        }
        console.log('Nova missão criada com sucesso:', data);
        if (data) {
          setMissao({
            ...updatedMissao,
            id: data.id
          });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar missão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas informações.",
        variant: "destructive",
      });
    }
  };

  const concluirMissao = async () => {
    if (!missao || !userProfile?.id) return;
    
    console.log('Concluindo missão para user:', userProfile.id);
    
    await updateMissao({ concluido: true });
    
    toast({
      title: "🎉 Missão cumprida!",
      description: "Cada passo de autocuidado te aproxima da sua melhor versão. ❤️",
    });
  };

  // Progresso movido para useMissaoCalculos

  useEffect(() => {
    if (isVisitor || !user) {
      // Para visitantes, carregar imediatamente
      fetchMissaoDodia();
    } else if (userProfile?.id) {
      fetchMissaoDodia();
    }
  }, [userProfile?.id, isVisitor, user]);

  return {
    missao,
    loading,
    updateMissao,
    concluirMissao,
    isAfter6PM: new Date().getHours() >= 18
  };
};