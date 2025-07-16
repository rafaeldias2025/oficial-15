import { motion, Variants } from 'framer-motion';
import { useEnhancedPoints } from '@/hooks/useEnhancedPoints';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Star, Target, TrendingUp, Zap, Heart, 
  Sparkles, Award, CheckCircle, ArrowRight, 
  Droplets, Moon, Sun, Timer, Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

const FEEDBACK_ICONS = {
  excelente: Trophy,
  otimo: Star,
  bom: Target,
  regular: TrendingUp
};

const LEVEL_GRADIENT = {
  1: 'from-health-primary/20 to-health-primary/40',
  2: 'from-health-secondary/20 to-health-secondary/40',
  3: 'from-health-success/20 to-health-success/40',
  4: 'from-health-warning/20 to-health-warning/40',
  5: 'from-health-error/20 to-health-error/40',
  6: 'from-gamification-gold/20 to-gamification-gold/40',
  7: 'from-gamification-legendary/20 to-gamification-legendary/40'
};

const ACHIEVEMENT_TIPS = {
  low: [
    { icon: Droplets, text: 'Comece o dia bebendo água morna com limão', color: 'text-blue-500' },
    { icon: Target, text: 'Defina uma meta simples e alcançável', color: 'text-green-500' },
    { icon: Timer, text: 'Pratique 5 minutos de respiração consciente', color: 'text-purple-500' }
  ],
  medium: [
    { icon: Droplets, text: 'Aumente seu consumo de água para 2L', color: 'text-blue-500' },
    { icon: Activity, text: 'Adicione 15 minutos de atividade física', color: 'text-orange-500' },
    { icon: Heart, text: 'Pratique a gratidão antes de dormir', color: 'text-pink-500' }
  ],
  high: [
    { icon: Sparkles, text: 'Mantenha seu excelente ritmo', color: 'text-yellow-500' },
    { icon: Award, text: 'Inspire outros com seu exemplo', color: 'text-purple-500' },
    { icon: Zap, text: 'Desafie-se a superar sua pontuação', color: 'text-blue-500' }
  ],
  perfect: [
    { icon: Trophy, text: 'Você é inspirador! Continue brilhando', color: 'text-gold-500' },
    { icon: Star, text: 'Compartilhe suas estratégias de sucesso', color: 'text-yellow-500' },
    { icon: CheckCircle, text: 'Mantenha essa energia transformadora', color: 'text-green-500' }
  ]
};

export const FeedbackPontuacao = ({ pontuacao, showConfetti = true }) => {
  const { getFeedbackAvancado, determinarNivel } = useEnhancedPoints();

  const nivel = determinarNivel(pontuacao);
  const feedback = getFeedbackAvancado(pontuacao, nivel);

  // Dispara confetti para pontuações excelentes
  if (pontuacao >= 100 && showConfetti) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
    });
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        duration: 0.6
      }
    }
  };

  const getPerformanceLevel = () => {
    if (pontuacao >= 100) return 'perfect';
    if (pontuacao >= 80) return 'high';
    if (pontuacao >= 60) return 'medium';
    return 'low';
  };

  const getPerformanceColor = () => {
    if (pontuacao >= 100) return 'text-gamification-legendary';
    if (pontuacao >= 80) return 'text-health-success';
    if (pontuacao >= 60) return 'text-health-warning';
    return 'text-health-primary';
  };

  const getPerformanceGradient = () => {
    if (pontuacao >= 100) return 'from-gamification-legendary/10 to-gamification-gold/10';
    if (pontuacao >= 80) return 'from-health-success/10 to-health-primary/10';
    if (pontuacao >= 60) return 'from-health-warning/10 to-health-secondary/10';
    return 'from-health-primary/10 to-health-secondary/10';
  };

  const performanceLevel = getPerformanceLevel();
  const tips = ACHIEVEMENT_TIPS[performanceLevel];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Card Principal com Glass Morphism */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getPerformanceGradient()} rounded-2xl`}></div>
        
        {/* Emoji/Ícone Flutuante */}
        <div className="absolute -right-8 -top-8 text-9xl opacity-5">
          {feedback.emoji}
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-sm">
                <span className="text-4xl">{feedback.emoji}</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold gradient-text mb-1">
                  {pontuacao} pontos
                </h3>
                <Badge variant="outline" className={`${nivel.cor} text-base px-4 py-2 border-2`}>
                  {nivel.titulo}
                </Badge>
              </div>
            </div>
            
            {/* Indicador de Performance */}
            <div className="text-right">
              <div className={`text-2xl font-bold ${getPerformanceColor()}`}>
                {pontuacao >= 100 ? 'Perfeito!' : 
                 pontuacao >= 80 ? 'Excelente!' :
                 pontuacao >= 60 ? 'Muito Bom!' : 'Continue!'}
              </div>
              <div className="text-sm text-muted-foreground">
                {pontuacao >= 100 ? '100% de performance' :
                 pontuacao >= 80 ? '80%+ de performance' :
                 pontuacao >= 60 ? '60%+ de performance' : 'Começando bem'}
              </div>
            </div>
          </div>

          {/* Mensagem Motivacional */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <p className="text-lg text-foreground/90 leading-relaxed">
              {feedback.mensagem}
            </p>
          </motion.div>

          {/* Métricas de Performance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="text-sm text-muted-foreground">Nível Atual</div>
              <div className="text-xl font-bold text-health-primary">{nivel.titulo}</div>
              <div className="text-xs text-muted-foreground">Sua classificação</div>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="text-sm text-muted-foreground">Categoria</div>
              <div className={`text-xl font-bold ${getPerformanceColor()}`}>
                {pontuacao >= 100 ? 'Lendário' : 
                 pontuacao >= 80 ? 'Excelente' :
                 pontuacao >= 60 ? 'Bom' : 'Regular'}
              </div>
              <div className="text-xs text-muted-foreground">Classificação do dia</div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="text-sm text-muted-foreground">Progresso</div>
              <div className="text-xl font-bold text-health-secondary">{Math.round((pontuacao / 100) * 100)}%</div>
              <div className="text-xs text-muted-foreground">Do objetivo diário</div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="text-sm text-muted-foreground">Próximo Nível</div>
              <div className="text-xl font-bold text-health-warning">
                {Math.max(0, (nivel.max || 1000) - pontuacao)}
              </div>
              <div className="text-xs text-muted-foreground">Pontos restantes</div>
            </motion.div>
          </div>

          {/* Barra de Progresso */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso do Dia</span>
              <span className="text-sm text-muted-foreground">{pontuacao}/100 pontos</span>
            </div>
            <Progress value={Math.min(pontuacao, 100)} className="h-3 bg-health-background" />
          </motion.div>
        </div>
      </motion.div>

      {/* Dicas Personalizadas */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-6 relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getPerformanceGradient()} rounded-2xl`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-health-primary/20 to-health-secondary/20">
              <Sparkles className="w-6 h-6 text-health-primary" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Dicas para Amanhã</h4>
              <p className="text-sm text-muted-foreground">Continue evoluindo em sua jornada</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="tip-card group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/20 ${tip.color}`}>
                    <tip.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-relaxed">{tip.text}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-health-primary transition-colors ml-auto mt-2" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Motivação Extra para Altas Pontuações */}
      {pontuacao >= 80 && (
        <motion.div
          variants={itemVariants}
          className="text-center p-6 rounded-2xl bg-gradient-to-r from-health-success/5 to-health-primary/5 border border-health-success/20"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy className="w-6 h-6 text-health-success" />
            <h4 className="text-lg font-bold text-health-success">Parabéns pela Dedicação!</h4>
          </div>
          <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
            "Cada ponto conquistado é um passo em direção à sua melhor versão. 
            Continue transformando sua vida com essa energia inspiradora!"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};