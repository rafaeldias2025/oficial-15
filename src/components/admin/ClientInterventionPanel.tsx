import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  AlertTriangle, 
  Calendar, 
  Send, 
  FileText,
  Target,
  TrendingDown,
  Clock
} from 'lucide-react';

interface ClientData {
  profile: any;
  physicalData: any;
  recentMissions: any[];
  weeklyScores: any[];
  weightHistory: any[];
  engagementData: any;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  type: 'note' | 'alert' | 'goal';
}

interface ClientInterventionPanelProps {
  userId: string;
  clientData: ClientData;
}

export const ClientInterventionPanel: React.FC<ClientInterventionPanelProps> = ({
  userId,
  clientData
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'note' | 'alert' | 'goal'>('note');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, [userId]);

  const loadNotes = async () => {
    try {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('target_id', userId)
        .eq('target_type', 'user_intervention')
        .order('created_at', { ascending: false });

      if (data) {
        setNotes(data.map(comment => ({
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          created_by: comment.user_id,
          type: comment.is_private ? 'alert' : 'note'
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    
    setLoading(true);
    try {
      // Primeiro, pegar o ID do perfil do admin atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!adminProfile) throw new Error('Perfil do admin não encontrado');

      const { error } = await supabase
        .from('comments')
        .insert({
          target_id: userId,
          target_type: 'user_intervention',
          content: newNote,
          user_id: adminProfile.id,
          is_private: noteType === 'alert'
        });

      if (error) throw error;

      setNewNote('');
      loadNotes();
      toast({
        title: 'Nota adicionada',
        description: 'A nota foi salva com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a nota.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = () => {
    const alerts = [];
    const { engagementData, recentMissions, weightHistory } = clientData;

    // Alerta de inatividade
    if (engagementData.status === 'inactive') {
      alerts.push({
        type: 'danger',
        title: 'Cliente Inativo',
        message: `Sem atividade há ${engagementData.daysSinceLastActivity} dias. Considere entrar em contato.`,
        icon: AlertTriangle
      });
    }

    // Alerta de baixa performance
    if (engagementData.completionRate < 30) {
      alerts.push({
        type: 'warning',
        title: 'Baixa Taxa de Conclusão',
        message: `Taxa de conclusão de apenas ${engagementData.completionRate.toFixed(0)}%. Cliente pode precisar de apoio.`,
        icon: TrendingDown
      });
    }

    // Alerta de padrão preocupante
    const recentIncomplete = recentMissions.slice(0, 3).filter(m => !m.concluido).length;
    if (recentIncomplete >= 3) {
      alerts.push({
        type: 'warning',
        title: 'Padrão Preocupante',
        message: 'Últimos 3 dias sem conclusão de missões. Requer atenção.',
        icon: Clock
      });
    }

    return alerts;
  };

  const generateRecommendations = () => {
    const recommendations = [];
    const { engagementData, recentMissions, physicalData } = clientData;

    // Recomendação baseada em engajamento
    if (engagementData.avgScore < 15) {
      recommendations.push({
        title: 'Revisão de Metas',
        description: 'Pontuação média baixa. Considere ajustar as metas para serem mais alcançáveis.',
        priority: 'high'
      });
    }

    // Recomendação baseada em padrões de sono
    const sleepPattern = recentMissions
      .filter(m => m.sono_horas)
      .reduce((acc, m) => acc + m.sono_horas, 0) / 
      recentMissions.filter(m => m.sono_horas).length;

    if (sleepPattern < 6) {
      recommendations.push({
        title: 'Higiene do Sono',
        description: 'Média de sono abaixo de 6h. Focar em estratégias de melhoria do sono.',
        priority: 'medium'
      });
    }

    // Recomendação baseada em exercício
    const exerciseFreq = recentMissions.filter(m => m.atividade_fisica).length;
    if (exerciseFreq < 2) {
      recommendations.push({
        title: 'Atividade Física',
        description: 'Baixa frequência de exercícios. Incentivar atividades físicas leves.',
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const alerts = generateAlerts();
  const recommendations = generateRecommendations();

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'goal': return Target;
      default: return MessageSquare;
    }
  };

  const getNoteColor = (type: string) => {
    switch (type) {
      case 'alert': return 'border-l-instituto-orange';
      case 'goal': return 'border-l-instituto-green';
      default: return 'border-l-instituto-purple';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Painel de Alertas e Recomendações */}
      <div className="space-y-6">
        {/* Alertas */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-instituto-orange" />
              Alertas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-netflix-text-muted text-center py-4">
                Nenhum alerta ativo para este cliente
              </p>
            ) : (
              alerts.map((alert, index) => (
                <Alert key={index} className={`border-l-4 ${alert.type === 'danger' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
                  <alert.icon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{alert.title}:</strong> {alert.message}
                  </AlertDescription>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recomendações */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <Target className="h-5 w-5 text-instituto-green" />
              Recomendações de Intervenção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.length === 0 ? (
              <p className="text-netflix-text-muted text-center py-4">
                Cliente está dentro dos padrões esperados
              </p>
            ) : (
              recommendations.map((rec, index) => (
                <div key={index} className="border border-netflix-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : 'outline'}
                      className={rec.priority === 'high' ? '' : 'border-instituto-gold text-instituto-gold'}
                    >
                      {rec.priority === 'high' ? 'Alta Prioridade' : 'Média Prioridade'}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-netflix-text">{rec.title}</h4>
                  <p className="text-sm text-netflix-text-muted">{rec.description}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Painel de Notas */}
      <div className="space-y-6">
        {/* Adicionar Nova Nota */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <FileText className="h-5 w-5 text-instituto-purple" />
              Adicionar Nota de Intervenção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={noteType === 'note' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNoteType('note')}
                className={noteType === 'note' ? 'bg-instituto-purple' : ''}
              >
                Nota
              </Button>
              <Button
                variant={noteType === 'alert' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNoteType('alert')}
                className={noteType === 'alert' ? 'bg-instituto-orange' : ''}
              >
                Alerta
              </Button>
              <Button
                variant={noteType === 'goal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNoteType('goal')}
                className={noteType === 'goal' ? 'bg-instituto-green' : ''}
              >
                Meta
              </Button>
            </div>
            <Textarea
              placeholder="Digite sua nota de intervenção..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="bg-netflix-hover border-netflix-border text-netflix-text"
              rows={4}
            />
            <Button 
              onClick={addNote} 
              disabled={loading || !newNote.trim()}
              className="w-full bg-instituto-purple hover:bg-instituto-purple/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : 'Adicionar Nota'}
            </Button>
          </CardContent>
        </Card>

        {/* Histórico de Notas */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <Calendar className="h-5 w-5 text-instituto-gold" />
              Histórico de Intervenções
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-netflix-text-muted text-center py-4">
                Nenhuma nota de intervenção registrada
              </p>
            ) : (
              notes.map((note) => {
                const NoteIcon = getNoteIcon(note.type);
                return (
                  <div 
                    key={note.id} 
                    className={`border-l-4 ${getNoteColor(note.type)} bg-netflix-hover rounded-r-lg p-3`}
                  >
                    <div className="flex items-start gap-3">
                      <NoteIcon className="h-4 w-4 mt-1 text-netflix-text-muted" />
                      <div className="flex-1">
                        <p className="text-sm text-netflix-text">{note.content}</p>
                        <p className="text-xs text-netflix-text-muted mt-1">
                          {new Date(note.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};