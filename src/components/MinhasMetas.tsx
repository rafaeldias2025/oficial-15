import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  CalendarIcon, 
  TrendingDown, 
  Heart, 
  Zap, 
  Activity,
  Sparkles,
  Bell,
  BarChart3,
  Moon,
  Dumbbell,
  Brain,
  Utensils,
  Trophy,
  AlertTriangle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Meta {
  id: string;
  nome: string;
  tipo: 'emagrecer' | 'melhorar-sono' | 'ganhar-massa' | 'reduzir-ansiedade' | 'melhorar-alimentacao' | 'criar-habito' | 'reduzir-dor' | 'outro';
  dataInicio: Date;
  previsaoConclusao: Date;
  notas: string;
  progresso: number;
  tipoOutro?: string;
  lembretesSemana: boolean;
  planoAutomatico: boolean;
}

interface MinhasMetasProps {
  userType: 'visitante' | 'cliente';
}

const MinhasMetas: React.FC<MinhasMetasProps> = ({ userType }) => {
  const [metas, setMetas] = useState<Meta[]>([
    {
      id: '1',
      nome: 'Perder 10kg até meu aniversário para me sentir leve e confiante',
      tipo: 'emagrecer',
      dataInicio: new Date('2024-01-01'),
      previsaoConclusao: new Date('2024-06-01'),
      notas: 'Quero me sentir mais leve e confiante para curtir meu aniversário. Imagino como será incrível usar aquele vestido que sempre quis!',
      progresso: 35,
      lembretesSemana: true,
      planoAutomatico: true
    },
    {
      id: '2', 
      nome: 'Dormir 8 horas por noite para ter mais energia',
      tipo: 'melhorar-sono',
      dataInicio: new Date('2024-01-15'),
      previsaoConclusao: new Date('2024-04-15'),
      notas: 'Quero acordar mais disposta e produtiva. Sonho com manhãs em que acordo descansada e cheia de energia.',
      progresso: 60,
      lembretesSemana: false,
      planoAutomatico: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [showDateWarning, setShowDateWarning] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    dataInicio: new Date(),
    previsaoConclusao: new Date(),
    notas: '',
    tipoOutro: '',
    lembretesSemana: false,
    planoAutomatico: false
  });

  const tiposMeta = [
    { value: 'emagrecer', label: 'Emagrecer', icon: TrendingDown },
    { value: 'melhorar-sono', label: 'Melhorar Sono', icon: Moon },
    { value: 'ganhar-massa', label: 'Ganhar Massa Magra', icon: Dumbbell },
    { value: 'reduzir-ansiedade', label: 'Reduzir Ansiedade', icon: Brain },
    { value: 'melhorar-alimentacao', label: 'Melhorar Alimentação', icon: Utensils },
    { value: 'criar-habito', label: 'Criar Novo Hábito', icon: Trophy },
    { value: 'reduzir-dor', label: 'Reduzir Dor', icon: Heart },
    { value: 'outro', label: 'Outro', icon: Activity }
  ];

  const sugestoesPorTipo = {
    'emagrecer': [
      'Perder 5kg até o verão para me sentir confiante na praia',
      'Eliminar 10kg em 3 meses para conquistar minha autoestima',
      'Vestir tamanho 38 com orgulho até dezembro'
    ],
    'melhorar-sono': [
      'Dormir 8 horas por noite para acordar renovada',
      'Ter noites tranquilas sem insônia até março',
      'Criar rotina de sono relaxante para dias mais produtivos'
    ],
    'ganhar-massa': [
      'Ganhar 3kg de massa muscular para me sentir forte',
      'Definir braços e pernas até o verão',
      'Aumentar força e resistência para mais disposição'
    ],
    'reduzir-ansiedade': [
      'Controlar ansiedade para viver com mais paz',
      'Ter dias tranquilos sem crises de ansiedade',
      'Desenvolver calma para enfrentar desafios'
    ],
    'melhorar-alimentacao': [
      'Comer 5 porções de frutas e verduras por dia',
      'Eliminar açúcar refinado para ter mais energia',
      'Criar hábitos alimentares saudáveis para vida toda'
    ],
    'criar-habito': [
      'Meditar 10 minutos todo dia para encontrar paz interior',
      'Caminhar 30 minutos diários para mais disposição',
      'Ler 20 páginas por dia para crescer pessoalmente'
    ]
  };

  const dicasMotivacionais = [
    "Escreva algo que te motive quando bater o desânimo.",
    "Pense no porquê essa meta é importante para você.",
    "Imagine como você se sentirá ao alcançar este objetivo.",
    "Descreva o impacto positivo que isso trará para sua vida.",
    "Lembre-se: você é capaz de conquistas incríveis!",
    "Visualize-se celebrando quando alcançar esta meta."
  ];

  const getMetaIcon = (tipo: string) => {
    const tipoMeta = tiposMeta.find(t => t.value === tipo);
    return tipoMeta ? tipoMeta.icon : Activity;
  };

  const gerarSugestaoIA = () => {
    if (!formData.tipo || formData.tipo === 'outro') {
      return 'Perder 10kg até meu aniversário para me sentir leve e confiante';
    }
    
    const sugestoes = sugestoesPorTipo[formData.tipo as keyof typeof sugestoesPorTipo] || [];
    const sugestaoAleatoria = sugestoes[Math.floor(Math.random() * sugestoes.length)];
    return sugestaoAleatoria || 'Alcançar minha transformação pessoal com determinação e amor próprio';
  };

  const aplicarSugestaoIA = () => {
    const sugestao = gerarSugestaoIA();
    setFormData({...formData, nome: sugestao});
  };

  const validarDatas = (inicio: Date, fim: Date) => {
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      setShowDateWarning(true);
      return false;
    }
    setShowDateWarning(false);
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.tipo) return;

    // Validar datas
    if (!validarDatas(formData.dataInicio, formData.previsaoConclusao)) {
      return; // Mostra aviso mas não bloqueia
    }

    try {
      setIsSubmitting(true);

      const novaMeta: Meta = {
        id: editingMeta ? editingMeta.id : Date.now().toString(),
        nome: formData.nome,
        tipo: formData.tipo as Meta['tipo'],
        dataInicio: formData.dataInicio,
        previsaoConclusao: formData.previsaoConclusao,
        notas: formData.notas,
        progresso: editingMeta ? editingMeta.progresso : 0,
        tipoOutro: formData.tipo === 'outro' ? formData.tipoOutro : undefined,
        lembretesSemana: formData.lembretesSemana,
        planoAutomatico: formData.planoAutomatico
      };

      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingMeta) {
        setMetas(metas.map(m => m.id === editingMeta.id ? novaMeta : m));
      } else {
        setMetas([...metas, novaMeta]);
      }

      resetForm();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: '',
      dataInicio: new Date(),
      previsaoConclusao: new Date(),
      notas: '',
      tipoOutro: '',
      lembretesSemana: false,
      planoAutomatico: false
    });
    setEditingMeta(null);
    setShowForm(false);
    setShowDateWarning(false);
  };

  const handleEdit = (meta: Meta) => {
    setFormData({
      nome: meta.nome,
      tipo: meta.tipo,
      dataInicio: meta.dataInicio,
      previsaoConclusao: meta.previsaoConclusao,
      notas: meta.notas,
      tipoOutro: meta.tipoOutro || '',
      lembretesSemana: meta.lembretesSemana,
      planoAutomatico: meta.planoAutomatico
    });
    setEditingMeta(meta);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setMetas(metas.filter(m => m.id !== id));
  };

  const getMotivationalMessage = (meta: Meta) => {
    const today = new Date();
    const daysRemaining = Math.ceil((meta.previsaoConclusao.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (meta.progresso >= 80) {
      return "🔥 Você está quase lá! Continue assim!";
    } else if (meta.progresso >= 50) {
      return `💪 Metade do caminho! Faltam ${daysRemaining} dias!`;
    } else if (daysRemaining <= 7) {
      return "⚡ Reta final! Acelere o ritmo!";
    } else {
      return `🌟 Você está a ${daysRemaining} dias da sua meta!`;
    }
  };

  const getDicaAleatoria = () => {
    return dicasMotivacionais[Math.floor(Math.random() * dicasMotivacionais.length)];
  };

  // Versão simplificada para visitantes
  if (userType === 'visitante') {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Target className="h-16 w-16 text-instituto-orange mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-netflix-text mb-4">Minhas Metas</h2>
          <p className="text-netflix-text-muted mb-6 max-w-2xl mx-auto">
            Defina suas metas de transformação pessoal. Como visitante, você pode criar até 3 metas básicas.
          </p>
        </div>

        {/* Versão simplificada das estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-instituto-orange/20 to-instituto-orange/10 border-instituto-orange/30">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-netflix-text">{Math.min(metas.length, 3)}</h3>
              <p className="text-netflix-text-muted">Metas Criadas</p>
              <p className="text-xs text-netflix-text-muted mt-1">Limite: 3 metas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-instituto-purple/20 to-instituto-purple/10 border-instituto-purple/30">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-netflix-text">
                {Math.round(metas.slice(0, 3).reduce((acc, meta) => acc + meta.progresso, 0) / Math.min(metas.length, 3)) || 0}%
              </h3>
              <p className="text-netflix-text-muted">Progresso Médio</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-netflix-text">Suas Metas</h3>
            <p className="text-netflix-text-muted">Versão gratuita - até 3 metas</p>
          </div>
          
          {metas.length < 3 && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-instituto-orange hover:bg-instituto-orange-hover text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-netflix-card border-netflix-border max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-netflix-text">Nova Meta</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Formulário simplificado para visitantes */}
                  <div>
                    <Label className="text-netflix-text">Nome da Meta</Label>
                    <Input
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Perder 10kg até meu aniversário para me sentir leve e confiante"
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                    />
                    <p className="text-xs text-netflix-text-muted mt-1">
                      Escreva uma meta clara e emocional. Pense no porquê você quer isso.
                    </p>
                  </div>

                  <div>
                    <Label className="text-netflix-text">Tipo</Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-netflix-card border-netflix-border">
                        {tiposMeta.slice(0, 6).map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value} className="text-netflix-text hover:bg-netflix-hover">
                            <div className="flex items-center gap-2">
                              <tipo.icon className="h-4 w-4" />
                              {tipo.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-netflix-text">Notas e Comentários</Label>
                    <Textarea
                      value={formData.notas}
                      onChange={(e) => setFormData({...formData, notas: e.target.value})}
                      placeholder="Por que essa meta é importante para você? Como vai se sentir ao alcançá-la?"
                      className="bg-netflix-hover border-netflix-border text-netflix-text resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-netflix-text-muted mt-1">
                      {getDicaAleatoria()}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 bg-instituto-orange hover:bg-instituto-orange-hover text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Criando...
                        </>
                      ) : (
                        'Criar Meta'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        resetForm();
                        setIsCreating(false);
                      }}
                      disabled={isSubmitting}
                      className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Lista de metas simplificada */}
        <div className="grid gap-4">
          {metas.slice(0, 3).map((meta) => {
            const IconComponent = getMetaIcon(meta.tipo);
            return (
              <Card key={meta.id} className="bg-netflix-card border-netflix-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-instituto-orange/20 rounded-lg">
                      <IconComponent className="h-6 w-6 text-instituto-orange" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-netflix-text mb-2">{meta.nome}</h3>
                      <p className="text-netflix-text-muted mb-3 text-sm">{meta.notas}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-netflix-text-muted">Progresso</span>
                          <span className="text-netflix-text font-medium">{meta.progresso}%</span>
                        </div>
                        <div className="w-full bg-netflix-hover rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-instituto-orange to-instituto-purple h-2 rounded-full transition-all duration-500"
                            style={{ width: `${meta.progresso}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(meta.id)}
                      className="text-netflix-text-muted hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {metas.length === 0 && (
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 text-netflix-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-netflix-text mb-2">
                  Crie sua primeira meta
                </h3>
                <p className="text-netflix-text-muted mb-6">
                  Comece sua jornada de transformação definindo um objetivo claro
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-instituto-orange hover:bg-instituto-orange-hover text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Meta
                </Button>
              </CardContent>
            </Card>
          )}

          {metas.length >= 3 && (
            <Card className="bg-instituto-orange/10 border-instituto-orange/30">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-instituto-orange mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-netflix-text mb-2">
                  Limite de metas atingido
                </h3>
                <p className="text-netflix-text-muted mb-4">
                  Como visitante, você pode criar até 3 metas. Para metas ilimitadas e recursos avançados, torne-se cliente.
                </p>
                <Button className="instituto-button">
                  Tornar-se Cliente
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Versão completa para clientes
  return (
    <div className="space-y-6">
      {/* Header com estatísticas motivacionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-instituto-orange/20 to-instituto-orange/10 border-instituto-orange/30">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-netflix-text">{metas.length}</h3>
            <p className="text-netflix-text-muted">Metas Ativas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500/20 to-green-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-netflix-text">
              {metas.filter(m => m.progresso >= 100).length}
            </h3>
            <p className="text-netflix-text-muted">Concluídas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-instituto-purple/20 to-instituto-purple/10 border-instituto-purple/30">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-netflix-text">
              {Math.round(metas.reduce((acc, meta) => acc + meta.progresso, 0) / metas.length) || 0}%
            </h3>
            <p className="text-netflix-text-muted">Progresso Médio</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-netflix-text">Minhas Metas</h2>
          <p className="text-netflix-text-muted mt-2">
            Defina e acompanhe suas metas de transformação pessoal
          </p>
        </div>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-instituto-orange hover:bg-instituto-orange-hover text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-netflix-card border-netflix-border max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-netflix-text">
                {editingMeta ? 'Editar Meta' : 'Nova Meta'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-netflix-text">Nome da Meta</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={aplicarSugestaoIA}
                    className="border-instituto-orange text-instituto-orange hover:bg-instituto-orange hover:text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Gerar sugestão com IA
                  </Button>
                </div>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Perder 10kg até meu aniversário para me sentir leve e confiante"
                  className="bg-netflix-hover border-netflix-border text-netflix-text"
                />
                <p className="text-xs text-netflix-text-muted mt-1">
                  Escreva uma meta clara e emocional. Pense no porquê você quer isso.
                </p>
              </div>

              <div>
                <Label className="text-netflix-text">Tipo da Meta</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                  <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-netflix-card border-netflix-border">
                    {tiposMeta.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value} className="text-netflix-text hover:bg-netflix-hover">
                        <div className="flex items-center gap-2">
                          <tipo.icon className="h-4 w-4" />
                          {tipo.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.tipo === 'outro' && (
                <div>
                  <Label className="text-netflix-text">Especifique o tipo</Label>
                  <Input
                    value={formData.tipoOutro}
                    onChange={(e) => setFormData({...formData, tipoOutro: e.target.value})}
                    placeholder="Descreva o tipo da sua meta"
                    className="bg-netflix-hover border-netflix-border text-netflix-text"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-netflix-text">Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-netflix-hover border-netflix-border text-netflix-text"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-netflix-card border-netflix-border">
                      <Calendar
                        mode="single"
                        selected={formData.dataInicio}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({...formData, dataInicio: date});
                            validarDatas(date, formData.previsaoConclusao);
                          }
                        }}
                        initialFocus
                        className="text-netflix-text"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-netflix-text">Previsão de Conclusão</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-netflix-hover border-netflix-border text-netflix-text"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.previsaoConclusao, "dd/MM/yyyy", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-netflix-card border-netflix-border">
                      <Calendar
                        mode="single"
                        selected={formData.previsaoConclusao}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({...formData, previsaoConclusao: date});
                            validarDatas(formData.dataInicio, date);
                          }
                        }}
                        initialFocus
                        className="text-netflix-text"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {showDateWarning && (
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-600">
                    Essa meta está com prazo muito apertado. Deseja ajustar para um plano mais realista?
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label className="text-netflix-text">Notas e Comentários</Label>
                <Textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  placeholder="Por que essa meta é importante para você? Como vai se sentir ao alcançá-la?"
                  className="bg-netflix-hover border-netflix-border text-netflix-text resize-none"
                  rows={4}
                />
                <p className="text-xs text-netflix-text-muted mt-1">
                  {getDicaAleatoria()}
                </p>
              </div>

              {/* Lembretes e Engajamento */}
              <div className="space-y-4 p-4 bg-instituto-orange/5 rounded-lg border border-instituto-orange/20">
                <h4 className="text-sm font-semibold text-netflix-text">Lembretes e Engajamento</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-instituto-orange" />
                    <span className="text-sm text-netflix-text">Receber lembretes semanais dessa meta</span>
                  </div>
                  <Switch
                    checked={formData.lembretesSemana}
                    onCheckedChange={(checked) => setFormData({...formData, lembretesSemana: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-instituto-orange" />
                    <span className="text-sm text-netflix-text">Gerar plano semanal automático</span>
                  </div>
                  <Switch
                    checked={formData.planoAutomatico}
                    onCheckedChange={(checked) => setFormData({...formData, planoAutomatico: checked})}
                  />
                </div>
                <p className="text-xs text-netflix-text-muted">
                  (ex: dividir perda de peso em semanas)
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-instituto-orange hover:bg-instituto-orange-hover text-white"
                >
                  {editingMeta ? 'Salvar' : 'Criar Meta'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {metas.map((meta) => {
          const IconComponent = getMetaIcon(meta.tipo);
          return (
            <Card key={meta.id} className="bg-netflix-card border-netflix-border netflix-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-instituto-orange/20 rounded-lg">
                      <IconComponent className="h-6 w-6 text-instituto-orange" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-netflix-text mb-2">{meta.nome}</h3>
                      <p className="text-netflix-text-muted mb-3">{meta.notas}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-netflix-text-muted mb-4">
                        <span>Início: {format(meta.dataInicio, "dd/MM/yyyy", { locale: ptBR })}</span>
                        <span>•</span>
                        <span>Meta: {format(meta.previsaoConclusao, "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>

                      {/* Indicadores de recursos ativados */}
                      <div className="flex gap-2 mb-4">
                        {meta.lembretesSemana && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-instituto-orange/10 rounded-full">
                            <Bell className="h-3 w-3 text-instituto-orange" />
                            <span className="text-xs text-instituto-orange">Lembretes</span>
                          </div>
                        )}
                        {meta.planoAutomatico && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-instituto-purple/10 rounded-full">
                            <BarChart3 className="h-3 w-3 text-instituto-purple" />
                            <span className="text-xs text-instituto-purple">Plano Auto</span>
                          </div>
                        )}
                      </div>

                      {/* Mensagem Motivacional */}
                      <div className="p-3 bg-instituto-orange/10 border border-instituto-orange/20 rounded-lg mb-4">
                        <p className="text-sm text-instituto-orange font-medium">
                          {getMotivationalMessage(meta)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-netflix-text-muted">Progresso</span>
                          <span className="text-netflix-text font-medium">{meta.progresso}%</span>
                        </div>
                        <div className="w-full bg-netflix-hover rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-instituto-orange to-instituto-purple h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                            style={{ width: `${meta.progresso}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                          </div>
                        </div>
                        
                        {/* Botões de ação do progresso */}
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const novoProgresso = Math.min(100, meta.progresso + 10);
                              setMetas(metas.map(m => m.id === meta.id ? {...m, progresso: novoProgresso} : m));
                            }}
                            className="border-instituto-orange text-instituto-orange hover:bg-instituto-orange hover:text-white"
                          >
                            +10% Progresso
                          </Button>
                          {meta.progresso >= 100 && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              ✅ Concluída!
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(meta)}
                      className="text-netflix-text-muted hover:text-netflix-text hover:bg-netflix-hover"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(meta.id)}
                      className="text-netflix-text-muted hover:text-red-400 hover:bg-netflix-hover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {metas.length === 0 && (
          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-netflix-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-netflix-text mb-2">
                Nenhuma meta criada ainda
              </h3>
              <p className="text-netflix-text-muted mb-6">
                Crie sua primeira meta de transformação para começar sua jornada
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-instituto-orange hover:bg-instituto-orange-hover text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Meta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MinhasMetas;