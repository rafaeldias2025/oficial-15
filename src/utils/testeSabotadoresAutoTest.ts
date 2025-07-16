import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TestResult {
  success: boolean;
  message: string;
  errors: string[];
  data?: any;
}

export class TesteSabotadoresAutoTest {
  private testId: string | null = null;
  private profileId: string | null = null;
  
  async runCompleteTest(): Promise<TestResult> {
    const errors: string[] = [];
    let success = true;
    
    console.log("🤖 Iniciando teste automatizado do Teste de Sabotadores...");
    
    try {
      // 1. Verificar autenticação
      const authResult = await this.checkAuthentication();
      if (!authResult.success) {
        errors.push(authResult.message);
        success = false;
      }

      // 2. Garantir que o teste existe
      const testSetupResult = await this.ensureTestExists();
      if (!testSetupResult.success) {
        errors.push(testSetupResult.message);
        success = false;
      }

      // 3. Simular resposta a primeira pergunta
      const answerResult = await this.simulateAnswer(1, 4); // Pergunta 1, resposta "Concordo"
      if (!answerResult.success) {
        errors.push(answerResult.message);
        success = false;
      }

      // 4. Verificar se foi salvo corretamente
      const verificationResult = await this.verifyAnswerSaved(1, 4);
      if (!verificationResult.success) {
        errors.push(verificationResult.message);
        success = false;
      }

      // 5. Testar mais algumas respostas para validar o sistema
      for (let i = 2; i <= 5; i++) {
        const multiAnswerResult = await this.simulateAnswer(i, Math.floor(Math.random() * 5) + 1);
        if (!multiAnswerResult.success) {
          errors.push(`Pergunta ${i}: ${multiAnswerResult.message}`);
          success = false;
        }
      }

      // 6. Verificar dados salvos no banco
      const dbCheckResult = await this.checkDatabaseData();
      if (!dbCheckResult.success) {
        errors.push(dbCheckResult.message);
        success = false;
      }

      if (success) {
        console.log("✅ Teste automatizado concluído com sucesso!");
        toast.success("Teste automatizado concluído! Todas as respostas foram salvas corretamente.");
        return {
          success: true,
          message: "Teste automatizado executado com sucesso. Todas as funcionalidades estão operacionais.",
          errors: [],
          data: await this.getSavedData()
        };
      } else {
        console.error("❌ Teste automatizado falhou:", errors);
        toast.error("Teste automatizado falhou. Verifique os logs para detalhes.");
        return {
          success: false,
          message: "Teste automatizado encontrou problemas",
          errors
        };
      }

    } catch (error) {
      const errorMessage = `Erro inesperado durante teste automatizado: ${error}`;
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

  private async ensureTestExists(): Promise<TestResult> {
    try {
      // Verificar se já existe o teste
      let { data: existingTest } = await supabase
        .from('tests')
        .select('id')
        .eq('title', 'Teste dos Sabotadores')
        .eq('is_public', true)
        .single();

      if (!existingTest) {
        // Criar o teste se não existir
        const { data: newTest, error } = await supabase
          .from('tests')
          .insert({
            title: 'Teste dos Sabotadores',
            description: 'Teste para identificar padrões comportamentais que sabotam o emagrecimento',
            is_public: true,
            questions: [{ test: "automated_test" }] // Dados mínimos para o teste
          })
          .select('id')
          .single();

        if (error) {
          return {
            success: false,
            message: `Erro ao criar teste: ${error.message}`,
            errors: [error.message]
          };
        }
        
        this.testId = newTest.id;
        console.log("✅ Teste criado:", newTest.id);
      } else {
        this.testId = existingTest.id;
        console.log("✅ Teste encontrado:", existingTest.id);
      }

      return {
        success: true,
        message: "Teste configurado",
        errors: []
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao configurar teste: ${error}`,
        errors: [String(error)]
      };
    }
  }

  private async simulateAnswer(perguntaId: number, resposta: number): Promise<TestResult> {
    if (!this.testId || !this.profileId) {
      return {
        success: false,
        message: "Teste ou perfil não configurado",
        errors: ["Missing testId or profileId"]
      };
    }

    try {
      console.log(`📝 Simulando resposta: Pergunta ${perguntaId}, Resposta: ${resposta}`);

      // Buscar resposta existente
      const { data: existingResponse } = await supabase
        .from('test_responses')
        .select('responses')
        .eq('test_id', this.testId)
        .eq('user_id', this.profileId)
        .single();

      // Construir objeto de respostas
      const currentResponses = (existingResponse?.responses as Record<string, any>) || {};
      const updatedResponses = {
        ...currentResponses,
        [perguntaId]: {
          pergunta_id: perguntaId,
          resposta: resposta,
          data_hora: new Date().toISOString(),
          pergunta_texto: `Pergunta teste ${perguntaId}`
        }
      };

      // Salvar/atualizar resposta
      const { error } = await supabase
        .from('test_responses')
        .upsert({
          test_id: this.testId,
          user_id: this.profileId,
          responses: updatedResponses
        }, {
          onConflict: 'test_id,user_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`❌ Erro ao salvar resposta ${perguntaId}:`, error);
        return {
          success: false,
          message: `Erro ao salvar resposta ${perguntaId}: ${error.message}`,
          errors: [error.message]
        };
      }

      console.log(`✅ Resposta ${perguntaId} salva com sucesso`);
      return {
        success: true,
        message: `Resposta ${perguntaId} salva`,
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        message: `Erro inesperado ao simular resposta ${perguntaId}: ${error}`,
        errors: [String(error)]
      };
    }
  }

  private async verifyAnswerSaved(perguntaId: number, expectedAnswer: number): Promise<TestResult> {
    if (!this.testId || !this.profileId) {
      return {
        success: false,
        message: "Teste ou perfil não configurado para verificação",
        errors: ["Missing testId or profileId"]
      };
    }

    try {
      const { data: savedResponse, error } = await supabase
        .from('test_responses')
        .select('responses')
        .eq('test_id', this.testId)
        .eq('user_id', this.profileId)
        .single();

      if (error) {
        return {
          success: false,
          message: `Erro ao verificar resposta salva: ${error.message}`,
          errors: [error.message]
        };
      }

      const savedAnswer = savedResponse?.responses?.[perguntaId]?.resposta;
      
      if (savedAnswer !== expectedAnswer) {
        return {
          success: false,
          message: `Resposta não confere: esperado ${expectedAnswer}, encontrado ${savedAnswer}`,
          errors: ["Answer mismatch"]
        };
      }

      console.log(`✅ Resposta ${perguntaId} verificada: ${savedAnswer}`);
      return {
        success: true,
        message: "Resposta verificada com sucesso",
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        message: `Erro inesperado ao verificar resposta: ${error}`,
        errors: [String(error)]
      };
    }
  }

  private async checkDatabaseData(): Promise<TestResult> {
    try {
      const { data: responses, error } = await supabase
        .from('test_responses')
        .select('*')
        .eq('test_id', this.testId)
        .eq('user_id', this.profileId);

      if (error) {
        return {
          success: false,
          message: `Erro ao verificar dados no banco: ${error.message}`,
          errors: [error.message]
        };
      }

      if (!responses || responses.length === 0) {
        return {
          success: false,
          message: "Nenhuma resposta encontrada no banco de dados",
          errors: ["No responses found"]
        };
      }

      const responseData = responses[0];
      const answersCount = Object.keys(responseData.responses || {}).length;
      
      console.log(`✅ Dados no banco verificados: ${answersCount} respostas salvas`);
      console.log("📊 Dados salvos:", responseData);

      return {
        success: true,
        message: `Dados verificados: ${answersCount} respostas no banco`,
        errors: [],
        data: responseData
      };

    } catch (error) {
      return {
        success: false,
        message: `Erro inesperado ao verificar banco: ${error}`,
        errors: [String(error)]
      };
    }
  }

  private async getSavedData() {
    if (!this.testId || !this.profileId) return null;

    try {
      const { data, error } = await supabase
        .from('test_responses')
        .select('*')
        .eq('test_id', this.testId)
        .eq('user_id', this.profileId)
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
export const runAutomatedTest = async (): Promise<TestResult> => {
  const test = new TesteSabotadoresAutoTest();
  return await test.runCompleteTest();
};