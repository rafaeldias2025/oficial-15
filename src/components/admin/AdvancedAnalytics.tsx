import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Target, 
  Clock, 
  BarChart3,
  Calendar,
  Eye,
  Heart,
  Zap,
  Award,
  Filter,
  Download,
  Share2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Apple,
  Chrome,
  Smartphone,
  Wifi,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useHealthIntegration } from '@/hooks/useHealthIntegration';

// Paleta de cores otimizada para acessibilidade sênior
const SENIOR_COLORS = {
  primary: '#2563eb',        // Azul mais escuro
  secondary: '#16a34a',      // Verde mais escuro
  accent: '#d97706',         // Laranja mais escuro
  success: '#15803d',        // Verde sucesso escuro
  warning: '#d97706',        // Laranja alerta escuro
  error: '#b91c1c',          // Vermelho erro escuro
  info: '#1d4ed8',           // Azul informação escuro
  excellent: '#15803d',      // Verde excelente
  good: '#16a34a',           // Verde bom
  average: '#d97706',        // Laranja médio
  poor: '#ea580c',           // Laranja pobre
  critical: '#b91c1c',       // Vermelho crítico
  text: '#0f172a',           // Texto muito escuro
  background: '#fafafa',     // Fundo claro
  surface: '#ffffff',        // Superfície branca
  border: '#d4d4d8',         // Borda clara
  muted: '#71717a',          // Texto suave
};

interface AnalyticsData {
  date: string;
  users: number;
  sessions: number;
  completions: number;
  averageScore: number;
  engagement: number;
  retention: number;
  satisfaction: number;
  weightLoss: number;
  healthImprovement: number;
  behaviorChange: number;
  missionsCompleted: number;
  challengesParticipated: number;
  coursesCompleted: number;
  socialInteractions: number;
  supportTickets: number;
  appUsage: number;
  deviceType: string;
  userSegment: string;
  conversionRate: number;
  churnRate: number;
  ltv: number;
  cac: number;
  mrr: number;
  nps: number;
  csat: number;
  ces: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color, 
  description 
}) => {
  const changeIcon = changeType === 'increase' ? ArrowUp : changeType === 'decrease' ? ArrowDown : Minus;
  const changeColor = changeType === 'increase' ? SENIOR_COLORS.success : 
                      changeType === 'decrease' ? SENIOR_COLORS.error : 
                      SENIOR_COLORS.muted;

  return (
    <Card className="senior-card hover:shadow-senior-xl transition-all duration-300">
      <CardContent className="spacing-senior">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-senior-sm">
            <div 
              className="p-3 rounded-senior shadow-senior"
              style={{ backgroundColor: color, color: 'white' }}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-senior-large font-semibold text-high-contrast">{title}</h3>
              {description && (
                <p className="text-sm text-medium-contrast mt-1">{description}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-senior-xlarge font-bold text-high-contrast">{value}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                {React.createElement(changeIcon, { 
                  className: `w-4 h-4`, 
                  style: { color: changeColor } 
                })}
                <span 
                  className="text-sm font-medium ml-1"
                  style={{ color: changeColor }}
                >
                  {change}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, children, actions }) => (
  <Card className="senior-card">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-senior-xl text-high-contrast">{title}</CardTitle>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        {children}
      </div>
    </CardContent>
  </Card>
);

interface AlertCardProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  action?: React.ReactNode;
}

const AlertCard: React.FC<AlertCardProps> = ({ type, title, message, action }) => {
  const config = {
    success: { 
      className: 'senior-alert-success', 
      icon: CheckCircle, 
      color: SENIOR_COLORS.success 
    },
    warning: { 
      className: 'senior-alert-warning', 
      icon: AlertCircle, 
      color: SENIOR_COLORS.warning 
    },
    error: { 
      className: 'senior-alert-error', 
      icon: AlertCircle, 
      color: SENIOR_COLORS.error 
    },
    info: { 
      className: 'senior-alert-success', 
      icon: Info, 
      color: SENIOR_COLORS.info 
    },
  };

  const { className, icon: Icon, color } = config[type];

  return (
    <div className={`${className} rounded-senior-lg`}>
      <div className="flex items-start gap-senior-sm">
        <Icon className="w-5 h-5 mt-1 flex-shrink-0" style={{ color }} />
        <div className="flex-1">
          <h4 className="font-semibold text-senior-base">{title}</h4>
          <p className="text-senior-sm mt-1">{message}</p>
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AdvancedAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'users' | 'engagement' | 'health' | 'revenue'>('users');
  const [refreshing, setRefreshing] = useState(false);

  // Hook para integração com Apple Health/Google Fit
  const {
    state: healthState,
    isIOS,
    isAndroid,
    connectAppleHealth,
    connectGoogleFit,
    syncAllData,
    disconnect
  } = useHealthIntegration();

  // Dados simulados em tempo real após conexão
  const [realTimeData, setRealTimeData] = useState({
    connectedUsers: 0,
    todayMeasurements: 0,
    avgWeight: 0,
    avgHeartRate: 0,
    steps: 0,
    lastSync: null as Date | null
  });

  // Simular dados em tempo real após conexão
  useEffect(() => {
    if (healthState.isConnected) {
      setRealTimeData({
        connectedUsers: 156,
        todayMeasurements: 23,
        avgWeight: 72.5,
        avgHeartRate: 78,
        steps: 8247,
        lastSync: new Date()
      });

      // Simular atualizações em tempo real
      const interval = setInterval(() => {
        setRealTimeData(prev => ({
          ...prev,
          todayMeasurements: prev.todayMeasurements + Math.floor(Math.random() * 2),
          avgWeight: prev.avgWeight + (Math.random() - 0.5) * 0.1,
          avgHeartRate: prev.avgHeartRate + Math.floor((Math.random() - 0.5) * 4),
          steps: prev.steps + Math.floor(Math.random() * 50),
          lastSync: new Date()
        }));
      }, 10000); // Atualizar a cada 10 segundos

      return () => clearInterval(interval);
    }
  }, [healthState.isConnected]);

  // Dados simulados para demonstração
  const generateMockData = (): AnalyticsData[] => {
    const mockData: AnalyticsData[] = [];
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90;
    
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      mockData.push({
        date,
        users: Math.floor(Math.random() * 1000) + 500,
        sessions: Math.floor(Math.random() * 2000) + 1000,
        completions: Math.floor(Math.random() * 500) + 200,
        averageScore: Math.floor(Math.random() * 40) + 60,
        engagement: Math.floor(Math.random() * 30) + 70,
        retention: Math.floor(Math.random() * 20) + 80,
        satisfaction: Math.floor(Math.random() * 15) + 85,
        weightLoss: Math.floor(Math.random() * 10) + 5,
        healthImprovement: Math.floor(Math.random() * 25) + 75,
        behaviorChange: Math.floor(Math.random() * 30) + 70,
        missionsCompleted: Math.floor(Math.random() * 1000) + 2000,
        challengesParticipated: Math.floor(Math.random() * 300) + 150,
        coursesCompleted: Math.floor(Math.random() * 100) + 50,
        socialInteractions: Math.floor(Math.random() * 500) + 200,
        supportTickets: Math.floor(Math.random() * 20) + 5,
        appUsage: Math.floor(Math.random() * 120) + 180,
        deviceType: ['Mobile', 'Desktop', 'Tablet'][Math.floor(Math.random() * 3)],
        userSegment: ['Iniciante', 'Intermediário', 'Avançado'][Math.floor(Math.random() * 3)],
        conversionRate: Math.floor(Math.random() * 10) + 15,
        churnRate: Math.floor(Math.random() * 5) + 2,
        ltv: Math.floor(Math.random() * 500) + 300,
        cac: Math.floor(Math.random() * 100) + 50,
        mrr: Math.floor(Math.random() * 10000) + 25000,
        nps: Math.floor(Math.random() * 40) + 60,
        csat: Math.floor(Math.random() * 20) + 80,
        ces: Math.floor(Math.random() * 3) + 2,
      });
    }
    
    return mockData.reverse();
  };

  const refreshData = async () => {
    setRefreshing(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData(generateMockData());
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simular carregamento inicial
      await new Promise(resolve => setTimeout(resolve, 1500));
      setData(generateMockData());
      setLoading(false);
    };

    loadData();
  }, [selectedPeriod]);

  // Funções para conexão com Apple Health/Google Fit
  const handleHealthConnection = async () => {
    if (isIOS) {
      await connectAppleHealth();
    } else {
      await connectGoogleFit();
    }
  };

  const handleHealthDisconnect = async () => {
    if (healthState.config.appleHealthEnabled) {
      await disconnect('apple_health');
    }
    if (healthState.config.googleFitEnabled) {
      await disconnect('google_fit');
    }
  };

  const handleSyncData = async () => {
    await syncAllData();
    // Atualizar dados em tempo real
    setRealTimeData(prev => ({
      ...prev,
      lastSync: new Date()
    }));
  };

  const getHealthIcon = () => {
    if (isIOS) return <Apple className="h-4 w-4" />;
    if (isAndroid) return <Chrome className="h-4 w-4" />;
    return <Smartphone className="h-4 w-4" />;
  };

  const getHealthPlatform = () => {
    if (isIOS) return 'Apple Health';
    if (isAndroid) return 'Google Fit';
    return 'Dados de Saúde';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="senior-tooltip">
          <p className="font-semibold mb-2">{`Data: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
  const avgEngagement = data.length > 0 ? data.reduce((sum, item) => sum + item.engagement, 0) / data.length : 0;
  const avgSatisfaction = data.length > 0 ? data.reduce((sum, item) => sum + item.satisfaction, 0) / data.length : 0;
  const totalRevenue = data.reduce((sum, item) => sum + item.mrr, 0);

  if (loading) {
    return (
      <div className="spacing-senior-lg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-senior-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-senior-lg text-medium-contrast">Carregando análises avançadas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="spacing-senior-lg space-y-senior-lg">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-senior-md">
        <div>
          <h1 className="text-senior-3xl font-bold text-high-contrast">Análises Avançadas</h1>
          <p className="text-senior-base text-medium-contrast mt-2">
            Insights detalhados sobre performance e engajamento dos usuários
          </p>
        </div>
        <div className="flex items-center gap-senior-sm">
          <Button 
            variant="outline" 
            size="lg"
            onClick={refreshData}
            disabled={refreshing}
            className="min-h-senior-button"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="min-h-senior-button"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Card Dedicado para Integração de Saúde - MELHORADO */}
      <Card className="bg-gradient-to-r from-red-100 via-pink-100 to-blue-100 border-4 border-dashed border-red-400 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-red-800 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 animate-pulse" />
            🩺 Integração com Apple Health & Google Fit
          </CardTitle>
          <p className="text-red-700 text-lg">
            Conecte seus dados de saúde para ter informações em tempo real
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-full shadow-lg">
                {getHealthIcon()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">
                  {healthState.isConnected ? 
                    `✅ Conectado com ${getHealthPlatform()}` : 
                    `📱 Disponível para ${getHealthPlatform()}`
                  }
                </p>
                <p className="text-sm text-gray-600">
                  {healthState.isConnected ? 
                    `${realTimeData.connectedUsers} usuários conectados` : 
                    'Clique para conectar e ver dados em tempo real'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!healthState.isConnected ? (
                <Button 
                  onClick={handleHealthConnection}
                  disabled={healthState.isLoading}
                  className="bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 hover:from-red-600 hover:via-pink-600 hover:to-blue-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-300 text-xl py-8 px-12 animate-pulse"
                  size="lg"
                >
                  {healthState.isLoading ? (
                    <Loader2 className="h-7 w-7 mr-3 animate-spin" />
                  ) : (
                    <>
                      {getHealthIcon()}
                      <Heart className="h-7 w-7 mx-3 text-white animate-pulse" />
                    </>
                  )}
                  <span className="font-bold">🚀 CONECTAR AGORA</span>
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleSyncData}
                    disabled={healthState.isLoading}
                    className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-md py-4 px-8 text-lg"
                    size="lg"
                  >
                    {healthState.isLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-5 w-5 mr-2" />
                    )}
                    🔄 Sincronizar
                  </Button>
                  <Button 
                    onClick={handleHealthDisconnect}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50 shadow-md py-4 px-8 text-lg"
                    size="lg"
                  >
                    <Wifi className="h-5 w-5 mr-2" />
                    🔌 Desconectar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status da Conexão de Saúde */}
      {healthState.isConnected && (
        <Alert className="bg-green-50 border-green-200 border-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                Conectado com {getHealthPlatform()} • {realTimeData.connectedUsers} usuários conectados
              </span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                {realTimeData.lastSync ? `Última sincronização: ${realTimeData.lastSync.toLocaleTimeString()}` : 'Sincronizando...'}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {healthState.error && (
        <Alert className="bg-red-50 border-red-200 border-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 text-lg">
            {healthState.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-senior-md">
        <AlertCard
          type="success"
          title="Performance Excelente"
          message="Taxa de engajamento aumentou 23% este mês comparado ao anterior."
          action={
            <Button size="sm" className="bg-senior-success text-white hover:bg-senior-success/90">
              Ver Detalhes
            </Button>
          }
        />
        <AlertCard
          type="warning"
          title="Atenção Necessária"
          message="Taxa de churn está acima da média. Considere implementar estratégias de retenção."
          action={
            <Button size="sm" className="bg-senior-warning text-white hover:bg-senior-warning/90">
              Plano de Ação
            </Button>
          }
        />
      </div>

      {/* Métricas em Tempo Real da Saúde - MELHORADAS */}
      {healthState.isConnected && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              📊 Dados em Tempo Real Conectados
            </h3>
            <p className="text-gray-600 text-lg">
              Informações atualizadas automaticamente do {getHealthPlatform()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-red-400 to-red-600 border-red-500 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-100">📏 Medições Hoje</p>
                    <p className="text-4xl font-bold text-white">
                      {realTimeData.todayMeasurements}
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1 text-green-200">
                      <TrendingUp className="h-4 w-4" />
                      +12.5%
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-white/20 shadow-lg">
                    <Heart className="h-10 w-10 text-white animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-400 to-blue-600 border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">⚖️ Peso Médio</p>
                    <p className="text-4xl font-bold text-white">
                      {realTimeData.avgWeight.toFixed(1)} kg
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1 text-green-200">
                      <TrendingUp className="h-4 w-4" />
                      -2.3%
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-white/20 shadow-lg">
                    <Activity className="h-10 w-10 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400 to-green-600 border-green-500 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">🚶 Passos Médios</p>
                    <p className="text-4xl font-bold text-white">
                      {realTimeData.steps.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1 text-green-200">
                      <TrendingUp className="h-4 w-4" />
                      +8.4%
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-white/20 shadow-lg">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-400 to-purple-600 border-purple-500 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">💓 Freq. Cardíaca</p>
                    <p className="text-4xl font-bold text-white">
                      {realTimeData.avgHeartRate} bpm
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1 text-green-200">
                      <TrendingUp className="h-4 w-4" />
                      +5.2%
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-white/20 shadow-lg">
                    <Heart className="h-10 w-10 text-white animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Filtros */}
      <Card className="senior-card">
        <CardContent className="spacing-senior">
          <div className="flex flex-wrap items-center gap-senior-md">
            <div className="flex items-center gap-senior-sm">
              <label className="text-senior-base font-medium text-high-contrast">Período:</label>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="senior-form-input min-w-[120px]"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
            </div>
            <div className="flex items-center gap-senior-sm">
              <label className="text-senior-base font-medium text-high-contrast">Métrica:</label>
              <select 
                value={selectedMetric} 
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="senior-form-input min-w-[140px]"
              >
                <option value="users">Usuários</option>
                <option value="engagement">Engajamento</option>
                <option value="health">Saúde</option>
                <option value="revenue">Receita</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-senior-md">
        <MetricCard
          title="Usuários Ativos"
          value={totalUsers.toLocaleString()}
          change="+12.5%"
          changeType="increase"
          icon={<Users className="w-5 h-5" />}
          color={SENIOR_COLORS.primary}
          description="Últimos 30 dias"
        />
        <MetricCard
          title="Engajamento"
          value={`${avgEngagement.toFixed(1)}%`}
          change="+8.3%"
          changeType="increase"
          icon={<Activity className="w-5 h-5" />}
          color={SENIOR_COLORS.success}
          description="Taxa média"
        />
        <MetricCard
          title="Satisfação"
          value={`${avgSatisfaction.toFixed(1)}%`}
          change="+5.7%"
          changeType="increase"
          icon={<Heart className="w-5 h-5" />}
          color={SENIOR_COLORS.accent}
          description="NPS médio"
        />
        <MetricCard
          title="Receita"
          value={`R$ ${(totalRevenue / 1000).toFixed(0)}k`}
          change="+15.2%"
          changeType="increase"
          icon={<Target className="w-5 h-5" />}
          color={SENIOR_COLORS.info}
          description="MRR total"
        />
      </div>

      {/* Gráficos com Aba de Saúde */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          <TabsTrigger value="users">👥 Usuários</TabsTrigger>
          <TabsTrigger value="health">🩺 Saúde</TabsTrigger>
          {healthState.isConnected && (
            <TabsTrigger value="realtime">⚡ Tempo Real</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-senior-lg">
            <ChartWrapper 
              title="Usuários Ativos Diários"
              actions={
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Detalhes
                </Button>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={SENIOR_COLORS.border} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }}
                    axisLine={{ stroke: SENIOR_COLORS.border }}
                  />
                  <YAxis 
                    tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }}
                    axisLine={{ stroke: SENIOR_COLORS.border }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke={SENIOR_COLORS.primary} 
                    fill={SENIOR_COLORS.primary}
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper 
              title="Engajamento vs Retenção"
              actions={
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Comparar
                </Button>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={SENIOR_COLORS.border} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }}
                    axisLine={{ stroke: SENIOR_COLORS.border }}
                  />
                  <YAxis 
                    tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }}
                    axisLine={{ stroke: SENIOR_COLORS.border }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="engagement" fill={SENIOR_COLORS.success} />
                  <Line 
                    type="monotone" 
                    dataKey="retention" 
                    stroke={SENIOR_COLORS.accent} 
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-senior-lg">
            <ChartWrapper title="Crescimento de Usuários">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={SENIOR_COLORS.border} />
                  <XAxis dataKey="date" tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }} />
                  <YAxis tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke={SENIOR_COLORS.primary} 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Sessões Completadas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={SENIOR_COLORS.border} />
                  <XAxis dataKey="date" tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }} />
                  <YAxis tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completions" fill={SENIOR_COLORS.success} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <ChartWrapper 
            title="Indicadores de Saúde e Bem-estar"
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={SENIOR_COLORS.border} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }}
                  axisLine={{ stroke: SENIOR_COLORS.border }}
                />
                <YAxis 
                  tick={{ fill: SENIOR_COLORS.text, fontSize: 12 }}
                  axisLine={{ stroke: SENIOR_COLORS.border }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="weightLoss" 
                  stroke={SENIOR_COLORS.primary} 
                  strokeWidth={3}
                  name="Perda de Peso (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="healthImprovement" 
                  stroke={SENIOR_COLORS.success} 
                  strokeWidth={3}
                  name="Melhoria da Saúde (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="behaviorChange" 
                  stroke={SENIOR_COLORS.accent} 
                  strokeWidth={3}
                  name="Mudança de Comportamento (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </TabsContent>

        {/* Aba de Dados em Tempo Real */}
        {healthState.isConnected && (
          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="senior-card">
                <CardHeader>
                  <CardTitle className="text-senior-xl text-high-contrast flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Medições de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-red-800">Peso Médio</p>
                        <p className="text-3xl font-bold text-red-600">{realTimeData.avgWeight.toFixed(1)} kg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600">Tendência</p>
                        <p className="text-sm font-medium text-green-600">-2.3%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-800">Freq. Cardíaca</p>
                        <p className="text-3xl font-bold text-purple-600">{realTimeData.avgHeartRate} bpm</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-purple-600">Variação</p>
                        <p className="text-sm font-medium text-green-600">+5.2%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Passos Totais</p>
                        <p className="text-3xl font-bold text-green-600">{realTimeData.steps.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">Meta</p>
                        <p className="text-sm font-medium text-green-600">82%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="senior-card">
                <CardHeader>
                  <CardTitle className="text-senior-xl text-high-contrast flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Usuários Conectados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-5xl font-bold text-blue-600 mb-2">
                        {realTimeData.connectedUsers}
                      </div>
                      <p className="text-blue-800 font-medium">Usuários conectados</p>
                      <p className="text-sm text-blue-600">ao {getHealthPlatform()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{realTimeData.todayMeasurements}</div>
                        <p className="text-sm text-green-800">Medições hoje</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">98%</div>
                        <p className="text-sm text-orange-800">Taxa de sucesso</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Resumo de Performance */}
      <Card className="senior-card">
        <CardHeader>
          <CardTitle className="text-senior-xl text-high-contrast">Resumo de Performance</CardTitle>
        </CardHeader>
        <CardContent className="spacing-senior">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-senior-lg">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: SENIOR_COLORS.success }}
              >
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-senior-lg font-semibold text-high-contrast">Excelente</h3>
              <p className="text-senior-base text-medium-contrast">Performance geral</p>
              <div className="mt-4">
                <div className="senior-progress">
                  <div 
                    className="senior-progress-fill" 
                    style={{ width: '92%', backgroundColor: SENIOR_COLORS.success }}
                  ></div>
                </div>
                <p className="text-senior-sm text-medium-contrast mt-2">92% dos objetivos atingidos</p>
              </div>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: SENIOR_COLORS.primary }}
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-senior-lg font-semibold text-high-contrast">Crescimento</h3>
              <p className="text-senior-base text-medium-contrast">Tendência positiva</p>
              <div className="mt-4">
                <div className="senior-progress">
                  <div 
                    className="senior-progress-fill" 
                    style={{ width: '85%', backgroundColor: SENIOR_COLORS.primary }}
                  ></div>
                </div>
                <p className="text-senior-sm text-medium-contrast mt-2">85% de crescimento sustentável</p>
              </div>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: SENIOR_COLORS.accent }}
              >
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-senior-lg font-semibold text-high-contrast">Engajamento</h3>
              <p className="text-senior-base text-medium-contrast">Muito alto</p>
              <div className="mt-4">
                <div className="senior-progress">
                  <div 
                    className="senior-progress-fill" 
                    style={{ width: '88%', backgroundColor: SENIOR_COLORS.accent }}
                  ></div>
                </div>
                <p className="text-senior-sm text-medium-contrast mt-2">88% de engajamento ativo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};