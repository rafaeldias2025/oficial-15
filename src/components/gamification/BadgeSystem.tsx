import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Award, Target, Calendar, Flame, Heart, 
  Brain, Salad, Dumbbell, Moon, Smile, Zap,
  CheckCircle, Star, Crown, Shield, Sparkles
} from 'lucide-react';

// Sistema de badges colecionáveis
export const BADGE_SYSTEM = {
  // Badges de Início
  first_step: {
    id: 'first_step',
    name: 'Primeiro Passo',
    description: 'Completou sua primeira missão',
    icon: Star,
    rarity: 'common',
    category: 'inicio',
    xpReward: 10,
    color: 'text-blue-400',
    bgColor: 'bg-blue-100'
  },
  early_bird: {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Completou uma missão antes das 8h',
    icon: Moon,
    rarity: 'common',
    category: 'rotina',
    xpReward: 15,
    color: 'text-purple-400',
    bgColor: 'bg-purple-100'
  },
  
  // Badges de Streak (Sequência)
  streak_7: {
    id: 'streak_7',
    name: '7 Dias Seguidos',
    description: 'Manteve a sequência por 7 dias',
    icon: Flame,
    rarity: 'uncommon',
    category: 'consistencia',
    xpReward: 50,
    color: 'text-orange-400',
    bgColor: 'bg-orange-100'
  },
  streak_30: {
    id: 'streak_30',
    name: 'Mês Perfeito',
    description: 'Manteve a sequência por 30 dias',
    icon: Trophy,
    rarity: 'rare',
    category: 'consistencia',
    xpReward: 200,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-100'
  },
  streak_100: {
    id: 'streak_100',
    name: 'Centenário',
    description: 'Manteve a sequência por 100 dias',
    icon: Crown,
    rarity: 'legendary',
    category: 'consistencia',
    xpReward: 500,
    color: 'text-red-400',
    bgColor: 'bg-red-100'
  },

  // Badges de Saúde Específica
  no_sugar_7: {
    id: 'no_sugar_7',
    name: 'Sem Açúcar 7 Dias',
    description: 'Ficou 7 dias sem açúcar refinado',
    icon: Salad,
    rarity: 'uncommon',
    category: 'nutricao',
    xpReward: 40,
    color: 'text-green-400',
    bgColor: 'bg-green-100'
  },
  hydration_master: {
    id: 'hydration_master',
    name: 'Mestre da Hidratação',
    description: 'Bebeu 2L+ de água por 14 dias seguidos',
    icon: Heart,
    rarity: 'rare',
    category: 'nutricao',
    xpReward: 80,
    color: 'text-blue-400',
    bgColor: 'bg-blue-100'
  },
  sleep_champion: {
    id: 'sleep_champion',
    name: 'Campeão do Sono',
    description: 'Dormiu 7+ horas por 21 dias seguidos',
    icon: Moon,
    rarity: 'rare',
    category: 'recuperacao',
    xpReward: 100,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-100'
  },
  exercise_warrior: {
    id: 'exercise_warrior',
    name: 'Guerreiro do Exercício',
    description: 'Se exercitou por 30 dias no mês',
    icon: Dumbbell,
    rarity: 'rare',
    category: 'atividade_fisica',
    xpReward: 120,
    color: 'text-red-400',
    bgColor: 'bg-red-100'
  },
  mindful_master: {
    id: 'mindful_master',
    name: 'Mestre da Atenção Plena',
    description: 'Praticou mindfulness por 50 dias',
    icon: Brain,
    rarity: 'rare',
    category: 'mental',
    xpReward: 150,
    color: 'text-purple-400',
    bgColor: 'bg-purple-100'
  },

  // Badges de Progresso
  goal_achiever: {
    id: 'goal_achiever',
    name: 'Realizador de Metas',
    description: 'Completou 5 metas pessoais',
    icon: Target,
    rarity: 'uncommon',
    category: 'progresso',
    xpReward: 75,
    color: 'text-green-400',
    bgColor: 'bg-green-100'
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Completou 100% das missões em uma semana',
    icon: CheckCircle,
    rarity: 'rare',
    category: 'progresso',
    xpReward: 100,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-100'
  },

  // Badges Especiais/Legendários
  transformation_legend: {
    id: 'transformation_legend',
    name: 'Lenda da Transformação',
    description: 'Alcançou todos os pilares do bem-estar',
    icon: Sparkles,
    rarity: 'legendary',
    category: 'especial',
    xpReward: 1000,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-100'
  },
  motivator: {
    id: 'motivator',
    name: 'Motivador',
    description: 'Inspirou 10 pessoas a se juntarem',
    icon: Heart,
    rarity: 'epic',
    category: 'social',
    xpReward: 300,
    color: 'text-pink-400',
    bgColor: 'bg-pink-100'
  }
};

export const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  uncommon: 'border-green-300 bg-green-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50'
};

interface BadgeProps {
  badge: typeof BADGE_SYSTEM[keyof typeof BADGE_SYSTEM];
  earned?: boolean;
  earnedAt?: Date;
  showDescription?: boolean;
}

export const BadgeComponent: React.FC<BadgeProps> = ({ 
  badge, 
  earned = false, 
  earnedAt, 
  showDescription = true 
}) => {
  const Icon = badge.icon;
  
  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-300
      ${earned 
        ? `${RARITY_COLORS[badge.rarity]} shadow-lg` 
        : 'border-gray-200 bg-gray-100 opacity-50'
      }
      ${earned ? 'hover:scale-105' : ''}
    `}>
      {earned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="text-center">
        <div className={`
          w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center
          ${earned ? badge.bgColor : 'bg-gray-200'}
        `}>
          <Icon className={`
            w-8 h-8 
            ${earned ? badge.color : 'text-gray-400'}
          `} />
        </div>
        
        <h4 className={`
          font-bold text-sm mb-1
          ${earned ? 'text-netflix-text' : 'text-gray-400'}
        `}>
          {badge.name}
        </h4>
        
        {showDescription && (
          <p className={`
            text-xs
            ${earned ? 'text-netflix-text-muted' : 'text-gray-400'}
          `}>
            {badge.description}
          </p>
        )}
        
        {earned && earnedAt && (
          <div className="mt-2 text-xs text-green-600 font-medium">
            Conquistado em {earnedAt.toLocaleDateString('pt-BR')}
          </div>
        )}
        
        <Badge 
          variant="outline" 
          className={`
            mt-2 text-xs capitalize
            ${earned ? 'border-current' : 'border-gray-300 text-gray-400'}
          `}
        >
          {badge.rarity}
        </Badge>
      </div>
    </div>
  );
};

interface BadgeSystemProps {
  earnedBadges: string[];
  badgeEarnedDates?: Record<string, Date>;
  filterCategory?: string;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({ 
  earnedBadges, 
  badgeEarnedDates = {},
  filterCategory 
}) => {
  const badges = Object.values(BADGE_SYSTEM);
  const filteredBadges = filterCategory 
    ? badges.filter(badge => badge.category === filterCategory)
    : badges;

  const categories = Array.from(new Set(badges.map(badge => badge.category)));
  const earnedCount = earnedBadges.length;
  const totalCount = badges.length;
  const completionPercentage = (earnedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Award className="w-6 h-6 text-instituto-orange" />
            Coleção de Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-netflix-text-muted">
                Progresso da Coleção
              </span>
              <span className="text-netflix-text font-bold">
                {earnedCount}/{totalCount} ({Math.round(completionPercentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-instituto-orange h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBadges.map(badge => (
              <BadgeComponent
                key={badge.id}
                badge={badge}
                earned={earnedBadges.includes(badge.id)}
                earnedAt={badgeEarnedDates[badge.id]}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeSystem;