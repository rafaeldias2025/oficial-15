import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetalhePontuacaoItem {
  categoria: string;
  pergunta: string;
  pontos: number;
  pontosMaximos: number;
  respondida: boolean;
}

interface DetalhePontuacaoMissaoProps {
  detalhes: DetalhePontuacaoItem[];
  totalPontos: number;
  totalMaximo: number;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export const DetalhePontuacaoMissao: React.FC<DetalhePontuacaoMissaoProps> = ({
  detalhes,
  totalPontos,
  totalMaximo,
  isVisible = true,
  onToggleVisibility,
}) => {
  const percentualProgresso = Math.round((totalPontos / totalMaximo) * 100);
  
  const getCorPontos = (pontos: number) => {
    if (pontos > 0) return 'text-green-600';
    if (pontos < 0) return 'text-red-600';
    return 'text-instituto-dark/60';
  };

  const getBadgeCategoria = (categoria: string) => {
    const cores = {
      'Ritual da Manhã': 'bg-blue-100 text-blue-800',
      'Hábitos do Dia': 'bg-green-100 text-green-800',
      'Mente & Emoções': 'bg-purple-100 text-purple-800',
    };
    return cores[categoria as keyof typeof cores] || 'bg-gray-100 text-gray-800';
  };

  if (!isVisible) {
    return (
      <Card className="bg-instituto-orange/5 border-instituto-orange/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-instituto-orange" />
              <div>
                <h3 className="font-semibold text-instituto-dark">
                  {totalPontos} pontos
                </h3>
                <p className="text-sm text-instituto-dark/60">
                  {Math.round((totalPontos / totalMaximo) * 100)}% do total
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVisibility}
              className="text-instituto-orange hover:bg-instituto-orange/10"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-instituto-orange/5 border-instituto-orange/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-instituto-orange" />
            Pontuação em Tempo Real
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="text-instituto-orange hover:bg-instituto-orange/10"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-instituto-dark/70">Progresso Total</span>
            <span className="font-medium">{totalPontos}/{totalMaximo} pontos</span>
          </div>
          <Progress value={percentualProgresso} className="h-2" />
          <div className="text-center">
            <Badge variant="secondary" className="bg-instituto-orange/10 text-instituto-orange">
              {percentualProgresso}% completo
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {detalhes.map((item, index) => (
          <div
            key={index}
            className={`
              p-3 rounded-lg border transition-all duration-200
              ${item.respondida 
                ? 'bg-white border-instituto-border' 
                : 'bg-instituto-dark/5 border-instituto-dark/10'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge 
                variant="secondary" 
                className={`text-xs ${getBadgeCategoria(item.categoria)}`}
              >
                {item.categoria}
              </Badge>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${getCorPontos(item.pontos)}`}>
                  {item.pontos > 0 ? '+' : ''}{item.pontos}
                </span>
                <span className="text-xs text-instituto-dark/40">
                  /{item.pontosMaximos}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-instituto-dark/80 mb-2">
              {item.pergunta}
            </p>
            
            <div className="w-full bg-instituto-dark/10 rounded-full h-1">
              <div 
                className={`
                  h-1 rounded-full transition-all duration-300
                  ${item.pontos > 0 ? 'bg-green-500' : 
                    item.pontos < 0 ? 'bg-red-500' : 'bg-gray-300'}
                `}
                style={{ 
                  width: `${Math.max(0, (item.pontos / item.pontosMaximos) * 100)}%` 
                }}
              />
            </div>
            
            {!item.respondida && (
              <p className="text-xs text-instituto-dark/50 mt-1">
                Aguardando resposta...
              </p>
            )}
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-instituto-border">
          <div className="flex items-center justify-between">
            <span className="font-medium text-instituto-dark">Total do Dia</span>
            <span className="text-2xl font-bold text-instituto-orange">
              {totalPontos} pontos
            </span>
          </div>
          <div className="text-sm text-instituto-dark/60 mt-1">
            {detalhes.filter(d => d.respondida).length}/{detalhes.length} perguntas respondidas
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetalhePontuacaoMissao;