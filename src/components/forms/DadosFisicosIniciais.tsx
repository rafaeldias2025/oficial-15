import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DadosFisicosIniciaisProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

interface FormData {
  dataNascimento: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  pesoAtual: number;
  altura: number;
  circunferenciaAbdominal: number;
}

export const DadosFisicosIniciais = ({ onSubmit, isSubmitting }: DadosFisicosIniciaisProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const sexoValue = watch('sexo');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          📝 Cadastro Inicial - Dados Físicos
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Estes dados serão salvos permanentemente e não precisarão ser preenchidos novamente
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dataNascimento">📅 Data de Nascimento *</Label>
            <Input
              id="dataNascimento"
              type="date"
              {...register('dataNascimento', { 
                required: 'Data de nascimento é obrigatória' 
              })}
            />
            <p className="text-sm text-muted-foreground">
              Usaremos para calcular sua idade e ajustar recomendações.
            </p>
            {errors.dataNascimento && (
              <p className="text-sm text-destructive">{errors.dataNascimento.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>🧑‍🤝‍🧑 Sexo *</Label>
            <RadioGroup
              value={sexoValue}
              onValueChange={(value) => setValue('sexo', value as 'masculino' | 'feminino' | 'outro')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="masculino" id="masculino" />
                <Label htmlFor="masculino">Masculino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feminino" id="feminino" />
                <Label htmlFor="feminino">Feminino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outro" id="outro" />
                <Label htmlFor="outro">Outro</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">
              Usamos essas informações para calcular o risco cardiometabólico, definir faixas ideais e ajustar sua silhueta.
            </p>
            {errors.sexo && (
              <p className="text-sm text-destructive">Sexo é obrigatório</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesoAtual">⚖️ Peso Atual (kg) *</Label>
            <Input
              id="pesoAtual"
              type="number"
              step="0.1"
              placeholder="70.5"
              {...register('pesoAtual', { 
                required: 'Peso atual é obrigatório',
                min: { value: 30, message: 'Peso deve ser maior que 30kg' },
                max: { value: 300, message: 'Peso deve ser menor que 300kg' }
              })}
            />
            {errors.pesoAtual && (
              <p className="text-sm text-destructive">{errors.pesoAtual.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="altura">📏 Altura (cm) *</Label>
            <Input
              id="altura"
              type="number"
              placeholder="170"
              {...register('altura', { 
                required: 'Altura é obrigatória',
                min: { value: 100, message: 'Altura deve ser maior que 100cm' },
                max: { value: 250, message: 'Altura deve ser menor que 250cm' }
              })}
            />
            <p className="text-sm text-muted-foreground">
              A altura é essencial para calcular seu IMC e gerar sua silhueta personalizada.
            </p>
            {errors.altura && (
              <p className="text-sm text-destructive">{errors.altura.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="circunferenciaAbdominal">🔄 Circunferência Abdominal (cm) *</Label>
            <Input
              id="circunferenciaAbdominal"
              type="number"
              placeholder="92"
              {...register('circunferenciaAbdominal', { 
                required: 'Circunferência abdominal é obrigatória',
                min: { value: 50, message: 'Circunferência deve ser maior que 50cm' },
                max: { value: 200, message: 'Circunferência deve ser menor que 200cm' }
              })}
            />
            <p className="text-sm text-muted-foreground">
              Utilizamos esse dado para avaliar o seu risco cardiometabólico e gerar os gráficos de evolução.
            </p>
            {errors.circunferenciaAbdominal && (
              <p className="text-sm text-destructive">{errors.circunferenciaAbdominal.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : '💾 Salvar Dados Permanentemente'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};