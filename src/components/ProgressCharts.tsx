import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Scale,
  Activity,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useProgressData } from '@/hooks/useProgressData';
import { LastWeighingCards } from '@/components/LastWeighingCards';
import { EvolutionSummary } from '@/components/EvolutionSummary';

const COLORS = {
  primary: '#F97316', // instituto-orange
  current: '#F97316', // laranja para semana atual
  previous: '#6B7280', // cinza para semana anterior
  success: '#10B981',
  warning: '#F59E0B',
  destructive: '#EF4444',
  muted: '#6B7280'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-netflix-card border border-netflix-border rounded-lg p-3 shadow-lg">
        <p className="text-netflix-text font-medium">{`Data: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-netflix-text-muted">
            {`${entry.name}: ${entry.value}${entry.name === 'Peso' ? 'kg' : entry.name === 'Circunferência' ? 'cm' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ProgressCharts = () => {
  const { pesagens, dadosFisicos, loading } = useProgressData();

  // Configurar listener em tempo real para atualizações
  useEffect(() => {
    const channel = supabase
      .channel('progress-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pesagens'
        },
        () => {
          console.log('Dados atualizados');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-netflix-card border-netflix-border">
              <CardHeader>
                <div className="h-6 bg-netflix-hover rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-netflix-hover rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!pesagens.length) {
    return (
      <div className="space-y-8">
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-instituto-orange mx-auto mb-4 opacity-70" />
            <h3 className="text-2xl font-semibold text-netflix-text mb-2">
              Sem Dados de Progresso
            </h3>
            <p className="text-netflix-text-muted text-lg">
              Registre suas pesagens para ver os gráficos de evolução
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preparar dados para os gráficos
  const chartData = pesagens.slice(0, 10).reverse().map(pesagem => {
    const altura = dadosFisicos?.altura_cm || 170;
    const imc = pesagem.peso_kg / Math.pow(altura / 100, 2);
    
    return {
      data: format(new Date(pesagem.data_medicao), 'dd/MM', { locale: ptBR }),
      dataCompleta: format(new Date(pesagem.data_medicao), 'dd/MM/yyyy', { locale: ptBR }),
      peso: pesagem.peso_kg,
      imc: Math.round(imc * 10) / 10,
      circunferencia: pesagem.circunferencia_abdominal_cm || dadosFisicos?.circunferencia_abdominal_cm || 0
    };
  });

  return (
    <div className="space-y-8">
      {/* Título e Subtítulo */}
      <div className="text-center space-y-2 progress-chart-enter">
        <h2 className="text-3xl font-bold text-netflix-text">
          Evolução da Sua Jornada
        </h2>
        <p className="text-netflix-text-muted text-lg">
          Acompanhe sua transformação com clareza e motivação
        </p>
      </div>

      {/* Resumo da Evolução */}
      <EvolutionSummary />

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução do Peso */}
        <Card className="bg-netflix-card border-netflix-border hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-netflix-text">
              <Scale className="h-5 w-5 text-instituto-orange" />
              Evolução do Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pesoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
                <XAxis 
                  dataKey="data" 
                  tick={{ fill: 'hsl(var(--netflix-text))' }}
                  axisLine={{ stroke: 'hsl(var(--netflix-border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--netflix-text))' }}
                  axisLine={{ stroke: 'hsl(var(--netflix-border))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="peso" 
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  fill="url(#pesoGradient)"
                  name="Peso"
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: COLORS.primary }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução do IMC */}
        <Card className="bg-netflix-card border-netflix-border hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-netflix-text">
              <Activity className="h-5 w-5 text-instituto-orange" />
              Evolução do IMC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
                <XAxis 
                  dataKey="data" 
                  tick={{ fill: 'hsl(var(--netflix-text))' }}
                  axisLine={{ stroke: 'hsl(var(--netflix-border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--netflix-text))' }}
                  axisLine={{ stroke: 'hsl(var(--netflix-border))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="imc" 
                  stroke={COLORS.success}
                  strokeWidth={3}
                  name="IMC"
                  dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: COLORS.success }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Evolução da Circunferência Abdominal */}
      <Card className="bg-netflix-card border-netflix-border hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-netflix-text">
            <Target className="h-5 w-5 text-instituto-orange" />
            Evolução da Circunferência Abdominal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="circunferenciaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.warning} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.warning} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
              <XAxis 
                dataKey="data" 
                tick={{ fill: 'hsl(var(--netflix-text))' }}
                axisLine={{ stroke: 'hsl(var(--netflix-border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--netflix-text))' }}
                axisLine={{ stroke: 'hsl(var(--netflix-border))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="circunferencia" 
                stroke={COLORS.warning}
                strokeWidth={3}
                fill="url(#circunferenciaGradient)"
                name="Circunferência"
                dot={{ fill: COLORS.warning, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: COLORS.warning }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cards da Última Pesagem */}
      <LastWeighingCards />
    </div>
  );
};