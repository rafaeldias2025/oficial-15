import { useState } from "react";
import { useMissaoDia } from "@/hooks/useMissaoDia";
import { useMissaoCalculos } from "@/hooks/useMissaoCalculos";
import { usePontuacaoDiaria } from "@/hooks/usePontuacaoDiaria";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FeedbackPontuacao } from "@/components/FeedbackPontuacao";
import { DetalhePontuacaoMissao } from "@/components/DetalhePontuacaoMissao";
import { EvolucaoSemanalPontuacao } from "@/components/EvolucaoSemanalPontuacao";
import { RankingSemanalPontuacao } from "@/components/RankingSemanalPontuacao";
import { MissaoCalendario } from "@/components/MissaoCalendario";
import { GraficoEvolucaoMissao } from "@/components/GraficoEvolucaoMissao";
import { MissionHeader } from "@/components/mission/MissionHeader";
import { MissionRitualManha } from "@/components/mission/MissionRitualManha";
import { MissionHabitosDia } from "@/components/mission/MissionHabitosDia";
import { MissionMenteEmocoes } from "@/components/mission/MissionMenteEmocoes";
import { 
  TrendingUp,
  CheckCircle2,
  Trophy,
  Star,
  Heart,
  Calendar
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle } from "@/components/ui/card";

const MissaoDia = ({ isVisitor = false }: { isVisitor?: boolean }) => {
  const { missao, loading, updateMissao, concluirMissao } = useMissaoDia(isVisitor);
  const { pontuacaoCalculada, progresso } = useMissaoCalculos(missao);
  const { 
    pontuacaoHoje, 
    historicoPontuacao, 
    rankingSemanal, 
    isLoadingHoje,
    isLoadingHistorico,
    isLoadingRanking,
    getFeedbackPontuacao 
  } = usePontuacaoDiaria();
  
  const [showGraph, setShowGraph] = useState(false);
  const [showPontuacaoDetalhes, setShowPontuacaoDetalhes] = useState(false);
  const [activeTab, setActiveTab] = useState<'evolucao' | 'calendario' | 'ranking'>('evolucao');

  if (loading) {
    return (
      <Card className="border-0 bg-gradient-to-br from-background via-muted/30 to-background shadow-xl">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const frases = [
    "Seu corpo te ouviu hoje. Seu espírito também. Continue.",
    "Beber água morna é um abraço no seu fígado. Você merece leveza.",
    "Cuidar da mente e agradecer, mesmo nos dias difíceis, é um ato de coragem.",
    "Cada pequena vitória é um passo em direção à sua melhor versão.",
    "O autocuidado é um ato de amor próprio. Você está no caminho certo."
  ];

  const getFraseInspiradora = () => {
    if (!missao) return frases[0];
    
    if (missao.liquido_ao_acordar === "Água morna com limão") return frases[1];
    if (missao.gratidao) return frases[2];
    if (missao.pequena_vitoria) return frases[3];
    
    return frases[Math.floor(Math.random() * frases.length)];
  };

  const liquidoOptions = [
    "Água morna com limão",
    "Chá natural", 
    "Café puro",
    "Água gelada",
    "Outro"
  ];

  const conexaoOptions = [
    "Oração",
    "Meditação", 
    "Respiração consciente",
    "Não fiz hoje"
  ];

  const sonoOptions = [
    { value: 4, label: "4h ou menos" },
    { value: 6, label: "6h" },
    { value: 8, label: "8h" },
    { value: 9, label: "9h+" }
  ];

  const aguaOptions = [
    "Menos de 500ml",
    "1L",
    "2L", 
    "3L ou mais"
  ];

  const gratidaoOptions = [
    "Minha saúde",
    "Minha família",
    "Meu trabalho",
    "Meu corpo",
    "Outro"
  ];

  const intencaoOptions = [
    "Cuidar de mim",
    "Estar presente",
    "Fazer melhor",
    "Outro"
  ];

  const renderStars = (current: number | undefined, onChange: (value: number) => void) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          onClick={() => onChange(star)}
          className={`p-1 ${current === star ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
          <Star className={`h-6 w-6 ${current === star ? 'fill-current' : ''}`} />
        </Button>
      ))}
    </div>
  );

  const renderEmojiScale = (current: number | undefined, onChange: (value: number) => void) => (
    <div className="flex gap-2 justify-center">
      {[
        { emoji: "😴", value: 1 },
        { emoji: "😐", value: 2 },
        { emoji: "🙂", value: 3 },
        { emoji: "😊", value: 4 },
        { emoji: "💥", value: 5 }
      ].map(({ emoji, value }) => (
        <Button
          key={value}
          variant={current === value ? "default" : "outline"}
          size="lg"
          onClick={() => onChange(value)}
          className="text-3xl h-16 w-16"
        >
          {emoji}
        </Button>
      ))}
    </div>
  );

  const renderOptions = (options: string[], current: string | undefined, onChange: (value: string) => void) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {options.map((option) => (
        <Button
          key={option}
          variant={current === option ? "default" : "outline"}
          onClick={() => onChange(option)}
          className="justify-start h-auto p-3 text-left"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const renderNumberScale = (current: number | undefined, onChange: (value: number) => void, max: number = 5) => (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
        <Button
          key={num}
          variant={current === num ? "default" : "outline"}
          size="lg"
          onClick={() => onChange(num)}
          className="h-12 w-12 text-lg font-bold"
        >
          {num}
        </Button>
      ))}
    </div>
  );

  if (showGraph) {
    return (
      <Card className="border-0 bg-gradient-to-br from-background via-muted/30 to-background shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sua Evolução e Ranking
          </CardTitle>
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant={activeTab === 'evolucao' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('evolucao')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Gráfico
            </Button>
            <Button
              variant={activeTab === 'calendario' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('calendario')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendário
            </Button>
            <Button
              variant={activeTab === 'ranking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('ranking')}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Ranking
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Feedback final da pontuação */}
          {progresso >= 100 && (
            <FeedbackPontuacao 
              pontuacaoTotal={pontuacaoCalculada.total}
              pontuacaoMaxima={30}
              showDetalhes={true}
            />
          )}
          
          {/* Frase inspiradora */}
          <div className="text-center p-6 bg-primary/10 rounded-lg">
            <p className="text-lg italic text-foreground/80 mb-4">
              "{getFeedbackPontuacao(pontuacaoCalculada.total).mensagem}"
            </p>
            <Badge variant="secondary" className="text-sm">
              {getFeedbackPontuacao(pontuacaoCalculada.total).emoji} {pontuacaoCalculada.total} pontos hoje
            </Badge>
          </div>
          
          {/* Conteúdo das abas */}
          {activeTab === 'evolucao' && (
            <GraficoEvolucaoMissao />
          )}
          
          {activeTab === 'calendario' && (
            <MissaoCalendario />
          )}
          
          {activeTab === 'ranking' && (
            <RankingSemanalPontuacao 
              dados={rankingSemanal || []}
              isLoading={isLoadingRanking}
            />
          )}
          
          {/* Botões de ação */}
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowGraph(false)}
              variant="outline"
              className="flex-1"
            >
              Voltar à Missão
            </Button>
            <Button 
              onClick={concluirMissao}
              className="flex-1 bg-gradient-to-r from-primary to-accent"
              disabled={progresso < 100}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Concluir Missão
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-background via-muted/30 to-background shadow-xl">
      <MissionHeader progresso={progresso} />

      <CardContent className="space-y-8">
        {/* COMPONENTE DE DETALHES DA PONTUAÇÃO REMOVIDO - AGORA APENAS NO RANKING */}

        {/* COMPONENTE DE DETALHES DA PONTUAÇÃO */}
        {!isVisitor && (
          <DetalhePontuacaoMissao
            detalhes={pontuacaoCalculada.detalhes}
            totalPontos={pontuacaoCalculada.total}
            totalMaximo={30}
            isVisible={showPontuacaoDetalhes}
            onToggleVisibility={() => setShowPontuacaoDetalhes(!showPontuacaoDetalhes)}
          />
        )}
        
        {/* BLOCO 1 - RITUAL DA MANHÃ */}
        <MissionRitualManha missao={missao} updateMissao={updateMissao} />

        <Separator />

        {/* BLOCO 2 - HÁBITOS DO DIA */}
        <MissionHabitosDia missao={missao} updateMissao={updateMissao} />

        <Separator />

        {/* BLOCO 3 - MENTE & EMOÇÕES */}
        <MissionMenteEmocoes missao={missao} updateMissao={updateMissao} />

        <Separator />

        {/* BOTÕES FINAIS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setShowGraph(true)}
            variant="outline"
            className="flex-1 h-12 text-base"
            disabled={progresso < 80}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Ver minha evolução</span>
            <span className="sm:hidden">Evolução</span>
          </Button>
          <Button 
            onClick={concluirMissao}
            className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
            disabled={progresso < 100}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Concluir Missão</span>
            <span className="sm:hidden">Concluir</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissaoDia;