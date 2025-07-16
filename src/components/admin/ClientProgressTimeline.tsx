import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Droplets, Moon, Dumbbell, Heart, Target, Calendar } from 'lucide-react';

interface Mission {
  id: string;
  data: string;
  concluido: boolean;
  agua_litros?: string;
  sono_horas?: number;
  atividade_fisica?: boolean;
  gratidao?: string;
  pequena_vitoria?: string;
  nota_dia?: number;
  humor?: string;
  estresse_nivel?: number;
}

interface Score {
  data: string;
  total_pontos_dia: number;
  categoria_dia: string;
}

interface ClientProgressTimelineProps {
  missions: Mission[];
  scores: Score[];
}

export const ClientProgressTimeline: React.FC<ClientProgressTimelineProps> = ({
  missions,
  scores
}) => {
  // Combinar missões e pontuações por data
  const timelineData = missions.map(mission => {
    const score = scores.find(s => s.data === mission.data);
    return {
      ...mission,
      score: score?.total_pontos_dia || 0,
      categoria: score?.categoria_dia || 'baixa'
    };
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'excelente': return 'bg-instituto-green text-white';
      case 'medio': return 'bg-instituto-gold text-white';
      default: return 'bg-instituto-orange text-white';
    }
  };

  const getCategoryText = (categoria: string) => {
    switch (categoria) {
      case 'excelente': return 'Excelente';
      case 'medio': return 'Médio';
      default: return 'Baixo';
    }
  };

  const getHumorIcon = (humor: string) => {
    switch (humor?.toLowerCase()) {
      case 'feliz': return '😊';
      case 'triste': return '😢';
      case 'ansioso': return '😰';
      case 'irritado': return '😠';
      case 'calmo': return '😌';
      default: return '😐';
    }
  };

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Calendar className="h-5 w-5 text-instituto-purple" />
          Timeline de Progresso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineData.length === 0 ? (
            <div className="text-center text-netflix-text-muted py-12">
              Nenhum dado de progresso disponível
            </div>
          ) : (
            timelineData.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Linha conectora */}
                {index < timelineData.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-netflix-border"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Ícone de status */}
                  <div className="flex-shrink-0">
                    {entry.concluido ? (
                      <CheckCircle className="h-12 w-12 text-instituto-green" />
                    ) : (
                      <Circle className="h-12 w-12 text-netflix-border" />
                    )}
                  </div>

                  {/* Conteúdo do dia */}
                  <div className="flex-1 space-y-3">
                    {/* Header do dia */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-netflix-text">
                          {new Date(entry.data).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(entry.categoria)}>
                            {entry.score} pontos - {getCategoryText(entry.categoria)}
                          </Badge>
                          {entry.humor && (
                            <span className="text-2xl" title={`Humor: ${entry.humor}`}>
                              {getHumorIcon(entry.humor)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Atividades do dia */}
                    <div className="bg-netflix-hover rounded-lg p-4 space-y-3">
                      {/* Linha 1: Água, Sono, Exercício */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-netflix-text">
                            Água: {entry.agua_litros || 'Não registrado'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-netflix-text">
                            Sono: {entry.sono_horas ? `${entry.sono_horas}h` : 'Não registrado'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-netflix-text">
                            Exercício: {entry.atividade_fisica ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      </div>

                      {/* Linha 2: Bem-estar */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-400" />
                          <span className="text-sm text-netflix-text">
                            Estresse: {entry.estresse_nivel ? `${entry.estresse_nivel}/5` : 'Não avaliado'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-instituto-gold" />
                          <span className="text-sm text-netflix-text">
                            Nota do dia: {entry.nota_dia ? `${entry.nota_dia}/5` : 'Não avaliada'}
                          </span>
                        </div>
                      </div>

                      {/* Reflexões */}
                      {(entry.gratidao || entry.pequena_vitoria) && (
                        <div className="space-y-2 pt-2 border-t border-netflix-border">
                          {entry.gratidao && (
                            <div>
                              <p className="text-xs font-medium text-instituto-gold uppercase tracking-wide">
                                Gratidão
                              </p>
                              <p className="text-sm text-netflix-text-muted">
                                {entry.gratidao}
                              </p>
                            </div>
                          )}
                          {entry.pequena_vitoria && (
                            <div>
                              <p className="text-xs font-medium text-instituto-green uppercase tracking-wide">
                                Pequena Vitória
                              </p>
                              <p className="text-sm text-netflix-text-muted">
                                {entry.pequena_vitoria}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};