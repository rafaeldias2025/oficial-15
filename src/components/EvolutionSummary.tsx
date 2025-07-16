import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale,
  Activity,
  Target,
  Calendar
} from 'lucide-react';
import { useProgressData } from '@/hooks/useProgressData';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const EvolutionSummary = () => {
  const { pesagens, dadosFisicos } = useProgressData();

  if (!pesagens.length || pesagens.length < 2) {
    return (
      <Card className="bg-gradient-to-br from-instituto-orange/10 to-instituto-purple/10 border-instituto-orange/20">
        <CardContent className="p-8 text-center">
          <Scale className="h-16 w-16 text-instituto-orange mx-auto mb-4 opacity-70" />
          <h3 className="text-xl font-semibold text-netflix-text mb-2">
            Dados Insuficientes
          </h3>
          <p className="text-netflix-text-muted">
            Registre pelo menos 2 pesagens para ver sua evolução
          </p>
        </CardContent>
      </Card>
    );
  }

  const ultimaPesagem = pesagens[0];
  const primeiraPesagem = pesagens[pesagens.length - 1];
  const diasMonitoramento = differenceInDays(new Date(ultimaPesagem.data_medicao), new Date(primeiraPesagem.data_medicao));

  // Calcular evoluções
  const evolucaoPeso = ultimaPesagem.peso_kg - primeiraPesagem.peso_kg;
  const evolucaoIMC = (ultimaPesagem.imc || 0) - (primeiraPesagem.imc || 0);
  const evolucaoCircunferencia = (ultimaPesagem.circunferencia_abdominal_cm || 0) - (primeiraPesagem.circunferencia_abdominal_cm || 0);

  // Calcular porcentagens
  const porcentagemPeso = ((evolucaoPeso / primeiraPesagem.peso_kg) * 100);
  const porcentagemIMC = ((evolucaoIMC / (primeiraPesagem.imc || 1)) * 100);
  const porcentagemCircunferencia = ((evolucaoCircunferencia / (primeiraPesagem.circunferencia_abdominal_cm || 1)) * 100);

  const getVariationColor = (value: number) => {
    if (value < 0) return 'text-green-500';
    if (value > 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getVariationIcon = (value: number) => {
    if (value < 0) return TrendingDown;
    if (value > 0) return TrendingUp;
    return () => <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  const formatValue = (value: number, unit: string) => {
    const formatted = Math.abs(value).toFixed(1);
    const sign = value < 0 ? '-' : value > 0 ? '+' : '';
    return `${sign}${formatted}${unit}`;
  };

  return (
    <div className="space-y-6">
      {/* Header com informações do período */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-instituto-orange" />
          <span className="text-lg font-semibold text-netflix-text">
            Evolução em {diasMonitoramento} dias
          </span>
        </div>
        <p className="text-sm text-netflix-text-muted">
          De {format(new Date(primeiraPesagem.data_medicao), 'dd/MM/yyyy', { locale: ptBR })} até {format(new Date(ultimaPesagem.data_medicao), 'dd/MM/yyyy', { locale: ptBR })}
        </p>
      </div>

      {/* Cards de Evolução */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Evolução do Peso */}
        <Card className="bg-netflix-card border-netflix-border hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-netflix-text">
              <Scale className="h-5 w-5 text-instituto-orange" />
              Peso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {React.createElement(getVariationIcon(evolucaoPeso), { 
                  className: `h-6 w-6 ${getVariationColor(evolucaoPeso)}` 
                })}
                <span className={`text-3xl font-bold ${getVariationColor(evolucaoPeso)}`}>
                  {formatValue(evolucaoPeso, 'kg')}
                </span>
              </div>
              <Badge variant={evolucaoPeso <= 0 ? 'default' : 'destructive'} className="text-xs">
                {Math.abs(porcentagemPeso).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-netflix-text-muted">
                {primeiraPesagem.peso_kg}kg → {ultimaPesagem.peso_kg}kg
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Evolução do IMC */}
        <Card className="bg-netflix-card border-netflix-border hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-netflix-text">
              <Activity className="h-5 w-5 text-instituto-orange" />
              IMC
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {React.createElement(getVariationIcon(evolucaoIMC), { 
                  className: `h-6 w-6 ${getVariationColor(evolucaoIMC)}` 
                })}
                <span className={`text-3xl font-bold ${getVariationColor(evolucaoIMC)}`}>
                  {formatValue(evolucaoIMC, '')}
                </span>
              </div>
              <Badge variant={evolucaoIMC <= 0 ? 'default' : 'destructive'} className="text-xs">
                {Math.abs(porcentagemIMC).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-netflix-text-muted">
                {(primeiraPesagem.imc || 0).toFixed(1)} → {(ultimaPesagem.imc || 0).toFixed(1)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Evolução da Circunferência */}
        <Card className="bg-netflix-card border-netflix-border hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-netflix-text">
              <Target className="h-5 w-5 text-instituto-orange" />
              Circunferência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {React.createElement(getVariationIcon(evolucaoCircunferencia), { 
                  className: `h-6 w-6 ${getVariationColor(evolucaoCircunferencia)}` 
                })}
                <span className={`text-3xl font-bold ${getVariationColor(evolucaoCircunferencia)}`}>
                  {formatValue(evolucaoCircunferencia, 'cm')}
                </span>
              </div>
              <Badge variant={evolucaoCircunferencia <= 0 ? 'default' : 'destructive'} className="text-xs">
                {Math.abs(porcentagemCircunferencia).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-netflix-text-muted">
                {primeiraPesagem.circunferencia_abdominal_cm || 0}cm → {ultimaPesagem.circunferencia_abdominal_cm || 0}cm
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensagem motivacional */}
      <Card className="bg-gradient-to-r from-instituto-orange/10 to-instituto-purple/10 border-instituto-orange/20">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-semibold text-netflix-text">
              {evolucaoPeso <= 0 ? 'Parabéns! Você está no caminho certo!' : 'Continue focada na sua jornada!'}
            </h3>
          </div>
          <p className="text-netflix-text-muted">
            {evolucaoPeso <= 0 
              ? `Você perdeu ${Math.abs(evolucaoPeso).toFixed(1)}kg em ${diasMonitoramento} dias. Continue assim!`
              : `Lembre-se: cada dia é uma nova oportunidade para alcançar suas metas.`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};