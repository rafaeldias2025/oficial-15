import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, Mail, Calendar, UserCheck, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  nome_completo_dados: string | null;
}

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.nome_completo_dados && user.nome_completo_dados.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, email, full_name, role, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar dados físicos para cada perfil
      const usersWithData = await Promise.all(
        profiles.map(async (profile) => {
          const { data: dadosFisicos } = await supabase
            .from('dados_fisicos_usuario')
            .select('nome_completo')
            .eq('user_id', profile.id)
            .maybeSingle();

          return {
            ...profile,
            nome_completo_dados: dadosFisicos?.nome_completo || null
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'client':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'client':
        return 'Cliente';
      default:
        return 'Usuário';
    }
  };

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange mx-auto mb-4"></div>
            <p className="text-netflix-text-muted">Carregando usuários...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Users className="h-5 w-5" />
          Lista de Usuários ({users.length})
        </CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-netflix-text-muted" />
            <Input
              placeholder="Buscar por email ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-netflix-hover border-netflix-border text-netflix-text"
            />
          </div>
          <Button onClick={fetchUsers} variant="outline" className="border-netflix-border text-netflix-text hover:bg-netflix-hover">
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-netflix-text mb-2">
              {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
            </h3>
            <p className="text-netflix-text-muted">
              {searchTerm ? 'Tente uma busca diferente' : 'Os usuários aparecerão aqui quando se cadastrarem'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-4 bg-netflix-hover rounded-lg border border-netflix-border hover:border-instituto-orange/50 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-instituto-orange/20 rounded-full flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-instituto-orange" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-netflix-text">
                        {user.nome_completo_dados || user.full_name || 'Nome não informado'}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={getRoleBadgeColor(user.role)}
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-netflix-text-muted">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.nome_completo_dados ? (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Dados Completos
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      Cadastro Incompleto
                    </Badge>
                  )}
                  
                  {/* Botões de ação com ícones pequenos */}
                  <div className="flex items-center gap-1 ml-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-instituto-orange hover:bg-instituto-orange/10"
                      title="Editar usuário"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/10"
                      title="Enviar WhatsApp"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                      </svg>
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10"
                      title="Enviar Email"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};