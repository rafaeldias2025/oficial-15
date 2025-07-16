import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'spinner' | 'dots' | 'pulse' | 'success' | 'error';
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const LoadingSpinner: React.FC<{ size: string; className?: string }> = ({ size, className }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={cn(size, className)}
  >
    <Loader2 className="w-full h-full" />
  </motion.div>
);

const LoadingDots: React.FC<{ size: string }> = ({ size }) => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut"
        }}
        className={cn(
          "bg-current rounded-full",
          size === 'sm' ? 'w-1 h-1' :
          size === 'md' ? 'w-2 h-2' :
          size === 'lg' ? 'w-3 h-3' :
          'w-4 h-4'
        )}
      />
    ))}
  </div>
);

const LoadingPulse: React.FC<{ size: string }> = ({ size }) => (
  <motion.div
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className={cn(
      "bg-current rounded-full",
      size === 'sm' ? 'w-4 h-4' :
      size === 'md' ? 'w-6 h-6' :
      size === 'lg' ? 'w-8 h-8' :
      'w-12 h-12'
    )}
  />
);

const LoadingSuccess: React.FC<{ size: string }> = ({ size }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className={cn(size, "text-green-500")}
  >
    <Heart className="w-full h-full" />
  </motion.div>
);

const LoadingError: React.FC<{ size: string }> = ({ size }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className={cn(size, "text-red-500")}
  >
    <Star className="w-full h-full" />
  </motion.div>
);

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'default',
  message,
  className,
  fullScreen = false,
}) => {
  const sizeClass = sizeClasses[size];

  const renderLoadingElement = () => {
    switch (variant) {
      case 'spinner':
        return <LoadingSpinner size={sizeClass} className="text-purple-500" />;
      case 'dots':
        return <LoadingDots size={size} />;
      case 'pulse':
        return <LoadingPulse size={size} />;
      case 'success':
        return <LoadingSuccess size={sizeClass} />;
      case 'error':
        return <LoadingError size={sizeClass} />;
      default:
        return <LoadingSpinner size={sizeClass} className="text-blue-500" />;
    }
  };

  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      fullScreen ? "min-h-screen" : "p-8",
      className
    )}>
      <div className="relative">
        {renderLoadingElement()}
        
        {/* Glow effect */}
        {(variant === 'default' || variant === 'spinner') && (
          <div className="absolute inset-0 bg-current rounded-full opacity-20 animate-ping" />
        )}
      </div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-500 text-center max-w-xs"
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Componente de skeleton para carregamento de conteúdo
export const Skeleton: React.FC<{ 
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}> = ({ 
  className, 
  width = 'w-full', 
  height = 'h-4',
  rounded = true 
}) => (
  <div className={cn(
    "animate-pulse bg-gray-200 dark:bg-gray-700",
    width,
    height,
    rounded ? "rounded" : "",
    className
  )} />
);

// Componente de loading para botões
export const ButtonLoading: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={cn(
      "inline-block",
      size === 'sm' ? 'w-3 h-3' :
      size === 'md' ? 'w-4 h-4' :
      'w-5 h-5',
      className
    )}
  >
    <Loader2 className="w-full h-full" />
  </motion.div>
);

// Componente de loading para cards
export const CardLoading: React.FC<{ 
  lines?: number;
  showImage?: boolean;
  className?: string;
}> = ({ lines = 3, showImage = false, className }) => (
  <div className={cn("space-y-4 p-4", className)}>
    {showImage && (
      <Skeleton width="w-full" height="h-48" />
    )}
    
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          width={i === lines - 1 ? 'w-3/4' : 'w-full'}
          height="h-4"
        />
      ))}
    </div>
  </div>
);

// Componente de loading para listas
export const ListLoading: React.FC<{ 
  items?: number;
  className?: string;
}> = ({ items = 5, className }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton width="w-12" height="h-12" rounded />
        <div className="flex-1 space-y-2">
          <Skeleton width="w-1/3" height="h-4" />
          <Skeleton width="w-2/3" height="h-3" />
        </div>
      </div>
    ))}
  </div>
);

// Hook para controlar estados de loading
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setLoadingError = (errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
    setSuccess(false);
  };

  const setLoadingSuccess = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(true);
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    isLoading,
    error,
    success,
    startLoading,
    stopLoading,
    setLoadingError,
    setLoadingSuccess,
    reset,
  };
}; 