import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Heart,
  Calendar,
  CheckCircle,
  Award,
  Lock
} from 'lucide-react';

interface BadgeItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'achievement' | 'streak' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

interface BadgeSystemProps {
  badges: BadgeItem[];
  showLocked?: boolean;
}

export default function BadgeSystem({ badges, showLocked = true }: BadgeSystemProps) {
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      trophy: Trophy,
      star: Star,
      target: Target,
      flame: Flame,
      heart: Heart,
      calendar: Calendar,
      check: CheckCircle,
      award: Award
    };
    return iconMap[iconName] || Trophy;
  };

  const getRarityClass = (rarity: string, unlocked: boolean) => {
    if (!unlocked) return 'bg-muted/50 text-muted-foreground';
    
    const rarityMap: { [key: string]: string } = {
      common: 'bg-xp-bronze text-white',
      rare: 'bg-xp-silver text-white',
      epic: 'bg-xp-gold text-white',
      legendary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    };
    return rarityMap[rarity] || 'bg-muted';
  };

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: any } = {
      achievement: Trophy,
      streak: Flame,
      milestone: Star,
      special: Award
    };
    const IconComponent = categoryMap[category] || Trophy;
    return <IconComponent className="w-4 h-4" />;
  };

  const filteredBadges = showLocked ? badges : badges.filter(badge => badge.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Suas Conquistas</h2>
        <p className="text-muted-foreground">
          {badges.filter(b => b.unlocked).length} de {badges.length} badges desbloqueados
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const IconComponent = getIconComponent(badge.icon);
          const isUnlocked = badge.unlocked;
          
          return (
            <Card 
              key={badge.id} 
              className={`relative transition-all duration-300 hover:scale-105 ${
                isUnlocked ? 'bg-card netflix-card' : 'bg-muted/30'
              }`}
            >
              {/* Lock overlay for locked badges */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg z-10">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              
              <CardContent className="p-4 text-center">
                {/* Category indicator */}
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline" className="text-xs">
                    {getCategoryIcon(badge.category)}
                    <span className="ml-1">{badge.category}</span>
                  </Badge>
                  <Badge className={`text-xs ${getRarityClass(badge.rarity, isUnlocked)}`}>
                    {badge.rarity}
                  </Badge>
                </div>

                {/* Badge Icon */}
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  isUnlocked ? 'bg-primary/20' : 'bg-muted/50'
                } ${isUnlocked ? 'animate-bounce-in' : ''}`}>
                  <IconComponent className={`w-8 h-8 ${
                    isUnlocked ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>

                {/* Title and Description */}
                <h3 className={`font-semibold text-sm mb-1 ${
                  isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {badge.title}
                </h3>
                <p className={`text-xs ${
                  isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/50'
                }`}>
                  {badge.description}
                </p>

                {/* Progress Bar (for partially completed badges) */}
                {badge.progress !== undefined && badge.maxProgress && !isUnlocked && (
                  <div className="mt-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.progress}/{badge.maxProgress}
                    </p>
                  </div>
                )}

                {/* Unlock Date */}
                {isUnlocked && badge.unlockedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Desbloqueado em {badge.unlockedAt}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}