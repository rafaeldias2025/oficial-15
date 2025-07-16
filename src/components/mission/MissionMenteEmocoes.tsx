import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Star } from 'lucide-react';
import { MissaoDia } from '@/hooks/useMissaoDia';

interface MissionMenteEmocoesProps {
  missao: MissaoDia | null;
  updateMissao: (updates: Partial<MissaoDia>) => void;
}

export const MissionMenteEmocoes = ({ missao, updateMissao }: MissionMenteEmocoesProps) => {
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

  const renderStars = (current: number | undefined, onChange: (value: number) => void) => (
    <div className="flex gap-2 justify-center">
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Mente & Emoções</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        "Agora vamos cuidar da sua mente e das suas emoções."
      </p>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            🙏 Pelo que você é grato hoje?
          </Label>
          {renderOptions(gratidaoOptions, missao?.gratidao, (value) => 
            updateMissao({ gratidao: value })
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            🏆 Qual foi sua pequena vitória hoje?
          </Label>
          <Textarea
            placeholder="Ex: Terminei um projeto, cuidei da minha saúde, fiz alguém sorrir..."
            value={missao?.pequena_vitoria || ''}
            onChange={(e) => updateMissao({ pequena_vitoria: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            🌱 Qual sua intenção para amanhã?
          </Label>
          {renderOptions(intencaoOptions, missao?.intencao_para_amanha, (value) => 
            updateMissao({ intencao_para_amanha: value })
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            ⭐ Como foi seu dia hoje? (1 = Muito ruim, 5 = Excelente)
          </Label>
          {renderStars(missao?.nota_dia, (value) => 
            updateMissao({ nota_dia: value })
          )}
        </div>
      </div>
    </div>
  );
};