import React from 'react';
import { ModernGoalChart } from '@/components/ui/modern-goal-chart';
import { ModernMetricCard, ModernMetricsGrid, sampleMetrics } from '@/components/ui/modern-metric-card';
import { ModernHealthDashboard } from '@/components/ModernHealthDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Activity, Heart, Target, TrendingUp, Sparkles, Star } from 'lucide-react';

export const ModernGraphicsDemo: React.FC = () => {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header da Demo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-instituto-orange animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-instituto-orange via-orange-600 to-red-600 bg-clip-text text-transparent">
            Gráficos Modernos - Estilo "Move Goal"
          </h1>
          <Sparkles className="h-8 w-8 text-instituto-orange animate-pulse" />
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Novos componentes visuais inspirados no design moderno do Apple Watch e tendências de UX/UI para saúde e bem-estar.
          Gráficos motivacionais, animações fluidas e experiência visual premium.
        </p>
      </motion.div>

      {/* Grid de Métricas Modernas */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-instituto-orange" />
          <h2 className="text-2xl font-semibold">Métricas Inteligentes</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <ModernMetricsGrid metrics={sampleMetrics} />
      </motion.section>

      {/* Gráfico de Meta Principal */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-instituto-orange" />
          <h2 className="text-2xl font-semibold">Gráfico de Meta - Estilo "Move Goal"</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModernGoalChart
            title="Meta de Passos Diários"
            subtitle="Baseado no design do Apple Watch"
            data={[]}
            currentGoal={8247}
            targetGoal={10000}
            onGoalChange={(newGoal) => console.log('Nova meta:', newGoal)}
          />
          <ModernGoalChart
            title="Queima de Calorias"
            subtitle="Progresso energético"
            data={[]}
            currentGoal={1840}
            targetGoal={2200}
            onGoalChange={(newGoal) => console.log('Nova meta calorias:', newGoal)}
          />
        </div>
      </motion.section>

      {/* Dashboard Completo */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-instituto-orange" />
          <h2 className="text-2xl font-semibold">Dashboard Completo</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ModernHealthDashboard />
          </CardContent>
        </Card>
      </motion.section>

      {/* Características dos Componentes */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-instituto-orange" />
          <h2 className="text-2xl font-semibold">Características dos Novos Componentes</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-orange-600 dark:text-orange-400">Visual Moderno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                ✓ Círculos de progresso inspirados no Apple Watch<br/>
                ✓ Gradientes e glassmorphism<br/>
                ✓ Animações fluidas com Framer Motion<br/>
                ✓ Gráficos de barras interativos
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Funcionalidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                ✓ Edição de metas em tempo real<br/>
                ✓ Tooltips informativos<br/>
                ✓ Comparação com dados anteriores<br/>
                ✓ Indicadores de progresso personalizados
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Experiência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                ✓ Interface motivacional<br/>
                ✓ Feedback visual imediato<br/>
                ✓ Design responsivo<br/>
                ✓ Acessibilidade otimizada
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* CTA para implementação */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8"
      >
        <Card className="bg-gradient-to-r from-instituto-orange/10 via-orange-500/10 to-red-500/10 border-instituto-orange/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para Implementar nos Dashboards
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Estes componentes estão prontos para uso e podem ser integrados em qualquer parte do sistema.
              Eles são totalmente compatíveis com o design system existente e as APIs do Supabase.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-instituto-orange hover:bg-orange-600">
                Integrar ao Dashboard Principal
              </Button>
              <Button variant="outline">
                Ver Documentação dos Componentes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
};
