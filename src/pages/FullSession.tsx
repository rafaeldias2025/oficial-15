import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import butterflyLogo from '@/assets/butterfly-logo.png';

const FullSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);

  // Sample session data (same as before but now full access)
  const sessions = [
    {
      id: 1,
      title: "Descobrindo Seus Sabotadores Internos",
      description: "Uma sessão completa sobre como identificar padrões mentais que limitam seu crescimento.",
      estimated_duration: "15 min",
      content: JSON.stringify({
        intro: "Bem-vindo a esta jornada completa de autoconhecimento. Nesta sessão, você vai descobrir os padrões mentais que podem estar limitando seu crescimento pessoal e aprenderá estratégias práticas para superá-los.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Identifique Seus Padrões",
            description: "Reflita sobre situações em que você se sabotou ou limitou suas próprias oportunidades. Descreva pelo menos 3 situações específicas."
          },
          {
            title: "Reconheça os Gatilhos",
            description: "Quais situações ou emoções costumam ativar esses padrões limitantes? Como você se sente fisicamente quando isso acontece?"
          },
          {
            title: "Visualize a Mudança",
            description: "Como seria sua vida se você conseguisse superar esses sabotadores internos? Seja específico sobre os resultados que gostaria de alcançar."
          },
          {
            title: "Estratégias de Superação",
            description: "Baseado no que descobriu, quais são 3 estratégias práticas que você pode implementar quando perceber esses padrões?"
          }
        ],
        conclusion: "Parabéns por completar esta sessão! O autoconhecimento é o primeiro passo para a transformação. Continue praticando a observação de seus padrões para desenvolver mais consciência sobre si mesmo."
      })
    },
    {
      id: 2,
      title: "Primeiros Passos da Transformação",
      description: "Aprenda as bases completas da metodologia do Instituto dos Sonhos.",
      estimated_duration: "25 min",
      content: JSON.stringify({
        intro: "Esta é uma sessão fundamental para entender nossa metodologia completa de transformação pessoal. Você aprenderá todos os pilares que sustentam uma mudança duradoura.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Defina Sua Visão Completa",
            description: "Descreva detalhadamente como você gostaria que sua vida fosse em 12 meses. Include aspectos pessoais, profissionais, relacionamentos e saúde."
          },
          {
            title: "Mapeie Obstáculos",
            description: "Liste todos os principais desafios que você enfrenta atualmente. Categorize-os entre internos (crenças, medos) e externos (circunstâncias)."
          },
          {
            title: "Plano de Ação Detalhado",
            description: "Crie um plano com 5 ações específicas que você pode tomar nas próximas 2 semanas para se aproximar da sua visão."
          },
          {
            title: "Rede de Apoio e Recursos",
            description: "Identifique pessoas, livros, cursos ou recursos que podem te apoiar nesta jornada. Como você vai ativar essa rede?"
          }
        ],
        conclusion: "Excelente trabalho! Você criou uma base sólida para sua jornada de transformação. Lembre-se: grandes mudanças começam com pequenas ações consistentes."
      })
    },
    {
      id: 3,
      title: "Respiração Consciente para Ansiedade",
      description: "Técnicas completas de respiração e regulação emocional.",
      estimated_duration: "18 min",
      content: JSON.stringify({
        intro: "A respiração é uma ferramenta poderosa para regular suas emoções e reduzir a ansiedade. Nesta sessão completa, você aprenderá múltiplas técnicas que pode usar em qualquer situação.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Técnica 4-7-8 Avançada",
            description: "Pratique a respiração 4-7-8 por 10 ciclos. Descreva como se sentiu antes, durante e depois. Quais sensações físicas notou?"
          },
          {
            title: "Respiração do Quadrado Completa",
            description: "Pratique por 15 minutos: inspire por 4, segure por 4, expire por 4, segure por 4. Como esta técnica afeta seu estado mental?"
          },
          {
            title: "Situações de Aplicação",
            description: "Identifique 5 situações específicas da sua vida onde você pode usar essas técnicas. Como vai lembrar de aplicá-las?"
          }
        ],
        conclusion: "Parabéns por dominar essas técnicas! A respiração consciente é uma habilidade que melhora com a prática. Use essas técnicas diariamente para resultados duradouros."
      })
    }
  ];

  const session = sessions.find(s => s.id === parseInt(id || '1'));

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Sessão não encontrada.</p>
      </div>
    );
  }

  const sessionContent = typeof session.content === 'string' 
    ? JSON.parse(session.content) 
    : session.content;

  const steps = [
    { name: 'Introdução', component: 'intro' },
    { name: 'Vídeo', component: 'video' },
    ...sessionContent.tasks.map((task, index) => ({
      name: `Tarefa ${index + 1}`,
      component: 'task',
      taskIndex: index
    })),
    { name: 'Conclusão', component: 'conclusion' }
  ];

  const currentStepData = steps[currentStep];

  // Save progress for users (database)
  useEffect(() => {
    if (id && user) {
      const progress = (currentStep / (steps.length - 1)) * 100;
      // TODO: Save to database
      
      if (currentStep === steps.length - 1) {
        // TODO: Save completion to database
      }
    }
  }, [currentStep, id, user]);

  const handleResponseChange = (taskIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[taskIndex] = value;
    setResponses(newResponses);

    if (user) {
      // TODO: Auto-save to database for logged users
    }
  };

  const renderStep = () => {
    const step = currentStepData;
    
    switch (step.component) {
      case 'intro':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-instituto-dark mb-4">
                🌟 Bem-vindo à sua sessão completa
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {sessionContent.intro}
              </p>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-instituto-dark mb-4">
              🎥 Conteúdo Principal
            </h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={sessionContent.video_url}
                title={session.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );

      case 'task':
        const taskStep = step as any;
        const task = sessionContent.tasks[taskStep.taskIndex];
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-instituto-dark mb-4">{task.title}</h3>
              <p className="text-instituto-dark/70 mb-6">{task.description}</p>
            </div>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-instituto-dark">Sua Resposta:</h4>
              </div>
              <Textarea 
                placeholder="Digite sua resposta aqui..."
                className="min-h-[150px] resize-none"
                value={responses[taskStep.taskIndex] || ''}
                onChange={(e) => handleResponseChange(taskStep.taskIndex, e.target.value)}
              />
            </Card>
          </div>
        );

      case 'conclusion':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-instituto-dark mb-4">
                🎉 Sessão Concluída com Sucesso!
              </h2>
              <p className="text-lg text-instituto-dark/70">
                Parabéns por completar esta jornada de autoconhecimento
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-instituto-green/10 to-instituto-light/10 p-6 rounded-lg border border-instituto-green/20">
              <p className="text-lg text-instituto-dark leading-relaxed text-center">
                {sessionContent.conclusion}
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="lg"
                className="border-instituto-orange text-instituto-orange hover:bg-instituto-orange hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        );

      default:
        return <div>Conteúdo não encontrado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-instituto-light via-white to-instituto-cream">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={butterflyLogo} alt="Instituto dos Sonhos" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-instituto-dark">Instituto dos Sonhos</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-instituto-dark"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Session Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-instituto-dark mb-2">{session.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-instituto-dark/70">
            <Badge variant="outline" className="border-instituto-green text-instituto-green">
              <CheckCircle className="w-3 h-3 mr-1" />
              Acesso Completo
            </Badge>
            <span>{session.estimated_duration}</span>
            <span>{sessionContent.tasks?.length || 0} atividades</span>
          </div>
          <div className="mt-4">
            <div className="text-sm text-instituto-dark/70 mb-2">Progresso</div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="w-full max-w-md mx-auto" />
            <div className="text-sm text-instituto-orange font-semibold mt-1">
              {Math.round((currentStep / (steps.length - 1)) * 100)}% concluído
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="border-instituto-orange text-instituto-orange hover:bg-instituto-orange hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-instituto-orange'
                    : index < currentStep
                    ? 'bg-instituto-orange/60'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="bg-instituto-orange hover:bg-instituto-orange-hover"
          >
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};

export default FullSession;