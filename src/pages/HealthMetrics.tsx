import React from 'react';
import { Activity, Heart, TrendingUp, Clock } from 'lucide-react';

const HealthMetrics: React.FC = () => {
  const metrics = [
    {
      id: 'steps',
      label: 'Passos',
      value: '8,547',
      goal: '10,000',
      percentage: 85,
      icon: Activity,
      color: 'text-health-steps bg-health-steps/10'
    },
    {
      id: 'heart',
      label: 'Frequência Cardíaca',
      value: '72 bpm',
      goal: '60-100 bpm',
      percentage: 90,
      icon: Heart,
      color: 'text-health-heart bg-health-heart/10'
    },
    {
      id: 'calories',
      label: 'Calorias',
      value: '1,847',
      goal: '2,200',
      percentage: 84,
      icon: TrendingUp,
      color: 'text-health-calories bg-health-calories/10'
    },
    {
      id: 'sleep',
      label: 'Sono',
      value: '7h 23m',
      goal: '8h',
      percentage: 92,
      icon: Clock,
      color: 'text-health-sleep bg-health-sleep/10'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Métricas de Saúde
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acompanhe seus dados de saúde em tempo real
        </p>
      </div>

      <div className="health-grid">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="card-health"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <metric.icon size={24} className="current" />
              </div>
              <div className="text-right">
                <div className="metric-display">{metric.value}</div>
                <div className="metric-label">Meta: {metric.goal}</div>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {metric.label}
            </h3>
            
            {/* Progress Bar */}
            <div className="progress-health">
              <div
                className={`progress-fill bg-current ${metric.color.split(' ')[0]}`}
                style={{ width: `${metric.percentage}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {metric.percentage}% da meta
              </span>
              <span className={`text-sm font-medium ${metric.color.split(' ')[0]}`}>
                {metric.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="mt-8 card-health">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Histórico Semanal
        </h2>
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Gráfico de tendências (a ser implementado)
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;
