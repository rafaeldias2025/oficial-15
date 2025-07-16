import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Bar, RadialBarChart, RadialBar, PieChart, Pie, Cell,
  ScatterChart, Scatter, ReferenceLine, Legend
} from 'recharts';
import { 
  Heart, Activity, Droplets, Scale, BarChart3, TrendingUp, TrendingDown,
  Target, Flame, Zap, Calendar, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { format, parseISO, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProgressData } from '@/hooks/useProgressData';

// Paleta de cores aprimorada
const COLORS = {
  primary: '#F97316',
  secondary: '#06B6D4', 
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  emerald: '#10B981',
  rose: '#F43F5E',
  teal: '#14B8A6',
  gradient: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA']
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  target?: string;
  progress?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, change, changeType = 'neutral', icon, color, target, progress 
}) => {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-netflix-text-muted">{title}</p>
              <p className="text-2xl font-bold text-netflix-text">{value}</p>
              {target && (
                <p className="text-xs text-netflix-text-muted">Meta: {target}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            {change && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className="text-sm text-netflix-text-muted">{change}</span>
              </div>
            )}
            {progress && (
              <div className="mt-2 w-16 h-16">
                <RadialBarChart width={64} height={64} cx={32} cy={32} 
                  innerRadius={20} outerRadius={30} data={[{ value: progress }]}>
                  <RadialBar dataKey="value" fill={`var(--${color}-500)`} />
                </RadialBarChart>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de gráfico de composição corporal
const BodyCompositionChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Activity className="h-5 w-5 text-instituto-orange" />
          Composição Corporal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
            <XAxis dataKey="data" tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <YAxis tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--netflix-card))', 
                border: '1px solid hsl(var(--netflix-border))',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="gordura"
              stackId="1"
              stroke={COLORS.danger}
              fill={COLORS.danger}
              name="Gordura (%)"
            />
            <Area
              type="monotone"
              dataKey="musculo"
              stackId="1"
              stroke={COLORS.success}
              fill={COLORS.success}
              name="Músculo (kg)"
            />
            <Area
              type="monotone"
              dataKey="agua"
              stackId="1"
              stroke={COLORS.secondary}
              fill={COLORS.secondary}
              name="Água (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Gráfico combinado Peso + IMC
const WeightIMCChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Scale className="h-5 w-5 text-instituto-orange" />
          Evolução Peso + IMC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
            <XAxis dataKey="data" tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--netflix-card))', 
                border: '1px solid hsl(var(--netflix-border))',
                borderRadius: '8px'
              }}
            />
            <Bar yAxisId="left" dataKey="peso" fill={COLORS.primary} name="Peso (kg)" />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="imc" 
              stroke={COLORS.secondary} 
              strokeWidth={3}
              name="IMC"
              dot={{ fill: COLORS.secondary }}
            />
            <ReferenceLine yAxisId="right" y={25} stroke={COLORS.warning} strokeDasharray="3 3" />
            <ReferenceLine yAxisId="right" y={30} stroke={COLORS.danger} strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Gráfico de indicadores circulares
const CircularIndicators: React.FC<{ data: any }> = ({ data }) => {
  const indicadores = [
    { name: 'Hidratação', value: data.aguaCorporal || 0, max: 100, color: COLORS.secondary },
    { name: 'Gordura', value: data.gorduraCorporal || 0, max: 40, color: COLORS.danger },
    { name: 'Músculo', value: data.massaMuscular || 0, max: 60, color: COLORS.success },
    { name: 'TMB', value: data.taxaMetabolica || 0, max: 2500, color: COLORS.purple }
  ];

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Target className="h-5 w-5 text-instituto-orange" />
          Indicadores Atuais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {indicadores.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-24 h-24 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" 
                    data={[{ value: (item.value / item.max) * 100 }]}>
                    <RadialBar dataKey="value" fill={item.color} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-netflix-text-muted">{item.name}</p>
              <p className="text-lg font-bold text-netflix-text">{item.value}{item.name === 'TMB' ? '' : item.name === 'Músculo' ? 'kg' : '%'}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Heatmap mensal de pesagens
const MonthlyHeatmap: React.FC<{ data: any[] }> = ({ data }) => {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const heatmapData = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const hasWeighing = data.some(item => format(parseISO(item.data_medicao), 'yyyy-MM-dd') === dayStr);
    return {
      date: format(day, 'dd'),
      dayOfWeek: format(day, 'EEE', { locale: ptBR }),
      hasData: hasWeighing,
      intensity: hasWeighing ? 1 : 0
    };
  });

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Calendar className="h-5 w-5 text-instituto-orange" />
          Atividade Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {heatmapData.map((day, index) => (
            <div
              key={index}
              className={`
                w-8 h-8 rounded flex items-center justify-center text-xs
                ${day.hasData 
                  ? 'bg-instituto-orange text-white' 
                  : 'bg-netflix-hover text-netflix-text-muted'
                }
              `}
            >
              {day.date}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-netflix-text-muted">
          <div className="w-3 h-3 bg-netflix-hover rounded"></div>
          <span>Sem pesagem</span>
          <div className="w-3 h-3 bg-instituto-orange rounded"></div>
          <span>Com pesagem</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { pesagens, dadosFisicos, loading } = useProgressData();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState(30);

  // Preparar dados para gráficos
  const chartData = pesagens.slice(0, timeRange).reverse().map(pesagem => {
    const altura = dadosFisicos?.altura_cm || 170;
    const imc = pesagem.peso_kg / Math.pow(altura / 100, 2);
    
    return {
      data: format(new Date(pesagem.data_medicao), 'dd/MM'),
      peso: pesagem.peso_kg,
      imc: Math.round(imc * 10) / 10,
      gordura: pesagem.gordura_corporal_pct || 0,
      musculo: pesagem.massa_muscular_kg || 0,
      agua: pesagem.agua_corporal_pct || 0,
      data_medicao: pesagem.data_medicao
    };
  });

  const latestData = pesagens[0] || {};

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-netflix-card border-netflix-border">
              <CardContent className="p-4">
                <div className="h-16 bg-netflix-hover rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartões de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Peso Atual"
          value={`${latestData.peso_kg?.toFixed(1) || '0.0'}kg`}
          change="-0.5kg"
          changeType="decrease"
          icon={<Scale className="h-4 w-4" />}
          color="instituto-orange"
          target={`${dadosFisicos?.meta_peso_kg || 70}kg`}
          progress={85}
        />
        <MetricCard
          title="IMC"
          value={latestData.imc?.toFixed(1) || '0.0'}
          change="+0.2"
          changeType="increase"
          icon={<BarChart3 className="h-4 w-4" />}
          color="secondary"
          target="25.0"
          progress={75}
        />
        <MetricCard
          title="Gordura Corporal"
          value={`${latestData.gordura_corporal_pct?.toFixed(1) || '0.0'}%`}
          change="-1.2%"
          changeType="decrease"
          icon={<Activity className="h-4 w-4" />}
          color="danger"
          target="15%"
          progress={60}
        />
        <MetricCard
          title="Água Corporal"
          value={`${latestData.agua_corporal_pct?.toFixed(1) || '0.0'}%`}
          change="+0.5%"
          changeType="increase"
          icon={<Droplets className="h-4 w-4" />}
          color="secondary"
          target="60%"
          progress={90}
        />
      </div>

      {/* Abas de visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="composition">Composição</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeightIMCChart data={chartData} />
            <CircularIndicators data={latestData} />
          </div>
        </TabsContent>

        <TabsContent value="composition" className="space-y-6">
          <BodyCompositionChart data={chartData} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-instituto-orange" />
                  Análise de Tendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
                    <XAxis dataKey="data" tick={{ fill: 'hsl(var(--netflix-text))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--netflix-text))' }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="peso" 
                      stroke={COLORS.primary} 
                      strokeWidth={2}
                      name="Peso (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Idade Metabólica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-6xl font-bold text-netflix-text mb-2">
                    {latestData.idade_metabolica || 30}
                  </div>
                  <p className="text-netflix-text-muted">anos</p>
                  <p className="text-sm text-netflix-text-muted mt-2">
                    Sua idade metabólica está {(latestData.idade_metabolica || 30) < 30 ? 'abaixo' : 'acima'} da média
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <MonthlyHeatmap data={pesagens} />
        </TabsContent>
      </Tabs>

      {/* Controles de período */}
      <div className="flex justify-center gap-2">
        {[7, 15, 30, 60].map(days => (
          <Button
            key={days}
            variant={timeRange === days ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(days)}
          >
            {days} dias
          </Button>
        ))}
      </div>
    </div>
  );
};