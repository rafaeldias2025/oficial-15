import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface PhysicalData {
  dataNascimento?: string;
  sexo?: 'masculino' | 'feminino' | 'outro';
  pesoAtual: number;
  altura?: number;
  circunferenciaAbdominal: number;
  gorduraCorporal?: number;
  idadeMetabolica?: number;
  massaMuscular?: number;
  massaOssea?: number;
  aguaCorporal?: number;
  gorduraVisceral?: number;
  taxaMetabolicaBasal?: number;
  metaPeso?: number;
}

interface UnifiedPhysicalDataFormProps {
  mode: 'initial' | 'update' | 'bluetooth';
  existingData?: Partial<PhysicalData>;
  onSubmit: (data: PhysicalData) => Promise<void>;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  showAdvancedFields?: boolean;
  requiredFields?: (keyof PhysicalData)[];
}

export const UnifiedPhysicalDataForm = ({
  mode,
  existingData,
  onSubmit,
  isSubmitting = false,
  title,
  description,
  showAdvancedFields = false,
  requiredFields = ['pesoAtual', 'circunferenciaAbdominal']
}: UnifiedPhysicalDataFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PhysicalData>({
    defaultValues: {
      pesoAtual: existingData?.pesoAtual || 0,
      altura: existingData?.altura || 0,
      circunferenciaAbdominal: existingData?.circunferenciaAbdominal || 0,
      dataNascimento: existingData?.dataNascimento || '',
      sexo: existingData?.sexo || 'outro',
      gorduraCorporal: existingData?.gorduraCorporal || 0,
      idadeMetabolica: existingData?.idadeMetabolica || 0,
      massaMuscular: existingData?.massaMuscular || 0,
      massaOssea: existingData?.massaOssea || 0,
      aguaCorporal: existingData?.aguaCorporal || 0,
      gorduraVisceral: existingData?.gorduraVisceral || 0,
      taxaMetabolicaBasal: existingData?.taxaMetabolicaBasal || 0,
      metaPeso: existingData?.metaPeso || existingData?.pesoAtual || 0
    }
  });

  const sexoValue = watch('sexo');
  const pesoAtual = watch('pesoAtual');
  const altura = watch('altura');

  // Calcular IMC automaticamente
  const imc = altura && pesoAtual ? (pesoAtual / Math.pow(altura / 100, 2)).toFixed(1) : null;

  const getTitle = () => {
    if (title) return title;
    switch (mode) {
      case 'initial': return '📝 Cadastro Inicial - Dados Físicos';
      case 'update': return '🔄 Atualizar Dados Físicos';
      case 'bluetooth': return '📱 Dados da Balança Bluetooth';
      default: return 'Dados Físicos';
    }
  };

  const getDescription = () => {
    if (description) return description;
    switch (mode) {
      case 'initial': return 'Estes dados serão salvos permanentemente para cálculos de progresso';
      case 'update': return 'Atualize suas medidas para acompanhar seu progresso';
      case 'bluetooth': return 'Dados recebidos automaticamente da sua balança conectada';
      default: return null;
    }
  };

  const isFieldRequired = (field: keyof PhysicalData) => {
    return requiredFields.includes(field);
  };

  const getValidationRules = (field: keyof PhysicalData) => {
    const rules: any = {};
    
    if (isFieldRequired(field)) {
      rules.required = `${field} é obrigatório`;
    }

    switch (field) {
      case 'pesoAtual':
      case 'metaPeso':
        rules.min = { value: 30, message: 'Peso deve ser maior que 30kg' };
        rules.max = { value: 300, message: 'Peso deve ser menor que 300kg' };
        break;
      case 'altura':
        rules.min = { value: 100, message: 'Altura deve ser maior que 100cm' };
        rules.max = { value: 250, message: 'Altura deve ser menor que 250cm' };
        break;
      case 'circunferenciaAbdominal':
        rules.min = { value: 50, message: 'Circunferência deve ser maior que 50cm' };
        rules.max = { value: 200, message: 'Circunferência deve ser menor que 200cm' };
        break;
      case 'gorduraCorporal':
      case 'aguaCorporal':
        rules.min = { value: 0, message: 'Valor deve ser positivo' };
        rules.max = { value: 100, message: 'Percentual deve ser menor que 100%' };
        break;
      case 'idadeMetabolica':
        rules.min = { value: 10, message: 'Idade deve ser maior que 10 anos' };
        rules.max = { value: 100, message: 'Idade deve ser menor que 100 anos' };
        break;
    }

    return rules;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {getTitle()}
        </CardTitle>
        {getDescription() && (
          <p className="text-center text-muted-foreground">
            {getDescription()}
          </p>
        )}
        {imc && (
          <div className="text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              IMC: {imc}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campos básicos obrigatórios para cadastro inicial */}
          {mode === 'initial' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">📅 Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  {...register('dataNascimento', getValidationRules('dataNascimento'))}
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
                  Usamos para calcular risco cardiometabólico e ajustar sua silhueta.
                </p>
                {errors.sexo && (
                  <p className="text-sm text-destructive">Sexo é obrigatório</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="altura">📏 Altura (cm) *</Label>
                <Input
                  id="altura"
                  type="number"
                  placeholder="170"
                  {...register('altura', getValidationRules('altura'))}
                />
                <p className="text-sm text-muted-foreground">
                  A altura é essencial para calcular seu IMC e gerar sua silhueta personalizada.
                </p>
                {errors.altura && (
                  <p className="text-sm text-destructive">{errors.altura.message}</p>
                )}
              </div>
            </>
          )}

          {/* Campos principais - sempre visíveis */}
          <div className="space-y-2">
            <Label htmlFor="pesoAtual">⚖️ Peso Atual (kg) *</Label>
            <Input
              id="pesoAtual"
              type="number"
              step="0.1"
              placeholder="70.5"
              {...register('pesoAtual', getValidationRules('pesoAtual'))}
            />
            {errors.pesoAtual && (
              <p className="text-sm text-destructive">{errors.pesoAtual.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="circunferenciaAbdominal">🔄 Circunferência Abdominal (cm) *</Label>
            <Input
              id="circunferenciaAbdominal"
              type="number"
              placeholder="92"
              {...register('circunferenciaAbdominal', getValidationRules('circunferenciaAbdominal'))}
            />
            <p className="text-sm text-muted-foreground">
              Utilizamos para avaliar risco cardiometabólico e gerar gráficos de evolução.
            </p>
            {errors.circunferenciaAbdominal && (
              <p className="text-sm text-destructive">{errors.circunferenciaAbdominal.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaPeso">🎯 Meta de Peso (kg)</Label>
            <Input
              id="metaPeso"
              type="number"
              step="0.1"
              placeholder="65.0"
              {...register('metaPeso', getValidationRules('metaPeso'))}
            />
            <p className="text-sm text-muted-foreground">
              Defina seu peso objetivo para acompanharmos seu progresso.
            </p>
            {errors.metaPeso && (
              <p className="text-sm text-destructive">{errors.metaPeso.message}</p>
            )}
          </div>

          {/* Campos avançados - balança inteligente */}
          {showAdvancedFields && (
            <>
              <Separator />
              <h3 className="text-lg font-semibold">📊 Dados Avançados da Balança</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gorduraCorporal">💧 Gordura Corporal (%)</Label>
                  <Input
                    id="gorduraCorporal"
                    type="number"
                    step="0.1"
                    placeholder="15.5"
                    {...register('gorduraCorporal', getValidationRules('gorduraCorporal'))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aguaCorporal">💦 Água Corporal (%)</Label>
                  <Input
                    id="aguaCorporal"
                    type="number"
                    step="0.1"
                    placeholder="60.0"
                    {...register('aguaCorporal', getValidationRules('aguaCorporal'))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="massaMuscular">💪 Massa Muscular (kg)</Label>
                  <Input
                    id="massaMuscular"
                    type="number"
                    step="0.1"
                    placeholder="35.0"
                    {...register('massaMuscular')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="massaOssea">🦴 Massa Óssea (kg)</Label>
                  <Input
                    id="massaOssea"
                    type="number"
                    step="0.1"
                    placeholder="3.2"
                    {...register('massaOssea')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idadeMetabolica">🔥 Idade Metabólica</Label>
                  <Input
                    id="idadeMetabolica"
                    type="number"
                    placeholder="25"
                    {...register('idadeMetabolica', getValidationRules('idadeMetabolica'))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gorduraVisceral">🎯 Gordura Visceral</Label>
                  <Input
                    id="gorduraVisceral"
                    type="number"
                    placeholder="8"
                    {...register('gorduraVisceral')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxaMetabolicaBasal">⚡ Taxa Metabólica Basal (kcal)</Label>
                <Input
                  id="taxaMetabolicaBasal"
                  type="number"
                  placeholder="1650"
                  {...register('taxaMetabolicaBasal')}
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : '💾 Salvar Dados'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};