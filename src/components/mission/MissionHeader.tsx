import { CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MissionHeaderProps {
  progresso: number;
}

export const MissionHeader = ({ progresso }: MissionHeaderProps) => {
  return (
    <CardHeader className="text-center pb-4">
      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Missão do Dia
      </CardTitle>
      <p className="text-sm text-muted-foreground italic">
        "Mais que uma rotina, um reencontro com sua melhor versão."
      </p>
      <div className="mt-4">
        <Progress value={progresso} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {Math.round(progresso)}% concluído ({Math.round(progresso * 12 / 100)} de 12 respostas)
        </p>
      </div>
    </CardHeader>
  );
};