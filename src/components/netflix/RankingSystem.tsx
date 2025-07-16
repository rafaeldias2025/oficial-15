import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Star, Crown, MapPin, Calendar } from 'lucide-react';

interface RankingUser {
  id: number;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  city?: string;
  streak: number;
  badges: number;
  rank: number;
}

interface RankingSystemProps {
  currentUser: RankingUser;
  rankingData: RankingUser[];
}

export default function RankingSystem({ currentUser, rankingData }: RankingSystemProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [filter, setFilter] = useState<'global' | 'city'>('global');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
  };

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const topUsers = rankingData.slice(0, 10);

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Ranking de Campeões
          </CardTitle>
          
          {/* Filters */}
          <div className="flex gap-2">
            <div className="flex rounded-lg bg-muted p-1">
              <Button
                variant={timeframe === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe('week')}
                className="text-xs"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Semana
              </Button>
              <Button
                variant={timeframe === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe('month')}
                className="text-xs"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Mês
              </Button>
            </div>
            
            <div className="flex rounded-lg bg-muted p-1">
              <Button
                variant={filter === 'global' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('global')}
                className="text-xs"
              >
                Global
              </Button>
              <Button
                variant={filter === 'city' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('city')}
                className="text-xs"
              >
                <MapPin className="w-3 h-3 mr-1" />
                Cidade
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current User Position */}
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={`${getRankBadgeClass(currentUser.rank)} border-0 px-2 py-1`}>
                  {getRankIcon(currentUser.rank)}
                  <span className="ml-1">#{currentUser.rank}</span>
                </Badge>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{currentUser.name} (Você)</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {currentUser.xp.toLocaleString()} XP • Nível {currentUser.level}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Sequência: {currentUser.streak} dias</p>
                <p className="text-xs text-muted-foreground">{currentUser.badges} badges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Ranking */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">TOP 10</h3>
          {topUsers.map((user, index) => (
            <div 
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-accent/50 ${
                user.id === currentUser.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Badge className={`${getRankBadgeClass(user.rank)} border-0 w-8 h-8 rounded-full flex items-center justify-center p-0`}>
                  {getRankIcon(user.rank)}
                </Badge>
                
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium text-sm">
                    {user.name}
                    {user.id === currentUser.id && ' (Você)'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {user.city && (
                      <>
                        <MapPin className="w-3 h-3" />
                        <span>{user.city}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>Nível {user.level}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-sm">{user.xp.toLocaleString()} XP</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{user.streak} dias</span>
                  <span>•</span>
                  <span>{user.badges} badges</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation Message */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-medium mb-1">
              {currentUser.rank <= 3 ? '🎉 Você está no TOP 3!' : 
               currentUser.rank <= 10 ? '⭐ Você está no TOP 10!' :
               '💪 Continue assim para subir no ranking!'}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentUser.rank > 1 && 
                `Faltam ${rankingData[currentUser.rank - 2]?.xp - currentUser.xp || 0} XP para alcançar a posição ${currentUser.rank - 1}`
              }
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}