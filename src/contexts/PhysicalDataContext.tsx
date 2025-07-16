import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePhysicalDataComplete } from '@/hooks/usePhysicalDataComplete';

interface PhysicalDataContextType {
  isPhysicalDataComplete: boolean | null;
  isLoading: boolean;
  markAsComplete: () => void;
  showCadastroCompleto: boolean;
  setShowCadastroCompleto: (show: boolean) => void;
}

const PhysicalDataContext = createContext<PhysicalDataContextType | undefined>(undefined);

export const PhysicalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isComplete, isLoading, markAsComplete } = usePhysicalDataComplete();
  const [showCadastroCompleto, setShowCadastroCompleto] = useState(false);

  // Controlar a exibição do formulário baseado no estado dos dados físicos
  useEffect(() => {
    if (user && !isLoading && isComplete !== null) {
      setShowCadastroCompleto(!isComplete);
    }
  }, [user, isComplete, isLoading]);

  const handleMarkAsComplete = () => {
    markAsComplete();
    setShowCadastroCompleto(false);
  };

  return (
    <PhysicalDataContext.Provider value={{
      isPhysicalDataComplete: isComplete,
      isLoading,
      markAsComplete: handleMarkAsComplete,
      showCadastroCompleto,
      setShowCadastroCompleto
    }}>
      {children}
    </PhysicalDataContext.Provider>
  );
};

export const usePhysicalDataContext = () => {
  const context = useContext(PhysicalDataContext);
  if (context === undefined) {
    throw new Error('usePhysicalDataContext must be used within a PhysicalDataProvider');
  }
  return context;
};