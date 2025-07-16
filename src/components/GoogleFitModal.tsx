import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Chrome, Activity, Heart, Scale, Calendar, Shield, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GoogleFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (email: string) => Promise<void>;
  isLoading: boolean;
  isConnected: boolean;
}

export const GoogleFitModal: React.FC<GoogleFitModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  isLoading,
  isConnected
}) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'connecting' | 'permissions' | 'success'>('email');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email obrigatório',
        description: 'Por favor, insira seu email do Google',
        variant: 'destructive',
      });
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um email válido',
        variant: 'destructive',
      });
      return;
    }

    setStep('connecting');
    
    try {
      await onConnect(email);
      setStep('success');
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
        setStep('email');
        setEmail('');
      }, 2000);
    } catch (error) {
      setStep('email');
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar com o Google Fit. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setStep('email');
      setEmail('');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Chrome className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="text-xl font-semibold">Conectar com Google Fit</h3>
              <p className="text-muted-foreground">
                Sincronize seus dados de saúde e fitness automaticamente
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email da conta Google</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Use o email da conta Google que tem acesso ao Google Fit
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Dados que serão sincronizados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
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
                  </div>
                  <Badge variant="outline" className="w-full justify-center">
                    Seus dados ficam seguros e privados
                  </Badge>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !email}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Chrome className="h-4 w-4 mr-2" />
                      Conectar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        );

      case 'connecting':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Conectando com Google Fit</h3>
              <p className="text-muted-foreground">
                Redirecionando para autorização...
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
                Seus dados do Google Fit serão sincronizados automaticamente
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
          <DialogTitle>Integração Google Fit</DialogTitle>
          <DialogDescription>
            Configure a sincronização automática dos seus dados de saúde
          </DialogDescription>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}; 