import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Database, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createDemoUsers, cleanDemoUsers } from '@/utils/createDemoUsers';
import { EnhancedAdminDashboard } from './EnhancedAdminDashboard';

export const AdminTestRoute: React.FC = () => {
  const { user, session } = useAuth();
  const { isAdmin, loading } = useAdminAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const { toast } = useToast();

  const handleCreateDemoUsers = async () => {
    setIsCreating(true);
    setResult(null);
    
    try {
      const result = await createDemoUsers();
      setResult({
        success: true,
        message: `${result.count} usuários fictícios criados com sucesso!`,
        count: result.count
      });
      
      toast({
        title: "✅ Usuários criados!",
        description: `${result.count} usuários fictícios foram adicionados ao sistema`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao criar usuários:', error);
      setResult({
        success: false,
        message: 'Erro ao criar usuários fictícios. Verifique o console para mais detalhes.',
      });
      
      toast({
        title: "❌ Erro",
        description: "Falha ao criar usuários fictícios",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCleanDemoUsers = async () => {
    setIsCleaning(true);
    setResult(null);
    
    try {
      await cleanDemoUsers();
      setResult({
        success: true,
        message: 'Usuários fictícios removidos com sucesso!',
      });
      
      toast({
        title: "🧹 Limpeza concluída",
        description: "Todos os usuários fictícios foram removidos",
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao limpar usuários:', error);
      setResult({
        success: false,
        message: 'Erro ao remover usuários fictícios. Verifique o console para mais detalhes.',
      });
      
      toast({
        title: "❌ Erro",
        description: "Falha ao remover usuários fictícios",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsCleaning(false);
    }
  };

  console.log('🧪 AdminTestRoute - user:', user?.id);
  console.log('🧪 AdminTestRoute - session:', !!session);
  console.log('🧪 AdminTestRoute - isAdmin:', isAdmin);
  console.log('🧪 AdminTestRoute - loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <Card className="w-96 bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text">Carregando...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instituto-orange mb-4"></div>
            <p className="text-netflix-text">Verificando permissões...</p>
            <div className="mt-4 text-sm text-netflix-text-muted">
              <p>User: {user?.id || 'None'}</p>
              <p>Session: {session ? 'Active' : 'None'}</p>
              <p>IsAdmin: {String(isAdmin)}</p>
              <p>Loading: {String(loading)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !session) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <Card className="w-96 bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text">Não Autenticado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-netflix-text-muted">
              Você precisa fazer login para acessar esta página.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'} 
              className="mt-4"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin !== true) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <Card className="w-96 bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-netflix-text-muted">
              Você não tem permissão para acessar o painel administrativo.
            </p>
            <div className="mt-4 text-sm text-netflix-text-muted">
              <p>User ID: {user?.id}</p>
              <p>Email: {user?.email}</p>
              <p>Session: {session ? 'Active' : 'None'}</p>
              <p>IsAdmin: {String(isAdmin)}</p>
              <p>Loading: {String(loading)}</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/auth'} 
              className="mt-4"
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ferramentas de Demonstração */}
      <Card className="border-instituto-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Ferramentas de Demonstração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Criar Usuários Fictícios
              </h3>
              <p className="text-sm text-muted-foreground">
                Gera 20 usuários com pontuações, missões e dados realistas para demonstração do ranking.
              </p>
              <Button 
                onClick={handleCreateDemoUsers}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? 'Criando...' : 'Criar 20 Usuários Demo'}
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Limpar Usuários Fictícios
              </h3>
              <p className="text-sm text-muted-foreground">
                Remove todos os usuários fictícios criados para demonstração.
              </p>
              <Button 
                onClick={handleCleanDemoUsers}
                disabled={isCleaning}
                variant="destructive"
                className="w-full"
              >
                {isCleaning ? 'Limpando...' : 'Remover Usuários Demo'}
              </Button>
            </div>
          </div>

          {result && (
            <Alert className={result.success ? 'border-green-500' : 'border-red-500'}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <AlertDescription>{result.message}</AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dashboard Principal */}
      <EnhancedAdminDashboard />
    </div>
  );
}; 