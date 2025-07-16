
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Star, Flame } from 'lucide-react';
import { useDailyMissions } from '@/hooks/useDailyMissions';
import { useUserPoints } from '@/hooks/useUserPoints';

interface MissoesDiariasProps {
  onPointsEarned?: (points: number) => void;
}

export const MissoesDiarias: React.FC<MissoesDiariasProps> = ({ onPointsEarned }) => {
  const { fetchRanking } = useUserPoints();
  const { missions, totalPointsToday, loading, completeMission } = useDailyMissions(fetchRanking);

  const handleCompleteMission = (missionId: string) => {
    completeMission(missionId, onPointsEarned);
  };

  const completedMissions = missions.filter(m => m.completed).length;
  const completionPercentage = (completedMissions / missions.length) * 100;

  return (
    <Card className="netflix-card border-instituto-orange/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl font-bold text-netflix-text flex items-center gap-3">
            <div className="p-2 bg-instituto-orange/20 rounded-full">
              <Star className="w-6 h-6 text-instituto-orange" />
            </div>
            Missão do Dia
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-instituto-orange">
              +{totalPointsToday} XP
            </div>
            <div className="text-sm text-netflix-text-muted">
              {completedMissions}/{missions.length} concluídas
            </div>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-netflix-text-muted mb-2">
            <span>Progresso Diário</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-netflix-hover rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-instituto-orange to-instituto-green h-3 rounded-full transition-all duration-1000"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`mission-card flex items-center justify-between p-4 ${
              mission.completed ? 'completed' : 'pending'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-2xl">{mission.icon}</div>
              <div className="flex-1">
                <h4 className={`font-semibold text-lg ${
                  mission.completed ? 'text-instituto-green' : 'text-netflix-text'
                }`}>
                  {mission.title}
                </h4>
                <p className="text-sm text-netflix-text-muted">
                  {mission.description}
                </p>
              </div>
              {mission.completed && (
                <Badge 
                  variant="outline" 
                  className="border-instituto-green text-instituto-green"
                >
                  +{mission.points} XP
                </Badge>
              )}
            </div>
            
            <div className="ml-4">
              {mission.completed ? (
                <div className="flex items-center gap-2 text-instituto-green">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold text-sm">Concluído!</span>
                </div>
              ) : (
                <Button
                  onClick={() => handleCompleteMission(mission.id)}
                  className="mission-button complete"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Concluir'}
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Motivação e streak */}
        <div className="mt-6 p-4 bg-instituto-purple/10 border border-instituto-purple/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg text-instituto-purple">
                {completedMissions === missions.length ? 
                  '🎉 Dia Perfeito Concluído!' : 
                  `Faltam ${missions.length - completedMissions} missões!`
                }
              </h4>
              <p className="text-sm text-netflix-text-muted">
                {completedMissions === missions.length ? 
                  'Você conquistou todas as missões de hoje! Continue assim amanhã.' :
                  'Cada pequeno passo te aproxima dos seus sonhos.'
                }
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-5 h-5 text-instituto-orange" />
              <span className="font-bold text-instituto-orange">7 dias</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
