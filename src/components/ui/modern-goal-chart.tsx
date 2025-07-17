import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Calendar,
  Activity,
  Settings,
  Plus,
  Minus
} from 'lucide-react';

interface GoalData {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  percentage: number;
}

interface ModernGoalChartProps {
  title: string;
  subtitle?: string;
  data: GoalData[];
  currentGoal?: number;
  targetGoal?: number;
  onGoalChange?: (newGoal: number) => void;
  className?: string;
}

export const ModernGoalChart: React.FC<ModernGoalChartProps> = ({
  title,
  subtitle,
  data,
  currentGoal = 400,
  targetGoal = 500,
  onGoalChange,
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(targetGoal);

  // Calcular progresso
  const progressPercentage = Math.min(100, (currentGoal / targetGoal) * 100);
  const isGoalReached = currentGoal >= targetGoal;

  // Gerar dados para o gráfico de barras (últimos 14 dias)
  const generateChartData = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 2);
      const value = Math.floor(Math.random() * 600) + 50; // Valores aleatórios para demonstração
      const percentage = (value / targetGoal) * 100;
      
      days.push({
        day: dayName,
        value,
        percentage: Math.min(100, percentage),
        isToday: i === 0,
        isAboveTarget: value >= targetGoal
      });
    }
    return days;
  };

  const chartData = generateChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

  const handleGoalUpdate = () => {
    if (onGoalChange) {
      onGoalChange(tempGoal);
    }
    setIsEditing(false);
  };

  return (
    <Card className={`bg-gradient-to-br from-background via-background to-muted/10 backdrop-blur-sm border-border ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-instituto-orange" />
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Meta Principal */}
        <div className="text-center space-y-3">
          <div className="relative">
            <div className="text-4xl font-bold bg-gradient-to-r from-instituto-orange via-orange-600 to-red-600 bg-clip-text text-transparent">
              {currentGoal.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              de {targetGoal.toLocaleString()} passos
            </div>
          </div>

          {/* Progress Ring ou Barra */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
                className="opacity-20"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={isGoalReached ? "#10B981" : "#F97316"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  completo
                </div>
              </div>
            </div>
          </div>

          <Badge 
            variant={isGoalReached ? "default" : "secondary"}
            className={isGoalReached ? "bg-green-500" : "bg-orange-500"}
          >
            {isGoalReached ? "Meta Atingida!" : `Faltam ${(targetGoal - currentGoal).toLocaleString()}`}
          </Badge>
        </div>

        {/* Edição de Meta */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-muted/50 rounded-lg space-y-3"
            >
              <label className="text-sm font-medium">Definir nova meta diária</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTempGoal(Math.max(100, tempGoal - 100))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-lg font-semibold">{tempGoal.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground ml-1">passos</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTempGoal(tempGoal + 100)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleGoalUpdate} className="flex-1">
                  Salvar Meta
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gráfico de Barras - Últimos 14 dias */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Últimos 14 dias</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Atividade diária
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-1 h-24 px-2">
            {chartData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(8, (day.value / maxValue) * 80)}px` }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex flex-col items-center gap-1 flex-1"
              >
                {/* Barra */}
                <div className="relative w-full max-w-6 group">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      day.isToday 
                        ? 'bg-instituto-orange shadow-lg' 
                        : day.isAboveTarget 
                          ? 'bg-green-500' 
                          : 'bg-muted-foreground/40'
                    } hover:opacity-80`}
                    style={{ 
                      height: `${Math.max(8, (day.value / maxValue) * 80)}px`,
                    }}
                  >
                    {/* Tooltip no hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {day.value.toLocaleString()} passos
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                    </div>
                  </div>
                </div>
                
                {/* Label do dia */}
                <span className={`text-xs ${day.isToday ? 'font-medium text-instituto-orange' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </motion.div>
            ))}
          </div>
          
          {/* Linha de meta */}
          <div className="relative">
            <div className="absolute w-full border-t border-dashed border-muted-foreground/30 top-0"></div>
            <div className="text-xs text-muted-foreground text-right -mt-1">
              Meta: {targetGoal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Estatísticas adicionais */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-500">
              {chartData.filter(d => d.isAboveTarget).length}
            </div>
            <div className="text-xs text-muted-foreground">Dias com meta</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-500">
              {Math.round(chartData.reduce((acc, d) => acc + d.value, 0) / chartData.length).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Média diária</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
