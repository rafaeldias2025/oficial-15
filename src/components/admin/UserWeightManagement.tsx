import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Scale, Users, Search, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  nome_completo_dados: string | null;
}

interface WeightData {
  peso_kg: number;
  circunferencia_abdominal_cm?: number;
  gordura_corporal_pct?: number;
  massa_muscular_kg?: number;
  agua_corporal_pct?: number;
  gordura_visceral?: number;
  idade_metabolica?: number;
  massa_ossea_kg?: number;
  taxa_metabolica_basal?: number;
  tipo_corpo?: string;
  origem_medicao: string;
}

export const UserWeightManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [weightData, setWeightData] = useState<WeightData>({
    peso_kg: 0,
    origem_medicao: 'admin'
  });

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
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, email, full_name')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

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
      setFilteredUsers(usersWithData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWeight = async () => {
    if (!selectedUser) {
      toast({
        title: "Erro",
        description: "Selecione um usuário primeiro",
        variant: "destructive"
      });
      return;
    }

    if (weightData.peso_kg <= 0) {
      toast({
        title: "Erro",
        description: "O peso deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('pesagens')
        .insert({
          user_id: selectedUser.id,
          ...weightData,
          data_medicao: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Pesagem registrada com sucesso",
        variant: "default"
      });

      // Reset form
      setWeightData({
        peso_kg: 0,
        origem_medicao: 'admin'
      });
      setSelectedUser(null);
      setIsDialogOpen(false);

    } catch (error) {
      console.error('Erro ao registrar pesagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a pesagem",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = (user: User) => {
    return user.nome_completo_dados || user.full_name || user.email;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Scale className="h-5 w-5 text-instituto-orange" />
            Gestão de Pesagens - Seleção de Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-netflix-text-muted" />
              <Input
                placeholder="Buscar usuário por email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-netflix-hover border-netflix-border text-netflix-text"
              />
            </div>

            {/* Selected User Display */}
            {selectedUser && (
              <div className="p-4 bg-instituto-orange/10 border border-instituto-orange/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-netflix-text">
                      Usuário Selecionado: {getUserDisplayName(selectedUser)}
                    </p>
                    <p className="text-sm text-netflix-text-muted">
                      Email: {selectedUser.email}
                    </p>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-instituto-orange hover:bg-instituto-orange/90">
                        <Scale className="h-4 w-4 mr-2" />
                        Registrar Pesagem
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-netflix-card border-netflix-border max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-netflix-text">
                          Registrar Pesagem - {getUserDisplayName(selectedUser)}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="peso" className="text-netflix-text">
                            Peso (kg) *
                          </Label>
                          <Input
                            id="peso"
                            type="number"
                            step="0.1"
                            value={weightData.peso_kg || ''}
                            onChange={(e) => setWeightData(prev => ({
                              ...prev,
                              peso_kg: parseFloat(e.target.value) || 0
                            }))}
                            className="bg-netflix-hover border-netflix-border text-netflix-text"
                            placeholder="Ex: 70.5"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="circunferencia" className="text-netflix-text">
                            Circunferência Abdominal (cm)
                          </Label>
                          <Input
                            id="circunferencia"
                            type="number"
                            step="0.1"
                            value={weightData.circunferencia_abdominal_cm || ''}
                            onChange={(e) => setWeightData(prev => ({
                              ...prev,
                              circunferencia_abdominal_cm: parseFloat(e.target.value) || undefined
                            }))}
                            className="bg-netflix-hover border-netflix-border text-netflix-text"
                            placeholder="Ex: 85.0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gordura_corporal" className="text-netflix-text">
                            Gordura Corporal (%)
                          </Label>
                          <Input
                            id="gordura_corporal"
                            type="number"
                            step="0.1"
                            value={weightData.gordura_corporal_pct || ''}
                            onChange={(e) => setWeightData(prev => ({
                              ...prev,
                              gordura_corporal_pct: parseFloat(e.target.value) || undefined
                            }))}
                            className="bg-netflix-hover border-netflix-border text-netflix-text"
                            placeholder="Ex: 20.5"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="massa_muscular" className="text-netflix-text">
                            Massa Muscular (kg)
                          </Label>
                          <Input
                            id="massa_muscular"
                            type="number"
                            step="0.1"
                            value={weightData.massa_muscular_kg || ''}
                            onChange={(e) => setWeightData(prev => ({
                              ...prev,
                              massa_muscular_kg: parseFloat(e.target.value) || undefined
                            }))}
                            className="bg-netflix-hover border-netflix-border text-netflix-text"
                            placeholder="Ex: 35.2"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="agua_corporal" className="text-netflix-text">
                            Água Corporal (%)
                          </Label>
                          <Input
                            id="agua_corporal"
                            type="number"
                            step="0.1"
                            value={weightData.agua_corporal_pct || ''}
                            onChange={(e) => setWeightData(prev => ({
                              ...prev,
                              agua_corporal_pct: parseFloat(e.target.value) || undefined
                            }))}
                            className="bg-netflix-hover border-netflix-border text-netflix-text"
                            placeholder="Ex: 55.0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gordura_visceral" className="text-netflix-text">
                            Gordura Visceral
                          </Label>
                          <Input
                            id="gordura_visceral"
                            type="number"
                            value={weightData.gordura_visceral || ''}
                            onChange={(e) => setWeightData(prev => ({
                              ...prev,
                              gordura_visceral: parseInt(e.target.value) || undefined
                            }))}
                            className="bg-netflix-hover border-netflix-border text-netflix-text"
                            placeholder="Ex: 8"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="origem_medicao" className="text-netflix-text">
                            Origem da Medição
                          </Label>
                          <Select
                            value={weightData.origem_medicao}
                            onValueChange={(value) => setWeightData(prev => ({
                              ...prev,
                              origem_medicao: value
                            }))}
                          >
                            <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-netflix-card border-netflix-border">
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="balança">Balança Comum</SelectItem>
                              <SelectItem value="bioimpedância">Bioimpedância</SelectItem>
                              <SelectItem value="consultório">Consultório</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSubmitWeight}
                          disabled={loading}
                          className="bg-instituto-orange hover:bg-instituto-orange/90"
                        >
                          {loading ? 'Salvando...' : 'Salvar Pesagem'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuários ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange mx-auto mb-4"></div>
              <p className="text-netflix-text-muted">Carregando usuários...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-netflix-text mb-2">
                {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-netflix-text-muted">
                {searchTerm ? 'Tente uma busca diferente' : 'Os clientes aparecerão aqui quando se cadastrarem'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user, index) => (
                <div 
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 cursor-pointer animate-fade-in-up ${
                    selectedUser?.id === user.id
                      ? 'bg-instituto-orange/20 border-instituto-orange'
                      : 'bg-netflix-hover border-netflix-border hover:border-instituto-orange/50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedUser?.id === user.id
                        ? 'bg-instituto-orange text-white'
                        : 'bg-instituto-orange/20 text-instituto-orange'
                    }`}>
                      <Scale className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-netflix-text">
                        {getUserDisplayName(user)}
                      </h3>
                      <p className="text-sm text-netflix-text-muted">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedUser?.id === user.id && (
                      <div className="px-3 py-1 bg-instituto-orange text-white text-sm rounded-full">
                        Selecionado
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};