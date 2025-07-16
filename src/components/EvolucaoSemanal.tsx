import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DadosEvolucao {
  data: string;
  peso: number;
  imc: number;
  circunferencia?: number;
  dataFormatada?: string;
}

interface EvolucaoSemanalProps {
  dados: DadosEvolucao[];
  isLoading?: boolean;
  metaPeso?: number;
  altura: number;
}

export const EvolucaoSemanal: React.FC<EvolucaoSemanalProps> = ({
  dados,
  isLoading = false,
  metaPeso,
  altura
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

  // Formatar dados para o gráfico
  const dadosFormatados = dados.map(item => ({
    ...item,
    dataFormatada: format(parseISO(item.data), 'dd/MM', { locale: ptBR }),
    dataCompleta: format(parseISO(item.data), 'EEEE, dd/MM/yyyy', { locale: ptBR }),
  })).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  // Calcular estatísticas
  const estatisticas = {
    pesoAtual: dadosFormatados[dadosFormatados.length - 1]?.peso || 0,
    pesoAnterior: dadosFormatados[dadosFormatados.length - 2]?.peso || 0,
    imcAtual: dadosFormatados[dadosFormatados.length - 1]?.imc || 0,
    imcAnterior: dadosFormatados[dadosFormatados.length - 2]?.imc || 0,
    menorPeso: Math.min(...dadosFormatados.map(d => d.peso)),
    maiorPeso: Math.max(...dadosFormatados.map(d => d.peso)),
  };

  const progressoPeso = estatisticas.pesoAtual - estatisticas.pesoAnterior;
  const progressoImc = estatisticas.imcAtual - estatisticas.imcAnterior;

  const getIconeProgresso = (valor: number) => {
    if (Math.abs(valor) < 0.1) return { icone: Minus, cor: 'text-gray-500', texto: 'Estável' };
    return valor > 0 
      ? { icone: TrendingUp, cor: 'text-red-500', texto: `+${valor.toFixed(1)}` }
      : { icone: TrendingDown, cor: 'text-green-500', texto: `${valor.toFixed(1)}` };
  };

  const progressoPesoIcon = getIconeProgresso(progressoPeso);
  const progressoImcIcon = getIconeProgresso(progressoImc);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-instituto-border rounded-lg shadow-lg">
          <p className="font-medium text-instituto-dark">{data.dataCompleta}</p>
          <div className="space-y-1 text-sm">
            <p className="text-instituto-orange">Peso: {payload[0].value}kg</p>
            <p className="text-instituto-purple">IMC: {payload[1]?.value}</p>
            {payload[2] && (
              <p className="text-instituto-gold">Cintura: {payload[2].value}cm</p>
            )}
          </div>
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-instituto-dark">Peso Atual</span>
                <div className="flex items-center gap-1">
                  <progressoPesoIcon.icone className={`w-4 h-4 ${progressoPesoIcon.cor}`} />
                  <span className={`text-sm ${progressoPesoIcon.cor}`}>
                    {progressoPesoIcon.texto}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-instituto-orange">
                {estatisticas.pesoAtual.toFixed(1)}kg
              </div>
              <div className="text-xs text-instituto-dark/60">
                Anterior: {estatisticas.pesoAnterior.toFixed(1)}kg
              </div>
            </div>
            
            <div className="bg-instituto-purple/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-instituto-dark">IMC Atual</span>
                <div className="flex items-center gap-1">
                  <progressoImcIcon.icone className={`w-4 h-4 ${progressoImcIcon.cor}`} />
                  <span className={`text-sm ${progressoImcIcon.cor}`}>
                    {progressoImcIcon.texto}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-instituto-purple">
                {estatisticas.imcAtual.toFixed(1)}
              </div>
              <div className="text-xs text-instituto-dark/60">
                Anterior: {estatisticas.imcAnterior.toFixed(1)}
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
                    dataKey="dataFormatada" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Linha de referência para meta de peso */}
                  {metaPeso && (
                    <ReferenceLine 
                      y={metaPeso} 
                      stroke="#10b981" 
                      strokeDasharray="5 5" 
                      label="Meta"
                    />
                  )}
                  
                  {/* Linha de peso */}
                  <Line
                    type="monotone"
                    dataKey="peso"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#f97316' }}
                  />
                  
                  {/* Linha de IMC */}
                  <Line
                    type="monotone"
                    dataKey="imc"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#8b5cf6' }}
                  />
                  
                  {/* Linha de circunferência (se disponível) */}
                  {dadosFormatados.some(d => d.circunferencia) && (
                    <Line
                      type="monotone"
                      dataKey="circunferencia"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, fill: '#f59e0b' }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-instituto-dark/60">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-instituto-dark/40" />
                  <p>Nenhum dado disponível</p>
                  <p className="text-sm">Faça sua primeira pesagem para ver o gráfico!</p>
                </div>
              </div>
            )}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-center gap-6 text-sm text-instituto-dark/60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-instituto-orange rounded-full"></div>
              <span>Peso (kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-instituto-purple rounded-full"></div>
              <span>IMC</span>
            </div>
            {dadosFormatados.some(d => d.circunferencia) && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-instituto-gold rounded-full"></div>
                <span>Cintura (cm)</span>
              </div>
            )}
            {metaPeso && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500 border-dashed border-green-500"></div>
                <span>Meta</span>
              </div>
            )}
          </div>

          {/* Dados da semana passada */}
          {dadosFormatados.length > 1 && (
            <div className="bg-instituto-dark/5 p-4 rounded-lg">
              <h4 className="font-medium text-instituto-dark mb-2">📍 Comparação com medição anterior</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-instituto-dark/60">Semana passada:</span>
                  <span className="ml-2 font-medium">
                    {estatisticas.pesoAnterior.toFixed(1)}kg
                  </span>
                </div>
                <div>
                  <span className="text-instituto-dark/60">Variação:</span>
                  <span className={`ml-2 font-medium ${progressoPesoIcon.cor}`}>
                    {progressoPesoIcon.texto}kg
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvolucaoSemanal;