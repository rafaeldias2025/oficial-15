import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Zap } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  currentLevel: number;
  userName?: string;
}

export default function XPBar({ currentXP, nextLevelXP, currentLevel, userName }: XPBarProps) {
  const progressPercentage = (currentXP / nextLevelXP) * 100;
  const remainingXP = nextLevelXP - currentXP;

  const getLevelBadge = (level: number) => {
    if (level >= 50) return { icon: Trophy, color: 'bg-xp-gold', label: 'Mestre' };
    if (level >= 25) return { icon: Star, color: 'bg-xp-silver', label: 'Avançado' };
    return { icon: Zap, color: 'bg-xp-bronze', label: 'Iniciante' };
  };

  const levelBadge = getLevelBadge(currentLevel);
  const IconComponent = levelBadge.icon;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge className={`${levelBadge.color} text-white border-0 px-3 py-1`}>
              <IconComponent className="w-4 h-4 mr-1" />
              Nível {currentLevel}
            </Badge>
            <span className="text-sm text-muted-foreground">{levelBadge.label}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </div>
            <div className="text-xs text-muted-foreground">
              {remainingXP.toLocaleString()} XP para próximo nível
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-muted"
          />
          <div 
            className="absolute inset-y-0 left-0 h-3 rounded-full xp-fill animate-glow"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {userName && `Parabéns, ${userName}!`}
          </span>
          <span className="text-xs font-medium text-primary">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}