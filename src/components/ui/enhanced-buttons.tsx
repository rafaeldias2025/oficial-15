import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/ui/loading';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EnhancedButtonProps {
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loadingText?: string;
  confirmDestructive?: boolean;
  confirmMessage?: string;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  onClick,
  children,
  variant = 'default',
  size = 'default',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  loadingText,
  confirmDestructive = false,
  confirmMessage = 'Tem certeza que deseja continuar?'
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    try {
      // Confirmar ação destrutiva
      if (confirmDestructive && !window.confirm(confirmMessage)) {
        return;
      }

      setIsLoading(true);
      await onClick();
    } catch (error) {
      console.error('Erro no botão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = disabled || loading || isLoading;
  const showLoading = loading || isLoading;

  return (
    <Button
      type={type}
      onClick={handleClick}
      variant={variant}
      size={size}
      disabled={isDisabled}
      className={cn(
        'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
        showLoading && 'cursor-not-allowed',
        className
      )}
    >
      {showLoading ? (
        <div className="flex items-center">
          <ButtonLoading size="sm" className="mr-2" />
          {loadingText || 'Carregando...'}
        </div>
      ) : (
        <div className="flex items-center">
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {children}
        </div>
      )}
    </Button>
  );
};

// Botões pré-configurados comuns
export const SaveButton: React.FC<{
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ onClick, loading, disabled, className }) => (
  <EnhancedButton
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    className={cn('bg-instituto-orange hover:bg-instituto-orange/90', className)}
    loadingText="Salvando..."
  >
    💾 Salvar
  </EnhancedButton>
);

export const CancelButton: React.FC<{
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ onClick, loading, disabled, className }) => (
  <EnhancedButton
    onClick={onClick}
    variant="outline"
    loading={loading}
    disabled={disabled}
    className={cn('border-netflix-border text-netflix-text hover:bg-netflix-hover', className)}
  >
    ✕ Cancelar
  </EnhancedButton>
);

export const CreateButton: React.FC<{
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ onClick, loading, disabled, className, children }) => (
  <EnhancedButton
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    className={cn('bg-green-600 hover:bg-green-700 text-white', className)}
    loadingText="Criando..."
  >
    {children || '➕ Criar'}
  </EnhancedButton>
);

export const EditButton: React.FC<{
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ onClick, loading, disabled, className }) => (
  <EnhancedButton
    onClick={onClick}
    variant="outline"
    size="sm"
    loading={loading}
    disabled={disabled}
    className={cn('border-netflix-border text-netflix-text hover:bg-netflix-gray', className)}
  >
    📝 Editar
  </EnhancedButton>
);

export const DeleteButton: React.FC<{
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  confirmMessage?: string;
}> = ({ onClick, loading, disabled, className, confirmMessage }) => (
  <EnhancedButton
    onClick={onClick}
    variant="outline"
    size="sm"
    loading={loading}
    disabled={disabled}
    confirmDestructive={true}
    confirmMessage={confirmMessage || 'Tem certeza que deseja excluir? Esta ação não pode ser desfeita.'}
    className={cn('border-red-500/20 text-red-500 hover:bg-red-500/10', className)}
    loadingText="Excluindo..."
  >
    🗑️ Excluir
  </EnhancedButton>
);

export const LogoutButton: React.FC<{
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ onClick, loading, disabled, className }) => (
  <EnhancedButton
    onClick={onClick}
    variant="outline"
    loading={loading}
    disabled={disabled}
    confirmDestructive={true}
    confirmMessage="Tem certeza que deseja sair?"
    className={cn('border-red-500/20 text-red-500 hover:bg-red-500/10', className)}
    loadingText="Saindo..."
  >
    🚪 Sair
  </EnhancedButton>
);

export const RefreshButton: React.FC<{
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ onClick, loading, disabled, className }) => (
  <EnhancedButton
    onClick={onClick}
    variant="outline"
    loading={loading}
    disabled={disabled}
    className={cn('border-netflix-border text-netflix-text hover:bg-netflix-hover', className)}
    loadingText="Atualizando..."
  >
    🔄 Atualizar
  </EnhancedButton>
);

export const SubmitButton: React.FC<{
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ onClick, loading, disabled, className, children }) => (
  <EnhancedButton
    onClick={onClick}
    type="submit"
    loading={loading}
    disabled={disabled}
    className={cn('bg-instituto-orange hover:bg-instituto-orange/90', className)}
    loadingText="Processando..."
  >
    {children || '✓ Confirmar'}
  </EnhancedButton>
);

// Hook para usar com forms
export const useFormButtons = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (onSubmit: () => void | Promise<void>) => {
    try {
      setIsLoading(true);
      await onSubmit();
    } catch (error) {
      console.error('Erro no formulário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSubmit };
}; 