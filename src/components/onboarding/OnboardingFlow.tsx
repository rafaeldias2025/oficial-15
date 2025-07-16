import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Target, 
  User, 
  Calendar, 
  Trophy,
  Sparkles,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  isCompleted: boolean;
  isRequired: boolean;
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [userChoices, setUserChoices] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao Instituto dos Sonhos! 🌟',
      description: 'Sua jornada de transformação começa aqui',
      icon: <Sparkles className="h-8 w-8 text-instituto-orange" />,
      isCompleted: completedSteps.includes('welcome'),
      isRequired: true,
      content: (
        <div className="text-center space-y-4">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-instituto-orange to-instituto-purple rounded-full flex items-center justify-center">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
          <p className="text-netflix-text-muted">
            Estamos animados para acompanhar sua transformação pessoal. 
            Vamos configurar seu perfil para criar uma experiência personalizada.
          </p>
          <div className="bg-instituto-orange/10 p-4 rounded-lg">
            <h4 className="font-semibold text-netflix-text mb-2">O que você vai descobrir:</h4>
            <ul className="text-sm text-netflix-text-muted space-y-1">
              <li>• Sistema de missões diárias personalizadas</li>
              <li>• Acompanhamento de progresso detalhado</li>
              <li>• Biblioteca de cursos especializados</li>
              <li>• Sessões terapêuticas individuais</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Conte-nos sobre você',
      description: 'Vamos personalizar sua experiência',
      icon: <User className="h-8 w-8 text-instituto-orange" />,
      isCompleted: completedSteps.includes('profile'),
      isRequired: true,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-netflix-text">Nome</label>
              <input 
                type="text" 
                placeholder="Seu nome"
                className="w-full p-2 rounded-lg bg-netflix-hover border border-netflix-border text-netflix-text"
                value={userChoices.name || ''}
                onChange={(e) => setUserChoices(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-netflix-text">Idade</label>
              <input 
                type="number" 
                placeholder="Sua idade"
                className="w-full p-2 rounded-lg bg-netflix-hover border border-netflix-border text-netflix-text"
                value={userChoices.age || ''}
                onChange={(e) => setUserChoices(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-netflix-text">Principal objetivo</label>
            <div className="grid grid-cols-2 gap-2">
              {['Emagrecimento', 'Bem-estar', 'Autoestima', 'Saúde'].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setUserChoices(prev => ({ ...prev, mainGoal: goal }))}
                  className={`p-3 rounded-lg border transition-colors ${
                    userChoices.mainGoal === goal
                      ? 'border-instituto-orange bg-instituto-orange/10 text-instituto-orange'
                      : 'border-netflix-border bg-netflix-hover text-netflix-text'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Definir suas metas',
      description: 'O que você quer alcançar?',
      icon: <Target className="h-8 w-8 text-instituto-orange" />,
      isCompleted: completedSteps.includes('goals'),
      isRequired: true,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-netflix-text">Meta principal</label>
            <textarea 
              placeholder="Descreva sua meta principal..."
              className="w-full p-3 rounded-lg bg-netflix-hover border border-netflix-border text-netflix-text h-24"
              value={userChoices.primaryGoal || ''}
              onChange={(e) => setUserChoices(prev => ({ ...prev, primaryGoal: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-netflix-text">Prazo desejado</label>
            <select 
              className="w-full p-2 rounded-lg bg-netflix-hover border border-netflix-border text-netflix-text"
              value={userChoices.timeframe || ''}
              onChange={(e) => setUserChoices(prev => ({ ...prev, timeframe: e.target.value }))}
            >
              <option value="">Selecione um prazo</option>
              <option value="1-month">1 mês</option>
              <option value="3-months">3 meses</option>
              <option value="6-months">6 meses</option>
              <option value="1-year">1 ano</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-netflix-text">Nível de compromisso</label>
            <div className="space-y-2">
              {[
                { value: 'casual', label: 'Casual - 15-30 min/dia' },
                { value: 'moderate', label: 'Moderado - 30-60 min/dia' },
                { value: 'intensive', label: 'Intensivo - 1-2 horas/dia' }
              ].map((level) => (
                <label key={level.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="commitment"
                    value={level.value}
                    checked={userChoices.commitment === level.value}
                    onChange={(e) => setUserChoices(prev => ({ ...prev, commitment: e.target.value }))}
                    className="text-instituto-orange"
                  />
                  <span className="text-netflix-text">{level.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Preferências de notificação',
      description: 'Como você quer ser lembrado?',
      icon: <Calendar className="h-8 w-8 text-instituto-orange" />,
      isCompleted: completedSteps.includes('preferences'),
      isRequired: false,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-netflix-text mb-3">Quando você quer ser lembrado das missões?</h4>
            <div className="space-y-2">
              {[
                { value: 'morning', label: 'Manhã (8:00)', time: '08:00' },
                { value: 'afternoon', label: 'Tarde (14:00)', time: '14:00' },
                { value: 'evening', label: 'Noite (19:00)', time: '19:00' }
              ].map((time) => (
                <label key={time.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userChoices.reminderTimes?.includes(time.value) || false}
                    onChange={(e) => {
                      const current = userChoices.reminderTimes || [];
                      const updated = e.target.checked
                        ? [...current, time.value]
                        : current.filter((t: string) => t !== time.value);
                      setUserChoices(prev => ({ ...prev, reminderTimes: updated }));
                    }}
                    className="text-instituto-orange"
                  />
                  <span className="text-netflix-text">{time.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-netflix-text mb-3">Tipos de notificação</h4>
            <div className="space-y-2">
              {[
                { key: 'missions', label: 'Lembretes de missões' },
                { key: 'progress', label: 'Atualizações de progresso' },
                { key: 'courses', label: 'Novos cursos disponíveis' },
                { key: 'achievements', label: 'Conquistas e badges' }
              ].map((notif) => (
                <label key={notif.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userChoices.notifications?.[notif.key] || false}
                    onChange={(e) => {
                      setUserChoices(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [notif.key]: e.target.checked
                        }
                      }));
                    }}
                    className="text-instituto-orange"
                  />
                  <span className="text-netflix-text">{notif.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Tudo pronto! 🎉',
      description: 'Sua jornada está começando',
      icon: <Trophy className="h-8 w-8 text-instituto-orange" />,
      isCompleted: completedSteps.includes('complete'),
      isRequired: true,
      content: (
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-netflix-text mb-2">Configuração concluída!</h3>
            <p className="text-netflix-text-muted">
              Personalizamos sua experiência com base nas suas respostas. 
              Agora você pode começar sua primeira missão!
            </p>
          </div>
          
          <div className="bg-instituto-orange/10 p-4 rounded-lg">
            <h4 className="font-semibold text-netflix-text mb-2">Seus próximos passos:</h4>
            <div className="text-sm text-netflix-text-muted space-y-1 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Complete sua primeira missão diária</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Explore a biblioteca de cursos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Agende sua primeira sessão</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onComplete}
            className="w-full bg-instituto-orange hover:bg-instituto-orange-hover text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Começar minha jornada
          </Button>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    // Marcar step atual como completo
    setCompletedSteps(prev => [...prev, currentStepData.id]);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Salvar dados do onboarding
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('user_onboarding_data', JSON.stringify(userChoices));
      
      toast({
        title: "Onboarding concluído! 🎉",
        description: "Bem-vindo ao Instituto dos Sonhos!"
      });
      
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStepData.id === 'profile') {
      return userChoices.name && userChoices.age && userChoices.mainGoal;
    }
    if (currentStepData.id === 'goals') {
      return userChoices.primaryGoal && userChoices.timeframe && userChoices.commitment;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-netflix-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-netflix-card border-netflix-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStepData.icon}
              <div>
                <CardTitle className="text-netflix-text">{currentStepData.title}</CardTitle>
                <p className="text-sm text-netflix-text-muted">{currentStepData.description}</p>
              </div>
            </div>
            <Badge variant="secondary">
              {currentStep + 1} de {steps.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-netflix-text-muted">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStepData.content}

          <div className="flex justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
              {onSkip && currentStep < steps.length - 1 && !currentStepData.isRequired && (
                <Button variant="ghost" onClick={onSkip}>
                  Pular
                </Button>
              )}
            </div>

            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-instituto-orange hover:bg-instituto-orange-hover"
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};