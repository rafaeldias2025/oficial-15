import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, FileText, Image, CheckCircle, Clock, MessageSquare, Loader, Video, Calendar, Star, Heart, Play, Send, Lightbulb } from 'lucide-react';
import { SessionTools } from './SessionTools';

interface SessionResponse {
  sessionId: string;
  response: string;
  privateComments: string;
  completed: boolean;
  favorite: boolean;
  completedAt?: Date;
  startedAt?: Date;
}

interface ClientSession {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  instructions: string;
  sentDate: Date;
  therapistName: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

const mockSessions: ClientSession[] = [
  {
    id: '1',
    title: 'Reflexão sobre Objetivos de Vida',
    description: 'Uma sessão profunda para refletir sobre seus verdadeiros objetivos e valores pessoais. Esta atividade vai te ajudar a conectar com seus sonhos mais profundos.',
    videoUrl: 'https://youtube.com/watch?v=example',
    instructions: 'Assista ao vídeo com atenção e reflita sobre as perguntas propostas. Anote suas respostas no campo abaixo, sendo o mais honesto possível consigo mesmo.',
    sentDate: new Date('2024-01-15'),
    therapistName: 'Rafael',
    status: 'in-progress'
  },
  {
    id: '2',
    title: 'Técnicas de Respiração para Ansiedade',
    description: 'Aprenda técnicas práticas de respiração que podem ser utilizadas no dia a dia para reduzir a ansiedade e promover calma interior.',
    videoUrl: 'https://youtube.com/watch?v=example2',
    instructions: 'Pratique cada técnica apresentada no vídeo pelo menos 3 vezes. Anote como se sentiu antes e depois de cada prática.',
    sentDate: new Date('2024-01-10'),
    therapistName: 'Rafael',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Mapeamento de Emoções',
    description: 'Um exercício de autoconhecimento para identificar e mapear suas emoções ao longo do dia, desenvolvendo maior consciência emocional.',
    instructions: 'Durante uma semana, anote suas emoções 3 vezes por dia (manhã, tarde, noite). Descreva o que as desencadeou e como lidou com elas.',
    sentDate: new Date('2024-01-20'),
    therapistName: 'Rafael',
    status: 'not-started'
  }
];

export const ClientSessions: React.FC = () => {
  const [sessions] = useState<ClientSession[]>(mockSessions);
  const [responses, setResponses] = useState<{[key: string]: SessionResponse}>({
    '1': {
      sessionId: '1',
      response: 'Comecei a refletir sobre meus objetivos...',
      privateComments: 'Esta sessão está sendo muito reveladora.',
      completed: false,
      favorite: true,
      startedAt: new Date('2024-01-16')
    },
    '2': {
      sessionId: '2',
      response: 'As técnicas de respiração realmente funcionam! Consegui aplicar durante um momento de ansiedade no trabalho.',
      privateComments: 'Muito útil para o dia a dia.',
      completed: true,
      favorite: false,
      completedAt: new Date('2024-01-12'),
      startedAt: new Date('2024-01-11')
    }
  });

  const [selectedSession, setSelectedSession] = useState<ClientSession | null>(null);
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentComments, setCurrentComments] = useState('');

  const handleStartSession = (session: ClientSession) => {
    const existing = responses[session.id];
    if (!existing) {
      setResponses({
        ...responses,
        [session.id]: {
          sessionId: session.id,
          response: '',
          privateComments: '',
          completed: false,
          favorite: false,
          startedAt: new Date()
        }
      });
    }
    setSelectedSession(session);
    setCurrentResponse(existing?.response || '');
    setCurrentComments(existing?.privateComments || '');
  };

  const handleSaveResponse = () => {
    if (selectedSession) {
      setResponses({
        ...responses,
        [selectedSession.id]: {
          ...responses[selectedSession.id],
          response: currentResponse,
          privateComments: currentComments,
          completed: false
        }
      });
      setSelectedSession(null);
    }
  };

  const handleCompleteSession = () => {
    if (selectedSession) {
      setResponses({
        ...responses,
        [selectedSession.id]: {
          ...responses[selectedSession.id],
          response: currentResponse,
          privateComments: currentComments,
          completed: true,
          completedAt: new Date()
        }
      });
      setSelectedSession(null);
    }
  };

  const toggleFavorite = (sessionId: string) => {
    setResponses({
      ...responses,
      [sessionId]: {
        ...responses[sessionId],
        favorite: !responses[sessionId]?.favorite
      }
    });
  };

  const getStatusBadge = (session: ClientSession) => {
    const response = responses[session.id];
    
    if (response?.completed) {
      return <Badge className="bg-instituto-green text-white">Concluída</Badge>;
    } else if (response?.response) {
      return <Badge className="bg-instituto-orange text-white">Em Andamento</Badge>;
    } else {
      return <Badge variant="outline" className="border-netflix-border text-netflix-text-muted">Não Iniciada</Badge>;
    }
  };

  const getCompletedCount = () => {
    return Object.values(responses).filter(r => r.completed).length;
  };

  const newSessionsCount = sessions.filter(s => !responses[s.id]?.startedAt).length;

  return (
    <div className="space-y-6">
      {/* Header com introdução */}
      <Card className="bg-gradient-to-r from-instituto-orange/20 to-instituto-purple/20 border-instituto-orange/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-instituto-orange/20 rounded-full">
              <Lightbulb className="h-8 w-8 text-instituto-orange" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-netflix-text mb-2">
                Suas Sessões Personalizadas ✨
              </h2>
              <p className="text-netflix-text-muted mb-4">
                Estas são as sessões enviadas especialmente para você pelo seu terapeuta Rafael. 
                Clique para iniciar sua jornada de autoconhecimento e transformação.
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-instituto-green font-medium">
                  {getCompletedCount()} Concluídas
                </span>
                <span className="text-instituto-orange font-medium">
                  {sessions.length - getCompletedCount()} Pendentes
                </span>
                {newSessionsCount > 0 && (
                  <Badge className="bg-instituto-purple text-white animate-pulse">
                    {newSessionsCount} Nova(s)
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Sessões */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessions.map((session) => {
          const response = responses[session.id];
          const isNew = !response?.startedAt;
          
          return (
            <Card 
              key={session.id} 
              className={`bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300 cursor-pointer group ${
                isNew ? 'ring-2 ring-instituto-purple/30 shimmer-effect' : ''
              }`}
              onClick={() => handleStartSession(session)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg text-netflix-text group-hover:text-instituto-orange transition-colors">
                        {session.title}
                      </CardTitle>
                      {isNew && (
                        <Badge className="bg-instituto-purple text-white text-xs animate-pulse">
                          NOVA
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-netflix-text-muted">{session.description}</p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {response?.favorite && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(session.id);
                        }}
                        className="p-1 hover:bg-instituto-orange/20"
                      >
                        <Star className="h-4 w-4 text-instituto-orange fill-current" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(session.id);
                      }}
                      className="p-1 hover:bg-instituto-orange/20"
                    >
                      <Heart className={`h-4 w-4 ${response?.favorite ? 'text-instituto-orange fill-current' : 'text-netflix-text-muted'}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {getStatusBadge(session)}
                  <div className="flex items-center gap-4 text-sm text-netflix-text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {session.sentDate.toLocaleDateString()}
                    </div>
                    {session.videoUrl && (
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        Vídeo
                      </div>
                    )}
                  </div>
                </div>

                {response?.response && (
                  <div className="p-3 bg-netflix-gray/20 rounded-lg">
                    <p className="text-sm text-netflix-text-muted mb-1">Sua resposta:</p>
                    <p className="text-sm text-netflix-text">{response.response.substring(0, 100)}...</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="instituto-button flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartSession(session);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {response?.startedAt ? 'Continuar' : 'Iniciar'}
                  </Button>
                  
                  {response?.privateComments && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog para realizar sessão */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-netflix-text">
                  {selectedSession.title}
                </DialogTitle>
                <p className="text-netflix-text-muted">{selectedSession.description}</p>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {selectedSession.videoUrl && (
                  <Card className="bg-netflix-gray/20 border-netflix-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Video className="h-5 w-5 text-instituto-orange" />
                        <h4 className="font-medium text-netflix-text">Vídeo da Sessão</h4>
                      </div>
                      <div className="bg-netflix-dark rounded-lg p-4 text-center">
                        <p className="text-netflix-text-muted mb-3">
                          Clique no link abaixo para assistir ao vídeo:
                        </p>
                        <Button 
                          variant="outline" 
                          asChild
                          className="border-instituto-orange text-instituto-orange hover:bg-instituto-orange hover:text-white"
                        >
                          <a href={selectedSession.videoUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="h-4 w-4 mr-2" />
                            Assistir Vídeo
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-netflix-gray/20 border-netflix-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-5 w-5 text-instituto-purple" />
                      <h4 className="font-medium text-netflix-text">Instruções</h4>
                    </div>
                    <p className="text-netflix-text-muted whitespace-pre-wrap">
                      {selectedSession.instructions}
                    </p>
                  </CardContent>
                </Card>

                {/* Ferramentas de Roda - Mock para demonstração */}
                <SessionTools
                  sessionId={selectedSession.id}
                  userId="mock-user-id" // Em produção, pegar do contexto de auth
                  isSessionActive={true} // Em produção, verificar se sessão está ativa
                  availableTools={['energia_vital']} // Mock - em produção vem dos dados da sessão
                />

                <div>
                  <label className="text-sm font-medium text-netflix-text mb-2 block">
                    Suas Respostas e Reflexões
                  </label>
                  <Textarea
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    placeholder="Escreva aqui suas reflexões, respostas e insights sobre esta sessão..."
                    className="bg-netflix-gray border-netflix-border text-netflix-text min-h-[150px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-netflix-text mb-2 block">
                    Comentários Privados (opcional)
                  </label>
                  <Textarea
                    value={currentComments}
                    onChange={(e) => setCurrentComments(e.target.value)}
                    placeholder="Anote aqui comentários privados, dúvidas ou observações que gostaria de compartilhar apenas com você mesmo..."
                    className="bg-netflix-gray border-netflix-border text-netflix-text min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSaveResponse}
                    variant="outline"
                    className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Salvar Progresso
                  </Button>
                  <Button 
                    onClick={handleCompleteSession}
                    className="instituto-button flex-1"
                    disabled={!currentResponse.trim()}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Concluída
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {sessions.length === 0 && (
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="text-center py-12">
            <Clock className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-netflix-text mb-2">Nenhuma sessão recebida</h3>
            <p className="text-netflix-text-muted">
              Aguarde! Seu terapeuta enviará sessões personalizadas em breve.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};