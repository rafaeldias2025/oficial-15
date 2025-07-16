import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { startOfWeek, format } from 'date-fns';

export interface TestResult {
  success: boolean;
  message: string;
  errors: string[];
  data?: any;
}

export class AvaliacaoSemanalAutoTest {
  private profileId: string | null = null;
  
  async runCompleteTest(): Promise<TestResult> {
    const errors: string[] = [];
    let success = true;
    
    console.log("🤖 Iniciando teste automatizado da Avaliação Semanal...");
    
    try {
      // 1. Verificar autenticação
      const authResult = await this.checkAuthentication();
      if (!authResult.success) {
        errors.push(authResult.message);
        success = false;
      }

      // 2. Gerar dados da avaliação semanal
      const avaliacaoData = this.generateWeeklyEvaluationData();
      
      // 3. Salvar avaliação semanal
      const saveResult = await this.saveWeeklyEvaluation(avaliacaoData);
      if (!saveResult.success) {
        errors.push(saveResult.message);
        success = false;
      }

      // 4. Verificar se foi salva corretamente
      const verificationResult = await this.verifyEvaluationSaved();
      if (!verificationResult.success) {
        errors.push(verificationResult.message);
        success = false;
      }

      if (success) {
        console.log("✅ Teste automatizado da Avaliação Semanal concluído com sucesso!");
        toast.success("Teste da Avaliação Semanal executado! Dados salvos corretamente.");
        return {
          success: true,
          message: "Teste automatizado da Avaliação Semanal executado com sucesso. Todas as funcionalidades estão operacionais.",
          errors: [],
          data: await this.getSavedData()
        };
      } else {
        console.error("❌ Teste automatizado da Avaliação Semanal falhou:", errors);
        toast.error("Teste automatizado da Avaliação Semanal falhou. Verifique os logs para detalhes.");
        return {
          success: false,
          message: "Teste automatizado encontrou problemas",
          errors
        };
      }

    } catch (error) {
      const errorMessage = `Erro inesperado durante teste automatizado da Avaliação Semanal: ${error}`;
      console.error("❌", errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    }
  }

  private async checkAuthentication(): Promise<TestResult> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return {
          success: false,
          message: "Erro de autenticação: Usuário não está logado",
          errors: ["Authentication failed"]
        };
      }

      // Buscar profile do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        return {
          success: false,
          message: "Erro: Profile do usuário não encontrado",
          errors: ["Profile not found"]
        };
      }

      this.profileId = profile.id;
      console.log("✅ Autenticação verificada:", { userId: user.id, profileId: profile.id });
      
      return {
        success: true,
        message: "Autenticação OK",
        errors: []
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao verificar autenticação: ${error}`,
        errors: [String(error)]
      };
    }
  }

  private generateWeeklyEvaluationData() {
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Respostas aleatórias de qualidade para o teste
    const getRandomRating = () => Math.floor(Math.random() * 5) + 1;
    const getRandomText = (prompts: string[]) => prompts[Math.floor(Math.random() * prompts.length)];

    const learningTexts = [
      "Consegui manter minha dieta equilibrada durante toda a semana.",
      "Aprendi a identificar melhor os momentos de fome emocional.",
      "Melhorei minha organização das refeições.",
      "Descobri novos exercícios que me motivam mais."
    ];

    const challengeTexts = [
      "Momentos de ansiedade que me levaram a comer mais.",
      "Dificuldade para manter a rotina nos finais de semana.",
      "Conciliar exercícios com a agenda corrida.",
      "Resistir às tentações em eventos sociais."
    ];

    const mentorTexts = [
      "Continue persistindo, você está no caminho certo!",
      "Cada pequeno progresso é uma vitória importante.",
      "Seja mais gentil consigo mesmo nos momentos difíceis.",
      "Foque no processo, não apenas no resultado."
    ];

    return {
      week_start_date: format(currentWeek, 'yyyy-MM-dd'),
      learning_data: {
        melhor_acontecimento: getRandomText(learningTexts),
        maior_desafio: getRandomText(challengeTexts),
        conselho_mentor: getRandomText(mentorTexts),
        maior_aprendizado_sabotador: "Percebi que sou muito crítico comigo mesmo.",
        momento_percebi_sabotando: "Quando comecei a me comparar excessivamente com outros.",
        nome_semana: "Semana do Autoconhecimento",
        relacao_ultima_semana: "Me sinto orgulhoso(a) dos progressos conquistados."
      },
      performance_ratings: {
        // Saúde
        saude_alimentacao_objetivos: getRandomRating(),
        saude_recuperacao_fisica: getRandomRating(),
        saude_bebi_agua: getRandomRating(),
        saude_mais_energia: getRandomRating(),
        saude_raspei_lingua: getRandomRating(),
        
        // Presença
        presenca_focado_planejei: getRandomRating(),
        presenca_atitudes_intencionais: getRandomRating(),
        presenca_atencao_alimentacao: getRandomRating(),
        presenca_clareza_objetivos: getRandomRating(),
        presenca_disciplina_consistencia: getRandomRating(),
        
        // Físico
        fisico_fui_academia: getRandomRating(),
        fisico_caminhada_melhor: getRandomRating(),
        fisico_mobilidade: getRandomRating(),
        fisico_sono_qualidade: getRandomRating(),
        fisico_condicionamento_aumentou: getRandomRating(),
        
        // Profissional
        profissional_li_livro: getRandomRating(),
        profissional_fiz_mais_combinado: getRandomRating(),
        profissional_ajudei_alguem: getRandomRating(),
        profissional_melhorei_trabalho: getRandomRating(),
        profissional_assisti_podcast: getRandomRating()
      },
      next_week_goals: "Focar em manter a consistência na alimentação e aumentar a frequência dos exercícios."
    };
  }

  private async saveWeeklyEvaluation(data: any): Promise<TestResult> {
    if (!this.profileId) {
      return {
        success: false,
        message: "Profile ID não configurado",
        errors: ["Missing profileId"]
      };
    }

    try {
      console.log("📝 Salvando avaliação semanal:", data);

      const { error } = await supabase
        .from('weekly_evaluations')
        .upsert({
          user_id: this.profileId,
          week_start_date: data.week_start_date,
          learning_data: data.learning_data,
          performance_ratings: data.performance_ratings,
          next_week_goals: data.next_week_goals
        }, {
          onConflict: 'user_id,week_start_date',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("❌ Erro ao salvar avaliação semanal:", error);
        return {
          success: false,
          message: `Erro ao salvar avaliação semanal: ${error.message}`,
          errors: [error.message]
        };
      }

      console.log("✅ Avaliação semanal salva com sucesso");
      return {
        success: true,
        message: "Avaliação semanal salva",
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        message: `Erro inesperado ao salvar avaliação semanal: ${error}`,
        errors: [String(error)]
      };
    }
  }

  private async verifyEvaluationSaved(): Promise<TestResult> {
    if (!this.profileId) {
      return {
        success: false,
        message: "Profile ID não configurado para verificação",
        errors: ["Missing profileId"]
      };
    }

    try {
      const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekStart = format(currentWeek, 'yyyy-MM-dd');

      const { data: savedEvaluation, error } = await supabase
        .from('weekly_evaluations')
        .select('*')
        .eq('user_id', this.profileId)
        .eq('week_start_date', weekStart)
        .single();

      if (error) {
        return {
          success: false,
          message: `Erro ao verificar avaliação salva: ${error.message}`,
          errors: [error.message]
        };
      }

      if (!savedEvaluation) {
        return {
          success: false,
          message: "Avaliação não foi encontrada após salvamento",
          errors: ["Evaluation not found"]
        };
      }

      console.log("✅ Avaliação semanal verificada no banco de dados");
      return {
        success: true,
        message: "Avaliação verificada com sucesso",
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        message: `Erro inesperado ao verificar avaliação: ${error}`,
        errors: [String(error)]
      };
    }
  }

  private async getSavedData() {
    if (!this.profileId) return null;

    try {
      const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekStart = format(currentWeek, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('weekly_evaluations')
        .select('*')
        .eq('user_id', this.profileId)
        .eq('week_start_date', weekStart)
        .single();

      if (error) {
        console.error("Erro ao buscar dados salvos:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro inesperado ao buscar dados:", error);
      return null;
    }
  }
}

// Função utilitária para executar o teste
export const runWeeklyEvaluationTest = async (): Promise<TestResult> => {
  const test = new AvaliacaoSemanalAutoTest();
  return await test.runCompleteTest();
};