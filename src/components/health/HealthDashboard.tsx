import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Activity, 
  TrendingUp, 
  Heart, 
  Zap,
  Settings,
  Fullscreen,
  Download,
  Share2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/contexts/AuthContext';
import { SilhuetaUsuario3D } from './SilhuetaUsuario3D';
import { GraficoIdadeMetabolica } from './GraficoIdadeMetabolica';
import { PainelVitalidade } from './PainelVitalidade';
import { BlocoUnicoEvolucao } from './BlocoUnicoEvolucao';

interface HealthDashboardProps {
  className?: string;
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({
  className = ''
}) => {
  // const { user } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dadosSaude, setDadosSaude] = useState<any>(null);
  const [pesagensHistorico, setPesagensHistorico] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);

  // Simular usuário para demonstração
  useEffect(() => {
    const simulateUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    simulateUser();
  }, []);

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      carregarDadosCompletos();
    }
  }, [user]);

  const carregarDadosCompletos = useCallback(async () => {
    try {
      setIsLoading(true);

      // Buscar perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfileData(profile);

      // Buscar dados de saúde
      const { data: saude } = await supabase
        .from('dados_saude_usuario')
        .select('*')
        .eq('user_id', user.id)
        .order('data_atualizacao', { ascending: false })
        .limit(1)
        .single();

      // Buscar histórico de pesagens (últimos 30 registros)
      const { data: pesagens } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', user.id)
        .order('data_medicao', { ascending: false })
        .limit(30);

      // Buscar dados físicos para altura e sexo
      const { data: dadosFisicos } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Combinar dados
      const dadosCombinados = {
        ...saude,
        ...dadosFisicos,
        // Usar dados da pesagem mais recente se disponível
        ...(pesagens && pesagens.length > 0 ? {
          peso_atual_kg: pesagens[0].peso_kg,
          gordura_corporal_pct: pesagens[0].gordura_corporal_pct,
          massa_muscular_kg: pesagens[0].massa_muscular_kg,
          agua_corporal_pct: pesagens[0].agua_corporal_pct,
          taxa_metabolica_basal: pesagens[0].taxa_metabolica_basal,
          idade_metabolica: pesagens[0].idade_metabolica || 25,
          gordura_visceral: pesagens[0].gordura_visceral || 8
        } : {})
      };

      setDadosSaude(dadosCombinados);
      setPesagensHistorico(pesagens || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Calcular idade cronológica
  const idadeCronologica = React.useMemo(() => {
    if (!profileData?.data_nascimento) return 30;
    
    const nascimento = new Date(profileData.data_nascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }, [profileData]);

  // Dados para os componentes
  const dadosParaComponentes = React.useMemo(() => {
    if (!dadosSaude) return null;

    return {
      peso: dadosSaude.peso_atual_kg || 70,
      altura: dadosSaude.altura_cm || 170,
      sexo: dadosSaude.sexo || 'masculino',
      imc: dadosSaude.peso_atual_kg && dadosSaude.altura_cm 
        ? dadosSaude.peso_atual_kg / Math.pow(dadosSaude.altura_cm / 100, 2)
        : 22,
      gorduraCorporal: dadosSaude.gordura_corporal_pct || 15,
      massaMuscular: dadosSaude.massa_muscular_kg || 30,
      aguaCorporal: dadosSaude.agua_corporal_pct || 60,
      idadeMetabolica: dadosSaude.idade_metabolica || 25,
      idadeCronologica,
      taxaMetabolicaBasal: dadosSaude.taxa_metabolica_basal || 1800,
      gorduraVisceral: dadosSaude.gordura_visceral || 8,
      metaPeso: dadosSaude.meta_peso_kg
    };
  }, [dadosSaude, idadeCronologica]);

  // Dados de evolução para gráficos
  const dadosEvolucao = React.useMemo(() => {
    return pesagensHistorico.map(pesagem => ({
      data: new Date(pesagem.data_medicao),
      peso: pesagem.peso_kg,
      imc: pesagem.imc || 22,
      gorduraCorporal: pesagem.gordura_corporal_pct || 15,
      massaMuscular: pesagem.massa_muscular_kg || 30,
      idadeMetabolica: pesagem.idade_metabolica || 25,
      idadeCronologica: idadeCronologica,
      taxaMetabolicaBasal: pesagem.taxa_metabolica_basal || 1800
    }));
  }, [pesagensHistorico, idadeCronologica]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instituto-orange mb-4"></div>
          <p className="text-gray-600">Carregando dados de saúde...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
          <p className="text-gray-600">Faça login para acessar o dashboard de saúde</p>
        </div>
      </div>
    );
  }

  if (!dadosParaComponentes) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${className}`}>
        <Card className="p-8 text-center">
          <div className="mb-4">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Dados de Saúde Não Encontrados
            </h3>
            <p className="text-gray-600 mb-4">
              Complete seu perfil para visualizar sua dashboard de saúde personalizada.
            </p>
            <Button 
              onClick={() => window.location.href = '/profile'}
              className="bg-instituto-orange hover:bg-instituto-orange-hover"
            >
              Completar Perfil
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard de Saúde</h1>
            <p className="text-gray-600">
              Bem-vindo, {profileData?.nome_completo || user.email?.split('@')[0]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Última atualização: hoje
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Configurar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Compartilhar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Silhueta 3D
            </TabsTrigger>
            <TabsTrigger value="metabolic" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Metabólico
            </TabsTrigger>
            <TabsTrigger value="vitality" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Vitalidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BlocoUnicoEvolucao
                dadosEvolucao={dadosEvolucao}
                dadosAtuais={dadosParaComponentes}
                metaPeso={dadosParaComponentes.metaPeso}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="3d" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {dadosParaComponentes ? (
                <SilhuetaUsuario3D
                  peso={dadosParaComponentes.peso}
                  altura={dadosParaComponentes.altura}
                  sexo={dadosParaComponentes.sexo as 'masculino' | 'feminino'}
                  imc={dadosParaComponentes.imc}
                  gorduraCorporal={dadosParaComponentes.gorduraCorporal}
                  massaMuscular={dadosParaComponentes.massaMuscular}
                  aguaCorporal={dadosParaComponentes.aguaCorporal}
                  idadeMetabolica={dadosParaComponentes.idadeMetabolica}
                  idadeCronologica={dadosParaComponentes.idadeCronologica}
                  taxaMetabolicaBasal={dadosParaComponentes.taxaMetabolicaBasal}
                  gorduraVisceral={dadosParaComponentes.gorduraVisceral}
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🧬</div>
                    <h3 className="text-lg font-semibold mb-2">Dados Insuficientes</h3>
                    <p className="text-gray-600 mb-4">Complete seus dados físicos para visualizar a silhueta 3D</p>
                    <Button variant="outline">
                      Adicionar Dados
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="metabolic" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {dadosParaComponentes ? (
                <GraficoIdadeMetabolica
                  dados={dadosEvolucao}
                  idadeAtualMetabolica={dadosParaComponentes.idadeMetabolica}
                  idadeAtualCronologica={dadosParaComponentes.idadeCronologica}
                  taxaMetabolicaAtual={dadosParaComponentes.taxaMetabolicaBasal}
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold mb-2">Dados Insuficientes</h3>
                    <p className="text-gray-600 mb-4">Complete seus dados para visualizar gráficos metabólicos</p>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="vitality" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {dadosParaComponentes ? (
                <PainelVitalidade
                  idadeCronologica={dadosParaComponentes.idadeCronologica}
                  idadeMetabolica={dadosParaComponentes.idadeMetabolica}
                  taxaMetabolicaBasal={dadosParaComponentes.taxaMetabolicaBasal}
                  peso={dadosParaComponentes.peso}
                  imc={dadosParaComponentes.imc}
                  gorduraCorporal={dadosParaComponentes.gorduraCorporal}
                  massaMuscular={dadosParaComponentes.massaMuscular}
                  aguaCorporal={dadosParaComponentes.aguaCorporal}
                  gorduraVisceral={dadosParaComponentes.gorduraVisceral}
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-lg font-semibold mb-2">Dados Insuficientes</h3>
                    <p className="text-gray-600 mb-4">Complete seus dados para visualizar análise de vitalidade</p>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          size="sm"
          className="bg-instituto-orange hover:bg-instituto-orange-hover shadow-lg"
          onClick={() => window.location.href = '/measurements'}
        >
          <Activity className="w-4 h-4 mr-1" />
          Nova Medição
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shadow-lg bg-white"
          onClick={() => {
            const element = document.documentElement;
            if (element.requestFullscreen) {
              element.requestFullscreen();
            }
          }}
        >
          <Fullscreen className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default HealthDashboard;
