import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

interface WheelData {
  name: string;
  value: number;
  color: string;
}

interface WheelToolProps {
  wheelType: 'energia_vital' | 'roda_vida' | 'saude_energia';
  sessionId: string;
  userId: string;
  isSessionActive: boolean;
}

const wheelConfigs = {
  energia_vital: {
    title: 'Roda da Energia Vital',
    areas: ['Espiritual', 'Mental', 'Emocional', 'Físico'],
    questions: [
      'Qual área você considera mais equilibrada e por quê?',
      'Qual área precisa de mais atenção?',
      'O que você pode fazer hoje para melhorar a área mais fraca?'
    ]
  },
  roda_vida: {
    title: 'Roda que Sustenta a Energia Vital',
    areas: ['Profissional', 'Financeiro', 'Família', 'Relacionamento Íntimo', 'Saúde e Energia'],
    questions: [
      'Qual pilar da sua vida está mais sólido?',
      'Qual área está causando mais frustração?',
      'Como você pode fortalecer o pilar mais fraco?'
    ]
  },
  saude_energia: {
    title: 'Roda da Saúde e Energia',
    areas: ['Sono', 'Intestino', 'Atividade Física', 'Alimentação', 'Respiração', 'Água', 'Ausência de Doenças', 'Energia'],
    questions: [
      'Qual hábito de saúde você considera mais forte?',
      'Qual área da sua saúde precisa de mais atenção?',
      'Que decisão você tomará para melhorar sua área mais fraca?'
    ]
  }
};

const getColorByScore = (score: number): string => {
  if (score >= 0 && score <= 3) return '#ef4444'; // vermelho
  if (score >= 4 && score <= 6) return '#eab308'; // amarelo
  if (score >= 7 && score <= 8) return '#84cc16'; // verde claro
  if (score >= 9 && score <= 10) return '#16a34a'; // verde escuro
  return '#6b7280'; // cinza padrão
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">Nota: {data.value}/10</p>
      </div>
    );
  }
  return null;
};

export const WheelTool: React.FC<WheelToolProps> = ({ 
  wheelType, 
  sessionId, 
  userId, 
  isSessionActive 
}) => {
  const { toast } = useToast();
  const config = wheelConfigs[wheelType];
  
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(config.areas.map(area => [area, 0]))
  );
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingResponse, setHasExistingResponse] = useState(false);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [highlightedArea, setHighlightedArea] = useState<string | null>(null);

  useEffect(() => {
    loadExistingResponse();
  }, [sessionId, wheelType]);

  const loadExistingResponse = async () => {
    try {
      const { data, error } = await supabase
        .from('wheel_responses')
        .select('*')
        .eq('session_id', sessionId)
        .eq('wheel_type', wheelType)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setScores(data.responses as Record<string, number> || {});
        setReflectionAnswers(data.reflection_answers as Record<string, string> || {});
        setHasExistingResponse(true);
      }
    } catch (error) {
      console.error('Erro ao carregar resposta existente:', error);
    }
  };

  const handleAreaClick = (area: string) => {
    if (scores[area] === 0) {
      setActiveArea(area);
      setHighlightedArea(area);
    } else {
      // Se já tem nota, permitir editar
      setActiveArea(area);
      setHighlightedArea(area);
    }
  };

  const handleSliderChange = (area: string, value: number[]) => {
    const newScore = value[0];
    setScores(prev => ({ ...prev, [area]: newScore }));
  };

  const handleSliderComplete = () => {
    setActiveArea(null);
    setHighlightedArea(null);
  };

  const handleReflectionChange = (questionIndex: number, value: string) => {
    setReflectionAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const getAreaQuestion = (area: string): string => {
    const questionMap: Record<string, string> = {
      'Espiritual': 'Como está sua conexão espiritual?',
      'Mental': 'Como está sua saúde mental?', 
      'Emocional': 'Como está seu equilíbrio emocional?',
      'Físico': 'Como está sua saúde física?',
      'Profissional': 'Como está sua vida profissional?',
      'Financeiro': 'Como está sua situação financeira?',
      'Família': 'Como está sua relação familiar?',
      'Relacionamento Íntimo': 'Como está seu relacionamento íntimo?',
      'Saúde e Energia': 'Como está sua saúde e energia?',
      'Sono': 'Como está a qualidade do seu sono?',
      'Intestino': 'Como está a saúde do seu intestino?',
      'Atividade Física': 'Como está sua prática de atividade física?',
      'Alimentação': 'Como está sua alimentação?',
      'Respiração': 'Como está sua respiração?',
      'Água': 'Como está seu consumo de água?',
      'Ausência de Doenças': 'Como está sua saúde em geral?',
      'Energia': 'Como está seu nível de energia?'
    };
    return questionMap[area] || `Como está: ${area}?`;
  };

  const pieData: WheelData[] = config.areas.map(area => ({
    name: area,
    value: scores[area] || 0,
    color: getColorByScore(scores[area] || 0)
  }));

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('wheel_responses')
        .upsert({
          user_id: userId,
          session_id: sessionId,
          wheel_type: wheelType,
          responses: scores,
          reflection_answers: reflectionAnswers,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,session_id,wheel_type'
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Suas respostas foram salvas com sucesso.",
      });
      
      setHasExistingResponse(true);
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas respostas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSessionActive) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Esta ferramenta será liberada no dia da sua sessão.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold mb-2">
            Sessão de Hoje: {config.title}
          </CardTitle>
          <p className="text-center text-muted-foreground mb-4">
            Avalie cada área da sua vida de 0 a 10 e veja seu gráfico se formar em tempo real
          </p>
          
          {/* Indicador de Progresso */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progresso da Avaliação</span>
              <span>{Object.values(scores).filter(score => score > 0).length}/{config.areas.length} áreas</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(Object.values(scores).filter(score => score > 0).length / config.areas.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     outerRadius={highlightedArea ? 130 : 120}
                     fill="#8884d8"
                     dataKey="value"
                     label={({ name, value }) => value > 0 ? `${name}: ${value}` : name}
                     onClick={(data) => handleAreaClick(data.name)}
                     className="cursor-pointer"
                   >
                     {pieData.map((entry, index) => {
                       const isHighlighted = highlightedArea === entry.name;
                       const strokeWidth = isHighlighted ? 4 : 1;
                       const stroke = isHighlighted ? '#3b82f6' : '#ffffff';
                       
                       return (
                         <Cell 
                           key={`cell-${index}`} 
                           fill={entry.value > 0 ? entry.color : '#e5e7eb'} 
                           stroke={stroke}
                           strokeWidth={strokeWidth}
                         />
                       );
                     })}
                   </Pie>
                   <Tooltip content={<CustomTooltip />} />
                 </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Interface Interativa "Clique e Preencha" */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-6">Clique em cada área para avaliar:</h3>
              {config.areas.map((area) => {
                const hasScore = scores[area] > 0;
                const isActive = activeArea === area;
                
                return (
                  <div key={area} className="space-y-3">
                    {/* Pergunta Clicável */}
                    <button
                      onClick={() => handleAreaClick(area)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        hasScore 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                          : 'border-border hover:border-primary bg-muted/30 hover:bg-muted/50'
                      } ${
                        highlightedArea === area ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {hasScore ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-muted-foreground rounded" />
                          )}
                          <span className="font-medium text-base">
                            {getAreaQuestion(area)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasScore && (
                            <span className="text-lg font-bold text-primary">
                              {scores[area]}/10
                            </span>
                          )}
                          <div 
                            className="w-6 h-6 rounded border-2"
                            style={{ 
                              backgroundColor: hasScore ? getColorByScore(scores[area]) : '#e2e8f0',
                              borderColor: hasScore ? getColorByScore(scores[area]) : '#cbd5e1'
                            }}
                          />
                        </div>
                      </div>
                      {!hasScore && (
                        <p className="text-sm text-muted-foreground mt-2 ml-8">
                          Clique aqui para avaliar de 0 a 10
                        </p>
                      )}
                    </button>
                    
                    {/* Slider que aparece quando ativo */}
                    {isActive && (
                      <div className="ml-8 p-4 bg-background border rounded-lg shadow-lg animate-fade-in">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>0 - Muito Ruim</span>
                            <span>10 - Excelente</span>
                          </div>
                          <Slider
                            value={[scores[area] || 0]}
                            onValueChange={(value) => handleSliderChange(area, value)}
                            max={10}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">
                              Nota: {scores[area] || 0}/10
                            </span>
                            <Button 
                              onClick={handleSliderComplete}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Confirmar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Perguntas de Reflexão */}
      <Card>
        <CardHeader>
          <CardTitle>Reflexões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <Label className="font-medium">{question}</Label>
              <Textarea
                value={reflectionAnswers[index] || ''}
                onChange={(e) => handleReflectionChange(index, e.target.value)}
                placeholder="Escreva sua reflexão aqui..."
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Botão de Salvar */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          {isLoading ? 'Salvando...' : hasExistingResponse ? 'Atualizar Respostas' : 'Salvar Respostas'}
        </Button>
      </div>

      {/* Legenda de Cores */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>0-3: Área Crítica</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>4-6: Área de Atenção</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-lime-500 rounded"></div>
              <span>7-8: Área Boa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>9-10: Área Excelente</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};