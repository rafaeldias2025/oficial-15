import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Target, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  nome_completo_dados: string | null;
}

interface WeightGoal {
  id: string;
  user_id: string;
  name: string;
  type: string;
  start_date: string;
  target_date: string;
  notes?: string;
  progress?: number;
  created_at: string;
}

interface WeightGoalsManagerProps {
  selectedUser: User;
  currentWeight: number;
}

export const WeightGoalsManager: React.FC<WeightGoalsManagerProps> = ({
  selectedUser,
  currentWeight,
}) => {
  const [goals, setGoals] = useState<WeightGoal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WeightGoal | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    type: 'peso',
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    notes: '',
    progress: 0
  });

  useEffect(() => {
    fetchGoals();
  }, [selectedUser]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', selectedUser.id)
        .eq('type', 'peso')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.target_date) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      if (editingGoal) {
        const { error } = await supabase
          .from('goals')
          .update(formData)
          .eq('id', editingGoal.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Meta atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('goals')
          .insert({
            user_id: selectedUser.id,
            ...formData
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Meta criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      setEditingGoal(null);
      resetForm();
      fetchGoals();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a meta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Meta excluída com sucesso",
      });
      
      fetchGoals();
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a meta",
        variant: "destructive"
      });
    }
  };

  const updateGoalProgress = async (goalId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ progress })
        .eq('id', goalId);

      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'peso',
      start_date: new Date().toISOString().split('T')[0],
      target_date: '',
      notes: '',
      progress: 0
    });
  };

  const openEditDialog = (goal: WeightGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      type: goal.type,
      start_date: goal.start_date.split('T')[0],
      target_date: goal.target_date.split('T')[0],
      notes: goal.notes || '',
      progress: goal.progress || 0
    });
    setIsDialogOpen(true);
  };

  const getUserDisplayName = () => {
    return selectedUser.nome_completo_dados || selectedUser.full_name || selectedUser.email;
  };

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Target className="h-5 w-5 text-instituto-orange" />
            Metas de Peso - {getUserDisplayName()}
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingGoal(null);
                  resetForm();
                }}
                className="bg-instituto-orange hover:bg-instituto-orange/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-netflix-card border-netflix-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-netflix-text">
                  {editingGoal ? 'Editar Meta' : 'Nova Meta de Peso'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-netflix-text">Nome da Meta</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="bg-netflix-hover border-netflix-border text-netflix-text"
                    placeholder="Ex: Perder 5kg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-netflix-text">Data Início</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        start_date: e.target.value
                      }))}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-netflix-text">Data Limite</Label>
                    <Input
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        target_date: e.target.value
                      }))}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-netflix-text">Observações</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    className="bg-netflix-hover border-netflix-border text-netflix-text"
                    placeholder="Observações sobre a meta..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-netflix-border text-netflix-text"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-instituto-orange hover:bg-instituto-orange/90"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-netflix-text-muted mx-auto mb-4" />
            <p className="text-netflix-text-muted">Nenhuma meta de peso definida</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 bg-netflix-hover rounded-lg border border-netflix-border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-netflix-text">
                      {goal.name}
                    </h4>
                    <p className="text-sm text-netflix-text-muted">
                      Peso atual: {currentWeight}kg
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-instituto-green text-white">
                      {goal.progress || 0}% concluído
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(goal)}
                      className="border-netflix-border"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteGoal(goal.id)}
                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-netflix-text-muted">Progresso</span>
                    <span className="text-netflix-text">{goal.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-netflix-border rounded-full h-2">
                    <div 
                      className="bg-instituto-orange h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-netflix-text-muted">Início:</span>
                    <span className="ml-1 text-netflix-text">
                      {format(new Date(goal.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  <div>
                    <span className="text-netflix-text-muted">Limite:</span>
                    <span className="ml-1 text-netflix-text">
                      {format(new Date(goal.target_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>

                {goal.notes && (
                  <div className="mt-3 p-2 bg-netflix-dark rounded text-sm">
                    <span className="text-netflix-text-muted">Obs:</span>
                    <span className="ml-1 text-netflix-text">{goal.notes}</span>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => updateGoalProgress(goal.id, 100)}
                    className="bg-instituto-green hover:bg-instituto-green/90"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Concluir (100%)
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateGoalProgress(goal.id, 50)}
                    variant="outline"
                    className="border-netflix-border text-netflix-text"
                  >
                    50% Concluído
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};