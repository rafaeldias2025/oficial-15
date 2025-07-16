import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, Sparkles, Target, Zap, Heart, 
  Award, Star, Trophy, Gift 
} from 'lucide-react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'complete' | 'goal' | 'challenge' | 'premium' | 'hero' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ComponentType<any>;
  showGlow?: boolean;
  pulseOnHover?: boolean;
  completionEffect?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'complete',
  size = 'md',
  disabled = false,
  className,
  icon,
  showGlow = true,
  pulseOnHover = true,
  completionEffect = false
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleClick = async () => {
    if (disabled || isCompleting) return;

    if (completionEffect) {
      setIsCompleting(true);
      
      // Simulação de completar tarefa
      setTimeout(() => {
        setIsCompleted(true);
        setIsCompleting(false);
        
        // Reset após animação
        setTimeout(() => {
          setIsCompleted(false);
        }, 2000);
      }, 800);
    }

    if (onClick) {
      onClick();
    }
  };

  const getVariantStyles = () => {
    const baseStyles = "relative overflow-hidden transition-all duration-300 font-semibold";
    
    const variants = {
      complete: `
        bg-gradient-to-r from-instituto-green to-instituto-green-light 
        text-white border-0 shadow-lg
        hover:shadow-xl hover:shadow-green-500/25
        ${showGlow ? 'hover:shadow-green-400/40' : ''}
        ${pulseOnHover ? 'hover:scale-105' : ''}
        active:scale-95
      `,
      goal: `
        bg-gradient-to-r from-instituto-orange to-instituto-orange-hover 
        text-white border-0 shadow-lg
        hover:shadow-xl hover:shadow-orange-500/25
        ${showGlow ? 'hover:shadow-orange-400/40' : ''}
        ${pulseOnHover ? 'hover:scale-105' : ''}
        active:scale-95
      `,
      challenge: `
        bg-gradient-to-r from-instituto-purple to-instituto-purple-light 
        text-white border-0 shadow-lg
        hover:shadow-xl hover:shadow-purple-500/25
        ${showGlow ? 'hover:shadow-purple-400/40' : ''}
        ${pulseOnHover ? 'hover:scale-105' : ''}
        active:scale-95
      `,
      premium: `
        bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
        text-white border-0 shadow-lg
        hover:shadow-xl hover:shadow-yellow-500/25
        ${showGlow ? 'hover:shadow-yellow-400/40' : ''}
        ${pulseOnHover ? 'hover:scale-105' : ''}
        active:scale-95
      `,
      hero: `
        bg-white/10 text-white border border-white/20 backdrop-blur-sm
        hover:bg-white/20 hover:border-white/30
        ${showGlow ? 'hover:shadow-lg hover:shadow-white/20' : ''}
        ${pulseOnHover ? 'hover:scale-105' : ''}
        active:scale-95
      `,
      success: `
        bg-gradient-to-r from-emerald-500 to-teal-500 
        text-white border-0 shadow-lg
        hover:shadow-xl hover:shadow-emerald-500/25
        ${showGlow ? 'hover:shadow-emerald-400/40' : ''}
        ${pulseOnHover ? 'hover:scale-105' : ''}
        active:scale-95
      `
    };

    return variants[variant] || variants.complete;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg'
    };
    return sizes[size];
  };

  const getDefaultIcon = () => {
    const icons = {
      complete: CheckCircle,
      goal: Target,
      challenge: Zap,
      premium: Star,
      hero: Heart,
      success: Trophy
    };
    return icons[variant];
  };

  const IconComponent = icon || getDefaultIcon();

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isCompleting}
      className={cn(
        getVariantStyles(),
        getSizeStyles(),
        "group",
        {
          'opacity-50 cursor-not-allowed': disabled,
          'animate-pulse': isCompleting,
        },
        className
      )}
    >
      {/* Efeito de brilho de fundo */}
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      )}
      
      {/* Conteúdo do botão */}
      <div className="relative flex items-center gap-2">
        {IconComponent && (
          <IconComponent 
            className={cn(
              "transition-all duration-300",
              size === 'sm' ? "w-4 h-4" : size === 'lg' ? "w-6 h-6" : "w-5 h-5",
              {
                'animate-spin': isCompleting,
                'text-green-300': isCompleted && variant === 'complete',
                'group-hover:rotate-12': !isCompleting && !isCompleted,
              }
            )} 
          />
        )}
        
        <span className={cn(
          "transition-all duration-300",
          {
            'group-hover:tracking-wide': !isCompleting && !isCompleted,
          }
        )}>
          {isCompleting ? 'Completando...' : isCompleted ? 'Concluído!' : children}
        </span>
        
        {/* Sparkles para efeito premium */}
        {variant === 'premium' && (
          <Sparkles className={cn(
            "transition-all duration-300",
            size === 'sm' ? "w-3 h-3" : size === 'lg' ? "w-5 h-5" : "w-4 h-4",
            "group-hover:animate-pulse"
          )} />
        )}
      </div>
      
      {/* Efeito de sucesso */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-green-500/20 animate-ping rounded-md" />
        </div>
      )}
      
      {/* Partículas para efeito premium */}
      {variant === 'premium' && (
        <>
          <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-100" />
          <div className="absolute top-2 right-3 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-2 left-3 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-500" />
        </>
      )}
    </Button>
  );
};

// Botões especializados para casos específicos
export const CompleteButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton {...props} variant="complete" />
);

export const GoalButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton {...props} variant="goal" />
);

export const ChallengeButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton {...props} variant="challenge" />
);

export const PremiumButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton {...props} variant="premium" />
);

export const HeroButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton {...props} variant="hero" />
);

export default AnimatedButton;