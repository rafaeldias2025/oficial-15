import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

export const WelcomeHeader = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [engagementLevel, setEngagementLevel] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    };

    const fetchEngagement = async () => {
      if (!user) return;

      try {
        // Buscar dados de missões e pontuação para calcular engajamento
        const { data: missionsData } = await supabase
          .from('missao_dia')
          .select('concluido')
          .eq('user_id', user.id)
          .limit(7); // últimas 7 missões

        const completedMissions = missionsData?.filter(m => m.concluido).length || 0;
        const totalMissions = missionsData?.length || 0;
        
        if (totalMissions > 0) {
          const engagement = Math.round((completedMissions / totalMissions) * 100);
          setEngagementLevel(engagement);
        }
      } catch (error) {
        console.error('Erro ao calcular engajamento:', error);
      }
    };

    fetchProfile();
    fetchEngagement();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getGenderGreeting = () => {
    if (!profile?.sexo) return 'Sonhadora';
    if (profile.sexo === 'masculino') return 'Sonhador';
    if (profile.sexo === 'feminino') return 'Sonhadora';
    return 'Sonhadora'; // default
  };

  const getEngagementMessage = (level: number) => {
    if (level >= 80) return 'Incrível! Você está dominando sua jornada! 🔥';
    if (level >= 60) return 'Muito bem! Continue assim! 💪';
    if (level >= 40) return 'Bom progresso! Vamos acelerar? 🚀';
    if (level >= 20) return 'Você começou bem! Continue crescendo! 🌱';
    return 'Sua jornada está começando! Vamos juntos! ✨';
  };

  if (!profile) {
    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-instituto-orange/10 to-instituto-purple/10 rounded-xl border border-instituto-orange/20">
        <div className="animate-pulse">
          <div className="h-8 bg-instituto-orange/20 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-instituto-orange/20 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-instituto-orange/10 to-instituto-purple/10 rounded-xl border border-instituto-orange/20 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="h-6 w-6 text-instituto-orange" />
        <h1 className="text-2xl font-bold text-instituto-dark">
          {getGreeting()}, {getGenderGreeting()}!
        </h1>
      </div>
      
      <p className="text-instituto-dark/80 mb-4">
        {getEngagementMessage(engagementLevel)}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-instituto-dark/70 font-medium">
            Nível de Engajamento
          </span>
          <span className="text-instituto-orange font-semibold">
            {engagementLevel}%
          </span>
        </div>
        <Progress 
          value={engagementLevel} 
          className="h-3 bg-instituto-orange/20" 
        />
      </div>
    </div>
  );
};