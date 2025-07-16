import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Crown, Star, Target, Flame } from 'lucide-react';
import { useUserPoints } from '@/hooks/useUserPoints';

interface PublicRankingProps {
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
      return <span className="w-6 h-6 flex items-center justify-center text-instituto-purple font-bold">#{position}</span>;
  }
};

const getMedalClass = (position: number) => {
  switch (position) {
    case 1:
      return "ranking-medal-gold";
    case 2:
      return "ranking-medal-silver";
    case 3:
      return "ranking-medal-bronze";
    default:
      return "bg-netflix-card";
  }
};

export const PublicRanking: React.FC<PublicRankingProps> = ({
  timeFilter,
  onTimeFilterChange
}) => {
  const { ranking, currentUserRanking, fetchRanking, loading } = useUserPoints();

  useEffect(() => {
    fetchRanking(timeFilter);
  }, [timeFilter, fetchRanking]);

  // Mostrar todos os usuários, não apenas os top 10
  const allUsers = ranking;
  const currentUser = currentUserRanking;
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="netflix-card border-instituto-orange/20">
          <CardContent className="p-12 text-center">
            <div className="text-netflix-text-muted">Carregando ranking...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ranking dos Campeões Header */}
      <Card className="netflix-card border-instituto-orange/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-netflix-text flex items-center gap-2">
              <Trophy className="w-6 h-6 text-instituto-orange" />
              Ranking dos Campeões
            </CardTitle>
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => onTimeFilterChange(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeFilter === filter
                      ? 'bg-instituto-orange text-white'
                      : 'bg-netflix-card text-netflix-text-muted hover:bg-netflix-hover'
                  }`}
                >
                  {filter === 'week' ? 'Semana' : filter === 'month' ? 'Mês' : 'Geral'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Top 3 Pódio */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {allUsers.slice(0, 3).map((user, index) => {
              const position = index + 1;
              return (
                <div
                  key={user.id}
                  className={`text-center p-4 rounded-lg ${getMedalClass(position)} ${
                    currentUser && user.id === currentUser.id ? 'ring-2 ring-instituto-orange' : ''
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {getMedalIcon(position)}
                  </div>
                  <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-white/20">
                    <AvatarFallback className="bg-instituto-purple text-white text-lg font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg truncate">{user.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{user.points.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="text-sm">{user.streak} dias</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lista de Todos os Usuários */}
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-netflix-text mb-4">
              Ranking Completo ({allUsers.length} participantes)
            </h4>
            {allUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-lg netflix-card-hover ${
                    currentUser && user.id === currentUser.id 
                      ? 'bg-instituto-orange/10 border border-instituto-orange/30' 
                      : 'bg-netflix-card'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getMedalIcon(user.position)}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-instituto-purple text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-netflix-text">{user.name}</span>
                      {currentUser && user.id === currentUser.id && (
                        <Badge variant="outline" className="text-xs bg-instituto-orange/20 text-instituto-orange border-instituto-orange">
                          Você
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-netflix-text-muted">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {user.completedChallenges} desafios
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {user.streak} dias
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-instituto-orange">
                    {user.points.toLocaleString()}
                  </div>
                  <div className="text-sm text-netflix-text-muted">pontos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};