import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PontuacaoDiaria } from '@/hooks/usePontuacaoDiaria';

interface EvolucaoSemanalPontuacaoProps {
  dados: PontuacaoDiaria[];
  isLoading?: boolean;
}

export const EvolucaoSemanalPontuacao: React.FC<EvolucaoSemanalPontuacaoProps> = ({
  dados,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-instituto-orange" />
            Evolução Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dadosFormatados = dados.map(item => ({
    data: format(parseISO(item.data), 'dd/MM', { locale: ptBR }),
    pontos: item.total_pontos_dia,
    categoria: item.categoria_dia,
    dataCompleta: format(parseISO(item.data), 'EEEE, dd/MM/yyyy', { locale: ptBR }),
  }));

  const mediaSemanal = dados.length > 0 
    ? Math.round(dados.reduce((sum, item) => sum + item.total_pontos_dia, 0) / dados.length)
    : 0;

  const melhorDia = dados.reduce((melhor, atual) => 
    atual.total_pontos_dia > melhor.total_pontos_dia ? atual : melhor
  , dados[0] || { total_pontos_dia: 0, data: '' });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-instituto-border rounded-lg shadow-lg">
          <p className="font-medium text-instituto-dark">{data.dataCompleta}</p>
          <p className="text-instituto-orange font-bold">{payload[0].value} pontos</p>
          <p className="text-sm text-instituto-dark/60 capitalize">{data.categoria}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-instituto-orange" />
          Evolução Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Estatísticas resumidas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-instituto-orange/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-instituto-orange" />
                <span className="text-sm font-medium text-instituto-dark">Média Semanal</span>
              </div>
              <div className="text-2xl font-bold text-instituto-orange">{mediaSemanal}</div>
            </div>
            <div className="bg-instituto-gold/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-instituto-gold" />
                <span className="text-sm font-medium text-instituto-dark">Melhor Dia</span>
              </div>
              <div className="text-2xl font-bold text-instituto-gold">{melhorDia.total_pontos_dia}</div>
              <div className="text-xs text-instituto-dark/60">
                {melhorDia.data ? format(parseISO(melhorDia.data), 'dd/MM', { locale: ptBR }) : '--'}
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="h-64">
            {dadosFormatados.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosFormatados}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="data" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    domain={[0, 'dataMax + 5']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Linhas de referência */}
                  <ReferenceLine 
                    y={21} 
                    stroke="#10b981" 
                    strokeDasharray="5 5" 
                    label="Excelente"
                  />
                  <ReferenceLine 
                    y={11} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5" 
                    label="Bom"
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="pontos"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#f97316' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-instituto-dark/60">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-instituto-dark/40" />
                  <p>Nenhum dado disponível</p>
                  <p className="text-sm">Complete sua primeira missão para ver o gráfico!</p>
                </div>
              </div>
            )}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-center gap-6 text-sm text-instituto-dark/60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Excelente (21+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Bom (11-20)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Precisa Melhorar (0-10)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvolucaoSemanalPontuacao;