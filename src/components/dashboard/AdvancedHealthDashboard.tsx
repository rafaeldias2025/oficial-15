import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, Scale, Heart, Droplets, Zap, TrendingUp, 
  Calendar, Target, User, BarChart3, Clock, Maximize2
} from 'lucide-react';
import { EnhancedDashboard } from './EnhancedDashboard';
import { EnhancedSilhouette3D } from '../visual/EnhancedSilhouette3D';
import { useProgressData } from '@/hooks/useProgressData';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente de comparação rápida
const QuickComparison: React.FC<{ current: any; previous: any }> = ({ current, previous }) => {
  const getChange = (currentVal: number, previousVal: number) => {
    const diff = currentVal - previousVal;
    return {
      value: diff,
      positive: diff > 0,
      percentage: ((Math.abs(diff) / previousVal) * 100).toFixed(1)
    };
  };

  const weightChange = getChange(current.peso_kg, previous.peso_kg);
  const imcChange = getChange(current.imc || 0, previous.imc || 0);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-netflix-text mb-1">
          {current.peso_kg?.toFixed(1)}kg
        </div>
        <div className={`text-sm ${weightChange.positive ? 'text-red-500' : 'text-green-500'}`}>
          {weightChange.positive ? '+' : ''}{weightChange.value.toFixed(1)}kg
        </div>
        <div className="text-xs text-netflix-text-muted">Peso</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-netflix-text mb-1">
          {(current.imc || 0).toFixed(1)}
        </div>
        <div className={`text-sm ${imcChange.positive ? 'text-red-500' : 'text-green-500'}`}>
          {imcChange.positive ? '+' : ''}{imcChange.value.toFixed(1)}
        </div>
        <div className="text-xs text-netflix-text-muted">IMC</div>
      </div>
    </div>
  );
};

// Componente de metas e progresso
const GoalsProgress: React.FC<{ data: any; target: number }> = ({ data, target }) => {
  const currentWeight = data.peso_kg || 0;
  const progress = target > 0 ? Math.min(100, Math.max(0, ((currentWeight - target) / currentWeight) * 100)) : 0;
  const remaining = Math.abs(currentWeight - target);
  
  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Target className="h-5 w-5 text-instituto-orange" />
          Meta de Peso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold text-netflix-text">
              {target.toFixed(1)}kg
            </div>
            <div className="text-sm text-netflix-text-muted">Meta</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-netflix-text">
              {remaining.toFixed(1)}kg
            </div>
            <div className="text-sm text-netflix-text-muted">
              {currentWeight > target ? 'Para perder' : 'Para ganhar'}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-netflix-hover rounded-full h-2">
          <div 
            className="bg-instituto-orange h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        
        <div className="text-center text-sm text-netflix-text-muted">
          {progress.toFixed(1)}% do progresso
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de insights inteligentes
const HealthInsights: React.FC<{ data: any[] }> = ({ data }) => {
  const generateInsights = () => {
    if (data.length < 2) return [];
    
    const insights = [];
    const latest = data[0];
    const previous = data[1];
    
    // Análise de peso
    const weightDiff = latest.peso_kg - previous.peso_kg;
    if (Math.abs(weightDiff) > 0.5) {
      insights.push({
        type: weightDiff > 0 ? 'warning' : 'success',
        title: weightDiff > 0 ? 'Ganho de peso detectado' : 'Perda de peso detectada',
        message: `${Math.abs(weightDiff).toFixed(1)}kg ${weightDiff > 0 ? 'ganhos' : 'perdidos'} desde a última medição`,
        icon: <Scale className="h-4 w-4" />
      });
    }
    
    // Análise de gordura corporal
    if (latest.gordura_corporal_pct && previous.gordura_corporal_pct) {
      const fatDiff = latest.gordura_corporal_pct - previous.gordura_corporal_pct;
      if (Math.abs(fatDiff) > 1) {
        insights.push({
          type: fatDiff > 0 ? 'warning' : 'success',
          title: fatDiff > 0 ? 'Aumento de gordura corporal' : 'Redução de gordura corporal',
          message: `${Math.abs(fatDiff).toFixed(1)}% ${fatDiff > 0 ? 'de aumento' : 'de redução'} na gordura corporal`,
          icon: <Activity className="h-4 w-4" />
        });
      }
    }
    
    // Análise de hidratação
    if (latest.agua_corporal_pct && latest.agua_corporal_pct < 50) {
      insights.push({
        type: 'warning',
        title: 'Hidratação baixa',
        message: `Nível de água corporal em ${latest.agua_corporal_pct.toFixed(1)}%. Recomendado: >55%`,
        icon: <Droplets className="h-4 w-4" />
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Insights Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-netflix-hover">
              <div className={`
                p-2 rounded-full 
                ${insight.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}
              `}>
                {insight.icon}
              </div>
              <div>
                <div className="font-medium text-netflix-text mb-1">
                  {insight.title}
                </div>
                <div className="text-sm text-netflix-text-muted">
                  {insight.message}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-netflix-text-muted py-8">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Registre mais pesagens para receber insights personalizados</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const AdvancedHealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const { pesagens, dadosFisicos, loading } = useProgressData();
  const [activeView, setActiveView] = useState<'charts' | 'body' | 'insights'>('charts');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-netflix-hover rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-netflix-card border-netflix-border">
                <CardContent className="p-6">
                  <div className="h-32 bg-netflix-hover rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const latestData = pesagens[0];
  const previousData = pesagens[1];

  const silhouetteCurrentData = latestData ? {
    peso: latestData.peso_kg,
    altura: dadosFisicos?.altura_cm || 170,
    sexo: (dadosFisicos?.sexo?.toLowerCase() || 'masculino') as 'masculino' | 'feminino',
    imc: latestData.imc || 0,
    gorduraCorporal: latestData.gordura_corporal_pct,
    massaMuscular: latestData.massa_muscular_kg,
    aguaCorporal: latestData.agua_corporal_pct,
    circunferenciaAbdominal: latestData.circunferencia_abdominal_cm,
    data: latestData.data_medicao
  } : null;

  const silhouettePreviousData = previousData ? {
    peso: previousData.peso_kg,
    altura: dadosFisicos?.altura_cm || 170,
    sexo: (dadosFisicos?.sexo?.toLowerCase() || 'masculino') as 'masculino' | 'feminino',
    imc: previousData.imc || 0,
    gorduraCorporal: previousData.gordura_corporal_pct,
    massaMuscular: previousData.massa_muscular_kg,
    aguaCorporal: previousData.agua_corporal_pct,
    circunferenciaAbdominal: previousData.circunferencia_abdominal_cm,
    data: previousData.data_medicao
  } : null;

  return (
    <div className="space-y-6">
      {/* Header com informações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Comparação rápida */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-instituto-orange" />
              Progresso Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestData && previousData ? (
              <QuickComparison current={latestData} previous={previousData} />
            ) : (
              <div className="text-center text-netflix-text-muted py-4">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Precisa de mais dados para comparação</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metas */}
        <GoalsProgress 
          data={latestData || {}} 
          target={dadosFisicos?.meta_peso_kg || 70} 
        />

        {/* Última medição */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <Clock className="h-5 w-5 text-instituto-orange" />
              Última Medição
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestData ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-netflix-text-muted">Data</span>
                  <span className="text-sm text-netflix-text">
                    {format(new Date(latestData.data_medicao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-netflix-text-muted">Peso</span>
                  <span className="text-sm text-netflix-text">
                    {latestData.peso_kg?.toFixed(1)}kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-netflix-text-muted">IMC</span>
                  <span className="text-sm text-netflix-text">
                    {latestData.imc?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                {latestData.gordura_corporal_pct && (
                  <div className="flex justify-between">
                    <span className="text-sm text-netflix-text-muted">Gordura</span>
                    <span className="text-sm text-netflix-text">
                      {latestData.gordura_corporal_pct.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-netflix-text-muted py-4">
                <Scale className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma medição registrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navegação entre visualizações */}
      <div className="flex justify-center gap-2">
        <Button
          variant={activeView === 'charts' ? 'default' : 'outline'}
          onClick={() => setActiveView('charts')}
          className="gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Gráficos
        </Button>
        <Button
          variant={activeView === 'body' ? 'default' : 'outline'}
          onClick={() => setActiveView('body')}
          className="gap-2"
        >
          <User className="h-4 w-4" />
          Silhueta 3D
        </Button>
        <Button
          variant={activeView === 'insights' ? 'default' : 'outline'}
          onClick={() => setActiveView('insights')}
          className="gap-2"
        >
          <Zap className="h-4 w-4" />
          Insights
        </Button>
      </div>

      {/* Conteúdo baseado na visualização selecionada */}
      {activeView === 'charts' && (
        <EnhancedDashboard />
      )}

      {activeView === 'body' && silhouetteCurrentData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedSilhouette3D 
              currentData={silhouetteCurrentData}
              previousData={silhouettePreviousData}
            />
          </div>
          <div className="space-y-4">
            <HealthInsights data={pesagens} />
          </div>
        </div>
      )}

      {activeView === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthInsights data={pesagens} />
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Recomendações Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-netflix-hover rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-netflix-text">Hidratação</span>
                </div>
                <p className="text-sm text-netflix-text-muted">
                  Mantenha o consumo de água entre 2-3 litros por dia para otimizar a composição corporal.
                </p>
              </div>
              
              <div className="p-4 bg-netflix-hover rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-netflix-text">Exercício</span>
                </div>
                <p className="text-sm text-netflix-text-muted">
                  Combine treino de força com cardio para otimizar a perda de gordura e ganho muscular.
                </p>
              </div>
              
              <div className="p-4 bg-netflix-hover rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-netflix-text">Regularidade</span>
                </div>
                <p className="text-sm text-netflix-text-muted">
                  Registre suas medições pelo menos 2x por semana para melhor acompanhamento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 