import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Users, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';

interface UserData {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  physicalData?: any;
  lastActivity?: string;
  completionRate?: number;
  avgScore?: number;
  status?: 'active' | 'at-risk' | 'inactive';
}

interface UserSelectorProps {
  onUserSelect: (userId: string) => void;
  selectedUserId: string | null;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  onUserSelect,
  selectedUserId
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, statusFilter, sortBy]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Buscar todos os perfis de clientes
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (!profiles) return;

      // Para cada perfil, buscar dados adicionais
      const usersWithData = await Promise.all(
        profiles.map(async (profile) => {
          // Buscar dados físicos
          const { data: physicalData } = await supabase
            .from('dados_fisicos_usuario')
            .select('*')
            .eq('user_id', profile.id)
            .single();

          // Buscar última atividade
          const { data: lastMission } = await supabase
            .from('missao_dia')
            .select('data, concluido')
            .eq('user_id', profile.id)
            .order('data', { ascending: false })
            .limit(1)
            .single();

          // Buscar missões recentes para calcular taxa de conclusão
          const { data: recentMissions } = await supabase
            .from('missao_dia')
            .select('concluido')
            .eq('user_id', profile.id)
            .order('data', { ascending: false })
            .limit(7);

          // Buscar pontuação média
          const { data: scores } = await supabase
            .from('pontuacao_diaria')
            .select('total_pontos_dia')
            .eq('user_id', profile.id)
            .order('data', { ascending: false })
            .limit(7);

          // Calcular métricas
          const completionRate = recentMissions?.length ? 
            (recentMissions.filter(m => m.concluido).length / recentMissions.length) * 100 : 0;

          const avgScore = scores?.length ? 
            scores.reduce((acc, s) => acc + (s.total_pontos_dia || 0), 0) / scores.length : 0;

          const daysSinceLastActivity = lastMission?.data ? 
            Math.floor((new Date().getTime() - new Date(lastMission.data).getTime()) / (1000 * 60 * 60 * 24)) : 999;

          const status: 'active' | 'at-risk' | 'inactive' = daysSinceLastActivity > 3 ? 'inactive' : 
                        daysSinceLastActivity > 1 ? 'at-risk' : 'active';

          return {
            id: profile.id,
            full_name: profile.full_name || 'Cliente',
            email: profile.email,
            created_at: profile.created_at,
            physicalData,
            lastActivity: lastMission?.data,
            completionRate,
            avgScore: Math.round(avgScore),
            status
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.full_name.localeCompare(b.full_name);
        case 'activity':
          return (b.lastActivity || '').localeCompare(a.lastActivity || '');
        case 'completion':
          return (b.completionRate || 0) - (a.completionRate || 0);
        case 'score':
          return (b.avgScore || 0) - (a.avgScore || 0);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'at-risk': return AlertCircle;
      case 'inactive': return TrendingDown;
      default: return User;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-instituto-green';
      case 'at-risk': return 'text-instituto-gold';
      case 'inactive': return 'text-instituto-orange';
      default: return 'text-netflix-text-muted';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-instituto-green text-white';
      case 'at-risk': return 'bg-instituto-gold text-white';
      case 'inactive': return 'bg-instituto-orange text-white';
      default: return 'bg-netflix-border text-netflix-text';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'at-risk': return 'Em Risco';
      case 'inactive': return 'Inativo';
      default: return 'Desconhecido';
    }
  };

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-instituto-orange border-t-transparent rounded-full mx-auto"></div>
            <p className="text-netflix-text-muted">Carregando clientes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Users className="h-5 w-5 text-instituto-orange" />
          Seletor de Clientes ({filteredUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles de Filtro */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-netflix-text-muted" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-netflix-hover border-netflix-border text-netflix-text"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-netflix-hover border-netflix-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="at-risk">Em Risco</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 bg-netflix-hover border-netflix-border">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome (A-Z)</SelectItem>
              <SelectItem value="activity">Última Atividade</SelectItem>
              <SelectItem value="completion">Taxa de Conclusão</SelectItem>
              <SelectItem value="score">Pontuação Média</SelectItem>
              <SelectItem value="created">Mais Recentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Usuários */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-netflix-text-muted py-8">
              <User className="h-12 w-12 mx-auto mb-4 text-netflix-text-muted" />
              <p>Nenhum cliente encontrado com os filtros aplicados</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const StatusIcon = getStatusIcon(user.status || 'inactive');
              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedUserId === user.id
                      ? 'border-instituto-orange bg-instituto-orange/10'
                      : 'border-netflix-border bg-netflix-hover hover:border-instituto-orange/50'
                  }`}
                  onClick={() => onUserSelect(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(user.status || 'inactive')}`} />
                      <div>
                        <h3 className="font-medium text-netflix-text">{user.full_name}</h3>
                        <p className="text-sm text-netflix-text-muted">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getStatusBadgeColor(user.status || 'inactive')}>
                        {getStatusText(user.status || 'inactive')}
                      </Badge>
                      <div className="flex gap-2 text-xs text-netflix-text-muted">
                        <span title="Taxa de Conclusão">
                          {user.completionRate?.toFixed(0)}%
                        </span>
                        <span title="Pontuação Média">
                          {user.avgScore || 0}pts
                        </span>
                      </div>
                    </div>
                  </div>
                  {user.lastActivity && (
                    <div className="mt-2 text-xs text-netflix-text-muted">
                      Última atividade: {new Date(user.lastActivity).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};