import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Activity,
  Target,
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart,
  BarChart
} from 'lucide-react';

interface AnalyticsData {
  userEngagement: {
    labels: string[];
    data: number[];
    trend: number;
  };
  sessionCompletion: {
    completed: number;
    incomplete: number;
    total: number;
  };
  userGrowth: {
    newUsers: number;
    activeUsers: number;
    returnUsers: number;
    churnRate: number;
  };
  weightProgress: {
    avgLoss: number;
    successRate: number;
    goalAchievers: number;
  };
}

export const AdvancedAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [timeFrame, setTimeFrame] = useState('30');

  const [analyticsData] = useState<AnalyticsData>({
    userEngagement: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      data: [65, 78, 82, 74, 91, 88, 76],
      trend: 12.5
    },
    sessionCompletion: {
      completed: 245,
      incomplete: 58,
      total: 303
    },
    userGrowth: {
      newUsers: 47,
      activeUsers: 234,
      returnUsers: 189,
      churnRate: 8.2
    },
    weightProgress: {
      avgLoss: 3.2,
      successRate: 78,
      goalAchievers: 156
    }
  });

  const exportData = (format: 'csv' | 'pdf' | 'excel') => {
    console.log(`Exportando dados em formato ${format}`);
    // Implementar exportação
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    suffix = '' 
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    color: string;
    suffix?: string;
  }) => (
    <Card className="bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-netflix-text-muted">{title}</p>
            <p className="text-2xl font-bold text-netflix-text">
              {value}{suffix}
            </p>
            {change !== undefined && (
              <p className={`text-sm font-medium flex items-center gap-1 mt-1 ${
                change > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(change)}%
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon className={`h-6 w-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header e Filtros */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-netflix-text flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-instituto-purple" />
            Analytics Avançados
          </h2>
          <p className="text-netflix-text-muted">
            Análise detalhada de engajamento e performance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-40 bg-netflix-hover border-netflix-border text-netflix-text">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48 bg-netflix-hover border-netflix-border text-netflix-text">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as métricas</SelectItem>
              <SelectItem value="users">Usuários</SelectItem>
              <SelectItem value="sessions">Sessões</SelectItem>
              <SelectItem value="weight">Progresso de Peso</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>

          <Button 
            variant="outline" 
            className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Novos Usuários"
          value={analyticsData.userGrowth.newUsers}
          change={15.2}
          icon={Users}
          color="instituto-orange"
        />
        
        <MetricCard
          title="Usuários Ativos"
          value={analyticsData.userGrowth.activeUsers}
          change={8.7}
          icon={Activity}
          color="instituto-purple"
        />
        
        <MetricCard
          title="Taxa de Conclusão"
          value={Math.round((analyticsData.sessionCompletion.completed / analyticsData.sessionCompletion.total) * 100)}
          change={5.3}
          icon={Target}
          color="instituto-green"
          suffix="%"
        />
        
        <MetricCard
          title="Taxa de Churn"
          value={analyticsData.userGrowth.churnRate}
          change={-2.1}
          icon={TrendingDown}
          color="red-500"
          suffix="%"
        />
      </div>

      {/* Gráficos Detalhados */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList className="bg-netflix-card border border-netflix-border">
          <TabsTrigger value="engagement" className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-2" />
            Engajamento
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-instituto-purple data-[state=active]:text-white">
            <BarChart className="h-4 w-4 mr-2" />
            Sessões
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-instituto-green data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Progresso
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-instituto-lilac data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </TabsTrigger>
        </TabsList>

        {/* Engajamento */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-instituto-orange" />
                  Engajamento Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-netflix-hover rounded-lg">
                  <div className="text-center text-netflix-text-muted">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de Engajamento</p>
                    <p className="text-sm">Visualização interativa seria implementada aqui</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-netflix-text-muted">Tendência</span>
                  <span className="text-green-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{analyticsData.userEngagement.trend}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-instituto-purple" />
                  Atividade por Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '06:00 - 09:00', value: 25, label: 'Manhã' },
                    { time: '09:00 - 12:00', value: 45, label: 'Meio da Manhã' },
                    { time: '12:00 - 15:00', value: 65, label: 'Tarde' },
                    { time: '15:00 - 18:00', value: 80, label: 'Final da Tarde' },
                    { time: '18:00 - 21:00', value: 95, label: 'Noite' },
                    { time: '21:00 - 00:00', value: 35, label: 'Final da Noite' }
                  ].map((period, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-netflix-text-muted">
                        {period.time}
                      </div>
                      <div className="flex-1 bg-netflix-hover rounded-full h-2">
                        <div 
                          className="bg-instituto-purple h-2 rounded-full transition-all duration-300"
                          style={{ width: `${period.value}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm text-netflix-text text-right">
                        {period.value}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sessões */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-instituto-purple" />
                  Status das Sessões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-netflix-text-muted">Completas</span>
                    <span className="text-green-500 font-semibold">
                      {analyticsData.sessionCompletion.completed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-netflix-text-muted">Incompletas</span>
                    <span className="text-yellow-500 font-semibold">
                      {analyticsData.sessionCompletion.incomplete}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-netflix-border pt-2">
                    <span className="text-netflix-text font-medium">Total</span>
                    <span className="text-netflix-text font-semibold">
                      {analyticsData.sessionCompletion.total}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex rounded-full overflow-hidden h-3">
                      <div 
                        className="bg-green-500"
                        style={{ 
                          width: `${(analyticsData.sessionCompletion.completed / analyticsData.sessionCompletion.total) * 100}%` 
                        }}
                      />
                      <div 
                        className="bg-yellow-500"
                        style={{ 
                          width: `${(analyticsData.sessionCompletion.incomplete / analyticsData.sessionCompletion.total) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-netflix-card border-netflix-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-instituto-green" />
                  Sessões Mais Populares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Reflexão sobre Objetivos', count: 45, completion: 92 },
                    { name: 'Autoconhecimento Profundo', count: 38, completion: 87 },
                    { name: 'Transformação de Hábitos', count: 35, completion: 94 },
                    { name: 'Mindfulness e Equilíbrio', count: 32, completion: 89 },
                    { name: 'Gestão de Emoções', count: 28, completion: 85 }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-netflix-text font-medium">{session.name}</span>
                          <span className="text-sm text-netflix-text-muted">{session.count} sessões</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-netflix-dark rounded-full h-2">
                            <div 
                              className="bg-instituto-green h-2 rounded-full"
                              style={{ width: `${session.completion}%` }}
                            />
                          </div>
                          <span className="text-sm text-green-500">{session.completion}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progresso */}
        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Target className="h-5 w-5 text-instituto-green" />
                  Progresso de Peso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-instituto-green">
                      {analyticsData.weightProgress.avgLoss}kg
                    </div>
                    <div className="text-sm text-netflix-text-muted">
                      Perda média de peso
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-semibold text-netflix-text">
                        {analyticsData.weightProgress.successRate}%
                      </div>
                      <div className="text-xs text-netflix-text-muted">
                        Taxa de Sucesso
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-netflix-text">
                        {analyticsData.weightProgress.goalAchievers}
                      </div>
                      <div className="text-xs text-netflix-text-muted">
                        Metas Alcançadas
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-instituto-orange" />
                  Distribuição de Resultados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: '0-2kg', count: 45, color: 'bg-red-500' },
                    { range: '2-5kg', count: 78, color: 'bg-yellow-500' },
                    { range: '5-10kg', count: 92, color: 'bg-green-500' },
                    { range: '10kg+', count: 34, color: 'bg-instituto-purple' }
                  ].map((range, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-netflix-text-muted">
                        {range.range}
                      </div>
                      <div className="flex-1 bg-netflix-hover rounded-full h-3">
                        <div 
                          className={`${range.color} h-3 rounded-full transition-all duration-300`}
                          style={{ width: `${(range.count / 249) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm text-netflix-text text-right">
                        {range.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usuários */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Users className="h-5 w-5 text-instituto-lilac" />
                  Demografia dos Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-netflix-text-muted mb-2">Faixa Etária</h4>
                    <div className="space-y-2">
                      {[
                        { age: '18-25', percentage: 15 },
                        { age: '26-35', percentage: 35 },
                        { age: '36-45', percentage: 28 },
                        { age: '46-55', percentage: 18 },
                        { age: '55+', percentage: 4 }
                      ].map((group) => (
                        <div key={group.age} className="flex items-center gap-3">
                          <span className="w-12 text-sm text-netflix-text-muted">{group.age}</span>
                          <div className="flex-1 bg-netflix-hover rounded-full h-2">
                            <div 
                              className="bg-instituto-lilac h-2 rounded-full"
                              style={{ width: `${group.percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-sm text-netflix-text text-right">{group.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Activity className="h-5 w-5 text-instituto-orange" />
                  Retenção de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { period: '1 semana', retention: 85, users: 201 },
                    { period: '1 mês', retention: 72, users: 169 },
                    { period: '3 meses', retention: 58, users: 136 },
                    { period: '6 meses', retention: 45, users: 106 },
                    { period: '1 ano', retention: 32, users: 75 }
                  ].map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-netflix-text font-medium">{data.period}</span>
                          <span className="text-sm text-netflix-text-muted">{data.users} usuários</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-netflix-dark rounded-full h-2">
                            <div 
                              className="bg-instituto-orange h-2 rounded-full"
                              style={{ width: `${data.retention}%` }}
                            />
                          </div>
                          <span className="text-sm text-instituto-orange">{data.retention}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};