import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Sparkles, ArrowRight, Heart, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConversionCTAProps {
  variant?: 'default' | 'inline' | 'floating' | 'banner';
  message?: string;
  className?: string;
}

const ConversionCTA = ({ 
  variant = 'default', 
  message,
  className = ''
}: ConversionCTAProps) => {
  const navigate = useNavigate();

  const handleConversion = () => {
    navigate('/auth');
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}>
        <Card className="border-instituto-orange/20 bg-white shadow-warm animate-slide-in-right">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-instituto-orange/10 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-instituto-orange" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-instituto-dark">
                  Desbloqueie Tudo! 
                </h4>
                <p className="text-xs text-instituto-dark/70">
                  {message || "Cadastre-se para acesso completo"}
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handleConversion}
                className="bg-instituto-orange hover:bg-instituto-orange-hover"
              >
                <Sparkles className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-instituto-orange to-instituto-warm p-4 ${className}`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between text-white">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <Crown className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">
                  {message || "Você está no modo visitante"}
                </h3>
                <p className="text-sm text-white/90">
                  Cadastre-se grátis para salvar progresso e acessar conteúdo exclusivo
                </p>
              </div>
            </div>
            <Button 
              onClick={handleConversion}
              variant="outline"
              className="bg-white text-instituto-orange hover:bg-instituto-light border-white"
            >
              Criar Conta Gratuita
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <Card className={`border-instituto-orange/20 bg-gradient-to-r from-instituto-orange/5 to-instituto-warm/10 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-instituto-orange animate-pulse" />
            <h3 className="font-semibold text-instituto-dark">Gostou do que viu?</h3>
            <Heart className="h-5 w-5 text-instituto-orange animate-pulse" />
          </div>
          <p className="text-sm text-instituto-dark/70 mb-4">
            {message || "Clientes registrados recebem sessões completas, desafios personalizados e acompanhamento do Rafael."}
          </p>
          <Button 
            onClick={handleConversion}
            className="bg-instituto-orange hover:bg-instituto-orange-hover"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Cadastrar Gratuitamente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-instituto-dark/60">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              4.9/5 avaliação
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              500+ membros
            </div>
            <span>100% gratuito</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`border-instituto-orange/20 bg-gradient-to-r from-instituto-orange/5 to-instituto-warm/10 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-semibold text-instituto-dark mb-2 flex items-center justify-center md:justify-start gap-2">
              <Crown className="w-5 h-5 text-instituto-orange" />
              Desbloqueie Todo o Conteúdo
            </h3>
            <p className="text-instituto-dark/70">
              {message || "Clientes registrados têm acesso a sessões completas, desafios personalizados e acompanhamento do Rafael."}
            </p>
          </div>
          <Button 
            onClick={handleConversion}
            size="lg"
            className="bg-instituto-orange hover:bg-instituto-orange-hover whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Cadastre-se Grátis
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionCTA;