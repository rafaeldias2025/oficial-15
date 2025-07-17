import React, { useState } from 'react';
import { ModernGoalChart } from '@/components/ui/modern-goal-chart';
import { ModernMetricCard, ModernMetricsGrid } from '@/components/ui/modern-metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Timer,
  Droplets,
  Moon,
  Flame
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const ModernHealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentStepGoal, setCurrentStepGoal] = useState(10000);

  // Dados simulados para demonstração do design moderno
  const simulatedData = {
    steps: Math.floor(Math.random() * 12000) + 3000,
    heartRate: Math.floor(Math.random() * 20) + 65,
    calories: Math.floor(Math.random() * 800) + 200,
    activeTime: Math.floor(Math.random() * 90) + 20,
    water: Math.floor(Math.random() * 1500) + 800,
    sleep: Math.floor(Math.random() * 3) + 6.5,
    previousSteps: Math.floor(Math.random() * 12000) + 3000,
    previousHeartRate: Math.floor(Math.random() * 20) + 65,
    previousCalories: Math.floor(Math.random() * 800) + 200,
    previousActiveTime: Math.floor(Math.random() * 90) + 20,
    previousWater: Math.floor(Math.random() * 1500) + 800,
    previousSleep: Math.floor(Math.random() * 3) + 6.5
  };

  // Dados das métricas principais com design moderno
  const healthMetrics = [
    {
      title: "Passos Hoje",
      value: simulatedData.steps,
      unit: "passos",
      target: currentStepGoal,
      previousValue: simulatedData.previousSteps,
      color: 'orange' as const,
      icon: <Activity className="h-4 w-4" />
    },
    {
      title: "Batimentos Cardíacos",
      value: simulatedData.heartRate,
      unit: "bpm",
      target: 80,
      previousValue: simulatedData.previousHeartRate,
      color: 'red' as const,
      icon: <Heart className="h-4 w-4" />,
      showProgress: false
    },
    {
      title: "Calorias Queimadas",
      value: simulatedData.calories,
      unit: "cal",
      target: 2000,
      previousValue: simulatedData.previousCalories,
      color: 'green' as const,
      icon: <Flame className="h-4 w-4" />
    },
    {
      title: "Tempo Ativo",
      value: simulatedData.activeTime,
      unit: "min",
      target: 60,
      previousValue: simulatedData.previousActiveTime,
      color: 'blue' as const,
      icon: <Timer className="h-4 w-4" />
    },
    {
      title: "Água Consumida",
      value: simulatedData.water,
      unit: "ml",
      target: 2000,
      previousValue: simulatedData.previousWater,
      color: 'blue' as const,
      icon: <Droplets className="h-4 w-4" />
    },
    {
      title: "Horas de Sono",
      value: simulatedData.sleep,
      unit: "h",
      target: 8,
      previousValue: simulatedData.previousSleep,
      color: 'purple' as const,
      icon: <Moon className="h-4 w-4" />,
      showProgress: false
    }
  ];

  const handleGoalChange = (newGoal: number) => {
    setCurrentStepGoal(newGoal);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Saúde</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso diário e metas de saúde
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Hoje
        </Button>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métricas Principais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ModernMetricsGrid metrics={healthMetrics.slice(0, 4)} />
          </motion.div>

          {/* Gráfico de Passos - Destaque */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <ModernGoalChart
                title="Meta de Passos Diários"
                subtitle="Acompanhe seu progresso e histórico"
                data={[]}
                currentGoal={simulatedData.steps}
                targetGoal={currentStepGoal}
                onGoalChange={handleGoalChange}
              />
            </div>
            
            <div className="space-y-4">
              <ModernMetricCard {...healthMetrics[4]} />
              <ModernMetricCard {...healthMetrics[5]} />
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-instituto-orange" />
                  Configurar Metas Diárias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ModernMetricsGrid metrics={healthMetrics} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-instituto-orange" />
                  Análise de Tendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Gráficos de tendência em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
