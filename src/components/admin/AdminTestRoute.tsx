import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedAdminDashboard } from './EnhancedAdminDashboard';

export const AdminTestRoute: React.FC = () => {
  const { user, session } = useAuth();
  const { isAdmin, loading } = useAdminAuth();

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
    <div>
      <div className="bg-green-500 text-white p-4 text-center">
        ✅ ACESSO LIBERADO! Usuário admin verificado com sucesso.
      </div>
      <EnhancedAdminDashboard />
    </div>
  );
}; 