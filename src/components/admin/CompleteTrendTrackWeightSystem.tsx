import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Scale, Users, Search, Calendar, TrendingUp, Plus, History, BarChart3, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { WeightHistoryChart } from './WeightHistoryChart';
import { WeightSummaryCards } from './WeightSummaryCards';
import { EnhancedWeightAnalytics } from './EnhancedWeightAnalytics';
import { WeightGoalsManager } from './WeightGoalsManager';
import { WeightReportsExport } from './WeightReportsExport';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  nome_completo_dados: string | null;
}

interface WeightEntry {
  id: string;
  user_id: string;
  peso_kg: number;
  data_medicao: string;
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
  imc?: number;
  created_at: string;
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

export const CompleteTrendTrackWeightSystem: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [activeTab, setActiveTab] = useState('selection');
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

  useEffect(() => {
    if (selectedUser) {
      fetchWeightHistory(selectedUser.id);
    }
  }, [selectedUser]);

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

  const fetchWeightHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', userId)
        .order('data_medicao', { ascending: false });

      if (error) throw error;
      setWeightHistory(data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
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

      // Calcular IMC se houver dados físicos
      let imc = null;
      if (weightData.peso_kg) {
        const { data: dadosFisicos } = await supabase
          .from('dados_fisicos_usuario')
          .select('altura_cm')
          .eq('user_id', selectedUser.id)
          .maybeSingle();

        if (dadosFisicos?.altura_cm) {
          const alturaM = dadosFisicos.altura_cm / 100;
          imc = weightData.peso_kg / (alturaM * alturaM);
        }
      }

      // Inserir pesagem completa com todos os campos obrigatórios
      const { error } = await supabase
        .from('pesagens')
        .insert({
          user_id: selectedUser.id,
          peso_kg: weightData.peso_kg,
          imc: imc ? parseFloat(imc.toFixed(2)) : null,
          circunferencia_abdominal_cm: weightData.circunferencia_abdominal_cm || null,
          idade_metabolica: weightData.idade_metabolica || null,
          gordura_corporal_pct: weightData.gordura_corporal_pct || null,
          massa_muscular_kg: weightData.massa_muscular_kg || null,
          agua_corporal_pct: weightData.agua_corporal_pct || null,
          gordura_visceral: weightData.gordura_visceral || null,
          taxa_metabolica_basal: weightData.taxa_metabolica_basal || null,
          massa_ossea_kg: weightData.massa_ossea_kg || null,
          tipo_corpo: weightData.tipo_corpo || null,
          origem_medicao: weightData.origem_medicao || 'admin',
          data_medicao: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Pesagem registrada com sucesso",
        variant: "default"
      });

      // Reset form and refresh data
      setWeightData({
        peso_kg: 0,
        origem_medicao: 'admin'
      });
      setIsDialogOpen(false);
      fetchWeightHistory(selectedUser.id);

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

  const getLatestWeight = () => {
    return weightHistory.length > 0 ? weightHistory[0] : null;
  };

  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null;
    const latest = weightHistory[0].peso_kg;
    const previous = weightHistory[1].peso_kg;
    return latest - previous;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-netflix-card border border-netflix-border">
          <TabsTrigger 
            value="selection" 
            className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white text-netflix-text"
          >
            <Users className="h-4 w-4 mr-2" />
            Seleção
          </TabsTrigger>
          <TabsTrigger 
            value="registration" 
            className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white text-netflix-text"
            disabled={!selectedUser}
          >
            <Plus className="h-4 w-4 mr-2" />
            Registro
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white text-netflix-text"
            disabled={!selectedUser}
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white text-netflix-text"
            disabled={!selectedUser}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* User Selection Tab */}
        <TabsContent value="selection" className="space-y-6">
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Scale className="h-5 w-5 text-instituto-orange" />
                Sistema Completo de Pesagem - Trend Track Wellness Hub 🎯
              </CardTitle>
              <div className="mt-2 text-sm text-netflix-text-muted">
                Sistema integrado para controle de peso e composição corporal dos clientes
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-netflix-text-muted" />
                  <Input
                    placeholder="Buscar usuário por email ou nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-netflix-hover border-netflix-border text-netflix-text"
                  />
                </div>

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
                        {weightHistory.length > 0 && (
                          <p className="text-sm text-netflix-text-muted">
                            Última pesagem: {getLatestWeight()?.peso_kg}kg em{' '}
                            {format(new Date(getLatestWeight()?.data_medicao || ''), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setActiveTab('registration')}
                          className="bg-instituto-orange hover:bg-instituto-orange/90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Pesagem
                        </Button>
                        <Button 
                          onClick={() => setActiveTab('history')}
                          variant="outline"
                          className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Histórico
                        </Button>
                      </div>
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
                          <Badge className="bg-instituto-orange text-white">
                            Selecionado
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weight Registration Tab */}
        <TabsContent value="registration" className="space-y-6">
          {selectedUser && (
            <>
              <WeightSummaryCards 
                selectedUser={selectedUser}
                weightHistory={weightHistory}
              />
              
              <Card className="bg-netflix-card border-netflix-border">
                <CardHeader>
                  <CardTitle className="text-netflix-text">
                    Registrar Nova Pesagem - {getUserDisplayName(selectedUser)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <Label htmlFor="idade_metabolica" className="text-netflix-text">
                        Idade Metabólica
                      </Label>
                      <Input
                        id="idade_metabolica"
                        type="number"
                        value={weightData.idade_metabolica || ''}
                        onChange={(e) => setWeightData(prev => ({
                          ...prev,
                          idade_metabolica: parseInt(e.target.value) || undefined
                        }))}
                        className="bg-netflix-hover border-netflix-border text-netflix-text"
                        placeholder="Ex: 25"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="massa_ossea" className="text-netflix-text">
                        Massa Óssea (kg)
                      </Label>
                      <Input
                        id="massa_ossea"
                        type="number"
                        step="0.1"
                        value={weightData.massa_ossea_kg || ''}
                        onChange={(e) => setWeightData(prev => ({
                          ...prev,
                          massa_ossea_kg: parseFloat(e.target.value) || undefined
                        }))}
                        className="bg-netflix-hover border-netflix-border text-netflix-text"
                        placeholder="Ex: 3.2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxa_metabolica" className="text-netflix-text">
                        Taxa Metabólica Basal
                      </Label>
                      <Input
                        id="taxa_metabolica"
                        type="number"
                        value={weightData.taxa_metabolica_basal || ''}
                        onChange={(e) => setWeightData(prev => ({
                          ...prev,
                          taxa_metabolica_basal: parseInt(e.target.value) || undefined
                        }))}
                        className="bg-netflix-hover border-netflix-border text-netflix-text"
                        placeholder="Ex: 1650"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo_corpo" className="text-netflix-text">
                        Tipo do Corpo
                      </Label>
                      <Select
                        value={weightData.tipo_corpo || ''}
                        onValueChange={(value) => setWeightData(prev => ({
                          ...prev,
                          tipo_corpo: value || undefined
                        }))}
                      >
                        <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="bg-netflix-card border-netflix-border">
                          <SelectItem value="magro">Magro</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="sobrepeso">Sobrepeso</SelectItem>
                          <SelectItem value="obeso">Obeso</SelectItem>
                          <SelectItem value="atletico">Atlético</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="casa">Casa do Cliente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('selection')}
                      className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={handleSubmitWeight}
                      disabled={loading}
                      className="bg-instituto-orange hover:bg-instituto-orange/90"
                    >
                      {loading ? 'Salvando...' : 'Salvar Pesagem'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Weight History Tab */}
        <TabsContent value="history" className="space-y-6">
          {selectedUser && (
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Pesagens - {getUserDisplayName(selectedUser)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weightHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Scale className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-netflix-text mb-2">
                      Nenhuma pesagem registrada
                    </h3>
                    <p className="text-netflix-text-muted mb-4">
                      Registre a primeira pesagem deste usuário
                    </p>
                    <Button 
                      onClick={() => setActiveTab('registration')}
                      className="bg-instituto-orange hover:bg-instituto-orange/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Primeira Pesagem
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {weightHistory.map((entry, index) => (
                      <div 
                        key={entry.id}
                        className="p-4 bg-netflix-hover rounded-lg border border-netflix-border animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-netflix-text">
                              {entry.peso_kg}kg
                              {entry.imc && (
                                <span className="ml-2 text-sm text-netflix-text-muted">
                                  (IMC: {entry.imc})
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-netflix-text-muted">
                              {format(new Date(entry.data_medicao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-instituto-orange text-instituto-orange">
                            {entry.origem_medicao}
                          </Badge>
                        </div>
                        
                        {(entry.circunferencia_abdominal_cm || entry.gordura_corporal_pct || entry.massa_muscular_kg) && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            {entry.circunferencia_abdominal_cm && (
                              <div>
                                <span className="text-netflix-text-muted">Cintura:</span>
                                <span className="ml-1 text-netflix-text">{entry.circunferencia_abdominal_cm}cm</span>
                              </div>
                            )}
                            {entry.gordura_corporal_pct && (
                              <div>
                                <span className="text-netflix-text-muted">Gordura:</span>
                                <span className="ml-1 text-netflix-text">{entry.gordura_corporal_pct}%</span>
                              </div>
                            )}
                            {entry.massa_muscular_kg && (
                              <div>
                                <span className="text-netflix-text-muted">Músculo:</span>
                                <span className="ml-1 text-netflix-text">{entry.massa_muscular_kg}kg</span>
                              </div>
                            )}
                            {entry.agua_corporal_pct && (
                              <div>
                                <span className="text-netflix-text-muted">Água:</span>
                                <span className="ml-1 text-netflix-text">{entry.agua_corporal_pct}%</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {selectedUser && (
            <>
              <EnhancedWeightAnalytics 
                selectedUser={selectedUser}
                weightHistory={weightHistory}
              />
              
              <WeightGoalsManager 
                selectedUser={selectedUser}
                currentWeight={getLatestWeight()?.peso_kg || 0}
              />

              <WeightReportsExport 
                selectedUser={selectedUser}
                weightHistory={weightHistory}
              />
              
              <WeightHistoryChart 
                weightHistory={weightHistory}
                userName={getUserDisplayName(selectedUser)}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};