
import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();

  console.log('AdminProtectedRoute - Loading:', loading, 'IsAdmin:', isAdmin);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <Card className="w-96 bg-netflix-card border-netflix-border">
          <CardContent className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instituto-orange mb-4"></div>
            <p className="text-netflix-text">Verificando permissões...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <Card className="w-96 bg-netflix-card border-netflix-border">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-netflix-text mb-2">
              Acesso Negado
            </h2>
            <p className="text-netflix-text-muted">
              Você não tem permissão para acessar o painel administrativo.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
