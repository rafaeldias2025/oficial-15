import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Crown, Trophy, Shield, Zap, Heart, Sparkles } from 'lucide-react';

// Sistema de níveis avançado
export const LEVEL_SYSTEM = {
  1: { name: "Descobridor", minXP: 0, maxXP: 100, icon: Star, color: "text-gray-400", bgColor: "bg-gray-100", description: "Primeiros passos na jornada" },
  2: { name: "Aprendiz", minXP: 100, maxXP: 300, icon: Sparkles, color: "text-blue-400", bgColor: "bg-blue-100", description: "Desenvolvendo novos hábitos" },
  3: { name: "Explorador", minXP: 300, maxXP: 600, icon: Zap, color: "text-purple-400", bgColor: "bg-purple-100", description: "Explorando novas possibilidades" },
  4: { name: "Guerreiro da Saúde", minXP: 600, maxXP: 1000, icon: Shield, color: "text-green-400", bgColor: "bg-green-100", description: "Fortalecendo corpo e mente" },
  5: { name: "Herói da Transformação", minXP: 1000, maxXP: 1500, icon: Trophy, color: "text-yellow-400", bgColor: "bg-yellow-100", description: "Inspirando outros com sua mudança" },
  6: { name: "Mestre do Bem-estar", minXP: 1500, maxXP: 2500, icon: Crown, color: "text-orange-400", bgColor: "bg-orange-100", description: "Dominando os pilares da vida saudável" },
  7: { name: "Lenda dos Sonhos", minXP: 2500, maxXP: Infinity, icon: Heart, color: "text-red-400", bgColor: "bg-red-100", description: "Realizando sonhos e inspirando outros" }
};

interface LevelSystemProps {
  currentXP: number;
  showDetailed?: boolean;
}

export const LevelSystem: React.FC<LevelSystemProps> = ({ currentXP, showDetailed = true }) => {
  // Calcular nível atual
  const getCurrentLevel = (xp: number) => {
    for (const [level, data] of Object.entries(LEVEL_SYSTEM)) {
      if (xp >= data.minXP && xp < data.maxXP) {
        return { level: parseInt(level), ...data };
      }
    }
    return { level: 7, ...LEVEL_SYSTEM[7] };
  };

  const currentLevel = getCurrentLevel(currentXP);
  const progressToNext = currentLevel.maxXP === Infinity 
    ? 100 
    : ((currentXP - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100;
  
  const nextLevel = LEVEL_SYSTEM[currentLevel.level + 1];
  const xpToNext = nextLevel ? nextLevel.minXP - currentXP : 0;

  const Icon = currentLevel.icon;

  if (!showDetailed) {
    return (
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${currentLevel.bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${currentLevel.color}`} />
        </div>
        <div>
          <div className="font-bold text-netflix-text">{currentLevel.name}</div>
          <div className="text-sm text-netflix-text-muted">Nível {currentLevel.level}</div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full ${currentLevel.bgColor} flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${currentLevel.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-netflix-text">{currentLevel.name}</h3>
              <Badge variant="outline" className="text-xs">
                Nível {currentLevel.level}
              </Badge>
            </div>
            <p className="text-netflix-text-muted text-sm mb-2">{currentLevel.description}</p>
            <div className="text-sm text-netflix-text-muted">
              {currentXP} XP {nextLevel && `(${xpToNext} XP para próximo nível)`}
            </div>
          </div>
        </div>

        {nextLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-netflix-text-muted">Progresso para {nextLevel.name}</span>
              <span className="text-netflix-text font-medium">{Math.round(progressToNext)}%</span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>
        )}

        {currentLevel.level === 7 && (
          <div className="text-center mt-4">
            <div className="text-instituto-orange font-bold">🎉 NÍVEL MÁXIMO ALCANÇADO! 🎉</div>
            <div className="text-sm text-netflix-text-muted mt-1">
              Você é uma Lenda dos Sonhos!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LevelSystem;