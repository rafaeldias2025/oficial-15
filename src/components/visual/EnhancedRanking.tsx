import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedButton } from '@/components/visual/AnimatedButton';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Gift,
  BookOpen,
  ShoppingBag,
  Ticket,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface RankingUser {
  id: number;
  name: string;
  points: number;
  position: number;
  lastPosition?: number;
  streak: number;
  completedChallenges: number;
  cidade: string;
  avatar?: string;
  trend: 'up' | 'down' | 'stable';
  positionChange: number;
}

interface Prize {
  position: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  value: string;
  color: string;
}

interface EnhancedRankingProps {
  users: RankingUser[];
  currentUser?: RankingUser;
  showPrizes?: boolean;
  className?: string;
}

export const EnhancedRanking: React.FC<EnhancedRankingProps> = ({
  users,
  currentUser,
  showPrizes = true,
  className = ''
}) => {
  const [showAllUsers, setShowAllUsers] = useState(false);

  const prizes: Prize[] = [
    {
      position: 1,
      title: 'E-book Premium',
      description: '"Transformação Completa: Guia dos Sabotadores"',
      icon: BookOpen,
      value: 'R$ 97,00',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      position: 2,
      title: 'Voucher de Desconto',
      description: '50% OFF em qualquer curso da plataforma',
      icon: Ticket,
      value: 'Até R$ 200',
      color: 'from-slate-300 to-slate-500'
    },
    {
      position: 3,
      title: 'Kit Bem-Estar',
      description: 'Produtos selecionados para sua jornada',
      icon: Gift,
      value: 'R$ 75,00',
      color: 'from-amber-600 to-amber-800'
    }
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return Crown;
      case 2: return Medal;
      case 3: return Trophy;
      default: return null;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-slate-400';
      case 3: return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return ArrowUp;
    if (trend === 'down') return ArrowDown;
    return Minus;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const displayUsers = showAllUsers ? users : users.slice(0, 5);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Prêmios para Top 3 */}
      {showPrizes && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              Prêmios da Semana
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prizes.map((prize) => {
                const IconComponent = prize.icon;
                return (
                  <Card key={prize.position} className="relative overflow-hidden border-2 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${prize.color} opacity-10`} />
                    <CardContent className="p-6 relative">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className={`p-3 rounded-full bg-gradient-to-br ${prize.color} text-white`}>
                            <IconComponent className="h-8 w-8" />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <Badge className={`bg-gradient-to-r ${prize.color} text-white border-0 text-lg px-3 py-1`}>
                            {prize.position}º Lugar
                          </Badge>
                        </div>
                        
                        <h3 className="font-bold text-foreground mb-2">{prize.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{prize.description}</p>
                        <p className="text-primary font-semibold">{prize.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking Principal */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Ranking Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayUsers.map((user, index) => {
              const PositionIcon = getPositionIcon(user.position);
              const TrendIcon = getTrendIcon(user.trend, user.positionChange);
              const isCurrentUser = currentUser?.id === user.id;
              
              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg border transition-all duration-300 hover:border-primary/30 ${
                    isCurrentUser 
                      ? 'bg-primary/5 border-primary/20 ring-2 ring-primary/10' 
                      : 'bg-background border-border hover:bg-muted/50'
                  } ${user.position <= 3 ? 'shadow-lg' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Posição e Ícone */}
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          user.position <= 3 
                            ? 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary border-2 border-primary/30' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {PositionIcon ? (
                            <PositionIcon className={`h-6 w-6 ${getPositionColor(user.position)}`} />
                          ) : (
                            user.position
                          )}
                        </div>
                        
                        {/* Indicador de Tendência */}
                        <div className="flex items-center gap-1">
                          <TrendIcon className={`h-4 w-4 ${getTrendColor(user.trend)}`} />
                          {user.positionChange !== 0 && (
                            <span className={`text-xs font-medium ${getTrendColor(user.trend)}`}>
                              {Math.abs(user.positionChange)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Informações do Usuário */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                            {user.name}
                          </h4>
                          {isCurrentUser && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              Você
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{user.cidade}</span>
                          <span>{user.streak} dias seguidos</span>
                          <span>{user.completedChallenges} desafios</span>
                        </div>
                      </div>
                    </div>

                    {/* Pontuação */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        user.position <= 3 ? 'text-primary' : 'text-foreground'
                      }`}>
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">pontos</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botão Ver Mais */}
          {users.length > 5 && (
            <div className="mt-6 text-center">
              <AnimatedButton
                variant="hero"
                onClick={() => setShowAllUsers(!showAllUsers)}
                showGlow={false}
                className="px-8"
              >
                {showAllUsers ? 'Ver Menos' : `Ver Todos (${users.length})`}
              </AnimatedButton>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sua Posição (se não estiver no top 5) */}
      {currentUser && currentUser.position > 5 && !showAllUsers && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {currentUser.position}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{currentUser.name} (Você)</h4>
                  <div className="text-sm text-muted-foreground">
                    {currentUser.cidade} • {currentUser.streak} dias seguidos
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-primary">{currentUser.points.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">pontos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};