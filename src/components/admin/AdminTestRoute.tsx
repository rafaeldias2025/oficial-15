import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Database, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createDemoUsers, cleanDemoUsers } from '@/utils/createDemoUsers';
import { AdminProtectedRoute } from './AdminProtectedRoute';
import { EnhancedAdminDashboard } from './EnhancedAdminDashboard';

// Componente principal AdminTestRoute
export const AdminTestRoute: React.FC = () => {
  return (
    <AdminProtectedRoute>
      <EnhancedAdminDashboard />
    </AdminProtectedRoute>
  );
};

// Bloco de ferramentas demo para ser usado dentro da aba de configurações do painel admin
export const DemoUsersTools: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const [quantidade, setQuantidade] = useState(20);
  const { toast } = useToast();

  const handleCreateDemoUsers = async () => {
    setIsCreating(true);
    setResult(null);
    try {
      const result = await createDemoUsers(quantidade);
      setResult({
        success: true,
        message: `${result.count} usuários criados com sucesso!`,
        count: result.count
      });
      toast({
        title: "✅ Usuários criados!",
        description: `${result.count} usuários foram adicionados ao sistema`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao criar usuários:', error);
      setResult({
        success: false,
        message: 'Erro ao criar usuários. Verifique o console para mais detalhes.',
      });
      toast({
        title: "❌ Erro",
        description: "Falha ao criar usuários",
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

  return (
    <Card className="w-full max-w-xl bg-netflix-card border-netflix-border my-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-netflix-text">
          <Users className="w-5 h-5" /> Ferramenta de Usuários Demo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="quantidade-demo-users" className="text-netflix-text-muted">Quantidade:</label>
            <input
              id="quantidade-demo-users"
              type="number"
              min={1}
              max={100}
              value={quantidade}
              onChange={e => setQuantidade(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded border border-netflix-border bg-netflix-dark text-netflix-text"
            />
            <Button onClick={handleCreateDemoUsers} disabled={isCreating} className="ml-2">
              {isCreating ? 'Criando...' : 'Criar Usuários'}
            </Button>
            <Button onClick={handleCleanDemoUsers} disabled={isCleaning} variant="destructive" className="ml-2">
              {isCleaning ? 'Limpando...' : 'Limpar Usuários'}
            </Button>
          </div>
          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'} className="mt-2">
              {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};