import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Eye, 
  Activity, 
  Heart, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  Search,
  Filter,
  BarChart3,
  Users,
  Target,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DailyMission {
  id: string;
  data: string;
  user_id: string;
  humor: string | null;
  nota_dia: number | null;
  concluido: boolean;
  user_name: string;
  user_email: string;
}

interface UserGoal {
  id: string;
  name: string;
  type: string;
  progress: number;
  target_date: string;
  user_name: string;
  user_email: string;
}

interface HealthData {
  id: string;
  peso_atual_kg: number;
  imc: number;
  meta_peso_kg: number;
  data_atualizacao: string;
  user_name: string;
  user_email: string;
}

export const DataVisualization: React.FC = () => {
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Buscar missões diárias
      const { data: missions, error: missionsError } = await supabase
        .from('missao_dia')
        .select('id, data, user_id, humor, nota_dia, concluido')
        .order('data', { ascending: false })
        .limit(100);

      if (missionsError) throw missionsError;

      // Buscar dados dos usuários para cada missão
      const formattedMissions = await Promise.all(
        missions.map(async (mission) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', mission.user_id)
            .single();

          return {
            ...mission,
            user_name: profile?.full_name || 'Nome não informado',
            user_email: profile?.email || ''
          };
        })
      );

      setDailyMissions(formattedMissions);

      // Buscar metas dos usuários
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id, name, type, progress, target_date, user_id')
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      // Buscar dados dos usuários para cada meta
      const formattedGoals = await Promise.all(
        goals.map(async (goal) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', goal.user_id)
            .single();

          return {
            ...goal,
            user_name: profile?.full_name || 'Nome não informado',
            user_email: profile?.email || ''
          };
        })
      );

      setUserGoals(formattedGoals);

      // Buscar dados de saúde
      const { data: health, error: healthError } = await supabase
        .from('dados_saude_usuario')
        .select('id, peso_atual_kg, imc, meta_peso_kg, data_atualizacao, user_id')
        .order('data_atualizacao', { ascending: false });

      if (healthError) throw healthError;

      // Buscar dados dos usuários para cada registro de saúde
      const formattedHealth = await Promise.all(
        health.map(async (h) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', h.user_id)
            .single();

          return {
            ...h,
            user_name: profile?.full_name || 'Nome não informado',
            user_email: profile?.email || ''
          };
        })
      );

      setHealthData(formattedHealth);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMissions = dailyMissions.filter(mission => {
    const matchesSearch = 
      mission.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || mission.data === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const getHumorColor = (humor: string | null) => {
    switch (humor) {
      case 'muito_bem': return 'bg-green-500/10 text-green-500';
      case 'bem': return 'bg-blue-500/10 text-blue-500';
      case 'normal': return 'bg-yellow-500/10 text-yellow-500';
      case 'mal': return 'bg-orange-500/10 text-orange-500';
      case 'muito_mal': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getHumorLabel = (humor: string | null) => {
    switch (humor) {
      case 'muito_bem': return 'Muito Bem';
      case 'bem': return 'Bem';
      case 'normal': return 'Normal';
      case 'mal': return 'Mal';
      case 'muito_mal': return 'Muito Mal';
      default: return 'Não informado';
    }
  };

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange"></div>
          <span className="ml-4 text-netflix-text">Carregando dados...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Eye className="h-5 w-5 text-instituto-orange" />
            Visualização de Dados dos Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-netflix-text-muted" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-netflix-hover border-netflix-border text-netflix-text"
              />
            </div>
            
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-48 bg-netflix-hover border-netflix-border text-netflix-text"
            />

            <Button onClick={fetchAllData} variant="outline" className="border-netflix-border text-netflix-text hover:bg-netflix-hover">
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-instituto-orange/10 rounded-lg">
                <Users className="h-6 w-6 text-instituto-orange" />
              </div>
              <div>
                <p className="text-sm text-netflix-text-muted">Missões Registradas</p>
                <p className="text-2xl font-bold text-netflix-text">{dailyMissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-instituto-green/10 rounded-lg">
                <Target className="h-6 w-6 text-instituto-green" />
              </div>
              <div>
                <p className="text-sm text-netflix-text-muted">Metas Ativas</p>
                <p className="text-2xl font-bold text-netflix-text">{userGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-instituto-purple/10 rounded-lg">
                <Heart className="h-6 w-6 text-instituto-purple" />
              </div>
              <div>
                <p className="text-sm text-netflix-text-muted">Dados de Saúde</p>
                <p className="text-2xl font-bold text-netflix-text">{healthData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-instituto-lilac/10 rounded-lg">
                <Award className="h-6 w-6 text-instituto-lilac" />
              </div>
              <div>
                <p className="text-sm text-netflix-text-muted">Missões Concluídas</p>
                <p className="text-2xl font-bold text-netflix-text">
                  {dailyMissions.filter(m => m.concluido).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dados detalhados */}
      <Tabs defaultValue="missions" className="space-y-4">
        <TabsList className="bg-netflix-card border border-netflix-border">
          <TabsTrigger value="missions" className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white text-netflix-text">
            <Activity className="h-4 w-4 mr-2" />
            Missões do Dia
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white text-netflix-text">
            <Target className="h-4 w-4 mr-2" />
            Metas
          </TabsTrigger>
          <TabsTrigger value="health" className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white text-netflix-text">
            <Heart className="h-4 w-4 mr-2" />
            Dados de Saúde
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-4">
          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-0">
              {filteredMissions.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-netflix-text mb-2">
                    Nenhuma missão encontrada
                  </h3>
                  <p className="text-netflix-text-muted">
                    Tente ajustar os filtros ou aguarde os usuários preencherem suas missões.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-netflix-border">
                  {filteredMissions.map((mission, index) => (
                    <div key={mission.id} className="p-6 hover:bg-netflix-hover transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-netflix-text">
                              {mission.user_name}
                            </h3>
                            <Badge variant="outline" className={getHumorColor(mission.humor)}>
                              {getHumorLabel(mission.humor)}
                            </Badge>
                            {mission.concluido && (
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                Concluída
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-netflix-text-muted">
                            <span>{mission.user_email}</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(mission.data), 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                            {mission.nota_dia && (
                              <span>Nota do dia: {mission.nota_dia}/10</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-0">
              {userGoals.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-netflix-text mb-2">
                    Nenhuma meta encontrada
                  </h3>
                  <p className="text-netflix-text-muted">
                    Os usuários ainda não criaram metas.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-netflix-border">
                  {userGoals.map((goal, index) => (
                    <div key={goal.id} className="p-6 hover:bg-netflix-hover transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-netflix-text">
                              {goal.name}
                            </h3>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              {goal.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-netflix-text-muted">
                            <span>{goal.user_name} ({goal.user_email})</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Meta: {format(new Date(goal.target_date), 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-netflix-text">
                            {goal.progress}%
                          </div>
                          <div className="text-sm text-netflix-text-muted">
                            Progresso
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-0">
              {healthData.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-netflix-text mb-2">
                    Nenhum dado de saúde encontrado
                  </h3>
                  <p className="text-netflix-text-muted">
                    Os usuários ainda não preencheram seus dados de saúde.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-netflix-border">
                  {healthData.map((health, index) => (
                    <div key={health.id} className="p-6 hover:bg-netflix-hover transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-netflix-text">
                            {health.user_name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-netflix-text-muted">
                            <span>{health.user_email}</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(health.data_atualizacao), 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-netflix-text">
                              {health.peso_atual_kg}kg
                            </div>
                            <div className="text-xs text-netflix-text-muted">
                              Peso Atual
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-netflix-text">
                              {health.imc}
                            </div>
                            <div className="text-xs text-netflix-text-muted">
                              IMC
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-netflix-text">
                              {health.meta_peso_kg}kg
                            </div>
                            <div className="text-xs text-netflix-text-muted">
                              Meta
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};