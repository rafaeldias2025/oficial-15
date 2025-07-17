import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  Flame,
  Scale,
  BarChart3,
  Info
} from 'lucide-react';

interface PainelVitalidadeProps {
  idadeCronologica: number;
  idadeMetabolica: number;
  taxaMetabolicaBasal: number;
  peso: number;
  imc: number;
  gorduraCorporal: number;
  massaMuscular: number;
  aguaCorporal: number;
  gorduraVisceral: number;
  frequenciaCardiaca?: number;
  pressaoSistolica?: number;
  pressaoDiastolica?: number;
  className?: string;
}

export const PainelVitalidade: React.FC<PainelVitalidadeProps> = ({
  idadeCronologica,
  idadeMetabolica,
  taxaMetabolicaBasal,
  peso,
  imc,
  gorduraCorporal,
  massaMuscular,
  aguaCorporal,
  gorduraVisceral,
  frequenciaCardiaca = 72,
  pressaoSistolica = 120,
  pressaoDiastolica = 80,
  className = ''
}) => {
  // Cálculos de status e saúde
  const diferencaIdades = idadeMetabolica - idadeCronologica;
  const isMetabolicHealthy = diferencaIdades <= 0;
  
  // Score geral de vitalidade (0-100)
  const scoreVitalidade = React.useMemo(() => {
    let score = 100;
    
    // Penalizar idade metabólica alta
    if (diferencaIdades > 0) score -= diferencaIdades * 3;
    
    // Penalizar IMC fora do ideal
    if (imc < 18.5 || imc > 24.9) score -= Math.abs(imc - 22) * 2;
    
    // Penalizar gordura corporal alta
    if (gorduraCorporal > 20) score -= (gorduraCorporal - 20) * 2;
    
    // Bonificar massa muscular
    if (massaMuscular > 30) score += (massaMuscular - 30) * 1.5;
    
    // Penalizar água corporal baixa
    if (aguaCorporal < 50) score -= (50 - aguaCorporal) * 1.5;
    
    // Penalizar gordura visceral alta
    if (gorduraVisceral > 10) score -= (gorduraVisceral - 10) * 3;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [diferencaIdades, imc, gorduraCorporal, massaMuscular, aguaCorporal, gorduraVisceral]);

  // Determinar categoria de vitalidade
  const categoriaVitalidade = React.useMemo(() => {
    if (scoreVitalidade >= 85) {
      return {
        nome: 'Excelente',
        cor: 'text-green-600',
        background: 'bg-green-50',
        border: 'border-green-200',
        icon: Heart,
        descricao: 'Vitalidade excepcional'
      };
    } else if (scoreVitalidade >= 70) {
      return {
        nome: 'Muito Bom',
        cor: 'text-blue-600',
        background: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Activity,
        descricao: 'Boa vitalidade'
      };
    } else if (scoreVitalidade >= 55) {
      return {
        nome: 'Moderado',
        cor: 'text-yellow-600',
        background: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: Target,
        descricao: 'Pode melhorar'
      };
    } else {
      return {
        nome: 'Necessita Atenção',
        cor: 'text-red-600',
        background: 'bg-red-50',
        border: 'border-red-200',
        icon: TrendingDown,
        descricao: 'Foque na saúde'
      };
    }
  }, [scoreVitalidade]);

  // Status da pressão arterial
  const statusPressao = React.useMemo(() => {
    if (pressaoSistolica < 120 && pressaoDiastolica < 80) {
      return { status: 'Normal', cor: 'text-green-600' };
    } else if (pressaoSistolica < 130 && pressaoDiastolica < 85) {
      return { status: 'Limítrofe', cor: 'text-yellow-600' };
    } else {
      return { status: 'Elevada', cor: 'text-red-600' };
    }
  }, [pressaoSistolica, pressaoDiastolica]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header - Score Principal de Vitalidade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className={`${categoriaVitalidade.background} ${categoriaVitalidade.border} border-2 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <categoriaVitalidade.icon className={`w-8 h-8 ${categoriaVitalidade.cor}`} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Painel de Vitalidade</h2>
                  <p className="text-sm text-gray-600">{categoriaVitalidade.descricao}</p>
                </div>
              </div>
              <Badge className={`${categoriaVitalidade.background} ${categoriaVitalidade.cor} border-current`}>
                {categoriaVitalidade.nome}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Score Principal */}
              <div className="text-center">
                <div className={`text-4xl font-bold ${categoriaVitalidade.cor}`}>
                  {scoreVitalidade}
                </div>
                <div className="text-sm text-gray-600">Score Vitalidade</div>
                <Progress value={scoreVitalidade} className="mt-2 h-2" />
              </div>
              
              {/* Idade Metabólica */}
              <div className="text-center">
                <div className={`text-4xl font-bold ${isMetabolicHealthy ? 'text-green-600' : 'text-red-600'}`}>
                  {idadeMetabolica}
                </div>
                <div className="text-sm text-gray-600">Idade Metabólica</div>
                <div className={`text-xs ${isMetabolicHealthy ? 'text-green-600' : 'text-red-600'}`}>
                  {diferencaIdades > 0 ? `+${diferencaIdades}` : diferencaIdades} vs cronológica
                </div>
              </div>
              
              {/* TMB */}
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600">
                  {taxaMetabolicaBasal}
                </div>
                <div className="text-sm text-gray-600">TMB (kcal/dia)</div>
                <div className="text-xs text-orange-600">
                  Taxa metabólica
                </div>
              </div>
              
              {/* Frequência Cardíaca */}
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500">
                  {frequenciaCardiaca}
                </div>
                <div className="text-sm text-gray-600">FC (bpm)</div>
                <div className="text-xs text-red-500">
                  Em repouso
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparação de Idades - Destaque */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-instituto-orange" />
              Comparação de Idades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Idade Cronológica */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-700 mb-2">
                  {idadeCronologica}
                </div>
                <div className="text-sm text-gray-600 mb-2">Idade Cronológica</div>
                <div className="text-xs text-gray-500">
                  Sua idade real em anos
                </div>
              </div>
              
              {/* Idade Metabólica */}
              <div className={`text-center p-4 rounded-lg ${
                isMetabolicHealthy ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${
                  isMetabolicHealthy ? 'text-green-600' : 'text-red-600'
                }`}>
                  {idadeMetabolica}
                </div>
                <div className="text-sm text-gray-600 mb-2">Idade Metabólica</div>
                <div className={`text-xs flex items-center justify-center gap-1 ${
                  isMetabolicHealthy ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isMetabolicHealthy ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  {isMetabolicHealthy ? 'Metabolismo eficiente' : 'Pode melhorar'}
                </div>
              </div>
            </div>
            
            {/* Insight */}
            <div className={`mt-4 p-3 rounded-lg ${
              isMetabolicHealthy ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
              <div className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4" />
                {isMetabolicHealthy ? (
                  'Parabéns! Seu metabolismo está funcionando como o de uma pessoa mais jovem.'
                ) : (
                  `Seu metabolismo está funcionando como o de alguém ${diferencaIdades} anos mais velho. Foque em exercícios e alimentação saudável.`
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Indicadores Vitais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Composição Corporal */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <Badge variant="outline">Composição</Badge>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Gordura</span>
                  <span>{gorduraCorporal.toFixed(1)}%</span>
                </div>
                <Progress value={gorduraCorporal} max={50} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Músculo</span>
                  <span>{massaMuscular.toFixed(1)}%</span>
                </div>
                <Progress value={massaMuscular} max={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Água</span>
                  <span>{aguaCorporal.toFixed(1)}%</span>
                </div>
                <Progress value={aguaCorporal} max={80} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IMC e Peso */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Scale className="w-5 h-5 text-purple-500" />
              <Badge variant="outline">Físico</Badge>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {imc.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">IMC</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-700">
                  {peso.toFixed(1)}kg
                </div>
                <div className="text-xs text-gray-500">Peso atual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saúde Cardiovascular */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Heart className="w-5 h-5 text-red-500" />
              <Badge variant="outline">Cardio</Badge>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {frequenciaCardiaca}
                </div>
                <div className="text-sm text-gray-600">bpm</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${statusPressao.cor}`}>
                  {pressaoSistolica}/{pressaoDiastolica}
                </div>
                <div className="text-xs text-gray-500">Pressão arterial</div>
                <Badge variant="outline" className={`text-xs ${statusPressao.cor}`}>
                  {statusPressao.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metabolismo */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <Badge variant="outline">Metabolismo</Badge>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-500">
                  {taxaMetabolicaBasal}
                </div>
                <div className="text-sm text-gray-600">kcal/dia</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-700">
                  Gordura Visceral: {gorduraVisceral}
                </div>
                <Badge variant={gorduraVisceral <= 10 ? "default" : "destructive"} className="text-xs">
                  {gorduraVisceral <= 10 ? "Saudável" : "Atenção"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights e Recomendações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-instituto-orange" />
              Insights Personalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pontos Fortes */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">✅ Pontos Fortes</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  {isMetabolicHealthy && <li>• Metabolismo eficiente</li>}
                  {massaMuscular > 30 && <li>• Boa massa muscular</li>}
                  {aguaCorporal > 55 && <li>• Hidratação adequada</li>}
                  {imc >= 18.5 && imc <= 24.9 && <li>• IMC ideal</li>}
                  {gorduraVisceral <= 10 && <li>• Gordura visceral saudável</li>}
                  {frequenciaCardiaca >= 60 && frequenciaCardiaca <= 80 && <li>• FC em repouso normal</li>}
                </ul>
                {![isMetabolicHealthy, massaMuscular > 30, aguaCorporal > 55, imc >= 18.5 && imc <= 24.9, gorduraVisceral <= 10].some(Boolean) && (
                  <p className="text-sm text-green-700">Continue trabalhando para alcançar seus objetivos!</p>
                )}
              </div>

              {/* Áreas de Melhoria */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-3">🎯 Áreas de Melhoria</h4>
                <ul className="space-y-1 text-sm text-orange-700">
                  {!isMetabolicHealthy && <li>• Otimizar metabolismo com exercícios</li>}
                  {gorduraCorporal > 20 && <li>• Reduzir gordura corporal</li>}
                  {massaMuscular < 25 && <li>• Aumentar massa muscular</li>}
                  {aguaCorporal < 50 && <li>• Melhorar hidratação</li>}
                  {gorduraVisceral > 10 && <li>• Reduzir gordura visceral</li>}
                  {(imc < 18.5 || imc > 24.9) && <li>• Ajustar peso para IMC ideal</li>}
                </ul>
              </div>
            </div>

            {/* Ações Recomendadas */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">🚀 Próximas Ações</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <Button variant="outline" size="sm" className="h-auto p-3 text-left">
                  <div>
                    <div className="font-semibold">Exercício Semanal</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Manter atividade física regular
                    </div>
                  </div>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-3 text-left">
                  <div>
                    <div className="font-semibold">Nutrição Balanceada</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Proteínas e hidratação adequada
                    </div>
                  </div>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-3 text-left">
                  <div>
                    <div className="font-semibold">Monitoramento</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Acompanhar métricas semanalmente
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PainelVitalidade;
