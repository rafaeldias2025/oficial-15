import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Brain, 
  Droplets, 
  Moon, 
  Activity, 
  Target,
  TrendingUp,
  Scale,
  Ruler,
  User,
  BarChart3,
  RefreshCw,
  Loader2,
  Apple,
  Chrome,
  Smartphone
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDadosSaude } from "@/hooks/useDadosSaude";
import { supabase } from "@/integrations/supabase/client";
import { AtualizarMedidasModal } from "./AtualizarMedidasModal";
import { BluetoothScaleConnection } from "./BluetoothScaleConnection";
import { RiscoCardiometabolico } from "./RiscoCardiometabolico";
import { EvolucaoSemanal } from "./EvolucaoSemanal";
import { Silhueta3D } from "./Silhueta3D";
import { useHealthIntegration } from '@/hooks/useHealthIntegration';
import { GoogleFitModal } from './GoogleFitModal';


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const getIMCStatus = (imc: number) => {
  if (imc < 18.5) return { status: "Abaixo do peso", cor: "text-blue-500" };
  if (imc < 25) return { status: "Peso normal", cor: "text-green-500" };
  if (imc < 30) return { status: "Sobrepeso", cor: "text-yellow-500" };
  return { status: "Obesidade", cor: "text-red-500" };
};

const formatarHumor = (humor: string) => {
  const emojis: { [key: string]: string } = {
    '😄': 'Muito Feliz',
    '😐': 'Neutro', 
    '😞': 'Triste'
  };
  return emojis[humor] || humor;
};

export const BeneficiosVisuais: React.FC = () => {
  const { user } = useAuth();
  const { dadosSaude, missoesDaSemana, loading, refetch } = useDadosSaude();
  // Estado consolidado para todos os dados
  const [dadosConsolidados, setDadosConsolidados] = useState({
    dadosSaude,
    historicoPesagens: [],
    dadosFisicos: null,
    isLoading: true
  });

  const {
    state: healthState,
    connectGoogleFit
  } = useHealthIntegration();

  const [showGoogleFitModal, setShowGoogleFitModal] = useState(false);

  const handleHealthConnection = () => {
    console.log('🏃 Abrindo modal Google Fit');
    setShowGoogleFitModal(true);
  };

  const handleGoogleFitConnect = async (email: string) => {
    await connectGoogleFit(email);
  };

  // Função centralizada para buscar e consolidar TODOS os dados
  const atualizarTodosOsDados = React.useCallback(async () => {
    if (!user) return;
    
    console.log('🔄 Atualizando TODOS os dados automaticamente...');
    setDadosConsolidados(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        // Buscar TODOS os dados em paralelo
        const [pesagensResult, fisicaResult, saudeResult] = await Promise.all([
          supabase
            .from('pesagens')
            .select('*')
            .eq('user_id', profile.id)
            .order('data_medicao', { ascending: false })
            .limit(30),
          
          supabase
            .from('dados_fisicos_usuario')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
            
          supabase
            .from('dados_saude_usuario')
            .select('*')
            .eq('user_id', profile.id)
            .order('data_atualizacao', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        // Processar dados de pesagem mais recente se disponível
        let dadosSaudeAtualizado = saudeResult.data;
        
        if (pesagensResult.data && pesagensResult.data.length > 0) {
          const pesagemRecente = pesagensResult.data[0];
          const altura = fisicaResult.data?.altura_cm || dadosSaudeAtualizado?.altura_cm || 170;
          const alturaMetros = altura / 100;
          const imcCalculado = pesagemRecente.peso_kg / (alturaMetros * alturaMetros);
          
          // Atualizar dados de saúde com pesagem mais recente
          dadosSaudeAtualizado = {
            ...dadosSaudeAtualizado,
            peso_atual_kg: pesagemRecente.peso_kg,
            altura_cm: altura,
            imc: Math.round(imcCalculado * 10) / 10,
            data_atualizacao: pesagemRecente.data_medicao,
            circunferencia_abdominal_cm: dadosSaudeAtualizado?.circunferencia_abdominal_cm || 90
          };
        }

        const pesagensFormatadas = pesagensResult.data?.map(p => ({
          data: p.data_medicao,
          peso: p.peso_kg,
          imc: p.imc || 0,
          circunferencia: p.circunferencia_abdominal_cm,
          gordura_corporal_pct: p.gordura_corporal_pct
        })) || [];

        setDadosConsolidados({
          dadosSaude: dadosSaudeAtualizado,
          historicoPesagens: pesagensFormatadas,
          dadosFisicos: fisicaResult.data,
          isLoading: false
        });

        console.log('✅ Todos os dados atualizados:', {
          dadosSaude: !!dadosSaudeAtualizado,
          pesagens: pesagensFormatadas.length,
          dadosFisicos: !!fisicaResult.data
        });
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar dados:', error);
      setDadosConsolidados(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  // Atualizar quando dados de saúde mudam
  useEffect(() => {
    atualizarTodosOsDados();
  }, [atualizarTodosOsDados, dadosSaude]);

  // Listener em tempo real para atualizações automáticas
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('dados-completos-tempo-real')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pesagens'
        },
        (payload) => {
          console.log('🔄 Nova pesagem detectada, recalculando TUDO automaticamente...', payload);
          atualizarTodosOsDados();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dados_saude_usuario'
        },
        (payload) => {
          console.log('🔄 Dados de saúde atualizados, recalculando TUDO automaticamente...', payload);
          atualizarTodosOsDados();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dados_fisicos_usuario'
        },
        (payload) => {
          console.log('🔄 Dados físicos atualizados, recalculando TUDO automaticamente...', payload);
          atualizarTodosOsDados();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, atualizarTodosOsDados]);

  // Calcular estatísticas das missões
  const estatisticasMissoes = React.useMemo(() => {
    if (!missoesDaSemana.length) return [];

    const total = missoesDaSemana.length;
    const agua = missoesDaSemana.filter(m => m.bebeu_agua).length;
    const sono = missoesDaSemana.filter(m => m.dormiu_bem).length;
    const autocuidado = missoesDaSemana.filter(m => m.autocuidado).length;
    
    return [
      { nome: 'Hidratação', valor: Math.round((agua / total) * 100), icon: '💧' },
      { nome: 'Sono', valor: Math.round((sono / total) * 100), icon: '😴' },
      { nome: 'Autocuidado', valor: Math.round((autocuidado / total) * 100), icon: '🧠' },
    ];
  }, [missoesDaSemana]);

  // Dados para o gráfico de humor
  const dadosHumor = React.useMemo(() => {
    return missoesDaSemana.map((missao, index) => ({
      dia: `Dia ${index + 1}`,
      humor: missao.humor === '😄' ? 3 : missao.humor === '😐' ? 2 : 1,
      humorTexto: formatarHumor(missao.humor)
    }));
  }, [missoesDaSemana]);

  if (loading || dadosConsolidados.isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando seus dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            🏆 Sua Evolução
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Visualize sua jornada de saúde e evolução pessoal
          </p>
        </div>

        {/* Dados de Saúde */}
        {dadosConsolidados.dadosSaude ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
            <Card className="hover:shadow-lg transition-shadow border-2 border-instituto-orange/20 hover:border-instituto-orange/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-instituto-orange">
                  <Activity className="h-5 w-5" />
                  IMC Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-instituto-orange">
                  {dadosConsolidados.dadosSaude.imc?.toFixed(1)}
                </div>
                <div className={`text-sm font-semibold ${getIMCStatus(dadosConsolidados.dadosSaude.imc || 0).cor}`}>
                  {getIMCStatus(dadosConsolidados.dadosSaude.imc || 0).status}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Calculado com seus dados: {dadosConsolidados.dadosSaude.peso_atual_kg}kg / {(dadosConsolidados.dadosSaude.altura_cm!/100).toFixed(2)}m
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-instituto-orange/20 hover:border-instituto-orange/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-instituto-orange">
                  <Target className="h-5 w-5" />
                  Progresso da Meta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-instituto-orange">
                  {dadosConsolidados.dadosSaude.progresso_percentual?.toFixed(0) || '0'}%
                </div>
                <Progress 
                  value={dadosConsolidados.dadosSaude.progresso_percentual || 0} 
                  className="h-3 mb-2" 
                />
                <div className="text-sm text-muted-foreground">
                  Meta: {dadosConsolidados.dadosSaude.meta_peso_kg || 'Não definida'}kg
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {dadosConsolidados.dadosSaude.meta_peso_kg ? 
                    `Faltam ${Math.abs((dadosConsolidados.dadosSaude.meta_peso_kg - dadosConsolidados.dadosSaude.peso_atual_kg!)).toFixed(1)}kg` :
                    'Defina uma meta para ver seu progresso'
                  }
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-instituto-orange/20 hover:border-instituto-orange/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-instituto-orange">
                  <Ruler className="h-5 w-5" />
                  Circunferência Abdominal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-instituto-orange">
                  {dadosConsolidados.dadosSaude.circunferencia_abdominal_cm}cm
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  📊 Atualizado automaticamente
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Última pesagem: {dadosConsolidados.historicoPesagens[0]?.data ? 
                    new Date(dadosConsolidados.historicoPesagens[0].data).toLocaleDateString('pt-BR') : 'Hoje'}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="text-center p-8">
            <CardContent>
              <Scale className="h-12 w-12 text-instituto-orange mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Adicione suas medidas</h3>
              <p className="text-muted-foreground mb-4">
                Para ver sua evolução personalizada, registre seus dados de saúde
              </p>
              <div className="flex justify-center">
                <AtualizarMedidasModal 
                  trigger={
                    <Button className="bg-instituto-orange hover:bg-instituto-orange/90">
                      ⚖️ Registrar Medidas
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        
        {/* Novos componentes integrados - TODOS AUTOMÁTICOS */}
        {dadosConsolidados.dadosSaude && (
          <Tabs defaultValue="resumo" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="resumo">📊 Resumo</TabsTrigger>
              <TabsTrigger value="risco">❤️ Risco</TabsTrigger>
              <TabsTrigger value="evolucao">📈 Evolução</TabsTrigger>
              <TabsTrigger value="silhueta">👤 Silhueta 3D</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resumo" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Status Atual (Automático)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Peso atual:</span>
                        <span className="font-bold text-instituto-orange">{dadosConsolidados.dadosSaude.peso_atual_kg}kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Altura:</span>
                        <span className="font-bold">{dadosConsolidados.dadosSaude.altura_cm}cm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>IMC:</span>
                        <span className="font-bold text-instituto-purple">{dadosConsolidados.dadosSaude.imc?.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Circunf. abdominal:</span>
                        <span className="font-bold text-instituto-orange">{dadosConsolidados.dadosSaude.circunferencia_abdominal_cm}cm</span>
                      </div>
                      <div className="text-xs text-green-600 mt-2">
                        ✅ Atualizado automaticamente da última pesagem
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Atualizar Dados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <BluetoothScaleConnection
                      trigger={
                        <Button className="w-full bg-instituto-purple hover:bg-instituto-purple/80 text-white shadow-lg" size="lg">
                          ⚖️ Balança Inteligente
                        </Button>
                      }
                      onDataSaved={() => {
                        console.log('🔄 Dados salvos, forçando atualização completa...');
                        refetch();
                        atualizarTodosOsDados();
                      }}
                    />
                    {/* Botão de integração de saúde - mesmo padrão da balança */}
                    <Button
                      onClick={handleHealthConnection}
                      disabled={healthState.isConnected || healthState.isLoading}
                      className="w-full bg-instituto-purple hover:bg-instituto-purple/80 text-white shadow-lg mt-2"
                      size="lg"
                    >
                      {healthState.isLoading ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <>
                          🩺 Saúde Inteligente
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('🔄 Botão atualizar clicado, refazendo todos os cálculos...');
                        refetch();
                        atualizarTodosOsDados();
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Recálcular Tudo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="risco">
              <RiscoCardiometabolico
                circunferenciaAbdominal={dadosConsolidados.dadosSaude?.circunferencia_abdominal_cm || 90}
                sexo={dadosConsolidados.dadosFisicos?.sexo || 'masculino'}
                imc={dadosConsolidados.dadosSaude?.imc}
                peso={dadosConsolidados.dadosSaude?.peso_atual_kg || 70}
                altura={dadosConsolidados.dadosSaude?.altura_cm || 170}
                pesoAnterior={dadosConsolidados.historicoPesagens[1]?.peso}
                key={`risco-auto-${dadosConsolidados.dadosSaude?.peso_atual_kg}-${Date.now()}`}
              />
            </TabsContent>
            
            <TabsContent value="evolucao">
              <EvolucaoSemanal
                dados={dadosConsolidados.historicoPesagens}
                isLoading={dadosConsolidados.isLoading}
                metaPeso={dadosConsolidados.dadosSaude?.meta_peso_kg}
                altura={dadosConsolidados.dadosSaude?.altura_cm || 170}
                key={`evolucao-auto-${dadosConsolidados.historicoPesagens.length}-${Date.now()}`}
              />
            </TabsContent>
            
            <TabsContent value="silhueta">
              <Silhueta3D
                peso={dadosConsolidados.dadosSaude?.peso_atual_kg || 70}
                altura={dadosConsolidados.dadosSaude?.altura_cm || 170}
                sexo={dadosConsolidados.dadosFisicos?.sexo || 'masculino'}
                imc={dadosConsolidados.dadosSaude?.imc}
                gorduraCorporal={dadosConsolidados.historicoPesagens[0]?.gordura_corporal_pct}
                key={`silhueta-auto-${dadosConsolidados.dadosSaude?.peso_atual_kg}-${Date.now()}`}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Gráfico de Evolução das Missões */}
        {missoesDaSemana.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-instituto-orange">
                  <TrendingUp className="h-5 w-5" />
                  Sua Evolução Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {estatisticasMissoes.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-2xl font-bold text-instituto-orange">{stat.valor}%</div>
                      <div className="text-sm text-muted-foreground">{stat.nome}</div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={estatisticasMissoes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="valor" fill="hsl(var(--instituto-orange))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-instituto-orange">
                  <Heart className="h-5 w-5" />
                  Evolução do Humor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={dadosHumor}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis domain={[1, 3]} tickFormatter={(value) => ['😞', '😐', '😄'][value - 1]} />
                    <Tooltip formatter={(value, name) => [dadosHumor.find(d => d.humor === value)?.humorTexto || '', 'Humor']} />
                    <Line 
                      type="monotone" 
                      dataKey="humor" 
                      stroke="hsl(var(--instituto-orange))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--instituto-orange))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Indicadores das Missões */}
        {missoesDaSemana.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-instituto-orange">Indicadores da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {missoesDaSemana.filter(m => m.bebeu_agua).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Dias hidratado</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Moon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {missoesDaSemana.filter(m => m.dormiu_bem).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Sono adequado</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Brain className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {missoesDaSemana.filter(m => m.autocuidado).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Autocuidado</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Heart className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(missoesDaSemana.filter(m => m.humor === '😄').length / missoesDaSemana.length * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Dias felizes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold">
            Continue Sua Jornada de Transformação
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada dia é uma nova oportunidade de cuidar melhor de si mesmo
          </p>
        </div>
      </div>

      {/* Botão Flutuante */}
      {dadosSaude && <AtualizarMedidasModal />}
      
      {/* Modal do Google Fit */}
      <GoogleFitModal
        isOpen={showGoogleFitModal}
        onClose={() => setShowGoogleFitModal(false)}
        onConnect={handleGoogleFitConnect}
        isLoading={healthState.isLoading}
        isConnected={healthState.isConnected}
      />
      

    </div>
  );
};