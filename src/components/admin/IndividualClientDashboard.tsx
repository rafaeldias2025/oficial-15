import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Activity, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  AlertCircle,
  Target,
  Heart,
  Droplets,
  Moon,
  Video
} from 'lucide-react';
import { IndividualMetricsCharts } from './IndividualMetricsCharts';
import { ClientProgressTimeline } from './ClientProgressTimeline';
import { ClientInterventionPanel } from './ClientInterventionPanel';
import { UserSessionManagement } from './UserSessionManagement';

interface ClientData {
  profile: any;
  physicalData: any;
  recentMissions: any[];
  weeklyScores: any[];
  weightHistory: any[];
  engagementData: any;
}

interface IndividualClientDashboardProps {
  selectedUserId: string | null;
  onClose: () => void;
}

export const IndividualClientDashboard: React.FC<IndividualClientDashboardProps> = ({
  selectedUserId,
  onClose
}) => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedUserId) {
      loadClientData(selectedUserId);
    }
  }, [selectedUserId]);

  const loadClientData = async (userId: string) => {
    setLoading(true);
    try {
      // Buscar dados do perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Buscar dados físicos
      const { data: physicalData } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Buscar missões recentes
      const { data: recentMissions } = await supabase
        .from('missao_dia')
        .select('*')
        .eq('user_id', userId)
        .order('data', { ascending: false })
        .limit(7);

      // Buscar pontuações semanais
      const { data: weeklyScores } = await supabase
        .from('pontuacao_diaria')
        .select('*')
        .eq('user_id', userId)
        .order('data', { ascending: false })
        .limit(30);

      // Buscar histórico de peso
      const { data: weightHistory } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', userId)
        .order('data_medicao', { ascending: false })
        .limit(20);

      // Calcular dados de engajamento
      const engagementData = calculateEngagement(recentMissions, weeklyScores);

      setClientData({
        profile,
        physicalData,
        recentMissions: recentMissions || [],
        weeklyScores: weeklyScores || [],
        weightHistory: weightHistory || [],
        engagementData
      });
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEngagement = (missions: any[], scores: any[]) => {
    const totalDays = missions?.length || 0;
    const completedDays = missions?.filter(m => m.concluido).length || 0;
    const avgScore = scores?.length ? 
      scores.reduce((acc, s) => acc + (s.total_pontos_dia || 0), 0) / scores.length : 0;
    
    const lastActivity = missions?.[0]?.data || null;
    const daysSinceLastActivity = lastActivity ? 
      Math.floor((new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)) : 999;

    return {
      completionRate: totalDays > 0 ? (completedDays / totalDays * 100) : 0,
      avgScore: Math.round(avgScore),
      daysSinceLastActivity,
      status: daysSinceLastActivity > 3 ? 'inactive' : daysSinceLastActivity > 1 ? 'at-risk' : 'active'
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-instituto-green';
      case 'at-risk': return 'bg-instituto-gold';
      case 'inactive': return 'bg-instituto-orange';
      default: return 'bg-netflix-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'at-risk': return 'Em Risco';
      case 'inactive': return 'Inativo';
      default: return 'Desconhecido';
    }
  };

  if (!selectedUserId) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <User className="h-12 w-12 text-netflix-text-muted mx-auto" />
            <p className="text-netflix-text-muted">Selecione um cliente para ver os detalhes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-instituto-orange border-t-transparent rounded-full mx-auto"></div>
            <p className="text-netflix-text-muted">Carregando dados do cliente...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientData?.profile) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-instituto-orange mx-auto" />
            <p className="text-netflix-text-muted">Cliente não encontrado</p>
            <Button onClick={onClose} variant="outline">
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { profile, physicalData, engagementData } = clientData;

  return (
    <div className="space-y-6">
      {/* Header do Cliente */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-netflix-text">
                  {physicalData?.nome_completo || profile.full_name || 'Cliente'}
                </h2>
                <Badge className={`${getStatusColor(engagementData.status)} text-white`}>
                  {getStatusText(engagementData.status)}
                </Badge>
              </div>
              <p className="text-netflix-text-muted">{profile.email}</p>
              {profile.celular && (
                <p className="text-netflix-text-muted">📱 {profile.celular}</p>
              )}
            </div>
            <Button onClick={onClose} variant="outline" className="border-netflix-border">
              Voltar à Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-instituto-orange">
                {engagementData.completionRate.toFixed(0)}%
              </div>
              <div className="text-sm text-netflix-text-muted">Taxa de Conclusão</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-instituto-purple">
                {engagementData.avgScore}
              </div>
              <div className="text-sm text-netflix-text-muted">Pontuação Média</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-instituto-green">
                {physicalData?.peso_atual_kg || 0}kg
              </div>
              <div className="text-sm text-netflix-text-muted">Peso Atual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-instituto-gold">
                {physicalData?.imc?.toFixed(1) || 0}
              </div>
              <div className="text-sm text-netflix-text-muted">IMC</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Detalhes */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-netflix-card border border-netflix-border grid grid-cols-5">
          <TabsTrigger value="overview" className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-instituto-purple data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-instituto-lilac data-[state=active]:text-white">
            <Video className="h-4 w-4 mr-2" />
            Sessões
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-instituto-green data-[state=active]:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="intervention" className="data-[state=active]:bg-instituto-gold data-[state=active]:text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Intervenção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados Físicos */}
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Target className="h-5 w-5 text-instituto-orange" />
                  Dados Físicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {physicalData && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-netflix-text-muted">Altura</p>
                        <p className="font-semibold text-netflix-text">{physicalData.altura_cm} cm</p>
                      </div>
                      <div>
                        <p className="text-sm text-netflix-text-muted">Peso Meta</p>
                        <p className="font-semibold text-netflix-text">{physicalData.meta_peso_kg || 'Não definido'} kg</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-netflix-text-muted">Circunferência Abdominal</p>
                        <p className="font-semibold text-netflix-text">{physicalData.circunferencia_abdominal_cm} cm</p>
                      </div>
                      <div>
                        <p className="text-sm text-netflix-text-muted">Categoria IMC</p>
                        <Badge variant="outline" className="border-netflix-border text-netflix-text">
                          {physicalData.categoria_imc || 'Não calculado'}
                        </Badge>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Atividade Recente */}
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Heart className="h-5 w-5 text-instituto-purple" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {clientData.recentMissions.slice(0, 3).map((mission, index) => (
                  <div key={mission.id} className="flex items-center justify-between py-2 border-b border-netflix-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-netflix-text">
                        {new Date(mission.data).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {mission.atividade_fisica && <Badge variant="outline" className="text-xs">🏃 Exercício</Badge>}
                        {mission.agua_litros && <Droplets className="h-3 w-3 text-blue-400" />}
                        {mission.sono_horas && <Moon className="h-3 w-3 text-purple-400" />}
                      </div>
                    </div>
                    <Badge 
                      variant={mission.concluido ? "default" : "outline"}
                      className={mission.concluido ? "bg-instituto-green text-white" : "border-netflix-border"}
                    >
                      {mission.concluido ? 'Concluído' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
                {clientData.recentMissions.length === 0 && (
                  <p className="text-netflix-text-muted text-center py-4">Nenhuma atividade recente</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <IndividualMetricsCharts
            clientData={clientData}
            userId={selectedUserId}
          />
        </TabsContent>

        <TabsContent value="sessions">
          <UserSessionManagement
            userId={selectedUserId}
            userName={physicalData?.nome_completo || profile.full_name || 'Cliente'}
          />
        </TabsContent>

        <TabsContent value="timeline">
          <ClientProgressTimeline
            missions={clientData.recentMissions}
            scores={clientData.weeklyScores}
          />
        </TabsContent>

        <TabsContent value="intervention">
          <ClientInterventionPanel
            userId={selectedUserId}
            clientData={clientData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};