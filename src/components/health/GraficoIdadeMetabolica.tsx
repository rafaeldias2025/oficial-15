import React, { useMemo } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Calendar,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface MetabolicAge {
  data: Date;
  idadeMetabolica: number;
  idadeCronologica: number;
  taxaMetabolicaBasal: number;
  peso: number;
  gorduraCorporal: number;
  massaMuscular: number;
}

interface GraficoIdadeMetabolicaProps {
  dados: MetabolicAge[];
  idadeAtualMetabolica: number;
  idadeAtualCronologica: number;
  taxaMetabolicaAtual: number;
  className?: string;
}

export const GraficoIdadeMetabolica: React.FC<GraficoIdadeMetabolicaProps> = ({
  dados = [],
  idadeAtualMetabolica,
  idadeAtualCronologica,
  taxaMetabolicaAtual,
  className = ''
}) => {
  // Dados formatados para o gráfico
  const dadosFormatados = useMemo(() => {
    return dados.map((item, index) => ({
      ...item,
      diferenca: item.idadeMetabolica - item.idadeCronologica,
      dataFormatada: item.data.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short' 
      }),
      index
    }));
  }, [dados]);

  // Cálculos de tendência
  const tendencia = useMemo(() => {
    if (dados.length < 2) return null;
    
    const primeiro = dados[0];
    const ultimo = dados[dados.length - 1];
    
    const diferencaMetabolica = ultimo.idadeMetabolica - primeiro.idadeMetabolica;
    const diferencaTMB = ultimo.taxaMetabolicaBasal - primeiro.taxaMetabolicaBasal;
    
    return {
      metabolica: diferencaMetabolica,
      tmb: diferencaTMB,
      melhorando: diferencaMetabolica < 0
    };
  }, [dados]);

  // Status atual
  const statusAtual = useMemo(() => {
    const diferenca = idadeAtualMetabolica - idadeAtualCronologica;
    
    if (diferenca <= -5) {
      return {
        nivel: 'Excelente',
        cor: 'text-green-600',
        background: 'bg-green-50',
        border: 'border-green-200',
        icon: CheckCircle,
        descricao: 'Seu metabolismo está muito jovem!'
      };
    } else if (diferenca <= 0) {
      return {
        nivel: 'Muito Bom',
        cor: 'text-blue-600',
        background: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Target,
        descricao: 'Metabolismo eficiente'
      };
    } else if (diferenca <= 5) {
      return {
        nivel: 'Atenção',
        cor: 'text-yellow-600',
        background: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: AlertTriangle,
        descricao: 'Há espaço para melhorar'
      };
    } else {
      return {
        nivel: 'Necessita Melhoria',
        cor: 'text-red-600',
        background: 'bg-red-50',
        border: 'border-red-200',
        icon: AlertTriangle,
        descricao: 'Foque em hábitos saudáveis'
      };
    }
  }, [idadeAtualMetabolica, idadeAtualCronologica]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.dataFormatada}</p>
          <div className="space-y-1 text-sm">
            <p className="text-instituto-orange">
              Idade Metabólica: <span className="font-bold">{data.idadeMetabolica} anos</span>
            </p>
            <p className="text-gray-600">
              Idade Cronológica: <span className="font-bold">{data.idadeCronologica} anos</span>
            </p>
            <p className="text-blue-600">
              TMB: <span className="font-bold">{data.taxaMetabolicaBasal} kcal</span>
            </p>
            <p className={`${data.diferenca <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Diferença: <span className="font-bold">
                {data.diferenca > 0 ? '+' : ''}{data.diferenca} anos
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com métricas principais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Status Atual */}
        <Card className={`${statusAtual.background} ${statusAtual.border} border-2`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <statusAtual.icon className={`w-5 h-5 ${statusAtual.cor}`} />
              <Badge className={statusAtual.background}>
                {statusAtual.nivel}
              </Badge>
            </div>
            <div className={`text-2xl font-bold ${statusAtual.cor}`}>
              {idadeAtualMetabolica} anos
            </div>
            <div className="text-sm text-gray-600">
              {statusAtual.descricao}
            </div>
          </CardContent>
        </Card>

        {/* Diferença */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              {idadeAtualMetabolica <= idadeAtualCronologica ? (
                <TrendingDown className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-500" />
              )}
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <div className={`text-2xl font-bold ${
              idadeAtualMetabolica <= idadeAtualCronologica ? 'text-green-500' : 'text-red-500'
            }`}>
              {idadeAtualMetabolica - idadeAtualCronologica > 0 ? '+' : ''}
              {idadeAtualMetabolica - idadeAtualCronologica}
            </div>
            <div className="text-sm text-gray-600">
              vs idade cronológica
            </div>
          </CardContent>
        </Card>

        {/* TMB Atual */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {taxaMetabolicaAtual}
            </div>
            <div className="text-sm text-gray-600">
              kcal/dia (TMB)
            </div>
          </CardContent>
        </Card>

        {/* Tendência */}
        {tendencia && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                {tendencia.melhorando ? (
                  <TrendingDown className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-red-500" />
                )}
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <div className={`text-2xl font-bold ${
                tendencia.melhorando ? 'text-green-500' : 'text-red-500'
              }`}>
                {tendencia.melhorando ? '↓' : '↑'} {Math.abs(tendencia.metabolica).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                {tendencia.melhorando ? 'Melhorando' : 'Piorando'}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolução da Idade Metabólica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-instituto-orange" />
              Evolução da Idade Metabólica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosFormatados}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="dataFormatada" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Linha da idade cronológica (referência) */}
                  <Line
                    type="monotone"
                    dataKey="idadeCronologica"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Idade Cronológica"
                  />
                  
                  {/* Linha da idade metabólica */}
                  <Line
                    type="monotone"
                    dataKey="idadeMetabolica"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                    name="Idade Metabólica"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Idade Metabólica</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-gray-400 border-dashed"></div>
                <span>Idade Cronológica</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Taxa Metabólica Basal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Taxa Metabólica Basal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosFormatados}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="dataFormatada" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    domain={['dataMin - 50', 'dataMax + 50']}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value} kcal`, 'TMB']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="taxaMetabolicaBasal"
                    stroke="#3b82f6"
                    fill="url(#tmbGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="tmbGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso e Metas */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso e Metas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meta de Idade Metabólica */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Meta: Idade Metabólica ≤ Cronológica</h4>
                <Badge variant={idadeAtualMetabolica <= idadeAtualCronologica ? "default" : "secondary"}>
                  {idadeAtualMetabolica <= idadeAtualCronologica ? "Atingida" : "Em progresso"}
                </Badge>
              </div>
              <Progress 
                value={Math.min(100, Math.max(0, ((idadeAtualCronologica - idadeAtualMetabolica + 10) / 10) * 100))} 
                className="h-3"
              />
              <div className="text-sm text-gray-600">
                {idadeAtualMetabolica <= idadeAtualCronologica 
                  ? "Parabéns! Seu metabolismo está otimizado."
                  : `Faltam ${(idadeAtualMetabolica - idadeAtualCronologica).toFixed(1)} anos para atingir a meta.`
                }
              </div>
            </div>

            {/* Eficiência Metabólica */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Eficiência Metabólica</h4>
                <Badge variant="outline">
                  {((taxaMetabolicaAtual / 2000) * 100).toFixed(0)}%
                </Badge>
              </div>
              <Progress 
                value={(taxaMetabolicaAtual / 2500) * 100} 
                className="h-3"
              />
              <div className="text-sm text-gray-600">
                Taxa metabólica atual: {taxaMetabolicaAtual} kcal/dia
              </div>
            </div>
          </div>

          {/* Recomendações */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Recomendações Personalizadas</h4>
            <div className="text-sm text-blue-700 space-y-1">
              {idadeAtualMetabolica > idadeAtualCronologica && (
                <>
                  <p>• Aumente a atividade física para acelerar o metabolismo</p>
                  <p>• Inclua exercícios de força para ganhar massa muscular</p>
                  <p>• Mantenha uma alimentação rica em proteínas</p>
                </>
              )}
              {idadeAtualMetabolica <= idadeAtualCronologica && (
                <>
                  <p>• Continue com seus hábitos saudáveis atuais</p>
                  <p>• Mantenha a regularidade nos exercícios</p>
                  <p>• Monitore periodicamente suas métricas</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraficoIdadeMetabolica;
