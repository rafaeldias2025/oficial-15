import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ModernHealthDashboard } from '@/components/ModernHealthDashboard';
import { ModernGoalChart } from '@/components/ui/modern-goal-chart';
import { ModernMetricCard, ModernMetricsGrid } from '@/components/ui/modern-metric-card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer as RechartsContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Activity, Target, TrendingUp, TrendingDown,
  BarChart3, Zap, Bone, Droplets, Flame, Heart,
  Calendar, Timer, Filter, Eye, EyeOff, Maximize,
  ArrowUp, ArrowDown, Minus, ChevronRight, Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useProgressData } from '@/hooks/useProgressData';
import { LastWeighingCards } from '@/components/LastWeighingCards';
import { EvolutionSummary } from '@/components/EvolutionSummary';

// Paleta de cores modernizada para saúde
const COLORS = {
  primary: '#3B82F6',       // Azul principal
  secondary: '#10B981',     // Verde saúde
  accent: '#F59E0B',        // Amarelo energia
  danger: '#EF4444',        // Vermelho alerta
  purple: '#8B5CF6',        // Roxo metabolismo
  pink: '#EC4899',          // Rosa feminino
  teal: '#14B8A6',          // Verde água
  orange: '#F97316',        // Laranja institucional
  gradients: {
    weight: ['#3B82F6', '#1D4ED8'],
    bodyFat: ['#F59E0B', '#D97706'],
    muscle: ['#10B981', '#047857'],
    water: ['#14B8A6', '#0F766E'],
    waist: ['#EC4899', '#BE185D'],
    imc: ['#8B5CF6', '#7C3AED']
  }
};

const MetricCard = ({ title, value, change, changeType, icon: Icon, color, subtitle, progress = undefined }) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return ArrowUp;
      case 'decrease': return ArrowDown;
      default: return Minus;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-health-error';
      case 'decrease': return 'text-health-success';
      default: return 'text-muted-foreground';
    }
  };

  const ChangeIcon = getChangeIcon();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="metric-card group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color}/20`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 ${getChangeColor()}`}>
            <ChangeIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ModernChart = ({ data, type, title, dataKey, color, subtitle }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id={`${dataKey}Gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--health-background))" />
            <XAxis 
              dataKey="data" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--health-background))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--health-background))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={3}
              fill={`url(#${dataKey}Gradient)`}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: color, strokeWidth: 2 }}
            />
          </AreaChart>
        );
      
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--health-background))" />
            <XAxis 
              dataKey="data" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--health-background))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--health-background))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: color, strokeWidth: 2 }}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--health-background))" />
            <XAxis 
              dataKey="data" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--health-background))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--health-background))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-6 relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-secondary/5 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold gradient-text">{title}</h3>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`${isFullscreen ? 'h-96' : 'h-80'} transition-all duration-300`}>
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const ProgressCharts = () => {
  const { pesagens, dadosFisicos, loading } = useProgressData();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState(30);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-health-background rounded mb-4"></div>
              <div className="h-8 bg-health-background rounded mb-2"></div>
              <div className="h-3 bg-health-background rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!pesagens.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-2xl bg-health-primary/10">
            <BarChart3 className="h-16 w-16 text-health-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-2">
              Sem Dados de Progresso
            </h3>
            <p className="text-muted-foreground text-lg">
              Registre suas pesagens para ver os gráficos de evolução
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

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
      circunferencia: pesagem.circunferencia_abdominal_cm || 0,
      data_medicao: pesagem.data_medicao
    };
  });

  const latestData = pesagens[0] || {};
  const previousData = pesagens[1] || {};

  // Calcular mudanças
  const weightChange = latestData.peso_kg - (previousData.peso_kg || latestData.peso_kg);
  const bodyFatChange = (latestData.gordura_corporal_pct || 0) - (previousData.gordura_corporal_pct || 0);
  const muscleChange = (latestData.massa_muscular_kg || 0) - (previousData.massa_muscular_kg || 0);
  const waistChange = (latestData.circunferencia_abdominal_cm || 0) - (previousData.circunferencia_abdominal_cm || 0);

  const getChangeType = (change) => {
    if (Math.abs(change) < 0.1) return 'neutral';
    return change > 0 ? 'increase' : 'decrease';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold gradient-text">
            Evolução da Sua Jornada
          </h2>
          <p className="text-xl text-muted-foreground">
            Acompanhe sua transformação com clareza e motivação
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-center gap-2">
          {[7, 14, 30, 60].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="px-4 py-2"
            >
              {range}d
            </Button>
          ))}
        </div>
      </div>

      {/* Resumo da Evolução */}
      <EvolutionSummary />

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Peso Atual"
          value={`${latestData.peso_kg || 0} kg`}
          change={weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg` : null}
          changeType={getChangeType(weightChange)}
          icon={Scale}
          color="text-health-primary"
          subtitle="Última medição"
        />
        
        <MetricCard
          title="Gordura Corporal"
          value={`${latestData.gordura_corporal_pct || 0}%`}
          change={bodyFatChange ? `${bodyFatChange > 0 ? '+' : ''}${bodyFatChange.toFixed(1)}%` : null}
          changeType={getChangeType(bodyFatChange)}
          icon={Flame}
          color="text-health-warning"
          subtitle="Percentual atual"
        />
        
        <MetricCard
          title="Massa Muscular"
          value={`${latestData.massa_muscular_kg || 0} kg`}
          change={muscleChange ? `${muscleChange > 0 ? '+' : ''}${muscleChange.toFixed(1)} kg` : null}
          changeType={muscleChange > 0 ? 'increase' : muscleChange < 0 ? 'decrease' : 'neutral'}
          icon={Activity}
          color="text-health-success"
          subtitle="Massa magra"
        />
        
        <MetricCard
          title="Circunferência"
          value={`${latestData.circunferencia_abdominal_cm || 0} cm`}
          change={waistChange ? `${waistChange > 0 ? '+' : ''}${waistChange.toFixed(1)} cm` : null}
          changeType={getChangeType(waistChange)}
          icon={Target}
          color="text-health-secondary"
          subtitle="Abdominal"
        />
      </div>

      {/* Abas de Gráficos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="modern">Dashboard Moderno</TabsTrigger>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="composition">Composição</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        {/* Nova aba do Dashboard Moderno */}
        <TabsContent value="modern" className="space-y-6 mt-8">
          <ModernHealthDashboard />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModernChart
              data={chartData}
              type="area"
              title="Evolução do Peso"
              subtitle="Progresso ao longo do tempo"
              dataKey="peso"
              color={COLORS.primary}
            />
            
            <ModernChart
              data={chartData}
              type="line"
              title="Índice de Massa Corporal"
              subtitle="IMC calculado automaticamente"
              dataKey="imc"
              color={COLORS.purple}
            />
          </div>
        </TabsContent>

        <TabsContent value="composition" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModernChart
              data={chartData}
              type="area"
              title="Gordura Corporal"
              subtitle="Percentual de gordura"
              dataKey="gordura"
              color={COLORS.accent}
            />
            
            <ModernChart
              data={chartData}
              type="line"
              title="Massa Muscular"
              subtitle="Quilos de músculo"
              dataKey="musculo"
              color={COLORS.secondary}
            />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModernChart
              data={chartData}
              type="bar"
              title="Água Corporal"
              subtitle="Percentual de hidratação"
              dataKey="agua"
              color={COLORS.teal}
            />
            
            <ModernChart
              data={chartData}
              type="line"
              title="Circunferência Abdominal"
              subtitle="Medida em centímetros"
              dataKey="circunferencia"
              color={COLORS.pink}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Cards de Últimas Pesagens */}
      <LastWeighingCards />
    </div>
  );
};