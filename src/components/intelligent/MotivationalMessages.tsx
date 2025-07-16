import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedButton } from '@/components/visual/AnimatedButton';
import { Heart, Sun, Moon, Clock, Zap, Target } from 'lucide-react';

interface MotivationalMessage {
  id: string;
  message: string;
  type: 'morning' | 'afternoon' | 'evening' | 'mood-boost' | 'progress' | 'streak';
  icon: React.ComponentType<any>;
  context?: string;
}

interface MotivationalMessagesProps {
  userMood?: 'happy' | 'sad' | 'neutral' | 'motivated' | 'tired';
  currentStreak?: number;
  recentProgress?: boolean;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

export const MotivationalMessages: React.FC<MotivationalMessagesProps> = ({
  userMood = 'neutral',
  currentStreak = 0,
  recentProgress = false,
  timeOfDay
}) => {
  const [currentMessage, setCurrentMessage] = useState<MotivationalMessage | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    if (timeOfDay) return timeOfDay;
    
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const messages: MotivationalMessage[] = [
    // Mensagens por horário
    {
      id: 'morning-1',
      message: 'Bom dia! Que tal começar o dia hidratando-se? Seu corpo agradece! 🌅',
      type: 'morning',
      icon: Sun,
      context: 'Manhã é o melhor momento para estabelecer o tom do dia'
    },
    {
      id: 'morning-2', 
      message: 'Novo dia, novas oportunidades! Vamos conquistar suas metas hoje! ✨',
      type: 'morning',
      icon: Target
    },
    {
      id: 'afternoon-1',
      message: 'Boa tarde! Lembre-se de fazer uma pausa e respirar fundo. Você está indo bem! 🌤️',
      type: 'afternoon',
      icon: Heart
    },
    {
      id: 'evening-1',
      message: 'Boa noite! Que tal refletir sobre as conquistas do dia? Cada passo conta! 🌙',
      type: 'evening',
      icon: Moon
    },
    
    // Mensagens baseadas no humor
    {
      id: 'mood-sad-1',
      message: 'Percebo que você pode estar se sentindo para baixo. Lembre-se: você é mais forte do que imagina! 💪',
      type: 'mood-boost',
      icon: Heart,
      context: 'Apoio emocional personalizado'
    },
    {
      id: 'mood-tired-1',
      message: 'Parece que você está cansado(a). Que tal uma meditação de 5 minutos? Pode fazer toda diferença! 😌',
      type: 'mood-boost',
      icon: Zap
    },
    
    // Mensagens de progresso
    {
      id: 'progress-1',
      message: 'Parabéns pelo progresso! Vi que você tem se dedicado. Continue assim! 🎉',
      type: 'progress',
      icon: Target,
      context: 'Reconhecimento de esforço'
    },
    {
      id: 'streak-high',
      message: `Incrível! ${currentStreak} dias consecutivos! Você está criando hábitos poderosos! 🔥`,
      type: 'streak',
      icon: Zap,
      context: 'Reforço positivo para consistência'
    }
  ];

  const getContextualMessage = (): MotivationalMessage | null => {
    const currentTime = getCurrentTimeOfDay();
    let relevantMessages: MotivationalMessage[] = [];

    // Priorizar mensagens baseadas no humor
    if (userMood === 'sad') {
      relevantMessages = messages.filter(m => m.type === 'mood-boost' && m.id.includes('sad'));
    } else if (userMood === 'tired') {
      relevantMessages = messages.filter(m => m.type === 'mood-boost' && m.id.includes('tired'));
    }
    
    // Mensagens de streak alta prioridade
    else if (currentStreak >= 7) {
      relevantMessages = messages.filter(m => m.type === 'streak');
    }
    
    // Mensagens de progresso recente
    else if (recentProgress) {
      relevantMessages = messages.filter(m => m.type === 'progress');
    }
    
    // Mensagens por horário como fallback
    else {
      relevantMessages = messages.filter(m => m.type === currentTime);
    }

    // Se não encontrou mensagens relevantes, usar mensagens gerais
    if (relevantMessages.length === 0) {
      relevantMessages = messages.filter(m => m.type === currentTime);
    }

    return relevantMessages.length > 0 
      ? relevantMessages[Math.floor(Math.random() * relevantMessages.length)]
      : null;
  };

  useEffect(() => {
    const message = getContextualMessage();
    if (message) {
      setCurrentMessage(message);
      setShowMessage(true);
    }
  }, [userMood, currentStreak, recentProgress, timeOfDay]);

  const handleDismiss = () => {
    setShowMessage(false);
    setTimeout(() => setCurrentMessage(null), 300);
  };

  if (!currentMessage || !showMessage) return null;

  const IconComponent = currentMessage.icon;

  return (
    <Card className={`bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 transition-all duration-500 ${
      showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <p className="text-foreground font-medium mb-2">
              {currentMessage.message}
            </p>
            
            {currentMessage.context && (
              <p className="text-muted-foreground text-sm mb-4">
                {currentMessage.context}
              </p>
            )}
            
            <div className="flex gap-2">
              <AnimatedButton
                size="sm"
                variant="success"
                onClick={handleDismiss}
                className="h-8"
              >
                Obrigado!
              </AnimatedButton>
              
              <AnimatedButton
                size="sm"
                variant="hero"
                onClick={handleDismiss}
                showGlow={false}
                className="h-8"
              >
                Dispensar
              </AnimatedButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};