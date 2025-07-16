import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DadosFisicosExistentesProps {
  existingData: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

interface FormData {
  pesoAtual: number;
  circunferenciaAbdominal: number;
}

export const DadosFisicosExistentes = ({ 
  existingData, 
  onSubmit, 
  isSubmitting 
}: DadosFisicosExistentesProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      pesoAtual: existingData?.peso_atual_kg || 0,
      circunferenciaAbdominal: existingData?.circunferencia_abdominal_cm || 0
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          ✅ Dados Físicos Já Cadastrados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800 text-center mb-4">
            Seus dados físicos já estão salvos no sistema e não precisam ser preenchidos novamente.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Data de Nascimento:</strong> {existingData?.data_nascimento}</div>
            <div><strong>Sexo:</strong> {existingData?.sexo}</div>
            <div><strong>Altura:</strong> {existingData?.altura_cm}cm</div>
            <div><strong>Peso Atual:</strong> {existingData?.peso_atual_kg}kg</div>
            <div><strong>Circunf. Abdominal:</strong> {existingData?.circunferencia_abdominal_cm}cm</div>
            <div><strong>IMC:</strong> {existingData?.imc?.toFixed(1)}</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pesoAtual">⚖️ Atualizar Peso Atual (kg)</Label>
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
            <p className="text-sm text-muted-foreground">
              Apenas o peso pode ser atualizado. Outros dados físicos permanecem fixos.
            </p>
            {errors.pesoAtual && (
              <p className="text-sm text-destructive">{errors.pesoAtual.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="circunferenciaAbdominal">🔄 Atualizar Circunferência Abdominal (cm)</Label>
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
            {errors.circunferenciaAbdominal && (
              <p className="text-sm text-destructive">{errors.circunferenciaAbdominal.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Atualizando...' : '💾 Atualizar Medidas'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};