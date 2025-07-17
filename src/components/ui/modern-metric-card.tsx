import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Target, 
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  target?: number;
  previousValue?: number;
  color?: 'orange' | 'green' | 'blue' | 'purple' | 'red';
  icon?: React.ReactNode;
  showProgress?: boolean;
  className?: string;
}

export const ModernMetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  target,
  previousValue,
  color = 'orange',
  icon,
  showProgress = true,
  className = ""
}) => {
  // Calcular mudança percentual
  const changePercentage = previousValue 
    ? ((value - previousValue) / previousValue) * 100 
    : 0;
  
  const isPositiveChange = changePercentage > 0;
  const isNegativeChange = changePercentage < 0;
  
  // Calcular progresso
  const progressPercentage = target ? Math.min(100, (value / target) * 100) : 0;
  
  // Cores baseadas no tema
  const colorConfig = {
    orange: {
      bg: 'from-orange-500/10 to-orange-600/5',
      border: 'border-orange-200 dark:border-orange-800',
      accent: 'text-orange-600 dark:text-orange-400',
      progress: 'bg-orange-500'
    },
    green: {
      bg: 'from-green-500/10 to-green-600/5',
      border: 'border-green-200 dark:border-green-800',
      accent: 'text-green-600 dark:text-green-400',
      progress: 'bg-green-500'
    },
    blue: {
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-200 dark:border-blue-800',
      accent: 'text-blue-600 dark:text-blue-400',
      progress: 'bg-blue-500'
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-200 dark:border-purple-800',
      accent: 'text-purple-600 dark:text-purple-400',
      progress: 'bg-purple-500'
    },
    red: {
      bg: 'from-red-500/10 to-red-600/5',
      border: 'border-red-200 dark:border-red-800',
      accent: 'text-red-600 dark:text-red-400',
      progress: 'bg-red-500'
    }
  };

  const config = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className={`bg-gradient-to-br ${config.bg} ${config.border} hover:shadow-lg transition-all duration-300`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {icon && (
              <div className={`${config.accent}`}>
                {icon}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Valor Principal */}
          <div className="flex items-baseline gap-1">
            <motion.span 
              className="text-2xl font-bold"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {value.toLocaleString()}
            </motion.span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>

          {/* Mudança Percentual */}
          {previousValue && changePercentage !== 0 && (
            <div className="flex items-center gap-1 text-xs">
              {isPositiveChange ? (
                <ChevronUp className="h-3 w-3 text-green-500" />
              ) : isNegativeChange ? (
                <ChevronDown className="h-3 w-3 text-red-500" />
              ) : (
                <Minus className="h-3 w-3 text-muted-foreground" />
              )}
              <span className={`font-medium ${
                isPositiveChange ? 'text-green-600' : 
                isNegativeChange ? 'text-red-600' : 
                'text-muted-foreground'
              }`}>
                {Math.abs(changePercentage).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs. anterior</span>
            </div>
          )}

          {/* Barra de Progresso */}
          {showProgress && target && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Progress 
                  value={progressPercentage} 
                  className={`h-2 [&>div]:${config.progress}`}
                />
              </motion.div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Atual: {value.toLocaleString()}</span>
                <span>Meta: {target.toLocaleString()}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente para conjunto de métricas
interface MetricsGridProps {
  metrics: Array<Omit<MetricCardProps, 'className'>>;
  className?: string;
}

export const ModernMetricsGrid: React.FC<MetricsGridProps> = ({ 
  metrics, 
  className = "" 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <ModernMetricCard
          key={index}
          {...metric}
          className="h-full"
        />
      ))}
    </div>
  );
};

// Dados de exemplo para demonstração
export const sampleMetrics = [
  {
    title: "Passos Hoje",
    value: 8247,
    unit: "passos",
    target: 10000,
    previousValue: 7890,
    color: 'orange' as const,
    icon: <Activity className="h-4 w-4" />
  },
  {
    title: "Batimentos Cardíacos",
    value: 72,
    unit: "bpm",
    target: 80,
    previousValue: 75,
    color: 'red' as const,
    icon: <Heart className="h-4 w-4" />
  },
  {
    title: "Calorias Queimadas",
    value: 342,
    unit: "cal",
    target: 500,
    previousValue: 298,
    color: 'green' as const,
    icon: <Target className="h-4 w-4" />
  },
  {
    title: "Tempo Ativo",
    value: 45,
    unit: "min",
    target: 60,
    previousValue: 38,
    color: 'blue' as const,
    icon: <TrendingUp className="h-4 w-4" />
  }
];
