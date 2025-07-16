import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Activity, Calendar } from 'lucide-react';

interface ClientData {
  profile: any;
  physicalData: any;
  recentMissions: any[];
  weeklyScores: any[];
  weightHistory: any[];
  engagementData: any;
}

interface IndividualMetricsChartsProps {
  clientData: ClientData;
  userId: string;
}

export const IndividualMetricsCharts: React.FC<IndividualMetricsChartsProps> = ({
  clientData
}) => {
  // Preparar dados para gráfico de peso
  const weightChartData = clientData.weightHistory
    .slice(0, 10)
    .reverse()
    .map(entry => ({
      date: new Date(entry.data_medicao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: parseFloat(entry.peso_kg),
      imc: parseFloat(entry.imc || 0)
    }));

  // Preparar dados para gráfico de pontuação diária
  const scoreChartData = clientData.weeklyScores
    .slice(0, 14)
    .reverse()
    .map(entry => ({
      date: new Date(entry.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      pontos: entry.total_pontos_dia || 0,
      categoria: entry.categoria_dia
    }));

  // Preparar dados para gráfico de atividades (últimos 7 dias)
  const activityData = clientData.recentMissions
    .slice(0, 7)
    .reverse()
    .map(mission => ({
      date: new Date(mission.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      agua: mission.agua_litros ? (mission.agua_litros.includes('3L') ? 3 : mission.agua_litros.includes('2L') ? 2 : 1) : 0,
      sono: mission.sono_horas || 0,
      exercicio: mission.atividade_fisica ? 1 : 0,
      estresse: mission.estresse_nivel ? 6 - mission.estresse_nivel : 0 // Inverte para que menos estresse = mais pontos
    }));

  // Dados para gráfico de pizza - distribuição de categorias de dia
  const categoryData = scoreChartData.reduce((acc, entry) => {
    const category = entry.categoria || 'baixa';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category === 'excelente' ? 'Excelente' : category === 'medio' ? 'Médio' : 'Baixo',
    value: count,
    color: category === 'excelente' ? '#22c55e' : category === 'medio' ? '#f59e0b' : '#ef4444'
  }));

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Evolução do Peso */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-instituto-green" />
            Evolução do Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weightChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 4 }}
                />
                {clientData.physicalData?.meta_peso_kg && (
                  <Line 
                    type="monotone" 
                    dataKey={() => clientData.physicalData.meta_peso_kg}
                    stroke="#22c55e" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-netflix-text-muted py-12">
              Sem dados de peso disponíveis
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Pontuação Diária */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Target className="h-5 w-5 text-instituto-purple" />
            Pontuação Diária
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scoreChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="pontos" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-netflix-text-muted py-12">
              Sem dados de pontuação disponíveis
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Atividades Semanais */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Activity className="h-5 w-5 text-instituto-gold" />
            Atividades da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="agua" fill="#3b82f6" name="Água (L)" />
                <Bar dataKey="sono" fill="#8b5cf6" name="Sono (h)" />
                <Bar dataKey="exercicio" fill="#22c55e" name="Exercício" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-netflix-text-muted py-12">
              Sem dados de atividades disponíveis
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribuição de Performance */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Calendar className="h-5 w-5 text-instituto-lilac" />
            Distribuição de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-netflix-text-muted py-12">
              Sem dados de performance disponíveis
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};