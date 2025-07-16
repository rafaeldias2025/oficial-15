import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Video, 
  Send, 
  Eye, 
  Edit,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  FileText,
  Play,
  Star,
  Heart,
  Trash2,
  Upload,
  Copy,
  Save,
  Bell,
  Target,
  BookOpen,
  Timer
} from 'lucide-react';

interface Session {
  id: string;
  title: string;
  description: string;
  content: string;
  video_url?: string;
  pdf_url?: string;
  created_at: string;
  assigned_to: string;
  is_public: boolean;
  updated_at?: string;
  created_by?: string;
  // Campos simulados para status e resposta (não existem na tabela real ainda)
  status?: 'sent' | 'viewed' | 'in_progress' | 'completed';
  response?: string;
  completed_at?: string;
  private_notes?: string;
}

interface UserSessionManagementProps {
  userId: string;
  userName: string;
}

export const UserSessionManagement: React.FC<UserSessionManagementProps> = ({ userId, userName }) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    pdf_url: '',
    category: '',
    estimated_time: '',
    send_immediately: true,
    scheduled_date: '',
    notification_type: 'immediate',
    template_name: '',
    wheel_tools: [] as string[]
  });

  const [sessionTemplates, setSessionTemplates] = useState([
    {
      id: '1',
      name: 'Reflexão Objetivos',
      title: 'Reflexão sobre Objetivos Pessoais',
      description: 'Uma sessão para refletir sobre metas e valores pessoais',
      content: 'Assista ao vídeo e reflita sobre as seguintes perguntas:\n\n1. Quais são seus principais objetivos de vida?\n2. O que mais valoriza em suas relações?\n3. Como seus valores se alinham com suas ações atuais?\n\nAnote suas reflexões detalhadamente.',
      category: 'Autoconhecimento',
      estimated_time: '30-45 minutos'
    },
    {
      id: '2', 
      name: 'Gestão Ansiedade',
      title: 'Técnicas para Gestão da Ansiedade',
      description: 'Exercícios práticos para reduzir a ansiedade no dia a dia',
      content: 'Esta sessão inclui 3 técnicas de respiração:\n\n1. Respiração 4-7-8\n2. Respiração diafragmática\n3. Respiração quadrada\n\nPratique cada técnica por 5 minutos e anote suas sensações.',
      category: 'Bem-estar Mental',
      estimated_time: '20-30 minutos'
    }
  ]);

  useEffect(() => {
    loadUserSessions();
  }, [userId]);

  const loadUserSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Adicionar status padrão para sessões existentes
      const sessionsWithStatus = (data || []).map(session => ({
        ...session,
        status: 'sent' as const
      }));
      setSessions(sessionsWithStatus);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as sessões do usuário.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    // Validações detalhadas
    if (!newSession.title.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!newSession.description.trim()) {
      toast({
        title: "Erro", 
        description: "Descrição é obrigatória.",
        variant: "destructive"
      });
      return;
    }

    if (!newSession.content.trim()) {
      toast({
        title: "Erro",
        description: "Conteúdo é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    console.log('Dados da sessão antes do envio:', newSession);
    
    try {
      // Validar se o usuário existe
      const { data: userExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (!userExists) {
        toast({
          title: "Erro",
          description: "Usuário não encontrado.",
          variant: "destructive"
        });
        return;
      }

      const sessionContent = {
        instructions: newSession.content,
        tools: newSession.wheel_tools,
        category: newSession.category,
        estimated_time: newSession.estimated_time
      };

      // Buscar o profile ID do usuário logado
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', 'd4c7e35c-2f66-4e5d-8d09-c0ba8d0d7187')
        .single();

      if (!currentUserProfile) {
        toast({
          title: "Erro",
          description: "Perfil do administrador não encontrado.",
          variant: "destructive"
        });
        return;
      }

      const sessionData = {
        title: newSession.title.trim(),
        description: newSession.description.trim(),
        content: JSON.stringify(sessionContent),
        video_url: newSession.video_url || null,
        pdf_url: newSession.pdf_url || null,
        wheel_tools: newSession.wheel_tools.length > 0 ? newSession.wheel_tools : null,
        estimated_time: newSession.estimated_time ? parseInt(newSession.estimated_time.split('-')[0]) : null,
        category: newSession.category || null,
        send_type: newSession.send_immediately ? 'immediate' : 'scheduled',
        scheduled_date: !newSession.send_immediately && newSession.scheduled_date ? 
          new Date(newSession.scheduled_date).toISOString() : null,
        notification_type: newSession.notification_type,
        assigned_to: userId,
        is_public: false,
        created_by: currentUserProfile.id
      };

      console.log('Dados finais para inserção:', sessionData);

      const { data, error } = await supabase
        .from('sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        
        // Tratamento específico de erros
        if (error.code === 'PGRST204') {
          toast({
            title: "Erro de Sistema",
            description: "Problema na estrutura do banco. Contate o suporte técnico.",
            variant: "destructive"
          });
        } else if (error.code === '23505') {
          toast({
            title: "Erro",
            description: "Já existe uma sessão com estes dados.",
            variant: "destructive"
          });
        } else if (error.code === '23503') {
          toast({
            title: "Erro",
            description: "Dados relacionados não encontrados.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro",
            description: `Falha ao criar sessão: ${error.message}`,
            variant: "destructive"
          });
        }
        return;
      }

      const sessionWithStatus = {
        ...data,
        status: 'sent' as const
      };
      setSessions([sessionWithStatus, ...sessions]);
      
      // Reset form
      setNewSession({
        title: '',
        description: '',
        content: '',
        video_url: '',
        pdf_url: '',
        category: '',
        estimated_time: '',
        send_immediately: true,
        scheduled_date: '',
        notification_type: 'immediate',
        template_name: '',
        wheel_tools: []
      });
      setIsCreateDialogOpen(false);

      toast({
        title: "Sessão criada com sucesso!",
        description: `A sessão "${data.title}" foi enviada para ${userName}.`
      });
    } catch (error) {
      console.error('Erro interno completo:', error);
      toast({
        title: "Erro Interno",
        description: "Erro do sistema. Verifique os logs e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleSaveTemplate = () => {
    if (!newSession.template_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do template é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: newSession.template_name,
      title: newSession.title,
      description: newSession.description,
      content: newSession.content,
      category: newSession.category,
      estimated_time: newSession.estimated_time
    };

    setSessionTemplates([...sessionTemplates, newTemplate]);
    toast({
      title: "Template salvo!",
      description: `Template "${newSession.template_name}" foi criado com sucesso.`
    });
  };

  const handleLoadTemplate = (template: any) => {
    setNewSession({
      ...newSession,
      title: template.title,
      description: template.description,
      content: template.content,
      category: template.category,
      estimated_time: template.estimated_time
    });
    toast({
      title: "Template carregado",
      description: `Template "${template.name}" foi aplicado ao formulário.`
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(sessions.filter(s => s.id !== sessionId));
      toast({
        title: "Sessão excluída",
        description: "A sessão foi removida com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir sessão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a sessão.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (session: Session) => {
    switch (session.status || 'sent') {
      case 'completed':
        return <Badge className="bg-instituto-green text-white">Concluída</Badge>;
      case 'in_progress':
        return <Badge className="bg-instituto-orange text-white">Em Andamento</Badge>;
      case 'viewed':
        return <Badge className="bg-instituto-purple text-white">Visualizada</Badge>;
      default:
        return <Badge variant="outline" className="border-netflix-border text-netflix-text-muted">Enviada</Badge>;
    }
  };

  const getSessionStats = () => {
    const completed = sessions.filter(s => (s.status || 'sent') === 'completed').length;
    const inProgress = sessions.filter(s => (s.status || 'sent') === 'in_progress').length;
    const viewed = sessions.filter(s => (s.status || 'sent') === 'viewed').length;
    const sent = sessions.filter(s => (s.status || 'sent') === 'sent').length;
    
    return { completed, inProgress, viewed, sent, total: sessions.length };
  };

  const stats = getSessionStats();

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange mx-auto"></div>
          <p className="text-netflix-text-muted mt-2">Carregando sessões...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-netflix-text flex items-center gap-2">
                <Video className="h-5 w-5 text-instituto-orange" />
                Sessões Individuais para {userName}
              </CardTitle>
              <p className="text-netflix-text-muted mt-1">
                Gerencie sessões personalizadas e acompanhe o progresso
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="instituto-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Sessão
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-instituto-orange" />
                    Criar Nova Sessão para {userName}
                  </DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="create" className="space-y-4">
                  <TabsList className="bg-netflix-card border border-netflix-border">
                    <TabsTrigger value="create" className="data-[state=active]:bg-instituto-orange data-[state=active]:text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Nova
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="data-[state=active]:bg-instituto-purple data-[state=active]:text-white">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Templates
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sessionTemplates.map((template) => (
                        <Card key={template.id} className="bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300 cursor-pointer" onClick={() => handleLoadTemplate(template)}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-netflix-text">{template.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-xs text-netflix-text-muted">{template.title}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="text-xs">{template.category}</Badge>
                              <span className="text-xs text-netflix-text-muted">{template.estimated_time}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="create" className="space-y-6">
                    {/* Informações Básicas */}
                    <Card className="bg-netflix-card border-netflix-border">
                      <CardHeader>
                        <CardTitle className="text-netflix-text flex items-center gap-2">
                          <FileText className="h-4 w-4 text-instituto-orange" />
                          Informações Básicas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title" className="text-sm font-medium text-netflix-text">
                              Título da Sessão *
                            </Label>
                            <Input
                              id="title"
                              value={newSession.title}
                              onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                              placeholder="Ex: Reflexão sobre Objetivos Pessoais"
                              className="bg-netflix-gray border-netflix-border text-netflix-text"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category" className="text-sm font-medium text-netflix-text">
                              Categoria
                            </Label>
                            <Select value={newSession.category} onValueChange={(value) => setNewSession({...newSession, category: value})}>
                              <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="autoconhecimento">Autoconhecimento</SelectItem>
                                <SelectItem value="bem-estar-mental">Bem-estar Mental</SelectItem>
                                <SelectItem value="relacionamentos">Relacionamentos</SelectItem>
                                <SelectItem value="objetivos">Objetivos e Metas</SelectItem>
                                <SelectItem value="mindfulness">Mindfulness</SelectItem>
                                <SelectItem value="gestao-emocoes">Gestão de Emoções</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="estimated_time" className="text-sm font-medium text-netflix-text">
                              Tempo Estimado
                            </Label>
                            <Select value={newSession.estimated_time} onValueChange={(value) => setNewSession({...newSession, estimated_time: value})}>
                              <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
                                <SelectValue placeholder="Quanto tempo deve levar?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10-15 minutos">10-15 minutos</SelectItem>
                                <SelectItem value="15-30 minutos">15-30 minutos</SelectItem>
                                <SelectItem value="30-45 minutos">30-45 minutos</SelectItem>
                                <SelectItem value="45-60 minutos">45-60 minutos</SelectItem>
                                <SelectItem value="1+ hora">Mais de 1 hora</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="template_name" className="text-sm font-medium text-netflix-text">
                              Salvar como Template (opcional)
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="template_name"
                                value={newSession.template_name}
                                onChange={(e) => setNewSession({...newSession, template_name: e.target.value})}
                                placeholder="Nome do template"
                                className="bg-netflix-gray border-netflix-border text-netflix-text"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleSaveTemplate}
                                disabled={!newSession.template_name.trim() || !newSession.title.trim()}
                                className="border-instituto-purple text-instituto-purple hover:bg-instituto-purple hover:text-white"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-sm font-medium text-netflix-text">
                            Descrição
                          </Label>
                          <Textarea
                            id="description"
                            value={newSession.description}
                            onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                            placeholder="Breve descrição dos objetivos da sessão..."
                            className="bg-netflix-gray border-netflix-border text-netflix-text"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Materiais e Recursos */}
                    <Card className="bg-netflix-card border-netflix-border">
                      <CardHeader>
                        <CardTitle className="text-netflix-text flex items-center gap-2">
                          <Upload className="h-4 w-4 text-instituto-purple" />
                          Materiais e Recursos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="video_url" className="text-sm font-medium text-netflix-text">
                              URL do Vídeo (YouTube, Vimeo, etc.)
                            </Label>
                            <Input
                              id="video_url"
                              value={newSession.video_url}
                              onChange={(e) => setNewSession({...newSession, video_url: e.target.value})}
                              placeholder="https://youtube.com/watch?v=..."
                              className="bg-netflix-gray border-netflix-border text-netflix-text"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="pdf_url" className="text-sm font-medium text-netflix-text">
                              URL do Material (PDF, Slides, etc.)
                            </Label>
                            <Input
                              id="pdf_url"
                              value={newSession.pdf_url}
                              onChange={(e) => setNewSession({...newSession, pdf_url: e.target.value})}
                              placeholder="Link para material de apoio..."
                              className="bg-netflix-gray border-netflix-border text-netflix-text"
                            />
                          </div>
                        </div>

                        {(newSession.video_url || newSession.pdf_url) && (
                          <div className="p-3 bg-instituto-green/10 rounded-lg border border-instituto-green/20">
                            <p className="text-sm text-instituto-green font-medium">✓ Materiais configurados</p>
                            <p className="text-xs text-netflix-text-muted mt-1">
                              O cliente terá acesso direto aos materiais na sessão
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Conteúdo da Sessão */}
                    <Card className="bg-netflix-card border-netflix-border">
                      <CardHeader>
                        <CardTitle className="text-netflix-text flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-instituto-orange" />
                          Conteúdo e Instruções
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <Label htmlFor="content" className="text-sm font-medium text-netflix-text">
                            Instruções Detalhadas *
                          </Label>
                          <Textarea
                            id="content"
                            value={newSession.content}
                            onChange={(e) => setNewSession({...newSession, content: e.target.value})}
                            placeholder="Instruções detalhadas, perguntas para reflexão, exercícios práticos..."
                            className="bg-netflix-gray border-netflix-border text-netflix-text min-h-[150px] mt-2"
                          />
                          <p className="text-xs text-netflix-text-muted mt-1">
                            Use quebras de linha para organizar melhor o conteúdo. Seja específico nas instruções.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ferramentas de Roda */}
                    <Card className="bg-netflix-card border-netflix-border">
                      <CardHeader>
                        <CardTitle className="text-netflix-text flex items-center gap-2">
                          <Target className="h-4 w-4 text-instituto-purple" />
                          Ferramentas de Avaliação
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-netflix-text mb-3 block">
                            Selecione as ferramentas de roda que o cliente poderá usar:
                          </Label>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="energia_vital"
                                checked={newSession.wheel_tools.includes('energia_vital')}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewSession({...newSession, wheel_tools: [...newSession.wheel_tools, 'energia_vital']});
                                  } else {
                                    setNewSession({...newSession, wheel_tools: newSession.wheel_tools.filter(t => t !== 'energia_vital')});
                                  }
                                }}
                              />
                              <Label htmlFor="energia_vital" className="text-netflix-text cursor-pointer">
                                <span className="font-medium">Roda da Energia Vital</span>
                                <span className="block text-xs text-netflix-text-muted">4 dimensões: Espiritual, Mental, Emocional, Físico</span>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="roda_vida"
                                checked={newSession.wheel_tools.includes('roda_vida')}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewSession({...newSession, wheel_tools: [...newSession.wheel_tools, 'roda_vida']});
                                  } else {
                                    setNewSession({...newSession, wheel_tools: newSession.wheel_tools.filter(t => t !== 'roda_vida')});
                                  }
                                }}
                              />
                              <Label htmlFor="roda_vida" className="text-netflix-text cursor-pointer">
                                <span className="font-medium">Roda da Vida</span>
                                <span className="block text-xs text-netflix-text-muted">5 pilares: Profissional, Financeiro, Família, Relacionamento, Saúde</span>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="saude_energia"
                                checked={newSession.wheel_tools.includes('saude_energia')}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewSession({...newSession, wheel_tools: [...newSession.wheel_tools, 'saude_energia']});
                                  } else {
                                    setNewSession({...newSession, wheel_tools: newSession.wheel_tools.filter(t => t !== 'saude_energia')});
                                  }
                                }}
                              />
                              <Label htmlFor="saude_energia" className="text-netflix-text cursor-pointer">
                                <span className="font-medium">Roda da Saúde e Energia</span>
                                <span className="block text-xs text-netflix-text-muted">8 áreas: Sono, Intestino, Atividade Física, Alimentação, etc.</span>
                              </Label>
                            </div>
                          </div>
                        </div>

                        {newSession.wheel_tools.length > 0 && (
                          <div className="p-3 bg-instituto-purple/10 rounded-lg border border-instituto-purple/20">
                            <p className="text-sm text-instituto-purple font-medium">✓ {newSession.wheel_tools.length} ferramenta(s) selecionada(s)</p>
                            <p className="text-xs text-netflix-text-muted mt-1">
                              O cliente poderá preencher as rodas e suas respostas serão salvas automaticamente
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Configurações de Envio */}
                    <Card className="bg-netflix-card border-netflix-border">
                      <CardHeader>
                        <CardTitle className="text-netflix-text flex items-center gap-2">
                          <Bell className="h-4 w-4 text-instituto-gold" />
                          Configurações de Envio
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-netflix-text">Quando enviar?</Label>
                          <RadioGroup
                            value={newSession.send_immediately ? 'immediate' : 'scheduled'}
                            onValueChange={(value) => setNewSession({...newSession, send_immediately: value === 'immediate'})}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="immediate" id="immediate" />
                              <Label htmlFor="immediate" className="text-netflix-text cursor-pointer">
                                Enviar imediatamente
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="scheduled" id="scheduled" />
                              <Label htmlFor="scheduled" className="text-netflix-text cursor-pointer">
                                Agendar para mais tarde
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {!newSession.send_immediately && (
                          <div>
                            <Label htmlFor="scheduled_date" className="text-sm font-medium text-netflix-text">
                              Data e Hora do Agendamento
                            </Label>
                            <Input
                              id="scheduled_date"
                              type="datetime-local"
                              value={newSession.scheduled_date}
                              onChange={(e) => setNewSession({...newSession, scheduled_date: e.target.value})}
                              className="bg-netflix-gray border-netflix-border text-netflix-text"
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="notification_type" className="text-sm font-medium text-netflix-text">
                            Tipo de Notificação
                          </Label>
                          <Select value={newSession.notification_type} onValueChange={(value) => setNewSession({...newSession, notification_type: value})}>
                            <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
                              <SelectValue placeholder="Como notificar o cliente?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">Notificação Imediata</SelectItem>
                              <SelectItem value="gentle">Lembrete Suave (24h depois)</SelectItem>
                              <SelectItem value="weekly">Lembrete Semanal</SelectItem>
                              <SelectItem value="none">Sem Lembretes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Botões de Ação */}

                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleCreateSession}
                        className="instituto-button flex-1"
                        disabled={!newSession.title.trim() || !newSession.content.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {newSession.send_immediately ? 'Criar e Enviar Agora' : 'Agendar Sessão'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-netflix-hover rounded-lg">
              <p className="text-2xl font-bold text-netflix-text">{stats.total}</p>
              <p className="text-xs text-netflix-text-muted">Total</p>
            </div>
            <div className="text-center p-3 bg-instituto-green/10 rounded-lg">
              <p className="text-2xl font-bold text-netflix-text">{stats.completed}</p>
              <p className="text-xs text-netflix-text-muted">Concluídas</p>
            </div>
            <div className="text-center p-3 bg-instituto-orange/10 rounded-lg">
              <p className="text-2xl font-bold text-netflix-text">{stats.inProgress}</p>
              <p className="text-xs text-netflix-text-muted">Em Andamento</p>
            </div>
            <div className="text-center p-3 bg-instituto-purple/10 rounded-lg">
              <p className="text-2xl font-bold text-netflix-text">{stats.viewed}</p>
              <p className="text-xs text-netflix-text-muted">Visualizadas</p>
            </div>
            <div className="text-center p-3 bg-netflix-hover rounded-lg">
              <p className="text-2xl font-bold text-netflix-text">{stats.sent}</p>
              <p className="text-xs text-netflix-text-muted">Enviadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de sessões */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id} className="bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg text-netflix-text">{session.title}</CardTitle>
                    {getStatusBadge(session)}
                  </div>
                  {session.description && (
                    <p className="text-sm text-netflix-text-muted">{session.description}</p>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedSession(session);
                      setIsViewDialogOpen(true);
                    }}
                    className="border-netflix-border text-netflix-text hover:bg-instituto-purple/20"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteSession(session.id)}
                    className="border-netflix-border text-netflix-text hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between text-sm text-netflix-text-muted">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(session.created_at).toLocaleDateString()}
                  </div>
                  {session.video_url && (
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      Vídeo
                    </div>
                  )}
                  {session.pdf_url && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      PDF
                    </div>
                  )}
                </div>
                
                {session.completed_at && (
                  <span className="text-instituto-green text-xs">
                    Concluída em {new Date(session.completed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {session.response && (
                <div className="mt-3 p-3 bg-netflix-hover rounded-lg">
                  <p className="text-xs text-netflix-text-muted mb-1">Resposta do cliente:</p>
                  <p className="text-sm text-netflix-text line-clamp-2">{session.response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="text-center py-12">
            <Video className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-netflix-text mb-2">Nenhuma sessão criada</h3>
            <p className="text-netflix-text-muted mb-6">
              Crie a primeira sessão personalizada para {userName}
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="instituto-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Sessão
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de visualização detalhada */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-netflix-text">
                  {selectedSession.title}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-2">
                  {getStatusBadge(selectedSession)}
                  <span className="text-sm text-netflix-text-muted">
                    Criada em {new Date(selectedSession.created_at).toLocaleDateString()}
                  </span>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {selectedSession.description && (
                  <div>
                    <h4 className="font-medium text-netflix-text mb-2">Descrição</h4>
                    <p className="text-netflix-text-muted">{selectedSession.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-netflix-text mb-2">Conteúdo da Sessão</h4>
                  <div className="p-4 bg-netflix-gray/20 rounded-lg">
                    <p className="text-netflix-text whitespace-pre-wrap">{selectedSession.content}</p>
                  </div>
                </div>

                {(selectedSession.video_url || selectedSession.pdf_url) && (
                  <div>
                    <h4 className="font-medium text-netflix-text mb-2">Materiais</h4>
                    <div className="flex gap-3">
                      {selectedSession.video_url && (
                        <Button variant="outline" asChild className="border-instituto-orange text-instituto-orange hover:bg-instituto-orange hover:text-white">
                          <a href={selectedSession.video_url} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-2" />
                            Abrir Vídeo
                          </a>
                        </Button>
                      )}
                      {selectedSession.pdf_url && (
                        <Button variant="outline" asChild className="border-instituto-purple text-instituto-purple hover:bg-instituto-purple hover:text-white">
                          <a href={selectedSession.pdf_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Abrir PDF
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {selectedSession.response && (
                  <div>
                    <h4 className="font-medium text-netflix-text mb-2">Resposta do Cliente</h4>
                    <div className="p-4 bg-instituto-green/10 rounded-lg border border-instituto-green/20">
                      <p className="text-netflix-text whitespace-pre-wrap">{selectedSession.response}</p>
                      {selectedSession.completed_at && (
                        <p className="text-xs text-instituto-green mt-3">
                          Respondida em {new Date(selectedSession.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedSession.private_notes && (
                  <div>
                    <h4 className="font-medium text-netflix-text mb-2">Notas Privadas do Cliente</h4>
                    <div className="p-4 bg-netflix-hover rounded-lg">
                      <p className="text-netflix-text-muted whitespace-pre-wrap">{selectedSession.private_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};