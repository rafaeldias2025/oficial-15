import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Video, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Eye,
  Send
} from 'lucide-react';

interface Session {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  instructions: string;
  createdAt: Date;
  sentTo: string[];
  responses: { [clientId: string]: { completed: boolean; response: string; completedAt?: Date } };
}

interface Client {
  id: string;
  name: string;
  email: string;
}

const mockClients: Client[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@email.com' },
  { id: '2', name: 'Carlos Santos', email: 'carlos@email.com' },
  { id: '3', name: 'Maria Costa', email: 'maria@email.com' },
  { id: '4', name: 'João Ferreira', email: 'joao@email.com' },
];

export const AdminSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      title: 'Reflexão sobre Objetivos de Vida',
      description: 'Uma sessão profunda para refletir sobre seus verdadeiros objetivos e valores pessoais.',
      videoUrl: 'https://youtube.com/watch?v=example',
      instructions: 'Assista ao vídeo e reflita sobre as perguntas propostas. Anote suas respostas no campo abaixo.',
      createdAt: new Date('2024-01-15'),
      sentTo: ['1', '2'],
      responses: {
        '1': { completed: true, response: 'Reflexão muito importante...', completedAt: new Date() },
        '2': { completed: false, response: '' }
      }
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    videoUrl: '',
    instructions: '',
    selectedClients: [] as string[]
  });

  const handleCreateSession = () => {
    const session: Session = {
      id: Date.now().toString(),
      title: newSession.title,
      description: newSession.description,
      videoUrl: newSession.videoUrl,
      instructions: newSession.instructions,
      createdAt: new Date(),
      sentTo: newSession.selectedClients,
      responses: {}
    };

    setSessions([...sessions, session]);
    setNewSession({
      title: '',
      description: '',
      videoUrl: '',
      instructions: '',
      selectedClients: []
    });
    setIsCreateDialogOpen(false);
  };

  const getSessionStats = (session: Session) => {
    const totalSent = session.sentTo.length;
    const completed = Object.values(session.responses).filter(r => r.completed).length;
    const inProgress = Object.values(session.responses).filter(r => !r.completed && r.response).length;
    const notStarted = totalSent - completed - inProgress;

    return { totalSent, completed, inProgress, notStarted };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-netflix-text flex items-center gap-3">
            <Video className="h-8 w-8 text-instituto-orange animate-float" />
            Gerenciar Sessões
          </h2>
          <p className="text-netflix-text-muted mt-2">
            Crie e gerencie sessões personalizadas para seus clientes
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="instituto-button animate-glow hover:scale-105 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Nova Sessão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Sessão</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div>
                <label className="text-sm font-medium text-netflix-text mb-2 block">
                  Título da Sessão
                </label>
                <Input
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  placeholder="Digite o título da sessão"
                  className="bg-netflix-gray border-netflix-border text-netflix-text"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-netflix-text mb-2 block">
                  Descrição
                </label>
                <Textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                  placeholder="Descreva o objetivo e conteúdo da sessão"
                  className="bg-netflix-gray border-netflix-border text-netflix-text min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-netflix-text mb-2 block">
                  Link do Vídeo (YouTube ou outro)
                </label>
                <Input
                  value={newSession.videoUrl}
                  onChange={(e) => setNewSession({...newSession, videoUrl: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-netflix-gray border-netflix-border text-netflix-text"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-netflix-text mb-2 block">
                  Instruções e Orientações
                </label>
                <Textarea
                  value={newSession.instructions}
                  onChange={(e) => setNewSession({...newSession, instructions: e.target.value})}
                  placeholder="Instruções detalhadas sobre como realizar a sessão, perguntas para reflexão, etc."
                  className="bg-netflix-gray border-netflix-border text-netflix-text min-h-[120px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-netflix-text mb-3 block">
                  Selecionar Clientes
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {mockClients.map((client) => (
                    <div key={client.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={client.id}
                        checked={newSession.selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewSession({
                              ...newSession,
                              selectedClients: [...newSession.selectedClients, client.id]
                            });
                          } else {
                            setNewSession({
                              ...newSession,
                              selectedClients: newSession.selectedClients.filter(id => id !== client.id)
                            });
                          }
                        }}
                      />
                      <label htmlFor={client.id} className="text-sm text-netflix-text cursor-pointer">
                        {client.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateSession}
                  disabled={!newSession.title || !newSession.description || newSession.selectedClients.length === 0}
                  className="instituto-button flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Criar e Enviar Sessão
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessions.map((session, index) => {
          const stats = getSessionStats(session);
          return (
            <Card 
              key={session.id} 
              className="bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300 floating-card animate-fade-in-up shimmer-effect"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-netflix-text">{session.title}</CardTitle>
                    <p className="text-sm text-netflix-text-muted">{session.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-netflix-border text-netflix-text hover:bg-instituto-orange hover:text-white hover:border-instituto-orange transition-all duration-300">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-netflix-border text-netflix-text hover:bg-instituto-purple hover:text-white hover:border-instituto-purple transition-all duration-300">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-netflix-text-muted">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {session.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {stats.totalSent} cliente(s)
                  </div>
                  {session.videoUrl && (
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      Vídeo
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-instituto-green/10 rounded-lg hover:bg-instituto-green/20 transition-all duration-300 animate-bounce-in">
                    <CheckCircle className="h-5 w-5 text-instituto-green mx-auto mb-1 animate-glow" />
                    <p className="text-lg font-bold text-netflix-text">{stats.completed}</p>
                    <p className="text-xs text-netflix-text-muted">Concluídas</p>
                  </div>
                  <div className="text-center p-3 bg-instituto-orange/10 rounded-lg hover:bg-instituto-orange/20 transition-all duration-300 animate-bounce-in" style={{ animationDelay: '0.1s' }}>
                    <Clock className="h-5 w-5 text-instituto-orange mx-auto mb-1 animate-float" />
                    <p className="text-lg font-bold text-netflix-text">{stats.inProgress}</p>
                    <p className="text-xs text-netflix-text-muted">Em Andamento</p>
                  </div>
                  <div className="text-center p-3 bg-netflix-hover rounded-lg hover:bg-netflix-border/20 transition-all duration-300 animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                    <AlertCircle className="h-5 w-5 text-netflix-text-muted mx-auto mb-1" />
                    <p className="text-lg font-bold text-netflix-text">{stats.notStarted}</p>
                    <p className="text-xs text-netflix-text-muted">Não Iniciadas</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-netflix-text">Respostas dos Clientes:</h4>
                  {session.sentTo.map((clientId) => {
                    const client = mockClients.find(c => c.id === clientId);
                    const response = session.responses[clientId];
                    
                    return (
                      <div key={clientId} className="flex items-center justify-between p-2 bg-netflix-hover rounded hover:bg-netflix-border/20 transition-all duration-300 animate-slide-in-left" style={{ animationDelay: `${index * 0.05}s` }}>
                        <span className="text-sm text-netflix-text font-medium">{client?.name}</span>
                        <Badge 
                          variant={response?.completed ? "default" : response?.response ? "secondary" : "outline"}
                          className={
                            response?.completed 
                              ? "bg-instituto-green text-white animate-glow" 
                              : response?.response 
                                ? "bg-instituto-orange text-white animate-float"
                                : "border-netflix-border text-netflix-text-muted"
                          }
                        >
                          {response?.completed ? "Concluída" : response?.response ? "Em Andamento" : "Não Iniciada"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <Card className="bg-netflix-card border-netflix-border animate-fade-in-up">
          <CardContent className="text-center py-12">
            <Video className="h-16 w-16 text-netflix-text-muted mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-bold text-netflix-text mb-2">Nenhuma sessão criada</h3>
            <p className="text-netflix-text-muted mb-6">
              Comece criando sua primeira sessão personalizada para seus clientes
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="instituto-button animate-glow hover:scale-105 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Sessão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};