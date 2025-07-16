import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface FeedbackPontuacaoProps {
  pontuacaoTotal: number;
  pontuacaoMaxima?: number;
  showDetalhes?: boolean;
  className?: string;
}

export const FeedbackPontuacao: React.FC<FeedbackPontuacaoProps> = ({
  pontuacaoTotal,
  pontuacaoMaxima = 30,
  showDetalhes = false,
  className = '',
}) => {
  const getFeedback = () => {
    if (pontuacaoTotal >= 21) {
      return {
        emoji: '🟢',
        mensagem: 'Excelente! Sua evolução está brilhando!',
        cor: 'text-green-600',
        corBg: 'bg-green-50',
        corBorder: 'border-green-200',
        categoria: 'Excelente',
        icone: Trophy,
      };
    } else if (pontuacaoTotal >= 11) {
      return {
        emoji: '🟡',
        mensagem: 'Você está no caminho! Continue assim.',
        cor: 'text-yellow-600',
        corBg: 'bg-yellow-50',
        corBorder: 'border-yellow-200',
        categoria: 'Bom',
        icone: Target,
      };
    } else {
      return {
        emoji: '🔴',
        mensagem: 'Hoje foi difícil, mas você não desistiu!',
        cor: 'text-red-600',
        corBg: 'bg-red-50',
        corBorder: 'border-red-200',
        categoria: 'Precisa Melhorar',
        icone: TrendingUp,
      };
    }
  };

  const feedback = getFeedback();
  const Icon = feedback.icone;
  const progressPercentage = Math.min((pontuacaoTotal / pontuacaoMaxima) * 100, 100);

  return (
    <Card className={`${feedback.corBg} ${feedback.corBorder} border-2 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header com pontuação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{feedback.emoji}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-instituto-dark">
                    {pontuacaoTotal} pontos
                  </h3>
                  <Badge variant="secondary" className={`${feedback.cor} bg-white`}>
                    {feedback.categoria}
                  </Badge>
                </div>
                <p className={`text-sm ${feedback.cor} font-medium`}>
                  {feedback.mensagem}
                </p>
              </div>
            </div>
            <Icon className={`w-8 h-8 ${feedback.cor}`} />
          </div>

          {/* Barra de progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-instituto-dark/70">
              <span>Progresso do dia</span>
              <span>{pontuacaoTotal}/{pontuacaoMaxima}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>

          {/* Detalhes adicionais */}
          {showDetalhes && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-instituto-border/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-instituto-dark">{pontuacaoTotal}</div>
                <div className="text-xs text-instituto-dark/60">Pontos Hoje</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-instituto-orange">{Math.round(progressPercentage)}%</div>
                <div className="text-xs text-instituto-dark/60">Progresso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-instituto-gold">{Math.max(0, pontuacaoMaxima - pontuacaoTotal)}</div>
                <div className="text-xs text-instituto-dark/60">Faltam</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackPontuacao;