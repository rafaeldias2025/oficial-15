import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Zap,
  Activity,
  Heart,
  Scale,
  Droplets,
  Flame
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface EvolutionData {
  data: Date;
  peso: number;
  imc: number;
  gorduraCorporal: number;
  massaMuscular: number;
  idadeMetabolica: number;
  taxaMetabolicaBasal: number;
}

interface BlocoUnicoEvolucaoProps {
  dadosEvolucao: EvolutionData[];
  dadosAtuais: {
    peso: number;
    imc: number;
    gorduraCorporal: number;
    massaMuscular: number;
    aguaCorporal: number;
    idadeMetabolica: number;
    idadeCronologica: number;
    taxaMetabolicaBasal: number;
    gorduraVisceral: number;
  };
  metaPeso?: number;
  className?: string;
}

export const BlocoUnicoEvolucao: React.FC<BlocoUnicoEvolucaoProps> = ({
  dadosEvolucao = [],
  dadosAtuais,
  metaPeso,
  className = ''
}) => {
  // Cálculos de tendência e progresso
  const tendencias = React.useMemo(() => {
    if (dadosEvolucao.length < 2) return null;
    
    const primeiro = dadosEvolucao[0];
    const ultimo = dadosEvolucao[dadosEvolucao.length - 1];
    
    return {
      peso: ultimo.peso - primeiro.peso,
      imc: ultimo.imc - primeiro.imc,
      gordura: ultimo.gorduraCorporal - primeiro.gorduraCorporal,
      musculo: ultimo.massaMuscular - primeiro.massaMuscular,
      idadeMetabolica: ultimo.idadeMetabolica - primeiro.idadeMetabolica,
      tmb: ultimo.taxaMetabolicaBasal - primeiro.taxaMetabolicaBasal
    };
  }, [dadosEvolucao]);

  // Score geral de evolução
  const scoreEvolucao = React.useMemo(() => {
    let score = 50; // Base neutra
    
    if (tendencias) {
      // Peso: negativo é bom se acima do ideal
      if (metaPeso && dadosAtuais.peso > metaPeso) {
        score += tendencias.peso < 0 ? 15 : -10;
      } else if (metaPeso && dadosAtuais.peso < metaPeso) {
        score += tendencias.peso > 0 ? 15 : -10;
      }
      
      // Gordura: redução sempre é boa
      score += tendencias.gordura < 0 ? 15 : -5;
      
      // Músculo: aumento sempre é bom
      score += tendencias.musculo > 0 ? 20 : -5;
      
      // Idade metabólica: redução sempre é boa
      score += tendencias.idadeMetabolica < 0 ? 15 : -10;
      
      // TMB: aumento moderado é bom
      score += tendencias.tmb > 0 && tendencias.tmb < 200 ? 10 : 0;
    }
    
    return Math.max(0, Math.min(100, score));
  }, [tendencias, dadosAtuais, metaPeso]);

  // Determinar status da evolução
  const statusEvolucao = React.useMemo(() => {
    if (scoreEvolucao >= 80) {
      return {
        nome: 'Excelente Progresso',
        cor: 'text-green-600',
        background: 'bg-green-50',
        border: 'border-green-200',
        icon: TrendingUp
      };
    } else if (scoreEvolucao >= 60) {
      return {
        nome: 'Bom Progresso',
        cor: 'text-blue-600',
        background: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Target
      };
    } else if (scoreEvolucao >= 40) {
      return {
        nome: 'Progresso Moderado',
        cor: 'text-yellow-600',
        background: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: Activity
      };
    } else {
      return {
        nome: 'Precisa Melhorar',
        cor: 'text-red-600',
        background: 'bg-red-50',
        border: 'border-red-200',
        icon: TrendingDown
      };
    }
  }, [scoreEvolucao]);

  // Dados para gráfico mini (últimos 7 pontos)
  const dadosGraficoMini = React.useMemo(() => {
    return dadosEvolucao
      .slice(-7)
      .map((item, index) => ({
        index,
        peso: item.peso,
        imc: item.imc,
        gordura: item.gorduraCorporal,
        musculo: item.massaMuscular,
        idade: item.idadeMetabolica
      }));
  }, [dadosEvolucao]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header - Status Geral de Evolução */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`${statusEvolucao.background} ${statusEvolucao.border} border-2`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <statusEvolucao.icon className={`w-8 h-8 ${statusEvolucao.cor}`} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Evolução Consolidada</h2>
                  <p className="text-sm text-gray-600">Progresso unificado dos seus dados de saúde</p>
                </div>
              </div>
              <Badge className={`${statusEvolucao.background} ${statusEvolucao.cor} border-current text-lg px-4 py-2`}>
                {scoreEvolucao}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Score Principal */}
              <div className="text-center">
                <div className={`text-3xl font-bold ${statusEvolucao.cor}`}>
                  {scoreEvolucao}
                </div>
                <div className="text-sm text-gray-600">Score Evolução</div>
                <Progress value={scoreEvolucao} className="mt-2 h-2" />
              </div>
              
              {/* Peso */}
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {dadosAtuais.peso.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Peso (kg)</div>
                {tendencias && (
                  <div className={`text-xs flex items-center justify-center gap-1 ${
                    tendencias.peso < 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tendencias.peso < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {tendencias.peso > 0 ? '+' : ''}{tendencias.peso.toFixed(1)}kg
                  </div>
                )}
              </div>
              
              {/* IMC */}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dadosAtuais.imc.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">IMC</div>
                {tendencias && (
                  <div className={`text-xs flex items-center justify-center gap-1 ${
                    Math.abs(dadosAtuais.imc - 22) < Math.abs(dadosAtuais.imc - tendencias.imc - 22) 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tendencias.imc < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {tendencias.imc > 0 ? '+' : ''}{tendencias.imc.toFixed(1)}
                  </div>
                )}
              </div>
              
              {/* Idade Metabólica */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  dadosAtuais.idadeMetabolica <= dadosAtuais.idadeCronologica 
                    ? 'text-green-600' 
                    : 'text-orange-600'
                }`}>
                  {dadosAtuais.idadeMetabolica}
                </div>
                <div className="text-sm text-gray-600">Idade Metab.</div>
                {tendencias && (
                  <div className={`text-xs flex items-center justify-center gap-1 ${
                    tendencias.idadeMetabolica < 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tendencias.idadeMetabolica < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {tendencias.idadeMetabolica > 0 ? '+' : ''}{tendencias.idadeMetabolica.toFixed(1)}
                  </div>
                )}
              </div>
              
              {/* TMB */}
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {dadosAtuais.taxaMetabolicaBasal}
                </div>
                <div className="text-sm text-gray-600">TMB</div>
                {tendencias && (
                  <div className={`text-xs flex items-center justify-center gap-1 ${
                    tendencias.tmb > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tendencias.tmb > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {tendencias.tmb > 0 ? '+' : ''}{tendencias.tmb.toFixed(0)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid de Métricas Principais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Composição Corporal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Composição
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Gordura</span>
                <span className="font-semibold">{dadosAtuais.gorduraCorporal.toFixed(1)}%</span>
              </div>
              <Progress value={dadosAtuais.gorduraCorporal} max={50} className="h-2" />
              {tendencias && (
                <div className={`text-xs ${tendencias.gordura < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tendencias.gordura < 0 ? '↓' : '↑'} {Math.abs(tendencias.gordura).toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Músculo</span>
                <span className="font-semibold">{dadosAtuais.massaMuscular.toFixed(1)}%</span>
              </div>
              <Progress value={dadosAtuais.massaMuscular} max={60} className="h-2" />
              {tendencias && (
                <div className={`text-xs ${tendencias.musculo > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tendencias.musculo > 0 ? '↑' : '↓'} {Math.abs(tendencias.musculo).toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Água</span>
                <span className="font-semibold">{dadosAtuais.aguaCorporal.toFixed(1)}%</span>
              </div>
              <Progress value={dadosAtuais.aguaCorporal} max={80} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Metabolismo */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Metabolismo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {dadosAtuais.idadeMetabolica}
              </div>
              <div className="text-sm text-gray-600">Idade Metab.</div>
              <Badge variant={dadosAtuais.idadeMetabolica <= dadosAtuais.idadeCronologica ? "default" : "destructive"}>
                {dadosAtuais.idadeMetabolica <= dadosAtuais.idadeCronologica ? "Saudável" : "Atenção"}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">
                {dadosAtuais.taxaMetabolicaBasal}
              </div>
              <div className="text-xs text-gray-500">kcal/dia</div>
            </div>
          </CardContent>
        </Card>

        {/* Estado Físico */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-500" />
              Estado Físico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {dadosAtuais.peso.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">kg</div>
              {metaPeso && (
                <div className={`text-xs ${
                  Math.abs(dadosAtuais.peso - metaPeso) < 2 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  Meta: {metaPeso}kg
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">
                {dadosAtuais.imc.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">IMC</div>
              <Badge variant={dadosAtuais.imc >= 18.5 && dadosAtuais.imc <= 24.9 ? "default" : "secondary"}>
                {dadosAtuais.imc < 18.5 ? "Baixo" : dadosAtuais.imc <= 24.9 ? "Normal" : dadosAtuais.imc <= 29.9 ? "Sobrepeso" : "Obesidade"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Saúde Geral */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Saúde Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {dadosAtuais.gorduraVisceral}
              </div>
              <div className="text-sm text-gray-600">Gord. Visceral</div>
              <Badge variant={dadosAtuais.gorduraVisceral <= 10 ? "default" : "destructive"}>
                {dadosAtuais.gorduraVisceral <= 10 ? "Saudável" : "Alto"}
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                scoreEvolucao >= 70 ? 'bg-green-500' : scoreEvolucao >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-600">
                Score: {scoreEvolucao}%
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráfico de Evolução Mini */}
      {dadosGraficoMini.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-instituto-orange" />
                Evolução Recente (7 medições)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosGraficoMini}>
                    <XAxis dataKey="index" hide />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value: any, name: string) => {
                        switch(name) {
                          case 'peso': return [`${value} kg`, 'Peso'];
                          case 'imc': return [`${value}`, 'IMC'];
                          case 'gordura': return [`${value}%`, 'Gordura'];
                          case 'musculo': return [`${value}%`, 'Músculo'];
                          case 'idade': return [`${value} anos`, 'Idade Metab.'];
                          default: return [value, name];
                        }
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="peso" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="imc" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gordura" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="musculo" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="idade" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      dot={{ fill: '#f97316', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Peso</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>IMC</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Gordura</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Músculo</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Idade Metab.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Resumo de Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-instituto-orange" />
              Resumo do Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Conquistas */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Conquistas
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  {scoreEvolucao >= 70 && <p>🎉 Evolução excelente</p>}
                  {tendencias?.peso && tendencias.peso < 0 && <p>📉 Perdeu peso</p>}
                  {tendencias?.gordura && tendencias.gordura < 0 && <p>🔥 Reduziu gordura</p>}
                  {tendencias?.musculo && tendencias.musculo > 0 && <p>💪 Ganhou músculo</p>}
                  {tendencias?.idadeMetabolica && tendencias.idadeMetabolica < 0 && <p>⚡ Metabolismo melhor</p>}
                  {dadosAtuais.idadeMetabolica <= dadosAtuais.idadeCronologica && <p>🧬 Idade metabólica ideal</p>}
                </div>
              </div>

              {/* Próximos Objetivos */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Próximos Objetivos
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  {dadosAtuais.gorduraCorporal > 20 && <p>🎯 Reduzir gordura corporal</p>}
                  {dadosAtuais.massaMuscular < 30 && <p>💪 Aumentar massa muscular</p>}
                  {dadosAtuais.idadeMetabolica > dadosAtuais.idadeCronologica && <p>⚡ Otimizar metabolismo</p>}
                  {dadosAtuais.aguaCorporal < 55 && <p>💧 Melhorar hidratação</p>}
                  {metaPeso && Math.abs(dadosAtuais.peso - metaPeso) > 2 && <p>⚖️ Atingir peso meta</p>}
                </div>
              </div>

              {/* Recomendações */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Recomendações
                </h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <p>📊 Medir semanalmente</p>
                  <p>🏃‍♂️ Exercícios regulares</p>
                  <p>🥗 Alimentação balanceada</p>
                  <p>💧 Hidratação adequada</p>
                  <p>😴 Sono de qualidade</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BlocoUnicoEvolucao;
