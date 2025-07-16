import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Crown, Star, Target, Flame, Share2, MessageCircle, Heart } from 'lucide-react';
import { useUserPoints } from '@/hooks/useUserPoints';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

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
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRanking(timeFilter);
  }, [timeFilter, fetchRanking]);

  const handleLikeUser = (userId: string) => {
    setLikedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
    toast({
      title: "Incentivo enviado!",
      description: "Continue motivando outros usuários em sua jornada!",
      duration: 2000,
    });
  };

  const handleShareRanking = async () => {
    try {
      await navigator.share({
        title: 'Ranking Instituto dos Sonhos',
        text: 'Confira o ranking de transformação do Instituto dos Sonhos! 🏆',
        url: window.location.href
      });
    } catch (err) {
      toast({
        title: "Link copiado!",
        description: "Compartilhe com seus amigos e os desafie!",
        duration: 2000,
      });
    }
  };

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
      <Card className="netflix-card border-instituto-orange/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-netflix-text">
            Ranking dos Campeões
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-instituto-orange hover:bg-instituto-orange/10"
            onClick={handleShareRanking}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </CardHeader>

        <CardContent>
          {/* Top 3 Pódio - Com Animação */}
          <motion.div 
            className="grid grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {ranking.slice(0, 3).map((user, index) => {
              const position = index + 1;
              return (
                <motion.div
                  key={user.id}
                  className={`text-center p-4 rounded-lg ${getMedalClass(position)} ${
                    currentUserRanking && user.id === currentUserRanking.id ? 'ring-2 ring-instituto-orange' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
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
                  
                  {/* Botões de Interação */}
                  <div className="flex justify-center gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`hover:text-pink-500 ${likedUsers.has(user.id) ? 'text-pink-500' : ''}`}
                      onClick={() => handleLikeUser(user.id)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-blue-500"
                      onClick={() => toast({
                        title: "Em breve!",
                        description: "Envio de mensagens será liberado em breve!",
                        duration: 2000,
                      })}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Lista de Todos os Usuários */}
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-netflix-text mb-4">
              Ranking Completo ({ranking.length} participantes)
            </h4>
            <AnimatePresence>
              {ranking.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg netflix-card-hover ${
                      currentUserRanking && user.id === currentUserRanking.id 
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
                          {currentUserRanking && user.id === currentUserRanking.id && (
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
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-instituto-orange">
                          {user.points.toLocaleString()}
                        </div>
                        <div className="text-sm text-netflix-text-muted">pontos</div>
                      </div>
                      
                      {/* Botões de Interação */}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`hover:text-pink-500 ${likedUsers.has(user.id) ? 'text-pink-500' : ''}`}
                          onClick={() => handleLikeUser(user.id)}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Motivação */}
      <Card className="bg-gradient-to-r from-instituto-orange/10 to-instituto-purple/10 border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Como participar do ranking?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <Target className="w-5 h-5 text-instituto-orange" />
              </div>
              <div>
                <p className="font-medium">Complete Desafios</p>
                <p className="text-muted-foreground">Participe dos desafios diários e ganhe pontos extras</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <Flame className="w-5 h-5 text-instituto-orange" />
              </div>
              <div>
                <p className="font-medium">Mantenha a Sequência</p>
                <p className="text-muted-foreground">Acesse todos os dias para multiplicar seus pontos</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <Trophy className="w-5 h-5 text-instituto-orange" />
              </div>
              <div>
                <p className="font-medium">Conquiste Prêmios</p>
                <p className="text-muted-foreground">Os melhores do ranking ganham recompensas especiais</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};