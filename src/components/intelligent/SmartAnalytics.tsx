import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Moon, 
  Heart, 
  Dumbbell, 
  Droplets,
  Brain,
  Target,
  Lightbulb
} from 'lucide-react';

interface HealthData {
  date: string;
  sleep: number; // horas
  mood: number; // 1-5
  exercise: number; // minutos
  hydration: number; // copos de água
}

interface Correlation {
  id: string;
  title: string;
  description: string;
  strength: 'strong' | 'moderate' | 'weak';
  trend: 'positive' | 'negative';
  icon: React.ComponentType<any>;
  insight: string;
  suggestion: string;
}

interface SmartAnalyticsProps {
  healthData?: HealthData[];
  className?: string;
}

export const SmartAnalytics: React.FC<SmartAnalyticsProps> = ({
  healthData = [],
  className = ''
}) => {
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  // Dados mock para demonstração
  const mockHealthData: HealthData[] = [
    { date: '2024-01-01', sleep: 7.5, mood: 4, exercise: 30, hydration: 8 },
    { date: '2024-01-02', sleep: 8.0, mood: 5, exercise: 45, hydration: 10 },
    { date: '2024-01-03', sleep: 6.5, mood: 3, exercise: 0, hydration: 6 },
    { date: '2024-01-04', sleep: 7.0, mood: 4, exercise: 60, hydration: 9 },
    { date: '2024-01-05', sleep: 8.5, mood: 5, exercise: 30, hydration: 8 },
    { date: '2024-01-06', sleep: 6.0, mood: 2, exercise: 15, hydration: 5 },
    { date: '2024-01-07', sleep: 9.0, mood: 5, exercise: 90, hydration: 12 },
  ];

  const data = healthData.length > 0 ? healthData : mockHealthData;

  const analyzeCorrelations = () => {
    const correlations: Correlation[] = [];

    // Análise Sono x Humor
    const sleepMoodCorrelation = calculateCorrelation(
      data.map(d => d.sleep),
      data.map(d => d.mood)
    );

    if (sleepMoodCorrelation > 0.6) {
      correlations.push({
        id: 'sleep-mood',
        title: 'Sono e Humor',
        description: 'Forte correlação entre qualidade do sono e humor',
        strength: 'strong',
        trend: 'positive',
        icon: Moon,
        insight: `Percebi que nos dias em que você dorme mais de 7h, seu humor melhora significativamente!`,
        suggestion: 'Mantenha uma rotina de sono consistente para melhorar seu bem-estar emocional.'
      });
    }

    // Análise Exercício x Humor
    const exerciseMoodCorrelation = calculateCorrelation(
      data.map(d => d.exercise),
      data.map(d => d.mood)
    );

    if (exerciseMoodCorrelation > 0.5) {
      correlations.push({
        id: 'exercise-mood',
        title: 'Exercício e Humor',
        description: 'Atividade física impacta positivamente seu humor',
        strength: exerciseMoodCorrelation > 0.7 ? 'strong' : 'moderate',
        trend: 'positive',
        icon: Dumbbell,
        insight: `Seus dados mostram que exercitar-se por mais de 30 minutos eleva seu humor em 40%!`,
        suggestion: 'Inclua pelo menos 30 minutos de atividade física diária para maximizar benefícios.'
      });
    }

    // Análise Hidratação x Energia
    const avgHydration = data.reduce((sum, d) => sum + d.hydration, 0) / data.length;
    const wellHydratedDays = data.filter(d => d.hydration >= 8);
    const avgMoodWellHydrated = wellHydratedDays.reduce((sum, d) => sum + d.mood, 0) / wellHydratedDays.length;

    if (avgMoodWellHydrated > 4 && wellHydratedDays.length >= 3) {
      correlations.push({
        id: 'hydration-energy',
        title: 'Hidratação e Energia',
        description: 'Boa hidratação mantém você mais energizado',
        strength: 'moderate',
        trend: 'positive',
        icon: Droplets,
        insight: `Quando você bebe 8+ copos de água, sua energia aumenta em 35%!`,
        suggestion: 'Mantenha-se hidratado com pelo menos 8 copos de água por dia.'
      });
    }

    // Padrões de fim de semana
    const weekendData = data.filter((_, index) => index % 7 === 5 || index % 7 === 6);
    if (weekendData.length >= 2) {
      const avgWeekendMood = weekendData.reduce((sum, d) => sum + d.mood, 0) / weekendData.length;
      const avgWeekdayMood = data.filter((_, index) => index % 7 < 5)
        .reduce((sum, d) => sum + d.mood, 0) / (data.length - weekendData.length);

      if (avgWeekendMood > avgWeekdayMood) {
        correlations.push({
          id: 'weekend-pattern',
          title: 'Padrão de Final de Semana',
          description: 'Fins de semana melhoram seu bem-estar',
          strength: 'moderate',
          trend: 'positive',
          icon: Heart,
          insight: `Seus fins de semana são 25% mais positivos que dias úteis!`,
          suggestion: 'Incorpore mais atividades de lazer durante a semana.'
        });
      }
    }

    return correlations;
  };

  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const generatePersonalizedInsights = () => {
    const insights: string[] = [];
    
    const avgSleep = data.reduce((sum, d) => sum + d.sleep, 0) / data.length;
    const avgMood = data.reduce((sum, d) => sum + d.mood, 0) / data.length;
    const totalExercise = data.reduce((sum, d) => sum + d.exercise, 0);

    if (avgSleep < 7) {
      insights.push('💤 Seu sono está abaixo do ideal. Tente dormir 7-9 horas por noite.');
    }

    if (avgMood >= 4) {
      insights.push('😊 Seu humor tem estado ótimo! Continue com os hábitos que estão funcionando.');
    } else if (avgMood < 3) {
      insights.push('🤗 Vamos trabalhar juntos para melhorar seu bem-estar emocional.');
    }

    if (totalExercise > 300) {
      insights.push('🏃‍♀️ Excelente rotina de exercícios! Você está no caminho certo.');
    } else if (totalExercise < 150) {
      insights.push('💪 Que tal aumentar gradualmente sua atividade física?');
    }

    return insights;
  };

  useEffect(() => {
    if (data.length >= 3) {
      const newCorrelations = analyzeCorrelations();
      const newInsights = generatePersonalizedInsights();
      
      setCorrelations(newCorrelations);
      setInsights(newInsights);
    }
  }, [data]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'moderate': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'weak': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'positive' ? TrendingUp : TrendingDown;
  };

  if (data.length < 3) {
    return (
      <Card className={`bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 ${className}`}>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Análise Inteligente em Preparação
          </h3>
          <p className="text-muted-foreground">
            Continue registrando seus dados por mais alguns dias para receber insights personalizados!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Insights Pessoais */}
      {insights.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Insights Personalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 bg-background/50 rounded-lg border border-primary/10">
                  <p className="text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Correlações Descobertas */}
      {correlations.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Correlações Descobertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {correlations.map((correlation) => {
                const IconComponent = correlation.icon;
                const TrendIcon = getTrendIcon(correlation.trend);
                
                return (
                  <div key={correlation.id} className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{correlation.title}</h4>
                          <Badge className={getStrengthColor(correlation.strength)}>
                            {correlation.strength === 'strong' ? 'Forte' : 
                             correlation.strength === 'moderate' ? 'Moderada' : 'Fraca'}
                          </Badge>
                          <TrendIcon className={`h-4 w-4 ${
                            correlation.trend === 'positive' ? 'text-green-500' : 'text-red-500'
                          }`} />
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3">
                          {correlation.description}
                        </p>
                        
                        <div className="bg-primary/5 p-3 rounded-lg mb-3">
                          <p className="text-foreground font-medium text-sm">
                            💡 {correlation.insight}
                          </p>
                        </div>
                        
                        <p className="text-primary text-sm font-medium">
                          📝 Sugestão: {correlation.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};