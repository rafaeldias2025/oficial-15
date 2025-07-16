import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnimatedButton } from '@/components/visual/AnimatedButton';
import { 
  Calendar, Trophy, Star, Flame, Target, Heart, 
  Droplets, Moon, Dumbbell, Brain, Gift, Clock,
  Users, Award, Sparkles
} from 'lucide-react';

interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'mindfulness' | 'hydration' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // days
  xpReward: number;
  specialReward?: string;
  icon: React.ComponentType<any>;
  progress: number; // 0-100
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  participants: number;
  successRate: number;
  tips: string[];
}

const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'hydration_hero',
    title: 'Herói da Hidratação',
    description: 'Beba pelo menos 2L de água por 7 dias consecutivos',
    category: 'hydration',
    difficulty: 'easy',
    duration: 7,
    xpReward: 150,
    specialReward: 'Badge "Mestre da Hidratação"',
    icon: Droplets,
    progress: 71,
    startDate: new Date('2024-07-08'),
    endDate: new Date('2024-07-14'),
    isCompleted: false,
    participants: 234,
    successRate: 78,
    tips: [
      'Mantenha uma garrafa sempre por perto',
      'Coloque lembretes a cada 2 horas',
      'Adicione limão ou hortelã para variar o sabor'
    ]
  },
  {
    id: 'sleep_champion',
    title: 'Campeão do Sono',
    description: 'Durma pelo menos 7 horas por noite durante toda a semana',
    category: 'sleep',
    difficulty: 'medium',
    duration: 7,
    xpReward: 200,
    specialReward: 'Voucher de R$ 50 em produtos para relaxamento',
    icon: Moon,
    progress: 43,
    startDate: new Date('2024-07-08'),
    endDate: new Date('2024-07-14'),
    isCompleted: false,
    participants: 189,
    successRate: 65,
    tips: [
      'Estabeleça uma rotina de sono consistente',
      'Evite telas 1 hora antes de dormir',
      'Crie um ambiente relaxante no quarto'
    ]
  },
  {
    id: 'mindful_week',
    title: 'Semana Mindful',
    description: 'Pratique 10 minutos de meditação todos os dias',
    category: 'mindfulness',
    difficulty: 'medium',
    duration: 7,
    xpReward: 180,
    specialReward: 'Acesso grátis ao curso premium de Mindfulness',
    icon: Brain,
    progress: 14,
    startDate: new Date('2024-07-08'),
    endDate: new Date('2024-07-14'),
    isCompleted: false,
    participants: 156,
    successRate: 58,
    tips: [
      'Comece com apenas 5 minutos se for iniciante',
      'Use aplicativos guiados como apoio',
      'Escolha sempre o mesmo horário do dia'
    ]
  },
  {
    id: 'movement_master',
    title: 'Mestre do Movimento',
    description: 'Faça pelo menos 30 minutos de exercício durante 5 dias',
    category: 'exercise',
    difficulty: 'hard',
    duration: 7,
    xpReward: 250,
    specialReward: 'Badge "Guerreiro da Transformação" + E-book de treinos',
    icon: Dumbbell,
    progress: 60,
    startDate: new Date('2024-07-08'),
    endDate: new Date('2024-07-14'),
    isCompleted: false,
    participants: 201,
    successRate: 72,
    tips: [
      'Caminhada rápida também conta como exercício',
      'Divida em duas sessões de 15 minutos se necessário',
      'Encontre atividades que você realmente gosta'
    ]
  }
];

interface WeeklyChallengesProps {
  onChallengeJoin?: (challengeId: string) => void;
  onChallengeComplete?: (challengeId: string) => void;
}

export const WeeklyChallenges: React.FC<WeeklyChallengesProps> = ({
  onChallengeJoin,
  onChallengeComplete
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set());

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      hard: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[difficulty] || colors.easy;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      nutrition: 'text-green-500',
      exercise: 'text-red-500',
      sleep: 'text-purple-500',
      mindfulness: 'text-blue-500',
      hydration: 'text-cyan-500',
      social: 'text-pink-500'
    };
    return colors[category] || 'text-gray-500';
  };

  const handleJoinChallenge = (challengeId: string) => {
    const newJoined = new Set(joinedChallenges);
    newJoined.add(challengeId);
    setJoinedChallenges(newJoined);
    
    if (onChallengeJoin) {
      onChallengeJoin(challengeId);
    }
  };

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-instituto-orange/10 to-instituto-purple/10 border-instituto-orange/30">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Calendar className="w-6 h-6 text-instituto-orange" />
            Desafios Semanais Especiais
          </CardTitle>
          <p className="text-netflix-text-muted">
            Participe dos desafios desta semana e ganhe XP extra + recompensas exclusivas!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {WEEKLY_CHALLENGES.map((challenge) => {
          const Icon = challenge.icon;
          const isJoined = joinedChallenges.has(challenge.id);
          const daysRemaining = getDaysRemaining(challenge.endDate);
          
          return (
            <Card 
              key={challenge.id}
              className={`
                transition-all duration-300 cursor-pointer
                ${selectedChallenge === challenge.id 
                  ? 'ring-2 ring-instituto-orange border-instituto-orange' 
                  : 'bg-netflix-card border-netflix-border hover:border-instituto-orange/50'
                }
                ${challenge.isCompleted ? 'bg-green-50 border-green-200' : ''}
              `}
              onClick={() => setSelectedChallenge(
                selectedChallenge === challenge.id ? null : challenge.id
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${challenge.isCompleted 
                      ? 'bg-green-100' 
                      : 'bg-instituto-orange/10'
                    }
                  `}>
                    <Icon className={`
                      w-6 h-6 
                      ${challenge.isCompleted 
                        ? 'text-green-600' 
                        : getCategoryColor(challenge.category)
                      }
                    `} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-netflix-text">
                        {challenge.title}
                      </h3>
                      <div className="flex gap-1">
                        <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        {challenge.isCompleted && (
                          <Badge className="bg-green-500 text-white">
                            Concluído
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-netflix-text-muted text-sm mb-3">
                      {challenge.description}
                    </p>
                    
                    {/* Progresso */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-netflix-text-muted">Progresso</span>
                        <span className="text-netflix-text font-medium">
                          {challenge.progress}%
                        </span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                    
                    {/* Informações do desafio */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2 text-netflix-text-muted">
                        <Clock className="w-4 h-4" />
                        <span>{daysRemaining} dias restantes</span>
                      </div>
                      <div className="flex items-center gap-2 text-netflix-text-muted">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants} participando</span>
                      </div>
                      <div className="flex items-center gap-2 text-netflix-text-muted">
                        <Star className="w-4 h-4" />
                        <span>{challenge.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-2 text-netflix-text-muted">
                        <Target className="w-4 h-4" />
                        <span>{challenge.successRate}% sucesso</span>
                      </div>
                    </div>
                    
                    {/* Recompensa especial */}
                    {challenge.specialReward && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">
                            Recompensa Especial:
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          {challenge.specialReward}
                        </p>
                      </div>
                    )}
                    
                    {/* Botão de ação */}
                    {!challenge.isCompleted && (
                      <div className="flex gap-2">
                        {!isJoined ? (
                          <AnimatedButton
                            variant="challenge"
                            size="sm"
                            onClick={() => handleJoinChallenge(challenge.id)}
                            className="flex-1"
                          >
                            Participar do Desafio
                          </AnimatedButton>
                        ) : (
                          <AnimatedButton
                            variant="complete"
                            size="sm"
                            onClick={() => {
                              if (onChallengeComplete) {
                                onChallengeComplete(challenge.id);
                              }
                            }}
                            className="flex-1"
                            completionEffect={true}
                          >
                            Marcar Progresso
                          </AnimatedButton>
                        )}
                      </div>
                    )}
                    
                    {/* Dicas expandidas */}
                    {selectedChallenge === challenge.id && (
                      <div className="mt-4 p-4 bg-instituto-purple/5 rounded-lg border border-instituto-purple/20">
                        <h4 className="font-semibold text-netflix-text mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-instituto-purple" />
                          Dicas para o Sucesso:
                        </h4>
                        <ul className="space-y-1">
                          {challenge.tips.map((tip, index) => (
                            <li key={index} className="text-sm text-netflix-text-muted flex items-start gap-2">
                              <span className="text-instituto-purple mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyChallenges;