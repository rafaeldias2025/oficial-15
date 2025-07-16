import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useVisitorData } from '@/hooks/useVisitorData';
import { Crown, Sparkles, Star, Users, Clock, CheckCircle, Heart, Gift } from 'lucide-react';

interface RegistrationIncentiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationIncentiveModal = ({ isOpen, onClose }: RegistrationIncentiveModalProps) => {
  const navigate = useNavigate();
  const { getVisitorStats } = useVisitorData();
  const stats = getVisitorStats();

  const handleRegister = () => {
    navigate('/auth');
    onClose();
  };

  const handleContinueAsVisitor = () => {
    // Store that user chose to continue as visitor (to not show again too soon)
    localStorage.setItem('visitor_modal_dismissed', Date.now().toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-instituto-orange to-instituto-warm rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-instituto-dark">
            💾 Quer Salvar Seu Progresso?
          </DialogTitle>
          <DialogDescription className="text-instituto-dark/70 text-base">
            Você tem acesso completo às sessões! Cadastre-se apenas para salvar seus dados permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progresso do visitante */}
          <Card className="border-instituto-orange/20 bg-instituto-orange/5">
            <CardContent className="p-4">
              <h4 className="font-semibold text-instituto-dark mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-instituto-orange" />
                Seu progresso até agora:
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-instituto-orange">{stats.completedSessions}</div>
                  <div className="text-instituto-dark/70">Amostras vistas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-instituto-orange">{Math.round(stats.timeSpent)}</div>
                  <div className="text-instituto-dark/70">Minutos de aprendizado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefícios do cadastro */}
          <div className="space-y-3">
            <h4 className="font-semibold text-instituto-dark">
              💾 Benefícios exclusivos do cadastro:
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-instituto-light rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-instituto-dark">
                  <strong>Progresso permanente</strong> - nunca perca suas respostas
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-instituto-light rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-instituto-dark">
                  <strong>Metas personalizadas</strong> e acompanhamento do Rafael
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-instituto-light rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-instituto-dark">
                  <strong>Insights avançados</strong> baseado no seu progresso
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-instituto-light rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-instituto-dark">
                  <strong>Conteúdo exclusivo</strong> para clientes registrados
                </span>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 py-4 bg-instituto-warm/20 rounded-lg">
            <div className="flex items-center gap-1 text-sm text-instituto-dark/70">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 avaliação</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-instituto-dark/70">
              <Users className="w-4 h-4" />
              <span>500+ membros</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-instituto-dark/70">
              <Gift className="w-4 h-4 text-instituto-orange" />
              <span>100% gratuito</span>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleRegister}
              size="lg"
              className="w-full bg-instituto-orange hover:bg-instituto-orange-hover text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Cadastrar Gratuitamente
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              onClick={handleContinueAsVisitor}
              variant="ghost"
              size="sm"
              className="text-instituto-dark/70 hover:text-instituto-dark"
            >
              Continuar explorando como visitante
            </Button>
          </div>

          <div className="text-center text-xs text-instituto-dark/60">
            Ao se cadastrar, você concorda com nossos Termos de Uso
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationIncentiveModal;