import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeightEntry {
  id: string;
  peso_kg: number;
  data_medicao: string;
  imc?: number;
  gordura_corporal_pct?: number;
  massa_muscular_kg?: number;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  nome_completo_dados: string | null;
}

interface WeightSummaryCardsProps {
  selectedUser: User;
  weightHistory: WeightEntry[];
}

export const WeightSummaryCards: React.FC<WeightSummaryCardsProps> = ({
  selectedUser,
  weightHistory
}) => {
  const getLatestWeight = () => {
    return weightHistory.length > 0 ? weightHistory[0] : null;
  };

  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null;
    const latest = weightHistory[0].peso_kg;
    const previous = weightHistory[1].peso_kg;
    return latest - previous;
  };

  const getIMCCategory = (imc?: number) => {
    if (!imc) return null;
    if (imc < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-500' };
    if (imc < 25) return { label: 'Peso normal', color: 'text-green-500' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-yellow-500' };
    return { label: 'Obesidade', color: 'text-red-500' };
  };

  const getAverageWeight = () => {
    if (weightHistory.length === 0) return null;
    const sum = weightHistory.reduce((acc, entry) => acc + entry.peso_kg, 0);
    return sum / weightHistory.length;
  };

  const latestWeight = getLatestWeight();
  const weightTrend = getWeightTrend();
  const imcCategory = getIMCCategory(latestWeight?.imc);
  const averageWeight = getAverageWeight();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Peso Atual */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-netflix-text-muted text-sm font-medium">
                Peso Atual
              </p>
              <p className="text-2xl font-bold text-netflix-text">
                {latestWeight ? `${latestWeight.peso_kg}kg` : 'N/A'}
              </p>
              {latestWeight && (
                <p className="text-xs text-netflix-text-muted">
                  {format(new Date(latestWeight.data_medicao), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              )}
            </div>
            <div className="p-3 rounded-lg bg-instituto-orange/10">
              <Scale className="h-6 w-6 text-instituto-orange" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendência de Peso */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-netflix-text-muted text-sm font-medium">
                Tendência
              </p>
              <p className={`text-2xl font-bold flex items-center gap-1 ${
                weightTrend === null ? 'text-netflix-text-muted' : 
                weightTrend > 0 ? 'text-red-500' : 
                weightTrend < 0 ? 'text-green-500' : 'text-netflix-text'
              }`}>
                {weightTrend === null ? 'N/A' : 
                 weightTrend > 0 ? '+' : ''}
                {weightTrend !== null && `${weightTrend.toFixed(1)}kg`}
              </p>
              <p className="text-xs text-netflix-text-muted">
                vs. pesagem anterior
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              weightTrend === null ? 'bg-gray-500/10' : 
              weightTrend > 0 ? 'bg-red-500/10' : 
              weightTrend < 0 ? 'bg-green-500/10' : 'bg-gray-500/10'
            }`}>
              {weightTrend === null ? <Scale className="h-6 w-6 text-netflix-text-muted" /> :
               weightTrend > 0 ? <TrendingUp className="h-6 w-6 text-red-500" /> :
               weightTrend < 0 ? <TrendingDown className="h-6 w-6 text-green-500" /> :
               <Scale className="h-6 w-6 text-netflix-text" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IMC */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-netflix-text-muted text-sm font-medium">
                IMC
              </p>
              <p className="text-2xl font-bold text-netflix-text">
                {latestWeight?.imc ? latestWeight.imc.toFixed(1) : 'N/A'}
              </p>
              {imcCategory && (
                <p className={`text-xs font-medium ${imcCategory.color}`}>
                  {imcCategory.label}
                </p>
              )}
            </div>
            <div className="p-3 rounded-lg bg-instituto-purple/10">
              <Target className="h-6 w-6 text-instituto-purple" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total de Pesagens */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-netflix-text-muted text-sm font-medium">
                Total de Pesagens
              </p>
              <p className="text-2xl font-bold text-netflix-text">
                {weightHistory.length}
              </p>
              {averageWeight && (
                <p className="text-xs text-netflix-text-muted">
                  Média: {averageWeight.toFixed(1)}kg
                </p>
              )}
            </div>
            <div className="p-3 rounded-lg bg-instituto-green/10">
              <Calendar className="h-6 w-6 text-instituto-green" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};