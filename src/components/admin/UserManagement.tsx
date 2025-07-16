import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  UserPlus, 
  Mail, 
  Calendar, 
  UserCheck, 
  UserX,
  Shield,
  RotateCcw,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  dados_fisicos?: {
    nome_completo: string;
    peso_atual_kg: number;
    altura_cm: number;
    imc: number;
    meta_peso_kg: number;
  } | null;
}

export const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    email: '',
    full_name: '',
    role: 'client' as 'admin' | 'client' | 'visitor'
  });

  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'client' as 'admin' | 'client' | 'visitor'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          email,
          full_name,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar dados físicos para cada perfil
      const usersWithData = await Promise.all(
        profiles.map(async (profile) => {
          const { data: dadosFisicos } = await supabase
            .from('dados_fisicos_usuario')
            .select('nome_completo, peso_atual_kg, altura_cm, imc, meta_peso_kg')
            .eq('user_id', profile.id)
            .maybeSingle();

          return {
            ...profile,
            dados_fisicos: dadosFisicos
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setEditForm({
      email: user.email,
      full_name: user.full_name || '',
      role: user.role as 'admin' | 'client' | 'visitor'
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: editForm.email,
          full_name: editForm.full_name,
          role: editForm.role
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso."
      });

      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive"
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: createForm.email,
        password: createForm.password,
        options: {
          data: {
            full_name: createForm.full_name
          }
        }
      });

      if (authError) throw authError;

      // Como o trigger já cria o perfil, só precisamos atualizar o role se necessário
      if (authData.user && createForm.role !== 'client') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: createForm.role })
          .eq('user_id', authData.user.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso."
      });

      setIsCreateDialogOpen(false);
      setCreateForm({
        email: '',
        password: '',
        full_name: '',
        role: 'client'
      });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o usuário.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Primeiro deletar o perfil (o cascade vai cuidar dos dados relacionados)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso."
      });

      fetchUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.dados_fisicos?.nome_completo && user.dados_fisicos.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'client': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'client': return 'Cliente';
      default: return 'Visitante';
    }
  };

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange"></div>
          <span className="ml-4 text-netflix-text">Carregando usuários...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Shield className="h-5 w-5 text-instituto-orange" />
            Gerenciamento de Usuários ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-netflix-text-muted" />
              <Input
                placeholder="Buscar por email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-netflix-hover border-netflix-border text-netflix-text"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48 bg-netflix-hover border-netflix-border text-netflix-text">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os papéis</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="client">Clientes</SelectItem>
                <SelectItem value="visitor">Visitantes</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="instituto-button">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="create-email">Email</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-password">Senha</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-name">Nome Completo</Label>
                    <Input
                      id="create-name"
                      value={createForm.full_name}
                      onChange={(e) => setCreateForm({...createForm, full_name: e.target.value})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-role">Papel</Label>
                    <Select value={createForm.role} onValueChange={(value: 'admin' | 'client' | 'visitor') => setCreateForm({...createForm, role: value})}>
                      <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="visitor">Visitante</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateUser} className="instituto-button flex-1">
                      Criar Usuário
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-netflix-border text-netflix-text">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={fetchUsers} variant="outline" className="border-netflix-border text-netflix-text hover:bg-netflix-hover">
              <RotateCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-netflix-text mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-netflix-text-muted">
                {searchTerm || roleFilter !== 'all' ? 'Tente ajustar os filtros' : 'Nenhum usuário cadastrado ainda'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-netflix-border">
              {filteredUsers.map((user, index) => (
                <div key={user.id} className="p-6 hover:bg-netflix-hover transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-instituto-orange/20 rounded-full flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-instituto-orange" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-netflix-text">
                            {user.dados_fisicos?.nome_completo || user.full_name || 'Nome não informado'}
                          </h3>
                          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
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
                        {user.dados_fisicos && (
                          <div className="text-xs text-netflix-text-muted">
                            IMC: {user.dados_fisicos.imc} | Peso: {user.dados_fisicos.peso_atual_kg}kg | Meta: {user.dados_fisicos.meta_peso_kg}kg
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                        className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-netflix-card border-netflix-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-netflix-text">
                              Confirmar exclusão
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-netflix-text-muted">
                              Tem certeza que deseja excluir o usuário {user.email}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-netflix-border text-netflix-text">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.user_id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="bg-netflix-hover border-netflix-border text-netflix-text"
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={editForm.full_name}
                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                className="bg-netflix-hover border-netflix-border text-netflix-text"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Papel</Label>
              <Select value={editForm.role} onValueChange={(value: 'admin' | 'client' | 'visitor') => setEditForm({...editForm, role: value})}>
                <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="visitor">Visitante</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateUser} className="instituto-button flex-1">
                Salvar Alterações
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-netflix-border text-netflix-text">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};