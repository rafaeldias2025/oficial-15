import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { MissaoDia } from '@/hooks/useMissaoDia';

interface MissionHabitosDiaProps {
  missao: MissaoDia | null;
  updateMissao: (updates: Partial<MissaoDia>) => void;
}

export const MissionHabitosDia = ({ missao, updateMissao }: MissionHabitosDiaProps) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Hábitos do Dia</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        "Agora me conte como foi seu autocuidado ao longo do dia."
      </p>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            💤 Quantas horas você dormiu?
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sonoOptions.map(({ value, label }) => (
              <Button
                key={value}
                variant={missao?.sono_horas === value ? "default" : "outline"}
                onClick={() => updateMissao({ sono_horas: value })}
                className="h-auto p-3"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            💧 Quanto de água você bebeu hoje?
          </Label>
          {renderOptions(aguaOptions, missao?.agua_litros, (value) => 
            updateMissao({ agua_litros: value })
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            🏃‍♀️ Praticou atividade física hoje?
          </Label>
          <div className="flex gap-2 justify-center">
            <Button
              variant={missao?.atividade_fisica === true ? "default" : "outline"}
              onClick={() => updateMissao({ atividade_fisica: true })}
              className="flex-1"
            >
              Sim
            </Button>
            <Button
              variant={missao?.atividade_fisica === false ? "default" : "outline"}
              onClick={() => updateMissao({ atividade_fisica: false })}
              className="flex-1"
            >
              Não
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            😰 Como está seu nível de estresse hoje? (1 = Muito baixo, 5 = Muito alto)
          </Label>
          {renderNumberScale(missao?.estresse_nivel, (value) => 
            updateMissao({ estresse_nivel: value })
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            🍫 Sentiu fome emocional hoje?
          </Label>
          <div className="flex gap-2 justify-center">
            <Button
              variant={missao?.fome_emocional === true ? "default" : "outline"}
              onClick={() => updateMissao({ fome_emocional: true })}
              className="flex-1"
            >
              Sim
            </Button>
            <Button
              variant={missao?.fome_emocional === false ? "default" : "outline"}
              onClick={() => updateMissao({ fome_emocional: false })}
              className="flex-1"
            >
              Não
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};