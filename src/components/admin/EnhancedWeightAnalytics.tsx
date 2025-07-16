import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Calendar, Scale, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeightEntry {
  id: string;
  user_id: string;
  peso_kg: number;
  data_medicao: string;
  circunferencia_abdominal_cm?: number;
  gordura_corporal_pct?: number;
  massa_muscular_kg?: number;
  agua_corporal_pct?: number;
  gordura_visceral?: number;
  idade_metabolica?: number;
  massa_ossea_kg?: number;
  taxa_metabolica_basal?: number;
  tipo_corpo?: string;
  origem_medicao: string;
  imc?: number;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  nome_completo_dados: string | null;
}

interface EnhancedWeightAnalyticsProps {
  selectedUser: User;
  weightHistory: WeightEntry[];
}

export const EnhancedWeightAnalytics: React.FC<EnhancedWeightAnalyticsProps> = ({
  selectedUser,
  weightHistory,
}) => {
  // Cálculos de análise
  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null;
    const latest = weightHistory[0].peso_kg;
    const previous = weightHistory[1].peso_kg;
    return latest - previous;
  };

  const getWeightProgress = () => {
    if (weightHistory.length < 2) return 0;
    const first = weightHistory[weightHistory.length - 1].peso_kg;
    const latest = weightHistory[0].peso_kg;
    return ((latest - first) / first) * 100;
  };

  const getAverageWeightLoss = () => {
    if (weightHistory.length < 2) return 0;
    const totalChange = weightHistory[weightHistory.length - 1].peso_kg - weightHistory[0].peso_kg;
    const weeks = Math.ceil(weightHistory.length / 7);
    return totalChange / weeks;
  };

  const getIMCCategory = (imc?: number) => {
    if (!imc) return 'Não calculado';
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const getIMCColor = (imc?: number) => {
    if (!imc) return 'text-netflix-text-muted';
    if (imc < 18.5) return 'text-blue-400';
    if (imc < 25) return 'text-instituto-green';
    if (imc < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBodyComposition = () => {
    const latest = weightHistory[0];
    if (!latest) return null;

    return {
      gordura: latest.gordura_corporal_pct,
      massaMuscular: latest.massa_muscular_kg,
      agua: latest.agua_corporal_pct,
      gorduraVisceral: latest.gordura_visceral,
      massaOssea: latest.massa_ossea_kg,
      metabolismo: latest.taxa_metabolica_basal,
      idadeMetabolica: latest.idade_metabolica
    };
  };

  const trend = getWeightTrend();
  const progress = getWeightProgress();
  const avgWeeklyLoss = getAverageWeightLoss();
  const latest = weightHistory[0];
  const bodyComp = getBodyComposition();

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-netflix-text-muted">Peso Atual</p>
                <p className="text-2xl font-bold text-netflix-text">
                  {latest?.peso_kg}kg
                </p>
              </div>
              <Scale className="h-8 w-8 text-instituto-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-netflix-text-muted">IMC</p>
                <p className={`text-2xl font-bold ${getIMCColor(latest?.imc)}`}>
                  {latest?.imc?.toFixed(1) || '--'}
                </p>
                <p className="text-xs text-netflix-text-muted">
                  {getIMCCategory(latest?.imc)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-instituto-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-netflix-text-muted">Tendência</p>
                <div className="flex items-center gap-1">
                  {trend !== null && (
                    <>
                      {trend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-instituto-green" />
                      )}
                      <p className={`text-lg font-bold ${trend > 0 ? 'text-red-500' : 'text-instituto-green'}`}>
                        {trend > 0 ? '+' : ''}{trend?.toFixed(1)}kg
                      </p>
                    </>
                  )}
                </div>
              </div>
              <Target className="h-8 w-8 text-instituto-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-netflix-text-muted">Registros</p>
                <p className="text-2xl font-bold text-netflix-text">
                  {weightHistory.length}
                </p>
                <p className="text-xs text-netflix-text-muted">
                  Desde {weightHistory.length > 0 ? format(new Date(weightHistory[weightHistory.length - 1].data_medicao), 'MMM/yyyy', { locale: ptBR }) : '--'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-instituto-lilac" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Composição Corporal */}
      {bodyComp && (
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text">Composição Corporal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bodyComp.gordura && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-netflix-text-muted">Gordura Corporal</span>
                    <span className="text-sm font-medium text-netflix-text">{bodyComp.gordura}%</span>
                  </div>
                  <Progress 
                    value={bodyComp.gordura} 
                    max={50} 
                    className="h-2"
                  />
                  <Badge variant="outline" className="text-xs">
                    {bodyComp.gordura < 15 ? 'Baixa' : bodyComp.gordura < 25 ? 'Normal' : 'Alta'}
                  </Badge>
                </div>
              )}

              {bodyComp.massaMuscular && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-netflix-text-muted">Massa Muscular</span>
                    <span className="text-sm font-medium text-netflix-text">{bodyComp.massaMuscular}kg</span>
                  </div>
                  <Progress 
                    value={(bodyComp.massaMuscular / (latest?.peso_kg || 1)) * 100} 
                    max={100} 
                    className="h-2"
                  />
                  <Badge variant="outline" className="text-xs">
                    {((bodyComp.massaMuscular / (latest?.peso_kg || 1)) * 100).toFixed(1)}% do peso
                  </Badge>
                </div>
              )}

              {bodyComp.agua && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-netflix-text-muted">Água Corporal</span>
                    <span className="text-sm font-medium text-netflix-text">{bodyComp.agua}%</span>
                  </div>
                  <Progress 
                    value={bodyComp.agua} 
                    max={100} 
                    className="h-2"
                  />
                  <Badge variant="outline" className="text-xs">
                    {bodyComp.agua > 50 ? 'Adequada' : 'Baixa'}
                  </Badge>
                </div>
              )}

              {bodyComp.gorduraVisceral && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-netflix-text-muted">Gordura Visceral</span>
                    <span className="text-sm font-medium text-netflix-text">{bodyComp.gorduraVisceral}</span>
                  </div>
                  <Progress 
                    value={bodyComp.gorduraVisceral} 
                    max={20} 
                    className="h-2"
                  />
                  <Badge variant="outline" className="text-xs">
                    {bodyComp.gorduraVisceral < 10 ? 'Saudável' : 'Atenção'}
                  </Badge>
                </div>
              )}

              {bodyComp.metabolismo && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-netflix-text-muted">Taxa Metabólica</span>
                    <span className="text-sm font-medium text-netflix-text">{bodyComp.metabolismo} kcal</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Basal por dia
                  </Badge>
                </div>
              )}

              {bodyComp.idadeMetabolica && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-netflix-text-muted">Idade Metabólica</span>
                    <span className="text-sm font-medium text-netflix-text">{bodyComp.idadeMetabolica} anos</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Idade biológica
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análise de Progresso */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text">Análise de Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-netflix-hover rounded-lg">
              <p className="text-sm text-netflix-text-muted mb-2">Progresso Total</p>
              <p className={`text-2xl font-bold ${progress < 0 ? 'text-instituto-green' : 'text-red-500'}`}>
                {progress > 0 ? '+' : ''}{progress.toFixed(1)}%
              </p>
              <p className="text-xs text-netflix-text-muted">
                desde o início
              </p>
            </div>

            <div className="text-center p-4 bg-netflix-hover rounded-lg">
              <p className="text-sm text-netflix-text-muted mb-2">Média Semanal</p>
              <p className={`text-2xl font-bold ${avgWeeklyLoss < 0 ? 'text-instituto-green' : 'text-red-500'}`}>
                {avgWeeklyLoss > 0 ? '+' : ''}{avgWeeklyLoss.toFixed(1)}kg
              </p>
              <p className="text-xs text-netflix-text-muted">
                por semana
              </p>
            </div>

            <div className="text-center p-4 bg-netflix-hover rounded-lg">
              <p className="text-sm text-netflix-text-muted mb-2">Meta Semanal</p>
              <p className="text-2xl font-bold text-instituto-orange">
                -0.5kg
              </p>
              <p className="text-xs text-netflix-text-muted">
                recomendada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};