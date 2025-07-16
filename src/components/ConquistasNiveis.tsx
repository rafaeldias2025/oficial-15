import { motion } from 'framer-motion';
import { useEnhancedPoints } from '@/hooks/useEnhancedPoints';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Crown, Star, Flame, Zap, Heart, 
  Droplets, TrendingUp, Target, Award, 
  ChevronRight, Sparkles, Shield
} from 'lucide-react';
import React from 'react'; // Added missing import for React

const ACHIEVEMENT_ICONS = {
  sequencia7dias: { icon: Flame, gradient: 'from-orange-400 to-red-500' },
  superPontuacao: { icon: Zap, gradient: 'from-purple-400 to-pink-500' },
  altaPerformance: { icon: TrendingUp, gradient: 'from-green-400 to-emerald-500' },
  mestreAgua: { icon: Droplets, gradient: 'from-blue-400 to-cyan-500' },
  perfeicaoSemanal: { icon: Crown, gradient: 'from-yellow-400 to-orange-500' },
  maestriaTotal: { icon: Trophy, gradient: 'from-gold-400 to-amber-500' }
};

const LEVEL_ICONS = {
  1: Star,
  2: Sparkles,
  3: Shield,
  4: Target,
  5: Trophy,
  6: Crown,
  7: Award
};

export const ConquistasNiveis = ({ pontuacaoTotal = 0, nivel, conquistas = [] }) => {
  const { NIVEIS } = useEnhancedPoints();

  // Encontra o próximo nível
  const proximoNivel = Object.values(NIVEIS).find(n => n.min > pontuacaoTotal);
  const pontosParaProximo = proximoNivel ? proximoNivel.min - pontuacaoTotal : 0;
  const progressoNivel = proximoNivel ? 
    ((pontuacaoTotal - nivel.min) / (proximoNivel.min - nivel.min)) * 100 : 100;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };



  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Nível Atual com Glass Morphism */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-health-primary/10 to-health-secondary/10 rounded-2xl"></div>
        
                 {/* Ícone de Nível Flutuante */}
         <div className="absolute -right-6 -top-6 text-8xl opacity-10">
           {React.createElement(LEVEL_ICONS[Math.min(1, 7)], {
             className: "w-20 h-20 text-health-primary animate-pulse"
           })}
         </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-health-primary/20 to-health-secondary/20">
                {React.createElement(LEVEL_ICONS[Math.min(nivel.id || 1, 7)], {
                  className: "w-8 h-8 text-health-primary"
                })}
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">Nível Atual</h3>
                <p className="text-muted-foreground">Sua jornada de transformação</p>
              </div>
            </div>
            <Badge variant="outline" className={`${nivel.cor} text-lg px-4 py-2 border-2`}>
              {nivel.titulo}
            </Badge>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-health-primary/5 to-health-secondary/5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Progresso para {proximoNivel?.titulo || 'Nível Máximo'}</span>
                <span className="text-xl font-bold text-health-primary">{Math.round(progressoNivel)}%</span>
              </div>
              <Progress value={progressoNivel} className="h-3 bg-health-background" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-health-primary/10 to-transparent">
                <div className="text-sm text-muted-foreground">Pontuação Total</div>
                <div className="text-2xl font-bold text-health-primary">{pontuacaoTotal.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">pontos conquistados</div>
              </div>
              
              {pontosParaProximo > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-health-secondary/10 to-transparent">
                  <div className="text-sm text-muted-foreground">Próximo Nível</div>
                  <div className="text-2xl font-bold text-health-secondary">{pontosParaProximo.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">pontos restantes</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Conquistas com Layout Moderno */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gamification-gold/5 to-gamification-legendary/5 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-gamification-gold/20 to-gamification-legendary/20">
              <Trophy className="w-8 h-8 text-gamification-gold" />
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text">Conquistas</h3>
              <p className="text-muted-foreground">Seus marcos de progresso</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sequência de Dias */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`achievement-card ${conquistas.includes('sequencia7dias') ? 'achievement-unlocked' : 'achievement-locked'}`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${ACHIEVEMENT_ICONS.sequencia7dias.gradient}`}>
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">7 Dias Seguidos</h4>
                  <p className="text-sm text-muted-foreground">Consistência é o segredo</p>
                </div>
              </div>
              <div className="h-2 bg-health-background rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${conquistas.includes('sequencia7dias') ? 'bg-gradient-to-r from-orange-400 to-red-500 w-full' : 'bg-muted-foreground/20 w-0'}`}
                />
              </div>
            </motion.div>

            {/* Super Pontuação */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`achievement-card ${conquistas.includes('superPontuacao') ? 'achievement-unlocked' : 'achievement-locked'}`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${ACHIEVEMENT_ICONS.superPontuacao.gradient}`}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Super Pontuação</h4>
                  <p className="text-sm text-muted-foreground">200+ pontos em um dia</p>
                </div>
              </div>
              <div className="h-2 bg-health-background rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${conquistas.includes('superPontuacao') ? 'bg-gradient-to-r from-purple-400 to-pink-500 w-full' : 'bg-muted-foreground/20 w-0'}`}
                />
              </div>
            </motion.div>

            {/* Alta Performance */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`achievement-card ${conquistas.includes('altaPerformance') ? 'achievement-unlocked' : 'achievement-locked'}`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${ACHIEVEMENT_ICONS.altaPerformance.gradient}`}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Alta Performance</h4>
                  <p className="text-sm text-muted-foreground">Média semanal 80+ pontos</p>
                </div>
              </div>
              <div className="h-2 bg-health-background rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${conquistas.includes('altaPerformance') ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full' : 'bg-muted-foreground/20 w-0'}`}
                />
              </div>
            </motion.div>

            {/* Mestre da Água */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`achievement-card ${conquistas.includes('mestreAgua') ? 'achievement-unlocked' : 'achievement-locked'}`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${ACHIEVEMENT_ICONS.mestreAgua.gradient}`}>
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Mestre da Água</h4>
                  <p className="text-sm text-muted-foreground">2L+ por 5 dias seguidos</p>
                </div>
              </div>
              <div className="h-2 bg-health-background rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${conquistas.includes('mestreAgua') ? 'bg-gradient-to-r from-blue-400 to-cyan-500 w-full' : 'bg-muted-foreground/20 w-0'}`}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Próximos Níveis */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-avatar-level1/5 to-avatar-level7/5 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-avatar-level1/20 to-avatar-level7/20">
              <Target className="w-8 h-8 text-avatar-level5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text">Próximos Níveis</h3>
              <p className="text-muted-foreground">Seus objetivos futuros</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.values(NIVEIS)
              .filter(n => n.min > pontuacaoTotal)
              .slice(0, 3)
              .map((n, i) => (
                <motion.div
                  key={n.titulo}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="level-card group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-xl bg-gradient-to-br from-${n.cor.replace('text-', '')}-400/20 to-${n.cor.replace('text-', '')}-500/20`}>
                         {React.createElement(LEVEL_ICONS[Math.min(i + 1, 7)], {
                           className: `w-6 h-6 ${n.cor}`
                         })}
                       </div>
                       <div>
                         <h4 className="font-bold text-lg">{n.titulo}</h4>
                         <p className="text-sm text-muted-foreground">Continue sua jornada de transformação</p>
                       </div>
                     </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{n.min.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">pts</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-health-primary transition-colors" />
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-health-background rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${n.cor.replace('text-', 'from-')}-400 to-${n.cor.replace('text-', '')}-500 transition-all duration-1000`}
                      style={{ width: `${Math.min((pontuacaoTotal / n.min) * 100, 100)}%` }}
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 