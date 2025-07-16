import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Users, UserPlus, Edit, Trash2, Search, RotateCw, UserCheck, UserX, Crown, Check, X } from 'lucide-react';
import { ButtonLoading } from '@/components/ui/loading';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'client' as 'admin' | 'client' | 'visitor'
  });
  
  const [editForm, setEditForm] = useState({
    email: '',
    full_name: '',
    role: 'client' as 'admin' | 'client' | 'visitor'
  });

  // Buscar usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      handleError(error, 'Carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Criar usuário
  const handleCreateUser = async () => {
    if (!createForm.email || !createForm.password || !createForm.full_name) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      
      toast({
        title: "👤 Criando usuário...",
        description: "Aguarde enquanto criamos o usuário"
      });

      // Criar usuário no Auth
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

      // Atualizar perfil com role
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: createForm.full_name,
            role: createForm.role
          })
          .eq('user_id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "✅ Usuário criado com sucesso!",
        description: `${createForm.full_name} foi adicionado ao sistema`
      });

      // Resetar formulário
      setCreateForm({
        email: '',
        password: '',
        full_name: '',
        role: 'client'
      });

      setIsCreateDialogOpen(false);
      fetchUsers();
    } catch (error) {
      handleError(error, 'Criar usuário');
    } finally {
      setIsCreating(false);
    }
  };

  // Editar usuário
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role || 'client'
    });
    setIsEditDialogOpen(true);
  };

  // Atualizar usuário
  const handleUpdateUser = async () => {
    if (!selectedUser || !editForm.email || !editForm.full_name) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      toast({
        title: "📝 Atualizando usuário...",
        description: "Salvando alterações"
      });

      // Atualizar perfil
      const { error } = await supabase
        .from('profiles')
        .update({
          email: editForm.email,
          full_name: editForm.full_name,
          role: editForm.role
        })
        .eq('user_id', selectedUser.user_id);

      if (error) throw error;

      toast({
        title: "✅ Usuário atualizado!",
        description: "Dados salvos com sucesso"
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      handleError(error, 'Atualizar usuário');
    } finally {
      setIsUpdating(false);
    }
  };

  // Deletar usuário
  const handleDeleteUser = async (userId: string) => {
    try {
      setIsDeleting(userId);
      
      toast({
        title: "🗑️ Removendo usuário...",
        description: "Aguarde enquanto removemos o usuário"
      });

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "✅ Usuário removido!",
        description: "Usuário foi removido com sucesso"
      });

      fetchUsers();
    } catch (error) {
      handleError(error, 'Remover usuário');
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-netflix-text">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-netflix-text-muted" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-10 bg-netflix-hover border-netflix-border text-netflix-text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Usuário
              </Button>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-netflix-text">Criar Novo Usuário</DialogTitle>
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
                      placeholder="user@exemplo.com"
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
                      placeholder="Senha forte (min. 6 caracteres)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="create-name">Nome Completo</Label>
                    <Input
                      id="create-name"
                      value={createForm.full_name}
                      onChange={(e) => setCreateForm({...createForm, full_name: e.target.value})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                      placeholder="Nome completo do usuário"
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
                    <Button 
                      onClick={handleCreateUser} 
                      disabled={isCreating}
                      className="instituto-button flex-1"
                    >
                      {isCreating ? (
                        <>
                          <ButtonLoading className="mr-2" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Criar Usuário
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setCreateForm({
                          email: '',
                          password: '',
                          full_name: '',
                          role: 'client'
                        });
                      }}
                      disabled={isCreating}
                      className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={fetchUsers} 
              disabled={loading}
              variant="outline" 
              className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
            >
              {loading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  Carregando...
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Atualizar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="text-netflix-text">Usuários do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <ButtonLoading className="mr-2" />
                <span className="text-netflix-text">Carregando usuários...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-netflix-text-muted">
                Nenhum usuário encontrado
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg border border-netflix-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-instituto-orange rounded-full flex items-center justify-center text-white font-bold">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-netflix-text">{user.full_name || 'Sem nome'}</p>
                      <p className="text-sm text-netflix-text-muted">{user.email}</p>
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
                          disabled={isDeleting === user.user_id}
                          className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                        >
                          {isDeleting === user.user_id ? (
                            <ButtonLoading className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover {user.full_name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-netflix-border text-netflix-text hover:bg-netflix-hover">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.user_id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Confirmar Exclusão
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-netflix-text">Editar Usuário</DialogTitle>
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
              <Button 
                onClick={handleUpdateUser} 
                disabled={isUpdating}
                className="instituto-button flex-1"
              >
                {isUpdating ? (
                  <>
                    <ButtonLoading className="mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedUser(null);
                  setEditForm({
                    email: '',
                    full_name: '',
                    role: 'client'
                  });
                }}
                disabled={isUpdating}
                className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};