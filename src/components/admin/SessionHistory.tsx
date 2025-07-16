import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Edit, 
  Send, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Users, 
  User,
  Search,
  Filter
} from 'lucide-react';

interface SessionRecord {
  id: string;
  titulo: string;
  cliente: string;
  tipo: 'individual' | 'grupo';
  status: 'visualizada' | 'nao-vista' | 'em-andamento';
  dataEnvio: Date;
  dataVisualizacao?: Date;
  membrosGrupo?: number;
}

const mockSessions: SessionRecord[] = [
  {
    id: '1',
    titulo: 'Reflexão sobre Objetivos de Vida',
    cliente: 'Ana Silva',
    tipo: 'individual',
    status: 'visualizada',
    dataEnvio: new Date('2024-01-15'),
    dataVisualizacao: new Date('2024-01-16')
  },
  {
    id: '2',
    titulo: 'Autoconhecimento Profundo',
    cliente: 'Grupo Iniciantes',
    tipo: 'grupo',
    status: 'em-andamento',
    dataEnvio: new Date('2024-01-14'),
    membrosGrupo: 5
  },
  {
    id: '3',
    titulo: 'Gestão de Ansiedade',
    cliente: 'Carlos Santos',
    tipo: 'individual',
    status: 'nao-vista',
    dataEnvio: new Date('2024-01-13')
  }
];

export const SessionHistory: React.FC = () => {
  const [sessions] = useState<SessionRecord[]>(mockSessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'visualizada':
        return <Badge className="bg-instituto-green text-white">Visualizada</Badge>;
      case 'em-andamento':
        return <Badge className="bg-instituto-orange text-white">Em Andamento</Badge>;
      case 'nao-vista':
        return <Badge variant="outline" className="border-netflix-border text-netflix-text-muted">Não Vista</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'visualizada':
        return <Eye className="h-4 w-4 text-instituto-green" />;
      case 'em-andamento':
        return <Calendar className="h-4 w-4 text-instituto-orange" />;
      case 'nao-vista':
        return <EyeOff className="h-4 w-4 text-netflix-text-muted" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-text-muted" />
          <Input
            placeholder="Buscar por título ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-netflix-gray border-netflix-border text-netflix-text pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-netflix-gray border border-netflix-border text-netflix-text rounded-md"
        >
          <option value="todos">Todos os Status</option>
          <option value="visualizada">Visualizada</option>
          <option value="em-andamento">Em Andamento</option>
          <option value="nao-vista">Não Vista</option>
        </select>
      </div>

      {/* Lista de Sessões */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-netflix-text-muted mx-auto mb-3" />
              <p className="text-netflix-text-muted">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Nenhuma sessão encontrada com os filtros aplicados'
                  : 'Nenhuma sessão no histórico'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session, index) => (
            <Card 
              key={session.id} 
              className="bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-instituto-purple/10 rounded-lg">
                      {getStatusIcon(session.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-netflix-text">{session.titulo}</h3>
                        {getStatusBadge(session.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-netflix-text-muted">
                        <div className="flex items-center gap-1">
                          {session.tipo === 'grupo' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                          <span>
                            {session.cliente}
                            {session.tipo === 'grupo' && session.membrosGrupo && 
                              ` (${session.membrosGrupo} membros)`
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Enviado: {session.dataEnvio.toLocaleDateString()}</span>
                        </div>
                        
                        {session.dataVisualizacao && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>Visto: {session.dataVisualizacao.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-netflix-border text-netflix-text hover:bg-instituto-orange hover:text-white hover:border-instituto-orange transition-all duration-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-netflix-border text-netflix-text hover:bg-instituto-green hover:text-white hover:border-instituto-green transition-all duration-300"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-netflix-border text-netflix-text hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-netflix-text">{sessions.length}</div>
            <div className="text-sm text-netflix-text-muted">Total de Sessões</div>
          </CardContent>
        </Card>
        
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-instituto-green">
              {sessions.filter(s => s.status === 'visualizada').length}
            </div>
            <div className="text-sm text-netflix-text-muted">Visualizadas</div>
          </CardContent>
        </Card>
        
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-instituto-orange">
              {sessions.filter(s => s.status === 'em-andamento').length}
            </div>
            <div className="text-sm text-netflix-text-muted">Em Andamento</div>
          </CardContent>
        </Card>
        
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-netflix-text-muted">
              {sessions.filter(s => s.status === 'nao-vista').length}
            </div>
            <div className="text-sm text-netflix-text-muted">Não Vistas</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};