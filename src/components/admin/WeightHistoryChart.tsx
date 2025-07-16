import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeightEntry {
  id: string;
  peso_kg: number;
  data_medicao: string;
  imc?: number;
  gordura_corporal_pct?: number;
  massa_muscular_kg?: number;
  agua_corporal_pct?: number;
}

interface WeightHistoryChartProps {
  weightHistory: WeightEntry[];
  userName: string;
}

export const WeightHistoryChart: React.FC<WeightHistoryChartProps> = ({
  weightHistory,
  userName
}) => {
  // Preparar dados para os gráficos (ordenar por data crescente)
  const chartData = weightHistory
    .slice()
    .reverse()
    .map((entry, index) => ({
      index: index + 1,
      data: format(new Date(entry.data_medicao), 'dd/MM', { locale: ptBR }),
      peso: entry.peso_kg,
      imc: entry.imc,
      gordura: entry.gordura_corporal_pct,
      musculo: entry.massa_muscular_kg,
      agua: entry.agua_corporal_pct,
      dataCompleta: format(new Date(entry.data_medicao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    }));

  // Dados para gráfico de composição corporal
  const compositionData = weightHistory
    .slice(0, 10)
    .reverse()
    .filter(entry => entry.gordura_corporal_pct || entry.massa_muscular_kg || entry.agua_corporal_pct)
    .map((entry, index) => ({
      data: format(new Date(entry.data_medicao), 'dd/MM', { locale: ptBR }),
      gordura: entry.gordura_corporal_pct || 0,
      musculo: entry.massa_muscular_kg || 0,
      agua: entry.agua_corporal_pct || 0,
      dataCompleta: format(new Date(entry.data_medicao), 'dd/MM/yyyy', { locale: ptBR })
    }));

  if (weightHistory.length === 0) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text">Gráficos de Evolução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-netflix-text-muted">
              Dados insuficientes para gerar gráficos. 
              Registre pelo menos 2 pesagens.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de Peso e IMC */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text">
            Evolução do Peso e IMC - {userName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="data" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="peso"
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="imc"
                  orientation="right"
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: 'IMC', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F1F1F',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.dataCompleta;
                    }
                    return label;
                  }}
                  formatter={(value, name) => {
                    if (name === 'peso') return [`${value}kg`, 'Peso'];
                    if (name === 'imc') return [value ? `${value}` : 'N/A', 'IMC'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="peso"
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#F97316" 
                  strokeWidth={3}
                  dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                  name="Peso (kg)"
                />
                {chartData.some(d => d.imc) && (
                  <Line 
                    yAxisId="imc"
                    type="monotone" 
                    dataKey="imc" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                    name="IMC"
                    strokeDasharray="5 5"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Composição Corporal */}
      {compositionData.length > 0 && (
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text">
              Composição Corporal - {userName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compositionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="data" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{ value: 'Percentual / Kg', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F1F1F',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.dataCompleta;
                      }
                      return label;
                    }}
                    formatter={(value, name) => {
                      if (name === 'gordura') return [`${value}%`, 'Gordura Corporal'];
                      if (name === 'musculo') return [`${value}kg`, 'Massa Muscular'];
                      if (name === 'agua') return [`${value}%`, 'Água Corporal'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  {compositionData.some(d => d.gordura > 0) && (
                    <Bar 
                      dataKey="gordura" 
                      fill="#EF4444" 
                      name="Gordura (%)"
                      radius={[2, 2, 0, 0]}
                    />
                  )}
                  {compositionData.some(d => d.musculo > 0) && (
                    <Bar 
                      dataKey="musculo" 
                      fill="#10B981" 
                      name="Músculo (kg)"
                      radius={[2, 2, 0, 0]}
                    />
                  )}
                  {compositionData.some(d => d.agua > 0) && (
                    <Bar 
                      dataKey="agua" 
                      fill="#3B82F6" 
                      name="Água (%)"
                      radius={[2, 2, 0, 0]}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Resumidas */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text">Estatísticas do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-netflix-hover rounded-lg">
              <p className="text-netflix-text-muted text-sm">Peso Máximo</p>
              <p className="text-xl font-bold text-netflix-text">
                {Math.max(...weightHistory.map(w => w.peso_kg)).toFixed(1)}kg
              </p>
            </div>
            <div className="text-center p-4 bg-netflix-hover rounded-lg">
              <p className="text-netflix-text-muted text-sm">Peso Mínimo</p>
              <p className="text-xl font-bold text-netflix-text">
                {Math.min(...weightHistory.map(w => w.peso_kg)).toFixed(1)}kg
              </p>
            </div>
            <div className="text-center p-4 bg-netflix-hover rounded-lg">
              <p className="text-netflix-text-muted text-sm">Variação Total</p>
              <p className="text-xl font-bold text-netflix-text">
                {(Math.max(...weightHistory.map(w => w.peso_kg)) - 
                  Math.min(...weightHistory.map(w => w.peso_kg))).toFixed(1)}kg
              </p>
            </div>
            <div className="text-center p-4 bg-netflix-hover rounded-lg">
              <p className="text-netflix-text-muted text-sm">Peso Médio</p>
              <p className="text-xl font-bold text-netflix-text">
                {(weightHistory.reduce((acc, w) => acc + w.peso_kg, 0) / weightHistory.length).toFixed(1)}kg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};