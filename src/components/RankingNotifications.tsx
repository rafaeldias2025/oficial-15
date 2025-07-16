import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ArrowUp, ArrowDown, Medal, Crown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useUserPoints } from '@/hooks/useUserPoints';

interface RankingNotification {
  id: string;
  type: 'position-change' | 'achievement' | 'level-up' | 'streak';
  message: string;
  icon: React.ReactNode;
  timestamp: Date;
}

export const RankingNotifications = () => {
  const [notifications, setNotifications] = useState<RankingNotification[]>([]);
  const { currentUserRanking } = useUserPoints();
  const [previousRanking, setPreviousRanking] = useState(currentUserRanking?.position);

  useEffect(() => {
    if (!currentUserRanking || !previousRanking) {
      setPreviousRanking(currentUserRanking?.position);
      return;
    }

    // Detectar mudanças de posição
    if (currentUserRanking.position !== previousRanking) {
      const improved = currentUserRanking.position < previousRanking;
      const notification: RankingNotification = {
        id: Date.now().toString(),
        type: 'position-change',
        message: improved 
          ? `Parabéns! Você subiu para a ${currentUserRanking.position}ª posição!` 
          : `Você desceu para a ${currentUserRanking.position}ª posição. Continue se esforçando!`,
        icon: improved ? <ArrowUp className="text-green-500" /> : <ArrowDown className="text-red-500" />,
        timestamp: new Date()
      };
      
      addNotification(notification);
      
      // Mostrar toast apenas para melhorias de posição
      if (improved) {
        toast({
          title: "🎉 Nova Conquista!",
          description: notification.message,
          duration: 5000,
        });
      }
    }

    setPreviousRanking(currentUserRanking.position);
  }, [currentUserRanking?.position]);

  const addNotification = (notification: RankingNotification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 5)); // Manter apenas as 5 últimas
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">Suas Atualizações</h3>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`
              flex items-center gap-3 p-3 rounded-lg border
              ${notification.type === 'position-change' && notification.message.includes('subiu') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'}
            `}
          >
            <div className="flex-shrink-0">
              {notification.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Nenhuma atualização recente</p>
          <p className="text-sm">Continue participando para ver seu progresso!</p>
        </div>
      )}
    </div>
  );
}; 