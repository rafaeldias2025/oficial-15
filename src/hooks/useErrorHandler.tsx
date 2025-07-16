import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  message: string;
  code?: string;
  timestamp: number;
  context?: string;
  retry?: () => void;
}

interface UseErrorHandlerReturn {
  errors: ErrorInfo[];
  handleError: (error: any, context?: string, retry?: () => void) => void;
  clearErrors: () => void;
  clearError: (timestamp: number) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleError = useCallback((error: any, context?: string, retry?: () => void) => {
    console.error('Error caught by error handler:', error, 'Context:', context);
    
    let errorMessage = 'Ocorreu um erro inesperado';
    let errorCode = 'UNKNOWN_ERROR';

    // Tratamento específico para diferentes tipos de erro
    if (error?.message) {
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        errorCode = 'CONNECTION_ERROR';
      } else if (error.message.includes('NetworkError')) {
        errorMessage = 'Erro de rede. Verifique sua conexão.';
        errorCode = 'NETWORK_ERROR';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Operação demorou muito. Tente novamente.';
        errorCode = 'TIMEOUT_ERROR';
      } else if (error.message.includes('Unauthorized')) {
        errorMessage = 'Acesso não autorizado. Faça login novamente.';
        errorCode = 'UNAUTHORIZED';
      } else if (error.message.includes('Forbidden')) {
        errorMessage = 'Você não tem permissão para esta ação.';
        errorCode = 'FORBIDDEN';
      } else if (error.message.includes('Not Found')) {
        errorMessage = 'Recurso não encontrado.';
        errorCode = 'NOT_FOUND';
      } else if (error.message.includes('Internal Server Error')) {
        errorMessage = 'Erro interno do servidor. Tente mais tarde.';
        errorCode = 'SERVER_ERROR';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciais inválidas. Verifique email e senha.';
        errorCode = 'INVALID_CREDENTIALS';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado.';
        errorCode = 'USER_EXISTS';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido.';
        errorCode = 'INVALID_EMAIL';
      } else {
        errorMessage = error.message;
        errorCode = 'CUSTOM_ERROR';
      }
    }

    // Supabase specific errors
    if (error?.code) {
      switch (error.code) {
        case 'PGRST116':
          errorMessage = 'Dados não encontrados.';
          errorCode = 'DATA_NOT_FOUND';
          break;
        case 'PGRST301':
          errorMessage = 'Erro de validação nos dados.';
          errorCode = 'VALIDATION_ERROR';
          break;
        case '23505':
          errorMessage = 'Dados duplicados. Este registro já existe.';
          errorCode = 'DUPLICATE_DATA';
          break;
        case '23503':
          errorMessage = 'Referência inválida nos dados.';
          errorCode = 'FOREIGN_KEY_ERROR';
          break;
        case '23502':
          errorMessage = 'Campos obrigatórios não preenchidos.';
          errorCode = 'REQUIRED_FIELDS';
          break;
        case '42501':
          errorMessage = 'Permissão insuficiente para esta operação.';
          errorCode = 'INSUFFICIENT_PERMISSION';
          break;
        default:
          errorCode = error.code;
      }
    }

    const errorInfo: ErrorInfo = {
      message: errorMessage,
      code: errorCode,
      timestamp: Date.now(),
      context: context || 'Unknown',
      retry
    };

    setErrors(prev => [...prev, errorInfo]);

    // Mostrar toast com erro
    toast({
      title: "❌ Erro",
      description: errorMessage,
      variant: "destructive"
    });

    // Auto-remover erro após 10 segundos
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.timestamp !== errorInfo.timestamp));
    }, 10000);

  }, [toast]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearError = useCallback((timestamp: number) => {
    setErrors(prev => prev.filter(e => e.timestamp !== timestamp));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Log de erros para debugging
  useEffect(() => {
    if (errors.length > 0) {
      console.group('🔴 Error Handler - Active Errors');
      errors.forEach((error, index) => {
        console.error(`${index + 1}. ${error.context}: ${error.message} (${error.code})`);
      });
      console.groupEnd();
    }
  }, [errors]);

  return {
    errors,
    handleError,
    clearErrors,
    clearError,
    isLoading,
    setLoading
  };
};

// Componente de exibição de erros
export const ErrorDisplay: React.FC<{ 
  errors: ErrorInfo[]; 
  onClearError: (timestamp: number) => void;
  onClearAll: () => void;
}> = ({ errors, onClearError, onClearAll }) => {
  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {errors.map((error) => (
        <div 
          key={error.timestamp}
          className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-800">
                {error.message}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {error.context} • {new Date(error.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {error.retry && (
                <button
                  onClick={error.retry}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Tentar novamente
                </button>
              )}
              <button
                onClick={() => onClearError(error.timestamp)}
                className="text-red-400 hover:text-red-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {errors.length > 1 && (
        <div className="text-center">
          <button
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-800 underline"
          >
            Limpar todos os erros
          </button>
        </div>
      )}
    </div>
  );
}; 