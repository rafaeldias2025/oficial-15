import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

interface DadosPontuacao {
  data: string;
  pontos: number;
  categoria: string;
  dataFormatada: string;
}

interface EstatisticasEvolucao {
  mediaUltimos7Dias: number;
  melhorDia: { data: string; pontos: number };
  totalPontos: number;
  diasAtivos: number;
  tendencia: 'subindo' | 'descendo' | 'estavel';
}

export const GraficoEvolucaoMissao = () => {
  const [dadosEvolucao, setDadosEvolucao] = useState<DadosPontuacao[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasEvolucao | null>(null);
  const [periodo, setPeriodo] = useState<7 | 14 | 30>(7);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDadosEvolucao();
    }
  }, [user, periodo]);

  const fetchDadosEvolucao = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const profile = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile.error) throw profile.error;

      const dataInicio = format(subDays(new Date(), periodo), 'yyyy-MM-dd');
      const dataFim = format(new Date(), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .select('data, total_pontos_dia, categoria_dia')
        .eq('user_id', profile.data.id)
        .gte('data', dataInicio)
        .lte('data', dataFim)
        .order('data');

      if (error) throw error;

      const dadosFormatados: DadosPontuacao[] = data?.map(item => ({
        data: item.data,
        pontos: item.total_pontos_dia || 0,
        categoria: item.categoria_dia || 'baixa',
        dataFormatada: format(parseISO(item.data), 'dd/MM', { locale: ptBR })
      })) || [];

      setDadosEvolucao(dadosFormatados);
      calcularEstatisticas(dadosFormatados);
    } catch (error) {
      console.error('Erro ao buscar dados de evolução:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (dados: DadosPontuacao[]) => {
    if (dados.length === 0) {
      setEstatisticas(null);
      return;
    }

    const totalPontos = dados.reduce((sum, item) => sum + item.pontos, 0);
    const diasAtivos = dados.filter(item => item.pontos > 0).length;
    const mediaUltimos7Dias = diasAtivos > 0 ? totalPontos / diasAtivos : 0;

    const melhorDia = dados.reduce((melhor, atual) => 
      atual.pontos > melhor.pontos ? atual : melhor
    );

    // Calcular tendência comparando primeira e segunda metade do período
    const metade = Math.floor(dados.length / 2);
    const primeiraMetade = dados.slice(0, metade);
    const segundaMetade = dados.slice(metade);

    const mediaPrimeira = primeiraMetade.reduce((sum, item) => sum + item.pontos, 0) / primeiraMetade.length;
    const mediaSegunda = segundaMetade.reduce((sum, item) => sum + item.pontos, 0) / segundaMetade.length;

    let tendencia: 'subindo' | 'descendo' | 'estavel' = 'estavel';
    const diferenca = mediaSegunda - mediaPrimeira;
    if (diferenca > 2) tendencia = 'subindo';
    else if (diferenca < -2) tendencia = 'descendo';

    setEstatisticas({
      mediaUltimos7Dias,
      melhorDia: {
        data: format(parseISO(melhorDia.data), "dd 'de' MMMM", { locale: ptBR }),
        pontos: melhorDia.pontos
      },
      totalPontos,
      diasAtivos,
      tendencia
    });
  };

  const getTendenciaIcon = () => {
    if (!estatisticas) return null;
    
    switch (estatisticas.tendencia) {
      case 'subindo':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'descendo':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTendenciaTexto = () => {
    if (!estatisticas) return '';
    
    switch (estatisticas.tendencia) {
      case 'subindo':
        return 'Em crescimento';
      case 'descendo':
        return 'Em queda';
      default:
        return 'Estável';
    }
  };

  const getTendenciaColor = () => {
    if (!estatisticas) return 'bg-gray-100 text-gray-800';
    
    switch (estatisticas.tendencia) {
      case 'subindo':
        return 'bg-green-100 text-green-800';
      case 'descendo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Resumidas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-instituto-orange">
                {estatisticas.totalPontos}
              </div>
              <div className="text-sm text-muted-foreground">Total de Pontos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {estatisticas.diasAtivos}
              </div>
              <div className="text-sm text-muted-foreground">Dias Ativos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {estatisticas.mediaUltimos7Dias.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Média Diária</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {getTendenciaIcon()}
                <Badge className={getTendenciaColor()}>
                  {getTendenciaTexto()}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Tendência</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico de Evolução */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-instituto-orange" />
              Evolução da Pontuação
            </CardTitle>
            <div className="flex gap-2">
              {[7, 14, 30].map((dias) => (
                <button
                  key={dias}
                  onClick={() => setPeriodo(dias as 7 | 14 | 30)}
                  className={`px-3 py-1 rounded text-sm ${
                    periodo === dias
                      ? 'bg-instituto-orange text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dias}d
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dadosEvolucao.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosEvolucao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dataFormatada" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 'dataMax + 5']}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Pontos']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="pontos"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>Nenhum dado encontrado para o período selecionado</p>
                <p className="text-sm">Complete suas missões para ver sua evolução</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Melhor Desempenho */}
      {estatisticas && estatisticas.melhorDia.pontos > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-instituto-dark">Seu melhor dia</h4>
                <p className="text-sm text-muted-foreground">
                  {estatisticas.melhorDia.data}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-instituto-orange">
                  {estatisticas.melhorDia.pontos}
                </div>
                <div className="text-sm text-muted-foreground">pontos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};