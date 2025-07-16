import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Apple, Activity, Heart, Scale, Calendar, Shield, Check, Moon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AppleHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
  isLoading: boolean;
  isConnected: boolean;
}

export const AppleHealthModal: React.FC<AppleHealthModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  isLoading,
  isConnected
}) => {
  const [step, setStep] = useState<'info' | 'connecting' | 'permissions' | 'success'>('info');
  const { toast } = useToast();

  const handleConnect = async () => {
    setStep('connecting');
    
    try {
      await onConnect();
      setStep('success');
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
        setStep('info');
      }, 2000);
    } catch (error) {
      setStep('info');
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar com Apple Health. Verifique as permissões.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setStep('info');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'info':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Apple className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-semibold">Conectar com Apple Health</h3>
              <p className="text-muted-foreground">
                Sincronize seus dados de saúde e fitness automaticamente
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Dados que serão sincronizados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Peso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Passos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Freq. Cardíaca</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Atividades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm">Sono</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Calorias</span>
                  </div>
                </div>
                <Badge variant="outline" className="w-full justify-center">
                  Seus dados ficam seguros e privados
                </Badge>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Esta funcionalidade está disponível apenas em dispositivos iOS com Apple Health configurado.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Permissões:</strong> Você será solicitado a autorizar o acesso aos seus dados de saúde.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleConnect}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Apple className="h-4 w-4 mr-2" />
                    Conectar
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'connecting':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-16 w-16 text-green-600 mx-auto animate-spin" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Conectando com Apple Health</h3>
              <p className="text-muted-foreground">
                Solicitando permissões de acesso...
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-green-700">Conectado com sucesso!</h3>
              <p className="text-muted-foreground">
                Seus dados do Apple Health serão sincronizados automaticamente
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Integração Apple Health</DialogTitle>
          <DialogDescription>
            Configure a sincronização automática dos seus dados de saúde
          </DialogDescription>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}; 