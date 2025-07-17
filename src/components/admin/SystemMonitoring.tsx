import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Server, 
  Database, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
  Wifi,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  activeUsers: number;
  totalSessions: number;
  errorRate: number;
  responseTime: number;
  uptime: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

export const SystemMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 67,
    disk: 32,
    activeUsers: 12,
    totalSessions: 245,
    errorRate: 2.1,
    responseTime: 145,
    uptime: '7 dias, 14h 32m'
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Sistema iniciado com sucesso',
      source: 'System'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'warning',
      message: 'Alto uso de CPU detectado',
      source: 'Monitor'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      level: 'error',
      message: 'Falha na conexão com base de dados',
      source: 'Database'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    // Simular chamada à API
    setTimeout(() => {
      setMetrics({
        ...metrics,
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        activeUsers: Math.floor(Math.random() * 50),
        responseTime: Math.floor(Math.random() * 300) + 50
      });
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (value: number, type: 'usage' | 'performance' = 'usage') => {
    if (type === 'usage') {
      if (value < 50) return 'text-green-500';
      if (value < 80) return 'text-yellow-500';
      return 'text-red-500';
    } else {
      if (value < 100) return 'text-green-500';
      if (value < 200) return 'text-yellow-500';
      return 'text-red-500';
    }
  };

  const getProgressColor = (value: number) => {
    if (value < 50) return '';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLevelBadge = (level: 'info' | 'warning' | 'error') => {
    const variants = {
      info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      error: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return variants[level];
  };

  // Simular atualização automática a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header com botão refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-netflix-text flex items-center gap-2">
            <Activity className="h-6 w-6 text-instituto-orange" />
            Monitoramento do Sistema
          </h2>
          <p className="text-netflix-text-muted">
            Acompanhe o desempenho e status em tempo real
          </p>
        </div>
        
        <Button 
          onClick={refreshMetrics} 
          disabled={isRefreshing}
          variant="outline"
          className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-netflix-text-muted">CPU</p>
                <p className={`text-2xl font-bold ${getStatusColor(metrics.cpu)}`}>
                  {metrics.cpu}%
                </p>
              </div>
              <Cpu className="h-8 w-8 text-instituto-orange" />
            </div>
            <Progress 
              value={metrics.cpu} 
              className={`mt-3 ${getProgressColor(metrics.cpu)}`}
            />
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-netflix-text-muted">Memória</p>
                <p className={`text-2xl font-bold ${getStatusColor(metrics.memory)}`}>
                  {metrics.memory}%
                </p>
              </div>
              <Server className="h-8 w-8 text-instituto-purple" />
            </div>
            <Progress 
              value={metrics.memory} 
              className={`mt-3 ${getProgressColor(metrics.memory)}`}
            />
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-netflix-text-muted">Disco</p>
                <p className={`text-2xl font-bold ${getStatusColor(metrics.disk)}`}>
                  {metrics.disk}%
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-instituto-green" />
            </div>
            <Progress 
              value={metrics.disk} 
              className={`mt-3 ${getProgressColor(metrics.disk)}`}
            />
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-netflix-text-muted">Usuários Ativos</p>
                <p className="text-2xl font-bold text-netflix-text">
                  {metrics.activeUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-instituto-lilac" />
            </div>
            <div className="mt-3 flex items-center text-sm text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% vs ontem
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dados Detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status de Serviços */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Status dos Serviços
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'API Principal', status: 'online', responseTime: 95 },
              { name: 'Base de Dados', status: 'online', responseTime: 45 },
              { name: 'Autenticação', status: 'online', responseTime: 120 },
              { name: 'Storage', status: 'warning', responseTime: 250 },
              { name: 'Email Service', status: 'offline', responseTime: 0 }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'online' ? 'bg-green-500' :
                    service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-netflix-text font-medium">{service.name}</span>
                </div>
                <div className="text-sm text-netflix-text-muted">
                  {service.responseTime > 0 ? `${service.responseTime}ms` : 'Offline'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Métricas de Performance */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-instituto-purple" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-netflix-text-muted">Tempo de Resposta</span>
                <span className={`font-medium ${getStatusColor(metrics.responseTime, 'performance')}`}>
                  {metrics.responseTime}ms
                </span>
              </div>
              <Progress value={(300 - metrics.responseTime) / 3} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-netflix-text-muted">Taxa de Erro</span>
                <span className={`font-medium ${metrics.errorRate > 5 ? 'text-red-500' : 'text-green-500'}`}>
                  {metrics.errorRate}%
                </span>
              </div>
              <Progress value={metrics.errorRate} className={metrics.errorRate > 5 ? 'bg-red-500' : ''} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-netflix-text-muted">Sessões Ativas</span>
                <span className="font-medium text-netflix-text">{metrics.totalSessions}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-netflix-border">
              <div className="flex items-center gap-2 text-sm text-netflix-text-muted">
                <Clock className="h-4 w-4" />
                Uptime: {metrics.uptime}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas Recentes */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: 'warning', message: 'Alto uso de CPU detectado', time: '5 min atrás' },
              { type: 'info', message: 'Backup concluído com sucesso', time: '1h atrás' },
              { type: 'error', message: 'Falha na conexão com storage', time: '2h atrás' },
              { type: 'warning', message: 'Memória acima de 80%', time: '3h atrás' }
            ].map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-netflix-hover rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'error' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-netflix-text font-medium">{alert.message}</p>
                  <p className="text-xs text-netflix-text-muted">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Logs do Sistema */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Server className="h-5 w-5 text-instituto-orange" />
            Logs do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 bg-netflix-hover rounded-lg text-sm">
                <Badge className={getLevelBadge(log.level)}>
                  {log.level.toUpperCase()}
                </Badge>
                <span className="text-netflix-text-muted min-w-0 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-netflix-text-muted font-mono text-xs bg-netflix-dark px-2 py-1 rounded">
                  {log.source}
                </span>
                <span className="text-netflix-text flex-1 min-w-0">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};