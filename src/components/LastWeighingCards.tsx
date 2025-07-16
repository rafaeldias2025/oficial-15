import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, 
  Target, 
  Activity,
  TrendingUp,
  TrendingDown,
  Bluetooth
} from 'lucide-react';
import { useProgressData } from '@/hooks/useProgressData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const LastWeighingCards = () => {
  const { pesagens, dadosFisicos, loading } = useProgressData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-netflix-card border-netflix-border">
            <CardContent className="p-6">
              <div className="h-20 bg-netflix-hover rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Pegar a última pesagem
  const ultimaPesagem = pesagens[0];
  
  if (!ultimaPesagem) {
    return (
      <div className="text-center py-8">
        <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nenhuma pesagem registrada ainda</p>
      </div>
    );
  }

  // Calcular categoria do IMC
  const getCategoriaIMC = (imc: number) => {
    if (imc < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-500' };
    if (imc < 25) return { label: 'Peso normal', color: 'text-green-500' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-orange-500' };
    return { label: 'Obesidade', color: 'text-red-500' };
  };

  // Calcular progresso da meta
  const calcularProgresso = () => {
    if (!dadosFisicos || !dadosFisicos.meta_peso_kg) return 0;
    
    const pesoAtual = ultimaPesagem.peso_kg;
    const pesoInicial = dadosFisicos.peso_atual_kg;
    const pesoMeta = dadosFisicos.meta_peso_kg;
    
    if (pesoInicial === pesoMeta) return 100;
    
    const progressoAtual = ((pesoInicial - pesoAtual) / (pesoInicial - pesoMeta)) * 100;
    return Math.min(100, Math.max(0, progressoAtual));
  };

  const categoriaIMC = getCategoriaIMC(ultimaPesagem.imc || 0);
  const progresso = calcularProgresso();
  const faltamKg = dadosFisicos?.meta_peso_kg ? Math.abs(ultimaPesagem.peso_kg - dadosFisicos.meta_peso_kg) : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-netflix-text mb-4">
        Última Pesagem de Comparação
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* IMC Última Pesagem */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-instituto-orange" />
                  <span className="text-sm text-instituto-orange font-medium">
                    IMC Última Pesagem
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-netflix-text mb-2">
                  {ultimaPesagem.imc?.toFixed(1) || '0.0'}
                </div>
                
                <div className={`text-sm font-medium ${categoriaIMC.color} mb-2`}>
                  {categoriaIMC.label}
                </div>
                
                <div className="text-xs text-netflix-text-muted">
                  Calculado com seus dados: {ultimaPesagem.peso_kg}kg / {(dadosFisicos?.altura_cm ? (dadosFisicos.altura_cm / 100).toFixed(2) : '1.70')}m
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progresso da Meta */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-instituto-orange" />
                  <span className="text-sm text-instituto-orange font-medium">
                    Progresso da Meta
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-netflix-text mb-2">
                  {progresso.toFixed(0)}%
                </div>
                
                <div className="mb-3">
                  <Progress 
                    value={progresso} 
                    className="h-2"
                    style={{
                      background: 'hsl(var(--netflix-hover))'
                    }}
                  />
                </div>
                
                <div className="text-xs text-netflix-text-muted">
                  Meta: {dadosFisicos?.meta_peso_kg || 0}kg
                </div>
                <div className="text-xs text-netflix-text-muted">
                  Faltam {faltamKg.toFixed(1)}kg
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Circunferência Abdominal */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-instituto-orange" />
                  <span className="text-sm text-instituto-orange font-medium">
                    Circunferência Abdominal
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-netflix-text mb-2">
                  {ultimaPesagem.circunferencia_abdominal_cm || dadosFisicos?.circunferencia_abdominal_cm || 0}cm
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Bluetooth className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">
                    Atualizado automaticamente
                  </span>
                </div>
                
                <div className="text-xs text-netflix-text-muted">
                  Última pesagem: {format(new Date(ultimaPesagem.data_medicao), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};