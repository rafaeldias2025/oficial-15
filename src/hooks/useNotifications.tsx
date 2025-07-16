import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o browser suporta notificações
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta notificações push",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Permissão concedida",
          description: "Você receberá notificações importantes"
        });
        return true;
      } else {
        toast({
          title: "Permissão negada",
          description: "Você não receberá notificações",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  }, [isSupported, toast]);

  const showNotification = useCallback((data: Omit<NotificationData, 'id'>) => {
    if (permission !== 'granted') {
      toast({
        title: data.title,
        description: data.body
      });
      return;
    }

    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/favicon.ico',
      tag: data.tag || 'default',
      requireInteraction: data.requireInteraction || false
    });

    const notificationData: NotificationData = {
      ...data,
      id: Date.now().toString()
    };

    setNotifications(prev => [...prev, notificationData]);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    notification.onclose = () => {
      setNotifications(prev => prev.filter(n => n.id !== notificationData.id));
    };

    // Auto-close after 5 seconds if not requiring interaction
    if (!data.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }, [permission, toast]);

  const scheduleNotification = useCallback((data: Omit<NotificationData, 'id'>, delay: number) => {
    setTimeout(() => {
      showNotification(data);
    }, delay);
  }, [showNotification]);

  // Notificações específicas do sistema
  const notifyMissionComplete = useCallback((missionName: string) => {
    showNotification({
      title: "Missão Concluída! 🎉",
      body: `Parabéns! Você completou: ${missionName}`,
      tag: 'mission-complete',
      requireInteraction: true
    });
  }, [showNotification]);

  const notifyWeeklyReport = useCallback(() => {
    showNotification({
      title: "Relatório Semanal Disponível 📊",
      body: "Confira seu progresso da semana no painel",
      tag: 'weekly-report'
    });
  }, [showNotification]);

  const notifySessionReminder = useCallback((sessionTime: string) => {
    showNotification({
      title: "Lembrete de Sessão 🕒",
      body: `Sua sessão está agendada para ${sessionTime}`,
      tag: 'session-reminder',
      requireInteraction: true
    });
  }, [showNotification]);

  return {
    permission,
    isSupported,
    notifications,
    requestPermission,
    showNotification,
    scheduleNotification,
    notifyMissionComplete,
    notifyWeeklyReport,
    notifySessionReminder
  };
};