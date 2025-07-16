import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Crown, Star, Flame, Award } from 'lucide-react';
import { useUserPoints } from '@/hooks/useUserPoints';

interface RealUserRankingProps {
  timeFilter: 'week' | 'month' | 'all';
  onTimeFilterChange: (filter: 'week' | 'month' | 'all') => void;
}

const getMedalIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Trophy className="w-6 h-6 text-amber-600" />;
    default:
      return (
        <span className="w-6 h-6 flex items-center justify-center text-instituto-purple font-bold text-sm">
          #{position}
        </span>
      );
  }
};

const getMedalClass = (position: number) => {
  switch (position) {
    case 1:
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
    case 2:
      return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
    case 3:
      return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
    default:
      return "bg-white border-instituto-border";
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getLevelColor = (level: number) => {
  const colors = [
    'text-gray-500',    // Nível 1
    'text-blue-500',    // Nível 2
    'text-green-500',   // Nível 3
    'text-yellow-500',  // Nível 4
    'text-orange-500',  // Nível 5
    'text-red-500',     // Nível 6
    'text-purple-500',  // Nível 7
    'text-pink-500',    // Nível 8
    'text-indigo-500',  // Nível 9
    'text-gold-500',    // Nível 10
  ];
  return colors[level - 1] || 'text-gray-500';
};

export const RealUserRanking: React.FC<RealUserRankingProps> = ({
  timeFilter,
  onTimeFilterChange
}) => {
  const { ranking, currentUserRanking, fetchRanking, loading } = useUserPoints();

  useEffect(() => {
    fetchRanking(timeFilter);
  }, [timeFilter, fetchRanking]);

  const getTimeFilterLabel = (filter: string) => {
    switch (filter) {
      case 'week': return 'Semana';
      case 'month': return 'Mês';
      default: return 'Geral';
    }
  };

  if (loading) {
    return (
      <Card className="border-instituto-orange/20">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange mx-auto mb-4"></div>
          <div className="text-muted-foreground">Carregando ranking...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-instituto-orange/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-instituto-dark flex items-center gap-2">
            <Trophy className="w-6 h-6 text-instituto-orange" />
            Ranking Geral
          </CardTitle>
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => onTimeFilterChange(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === filter
                    ? 'bg-instituto-orange text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getTimeFilterLabel(filter)}
              </button>
            ))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {ranking.length} participantes no total
        </div>
      </CardHeader>
      
      <CardContent>
        {ranking.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">Nenhum usuário no ranking</h3>
            <p className="text-sm text-gray-400">Seja o primeiro a completar uma missão!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ranking.map((user) => {
              const isCurrentUser = currentUserRanking && user.id === currentUserRanking.id;
              
              return (
                <div
                  key={user.id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border-2 transition-all
                    ${getMedalClass(user.position)}
                    ${isCurrentUser ? 'ring-2 ring-instituto-orange ring-opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getMedalIcon(user.position)}
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-instituto-orange text-white font-bold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-instituto-dark">
                          {user.name}
                        </h3>
                        {isCurrentUser && (
                          <Badge className="bg-instituto-orange text-white text-xs">
                            Você
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Award className={`w-3 h-3 ${getLevelColor(user.level)}`} />
                          Nível {user.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {user.streak} dias
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {user.completedChallenges} desafios
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-instituto-orange">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">pontos</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {ranking.length > 0 && (
          <div className="mt-6 p-4 bg-instituto-orange/10 rounded-lg">
            <h4 className="font-medium text-instituto-dark mb-2">Como funciona o ranking?</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Complete suas missões diárias para ganhar pontos</p>
              <p>• Mantenha sua sequência ativa para mais conquistas</p>
              <p>• Participe dos desafios para pontos extras</p>
              <p>• Evolua de nível: 0-99 (Nível 1), 100-299 (Nível 2), 300-599 (Nível 3)...</p>
              <p>• O ranking é atualizado em tempo real</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};