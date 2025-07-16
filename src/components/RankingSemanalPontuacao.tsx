import { useEnhancedPoints } from '@/hooks/useEnhancedPoints';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Trophy, Crown, Medal, Star, Zap, Flame, 
  TrendingUp, Target, Award, Sparkles, 
  ChevronRight, Users, Calendar, BarChart3
} from 'lucide-react';

const POSITION_MEDALS = {
  1: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/20', gradient: 'from-yellow-400/10 to-yellow-600/10' },
  2: { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/20', gradient: 'from-gray-300/10 to-gray-500/10' },
  3: { icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-600/20', gradient: 'from-amber-500/10 to-amber-700/10' }
};

const ACHIEVEMENT_BADGES = {
  sequencia7dias: { icon: Flame, color: 'text-orange-500', text: '🔥 7 Dias' },
  superPontuacao: { icon: Zap, color: 'text-purple-500', text: '⚡ Super Pontuação' },
  altaPerformance: { icon: TrendingUp, color: 'text-green-500', text: '📈 Alta Performance' },
  consistente: { icon: Target, color: 'text-blue-500', text: '🎯 Consistente' },
  lider: { icon: Crown, color: 'text-yellow-500', text: '👑 Líder' }
};

export const RankingSemanalPontuacao = () => {
  const { rankingAvancado, isLoadingRanking, NIVEIS } = useEnhancedPoints();
  const { user } = useAuth();

  if (isLoadingRanking) {
    return (
      <div className="glass-card p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-health-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Carregando ranking...</p>
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const getPositionStyle = (index: number) => {
    const position = index + 1;
    if (position <= 3) {
      return POSITION_MEDALS[position];
    }
    return { 
      icon: Star, 
      color: 'text-health-primary', 
      bg: 'bg-health-primary/10',
      gradient: 'from-health-primary/5 to-health-secondary/5'
    };
  };

  const getUserAchievements = (usuario: any) => {
    const achievements = [];
    
    if (usuario.dias_consecutivos >= 7) achievements.push('sequencia7dias');
    if (usuario.maior_pontuacao >= 200) achievements.push('superPontuacao');
    if (usuario.media_semanal >= 80) achievements.push('altaPerformance');
    if (usuario.pontuacoes?.length >= 5) achievements.push('consistente');
    if (usuario.posicao === 1) achievements.push('lider');
    
    return achievements;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="glass-card p-8 relative overflow-hidden"
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-secondary/5 rounded-2xl"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-gamification-gold/20 to-gamification-legendary/20">
              <Trophy className="w-8 h-8 text-gamification-gold" />
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text">Ranking Semanal</h2>
              <p className="text-muted-foreground">Transformação em movimento</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{rankingAvancado?.length || 0} participantes</span>
          </div>
        </div>
      </div>

      {/* Ranking List */}
      <div className="relative z-10 space-y-4">
        {rankingAvancado?.map((usuario: any, index: number) => {
          const isCurrentUser = usuario.user_id === user?.id;
          const positionStyle = getPositionStyle(index);
          const achievements = getUserAchievements(usuario);
          const position = index + 1;

          return (
            <motion.div
              key={usuario.user_id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`ranking-card group relative ${isCurrentUser ? 'current-user-card' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${positionStyle.gradient} rounded-2xl`}></div>
              
              <div className="relative z-10 p-6">
                {/* Position Badge */}
                <div className="absolute -left-2 -top-2 w-10 h-10 rounded-xl bg-gradient-to-br from-health-primary to-health-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{position}</span>
                </div>

                {/* Medal Icon for top 3 */}
                {position <= 3 && (
                  <div className={`absolute -right-2 -top-2 p-2 rounded-xl ${positionStyle.bg}`}>
                    <positionStyle.icon className={`w-5 h-5 ${positionStyle.color}`} />
                  </div>
                )}

                <div className="ml-6">
                  {/* User Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-health-primary/30">
                        <AvatarFallback className="bg-gradient-to-br from-health-primary to-health-secondary text-white">
                          {usuario.nome?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{usuario.nome}</h3>
                        <Badge variant="outline" className={`${usuario.nivel.cor} text-xs`}>
                          {usuario.nivel.titulo}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-health-primary">
                        {usuario.pontuacao_total}
                      </div>
                      <div className="text-xs text-muted-foreground">pontos</div>
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="stat-card">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-health-secondary" />
                        <span className="text-xs text-muted-foreground">Média</span>
                      </div>
                      <div className="text-lg font-bold text-health-secondary">
                        {usuario.media_semanal}
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-health-warning" />
                        <span className="text-xs text-muted-foreground">Recorde</span>
                      </div>
                      <div className="text-lg font-bold text-health-warning">
                        {usuario.maior_pontuacao}
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-health-error" />
                        <span className="text-xs text-muted-foreground">Sequência</span>
                      </div>
                      <div className="text-lg font-bold text-health-error">
                        {usuario.dias_consecutivos}
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progresso para Próximo Nível */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">Próximo Nível</span>
                      <span className="text-xs font-medium">
                        {Math.round((usuario.pontuacao_total / usuario.nivel.max) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(usuario.pontuacao_total / usuario.nivel.max) * 100} 
                      className="h-2 bg-health-background"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{usuario.nivel.titulo}</span>
                      <span>{Math.round((usuario.nivel.max - usuario.pontuacao_total)).toLocaleString()} pts restantes</span>
                    </div>
                  </div>

                  {/* Conquistas/Badges */}
                  {achievements.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {achievements.map((achievement) => {
                        const badge = ACHIEVEMENT_BADGES[achievement];
                        return (
                          <Badge 
                            key={achievement}
                            variant="secondary" 
                            className={`${badge.color} text-xs px-2 py-1 bg-white/10`}
                          >
                            {badge.text}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legenda dos Níveis */}
      <motion.div
        variants={itemVariants}
        className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-health-background/50 to-health-primary/5 border border-health-primary/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-health-primary/20">
            <Award className="w-5 h-5 text-health-primary" />
          </div>
          <h3 className="font-bold text-lg">Níveis de Transformação</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(NIVEIS).map(([key, nivel]) => (
            <div key={key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className={`w-3 h-3 rounded-full ${nivel.cor.replace('text-', 'bg-')}`}></div>
              <span className="text-sm font-medium">{nivel.titulo}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};