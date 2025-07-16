import React, { useState, useEffect } from 'react';
import { MinhaJornada } from '@/components/MinhaJornada';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { SupportChat } from '@/components/support/SupportChat';
import { useNotifications } from '@/hooks/useNotifications';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { useDataBackup } from '@/hooks/useDataBackup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  Database, 
  Settings,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EnhancedDashboard: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { toast } = useToast();
  
  const { 
    permission, 
    isSupported, 
    requestPermission,
    notifyMissionComplete 
  } = useNotifications();
  
  const { 
    isOnline, 
    pendingActions 
  } = useOfflineMode();
  
  const { 
    lastBackup, 
    createBackup 
  } = useDataBackup();

  useEffect(() => {
    // Verificar se é a primeira visita
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    const isNewUser = !hasCompletedOnboarding;
    
    if (isNewUser) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
    }

    // Auto-backup se necessário
    const lastBackupTime = localStorage.getItem('last_backup');
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (!lastBackupTime || (now - new Date(lastBackupTime).getTime()) > dayInMs) {
      setTimeout(() => {
        createBackup('automatic');
      }, 5000); // Delay para não sobrecarregar o carregamento inicial
    }
  }, [createBackup]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setIsFirstVisit(false);
    
    // Solicitar permissão para notificações após onboarding
    if (isSupported && permission !== 'granted') {
      setTimeout(() => {
        requestPermission();
      }, 1000);
    }

    toast({
      title: "Bem-vindo ao Instituto dos Sonhos! 🌟",
      description: "Sua jornada de transformação começa agora!"
    });
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding_skipped', 'true');
    
    toast({
      title: "Onboarding ignorado",
      description: "Você pode acessar as configurações a qualquer momento"
    });
  };

  return (
    <div className="min-h-screen bg-netflix-background">
      {/* Status Bar */}
      <div className="bg-netflix-card border-b border-netflix-border p-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? "default" : "destructive"} className="gap-1">
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
            
            {pendingActions > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Database className="h-3 w-3" />
                {pendingActions} ações pendentes
              </Badge>
            )}
            
            {permission === 'granted' && (
              <Badge variant="default" className="gap-1">
                <Bell className="h-3 w-3" />
                Notificações ativas
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isFirstVisit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOnboarding(true)}
                className="gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Tutorial
              </Button>
            )}
            
            {permission !== 'granted' && isSupported && (
              <Button
                variant="outline"
                size="sm"
                onClick={requestPermission}
                className="gap-1"
              >
                <Bell className="h-4 w-4" />
                Ativar notificações
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <MinhaJornada />

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Support Chat Widget */}
      <SupportChat />

      {/* Quick Actions Overlay para novos usuários */}
      {isFirstVisit && !showOnboarding && (
        <div className="fixed bottom-20 right-4 z-40">
          <Card className="bg-instituto-orange text-white border-instituto-orange-hover shadow-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Dica
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm mb-3">
                Clique no ícone de mensagem para acessar o suporte 24/7!
              </p>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => {
                  setIsFirstVisit(false);
                  localStorage.setItem('tips_seen', 'true');
                }}
                className="w-full"
              >
                Entendi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};