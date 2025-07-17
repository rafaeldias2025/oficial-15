import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Key, Mail, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AdminUserCreator: React.FC = () => {
  const [email, setEmail] = useState('admin@sonhos.com');
  const [password, setPassword] = useState('Admin123!');
  const [fullName, setFullName] = useState('Administrador Sistema');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    setResult(null);

    try {
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: 'admin'
          }
        }
      });

      if (authError) {
        throw new Error(`Erro na autenticação: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado');
      }

      // 2. Criar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: authData.user.id,
          email: email,
          full_name: fullName,
          celular: phone,
          data_nascimento: '1990-01-01',
          sexo: 'masculino',
          altura_cm: 180,
          role: 'admin'
        });

      if (profileError) {
        console.warn('Aviso ao criar perfil:', profileError);
      }

      setResult({
        success: true,
        message: `✅ Usuário admin criado com sucesso!\nEmail: ${email}\nSenha: ${password}`
      });

      toast({
        title: "✅ Admin criado!",
        description: `Usuário ${email} criado com sucesso`,
        duration: 5000,
      });

    } catch (error: any) {
      console.error('Erro ao criar admin:', error);
      setResult({
        success: false,
        message: `❌ Erro: ${error.message}`
      });

      toast({
        title: "❌ Erro",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-dark flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-netflix-text">
            <Shield className="w-5 h-5 text-instituto-orange" />
            Criar Usuário Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-netflix-text">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sonhos.com"
              className="bg-netflix-dark border-netflix-border text-netflix-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-netflix-text">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin123!"
              className="bg-netflix-dark border-netflix-border text-netflix-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-netflix-text">Nome Completo</label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Administrador Sistema"
              className="bg-netflix-dark border-netflix-border text-netflix-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-netflix-text">Telefone</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="bg-netflix-dark border-netflix-border text-netflix-text"
            />
          </div>

          <Button 
            onClick={handleCreateAdmin} 
            disabled={isCreating}
            className="w-full bg-instituto-orange hover:bg-instituto-orange-hover"
          >
            {isCreating ? 'Criando...' : 'Criar Admin'}
          </Button>

          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
              <AlertDescription className="whitespace-pre-line">
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-xs text-netflix-text-muted space-y-2">
            <p><strong>💡 Instruções:</strong></p>
            <p>1. Preencha os dados acima</p>
            <p>2. Clique em "Criar Admin"</p>
            <p>3. Use o email/senha para fazer login</p>
            <p>4. Acesse /admin para o painel</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
