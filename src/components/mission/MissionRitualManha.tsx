import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';
import { MissaoDia } from '@/hooks/useMissaoDia';

interface MissionRitualManhaProps {
  missao: MissaoDia | null;
  updateMissao: (updates: Partial<MissaoDia>) => void;
}

export const MissionRitualManha = ({ missao, updateMissao }: MissionRitualManhaProps) => {
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
          className="text-2xl h-14 w-14"
        >
          {emoji}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Coffee className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Ritual da Manhã</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        "Como você iniciou o seu dia hoje?"
      </p>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            🫖 Qual foi o primeiro líquido que consumiu?
          </Label>
          {renderOptions(liquidoOptions, missao?.liquido_ao_acordar, (value) => 
            updateMissao({ liquido_ao_acordar: value })
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            🧘‍♀️ Praticou algum momento de conexão interna?
          </Label>
          {renderOptions(conexaoOptions, missao?.pratica_conexao, (value) => 
            updateMissao({ pratica_conexao: value })
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            📿 Como você classificaria sua energia ao acordar?
          </Label>
          {renderEmojiScale(missao?.energia_ao_acordar, (value) => 
            updateMissao({ energia_ao_acordar: value })
          )}
        </div>
      </div>
    </div>
  );
};