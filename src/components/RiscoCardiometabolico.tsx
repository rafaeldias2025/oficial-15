import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Heart, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Calendar,
  Scale,
  Zap,
  Apple,
  Users
} from 'lucide-react';

interface RiscoCardiometabolicoProps {
  circunferenciaAbdominal: number;
  sexo: 'masculino' | 'feminino';
  imc: number;
  peso: number;
  altura: number;
  pesoAnterior?: number;
  showExplanation?: boolean;
  className?: string;
}

export const RiscoCardiometabolico: React.FC<RiscoCardiometabolicoProps> = ({
  circunferenciaAbdominal,
  sexo,
  imc,
  peso,
  altura,
  pesoAnterior,
  showExplanation = true,
  className = ''
}) => {
  
  const calcularRisco = () => {
    const limites = {
      masculino: { baixo: 94, moderado: 102 },
      feminino: { baixo: 80, moderado: 88 }
    };
    
    const limite = limites[sexo] || limites.masculino;
    
    if (circunferenciaAbdominal < limite.baixo) {
      return {
        nivel: 'Baixo',
        cor: 'text-green-600',
        corBg: 'bg-green-50',
        corBorder: 'border-green-200',
        icone: CheckCircle,
        porcentagem: Math.min(90, (circunferenciaAbdominal / limite.baixo) * 100),
        corBarra: 'bg-green-500'
      };
    } else if (circunferenciaAbdominal <= limite.moderado) {
      return {
        nivel: 'Moderado',
        cor: 'text-yellow-600',
        corBg: 'bg-yellow-50',
        corBorder: 'border-yellow-200',
        icone: AlertTriangle,
        porcentagem: Math.min(95, 50 + ((circunferenciaAbdominal - limite.baixo) / (limite.moderado - limite.baixo)) * 45),
        corBarra: 'bg-yellow-500'
      };
    } else {
      return {
        nivel: 'Alto',
        cor: 'text-red-600',
        corBg: 'bg-red-50',
        corBorder: 'border-red-200',
        icone: AlertTriangle,
        porcentagem: Math.min(100, 95 + ((circunferenciaAbdominal - limite.moderado) / 20) * 5),
        corBarra: 'bg-red-500'
      };
    }
  };

  const risco = calcularRisco();

  const getPassosAcompanhamento = () => {
    const limites = {
      masculino: { baixo: 94, moderado: 102 },
      feminino: { baixo: 80, moderado: 88 }
    };
    
    const limite = limites[sexo] || limites.masculino;
    const metaIdeal = limite.baixo - 5; // Meta é ficar 5cm abaixo do limite baixo
    const reducaoNecessaria = Math.max(0, circunferenciaAbdominal - metaIdeal);
    
    if (risco.nivel === 'Baixo') {
      return {
        meta: `Manter abaixo de ${limite.baixo}cm`,
        passos: [
          { icone: Scale, texto: 'Continue medindo semanalmente', status: 'check' },
          { icone: Apple, texto: 'Mantenha alimentação equilibrada', status: 'check' },
          { icone: Activity, texto: 'Exercite-se 3x por semana', status: 'check' },
          { icone: Calendar, texto: 'Avaliação médica anual', status: 'pending' }
        ],
        proximaMeta: `Excelente! Mantenha-se entre ${metaIdeal}-${limite.baixo}cm`
      };
    } else if (risco.nivel === 'Moderado') {
      return {
        meta: `Reduzir para ${limite.baixo}cm`,
        passos: [
          { icone: Target, texto: `Reduzir ${(circunferenciaAbdominal - limite.baixo).toFixed(1)}cm`, status: 'active' },
          { icone: Apple, texto: 'Dieta com déficit calórico', status: 'active' },
          { icone: Activity, texto: 'Exercícios 4x por semana', status: 'pending' },
          { icone: Calendar, texto: 'Reavaliação em 3 meses', status: 'pending' }
        ],
        proximaMeta: `Meta: reduzir ${reducaoNecessaria.toFixed(1)}cm em 6 meses`
      };
    } else {
      return {
        meta: `URGENTE: Reduzir para ${limite.moderado}cm`,
        passos: [
          { icone: Users, texto: 'Procurar acompanhamento médico', status: 'urgent' },
          { icone: Target, texto: `Reduzir ${(circunferenciaAbdominal - limite.moderado).toFixed(1)}cm primeiro`, status: 'active' },
          { icone: Apple, texto: 'Dieta supervisionada', status: 'active' },
          { icone: Activity, texto: 'Exercícios orientados', status: 'active' }
        ],
        proximaMeta: `Meta inicial: ${limite.moderado}cm em 3-4 meses`
      };
    }
  };

  const getImcClassificacao = () => {
    if (imc < 18.5) return { texto: 'Abaixo do peso', cor: 'text-blue-600' };
    if (imc < 25) return { texto: 'Peso normal', cor: 'text-green-600' };
    if (imc < 30) return { texto: 'Sobrepeso', cor: 'text-yellow-600' };
    return { texto: 'Obesidade', cor: 'text-red-600' };
  };

  const getProgressoIndicador = () => {
    if (!pesoAnterior) return null;
    
    const diferenca = peso - pesoAnterior;
    if (Math.abs(diferenca) < 0.1) {
      return { icone: Minus, cor: 'text-gray-500', texto: 'Estável' };
    }
    return diferenca > 0 
      ? { icone: TrendingUp, cor: 'text-red-500', texto: `+${diferenca.toFixed(1)}kg` }
      : { icone: TrendingDown, cor: 'text-green-500', texto: `${diferenca.toFixed(1)}kg` };
  };

  const imcClass = getImcClassificacao();
  const progresso = getProgressoIndicador();
  const passosAcompanhamento = getPassosAcompanhamento();
  const IconeRisco = risco.icone;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'check': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };
  
  return (
    <Card className={`${risco.corBg} ${risco.corBorder} border-2 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconeRisco className={`w-5 h-5 ${risco.cor}`} />
            <span className={risco.cor}>Risco Cardiometabólico</span>
          </div>
          <Badge variant="secondary" className={`${risco.cor} bg-white font-bold`}>
            {risco.nivel}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Dados principais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Circunferência</span>
              <span className="text-lg font-bold">{circunferenciaAbdominal}cm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">IMC</span>
              <div className="text-right">
                <span className="text-lg font-bold">{imc.toFixed(1)}</span>
                <div className={`text-xs ${imcClass.cor}`}>{imcClass.texto}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Peso Atual</span>
              <div className="text-right">
                <span className="text-lg font-bold">{peso.toFixed(1)}kg</span>
                {progresso && (
                  <div className={`text-xs flex items-center gap-1 ${progresso.cor}`}>
                    <progresso.icone className="w-3 h-3" />
                    {progresso.texto}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Altura</span>
              <span className="text-lg font-bold">{altura}cm</span>
            </div>
          </div>
        </div>

        {/* Barra de progresso do risco */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Nível de Risco</span>
            <span className={risco.cor}>{risco.porcentagem.toFixed(0)}%</span>
          </div>
          <Progress value={risco.porcentagem} className="h-2" />
        </div>

        <Separator />

        {/* Seção de Passos de Acompanhamento */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className={`w-4 h-4 ${risco.cor}`} />
            <h4 className="font-semibold text-sm">Plano de Acompanhamento</h4>
          </div>
          
          {/* Meta Principal */}
          <div className={`p-3 rounded-lg border-l-4 ${risco.corBg} ${risco.nivel === 'Alto' ? 'border-l-red-500' : risco.nivel === 'Moderado' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
            <div className="font-medium text-sm">{passosAcompanhamento.meta}</div>
            <div className="text-xs text-muted-foreground mt-1">{passosAcompanhamento.proximaMeta}</div>
          </div>

          {/* Lista de Passos */}
          <div className="space-y-2">
            {passosAcompanhamento.passos.map((passo, index) => {
              const IconePasso = passo.icone;
              return (
                <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border">
                  {getStatusIcon(passo.status)}
                  <IconePasso className="w-4 h-4 text-gray-600" />
                  <span className="text-sm flex-1">{passo.texto}</span>
                  {passo.status === 'urgent' && (
                    <Badge variant="destructive" className="text-xs">URGENTE</Badge>
                  )}
                  {passo.status === 'active' && (
                    <Badge className="text-xs bg-blue-100 text-blue-700">ATIVO</Badge>
                  )}
                  {passo.status === 'check' && (
                    <Badge className="text-xs bg-green-100 text-green-700">✓</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-green-100 rounded">
            <div className="font-bold text-green-700">Baixo</div>
            <div className="text-green-600">
              {sexo === 'masculino' ? '<94cm' : '<80cm'}
            </div>
          </div>
          <div className="text-center p-2 bg-yellow-100 rounded">
            <div className="font-bold text-yellow-700">Moderado</div>
            <div className="text-yellow-600">
              {sexo === 'masculino' ? '94-102cm' : '80-88cm'}
            </div>
          </div>
          <div className="text-center p-2 bg-red-100 rounded">
            <div className="font-bold text-red-700">Alto</div>
            <div className="text-red-600">
              {sexo === 'masculino' ? '>102cm' : '>88cm'}
            </div>
          </div>
        </div>

        {/* Botão explicativo */}
        {showExplanation && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full"
                size="sm"
              >
                <Info className="w-4 h-4 mr-2" />
                📘 Entenda seu Risco
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Risco Cardiometabólico
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">O que é?</h4>
                  <p className="text-sm text-blue-700">
                    O risco cardiometabólico avalia a probabilidade de desenvolver doenças 
                    cardíacas, diabetes e síndrome metabólica com base na circunferência abdominal.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Níveis de Risco:</h4>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-700">Baixo</div>
                      <div className="text-sm text-green-600">
                        {sexo === 'masculino' ? 'Menos de 94cm' : 'Menos de 80cm'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium text-yellow-700">Moderado</div>
                      <div className="text-sm text-yellow-600">
                        {sexo === 'masculino' ? '94-102cm' : '80-88cm'} - Atenção necessária
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium text-red-700">Alto</div>
                      <div className="text-sm text-red-600">
                        {sexo === 'masculino' ? 'Mais de 102cm' : 'Mais de 88cm'} - Cuidado médico recomendado
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-instituto-orange/10 rounded-lg">
                  <h4 className="font-semibold text-instituto-orange mb-2">💪 Frase de Incentivo</h4>
                  <p className="text-sm text-instituto-dark">
                    {risco.nivel === 'Baixo' && 
                      "Parabéns! Você está no caminho certo. Continue com seus hábitos saudáveis!"
                    }
                    {risco.nivel === 'Moderado' && 
                      "Você tem potencial para melhorar! Pequenas mudanças fazem grande diferença."
                    }
                    {risco.nivel === 'Alto' && 
                      "Cada passo conta! Procure orientação médica e mantenha-se determinado(a)."
                    }
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default RiscoCardiometabolico;