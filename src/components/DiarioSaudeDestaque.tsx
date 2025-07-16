import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedButton } from './visual/AnimatedButton';
import { 
  FileText, 
  Droplets, 
  Clock, 
  Heart, 
  TrendingUp,
  Calendar,
  Smile
} from 'lucide-react';

interface DiarioSaudeDestaqueProps {
  onOpenDiary: () => void;
}

export const DiarioSaudeDestaque: React.FC<DiarioSaudeDestaqueProps> = ({ onOpenDiary }) => {
  // Mock data do último registro
  const lastEntry = {
    date: new Date().toLocaleDateString('pt-BR'),
    mood: 'happy', // 😊
    water: '2L',
    sleep: '7h30',
    exercise: true
  };

  // Mock data para mini gráfico da semana
  const weekData = [
    { day: 'Seg', mood: 5, sleep: 7, water: 2.5 },
    { day: 'Ter', mood: 4, sleep: 6.5, water: 2.0 },
    { day: 'Qua', mood: 5, sleep: 8, water: 3.0 },
    { day: 'Qui', mood: 3, sleep: 6, water: 1.5 },
    { day: 'Sex', mood: 5, sleep: 7.5, water: 2.5 },
    { day: 'Sáb', mood: 4, sleep: 8.5, water: 2.0 },
    { day: 'Dom', mood: 5, sleep: 7.5, water: 2.5 },
  ];

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'neutral': return '😐';
      case 'excited': return '🤩';
      case 'tired': return '😴';
      default: return '😊';
    }
  };

  const getMoodScore = (score: number) => {
    if (score >= 4.5) return '😊';
    if (score >= 3.5) return '🙂';
    if (score >= 2.5) return '😐';
    if (score >= 1.5) return '😔';
    return '😢';
  };

  return (
    <Card className="bg-gradient-to-br from-diary-warm/30 to-diary-lilac/20 border-diary-glow/30 overflow-hidden relative animate-fade-in-up">
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-diary-glow/10 to-transparent animate-pulse" />
      
      <CardContent className="p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seção Principal do Diário */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-diary-glow/20 rounded-lg">
                <FileText className="h-6 w-6 text-diary-glow" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  📝 Diário da Saúde – Comece seu Dia com Consciência
                </h2>
                <p className="text-muted-foreground text-sm">
                  "Registrar é transformar. Cada palavra escrita é um passo em direção à sua nova versão."
                </p>
              </div>
            </div>

            {/* Resumo do Último Registro */}
            <div className="bg-background/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Último registro - {lastEntry.date}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getMoodEmoji(lastEntry.mood)}</span>
                  <span className="text-muted-foreground">Humor excelente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-foreground font-medium">{lastEntry.water}</span>
                  <span className="text-muted-foreground">de água</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="text-foreground font-medium">{lastEntry.sleep}</span>
                  <span className="text-muted-foreground">de sono</span>
                </div>
                {lastEntry.exercise && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="text-muted-foreground">Exercitou-se</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botão Principal */}
            <AnimatedButton 
              onClick={onOpenDiary}
              variant="goal" 
              size="lg" 
              className="w-full bg-gradient-to-r from-diary-glow to-instituto-orange hover:from-instituto-orange hover:to-diary-glow text-white font-bold py-4 animate-glow"
            >
              <FileText className="h-5 w-5 mr-2" />
              Preencher Agora
            </AnimatedButton>
          </div>

          {/* Mini Gráfico da Semana */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-diary-glow" />
              <h3 className="text-lg font-semibold text-foreground">Sua Semana em Números</h3>
            </div>

            {/* Gráfico de Barras Simples */}
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground mb-3">Humor, Sono e Hidratação</div>
              
              <div className="grid grid-cols-7 gap-2">
                {weekData.map((day, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="text-xs text-muted-foreground font-medium">{day.day}</div>
                    
                    {/* Barra do Humor */}
                    <div className="relative">
                      <div className="w-full h-8 bg-background/30 rounded-sm overflow-hidden">
                        <div 
                          className="bg-gradient-to-t from-yellow-400 to-yellow-300 transition-all duration-500 rounded-sm"
                          style={{ height: `${(day.mood / 5) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs mt-1">{getMoodScore(day.mood)}</div>
                    </div>
                    
                    {/* Barra do Sono */}
                    <div className="relative">
                      <div className="w-full h-6 bg-background/30 rounded-sm overflow-hidden">
                        <div 
                          className="bg-gradient-to-t from-purple-400 to-purple-300 transition-all duration-500 rounded-sm"
                          style={{ height: `${(day.sleep / 10) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs mt-1 text-purple-400">{day.sleep}h</div>
                    </div>
                    
                    {/* Barra da Água */}
                    <div className="relative">
                      <div className="w-full h-6 bg-background/30 rounded-sm overflow-hidden">
                        <div 
                          className="bg-gradient-to-t from-blue-400 to-blue-300 transition-all duration-500 rounded-sm"
                          style={{ height: `${(day.water / 3) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs mt-1 text-blue-400">{day.water}L</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legenda */}
              <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-sm" />
                  <span className="text-muted-foreground">Humor</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gradient-to-t from-purple-400 to-purple-300 rounded-sm" />
                  <span className="text-muted-foreground">Sono</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" />
                  <span className="text-muted-foreground">Água</span>
                </div>
              </div>
            </div>

            {/* Badge de Streak */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-diary-glow/20 text-diary-glow border-diary-glow/30">
                🔥 Sequência de 7 dias ativa
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};