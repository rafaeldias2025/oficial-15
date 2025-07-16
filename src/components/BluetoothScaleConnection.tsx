
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBluetoothScale, ScaleReading } from '@/hooks/useBluetoothScale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDadosSaude } from '@/hooks/useDadosSaude';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RiscoCardiometabolico } from '@/components/RiscoCardiometabolico';
import { EvolucaoSemanal } from '@/components/EvolucaoSemanal';
import { Silhueta3D } from '@/components/Silhueta3D';
import { 
  Bluetooth, 
  Scale,
  CheckCircle,
  Timer,
  X,
  Loader,
  AlertCircle,
  Wifi,
  Ruler,
  TrendingUp,
  BarChart3,
  User
} from 'lucide-react';

interface BluetoothScaleConnectionProps {
  trigger?: React.ReactNode;
  onDataSaved?: () => void;
}

export const BluetoothScaleConnection: React.FC<BluetoothScaleConnectionProps> = ({ 
  trigger, 
  onDataSaved 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isProcessingData, setIsProcessingData] = React.useState(false);
  const [showCircunferenciaInput, setShowCircunferenciaInput] = React.useState(false);
  const [circunferenciaAbdominal, setCircunferenciaAbdominal] = React.useState<number>(90);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { dadosSaude, refetch } = useDadosSaude();
  
  const {
    isConnected,
    isConnecting,
    isReading,
    device,
    lastReading,
    countdown,
    status,
    connectToScale,
    startWeighing,
    disconnect,
    clearReading
  } = useBluetoothScale();

  const processAndSaveScaleData = async (reading: ScaleReading, confirmedData?: {
    circunferencia_abdominal_cm?: number;
    meta_peso_kg?: number;
  }) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para salvar os dados",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // 🔄 ETAPA 1: Buscar profile do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      // Buscar dados físicos para altura, idade e sexo
      const { data: dadosFisicos } = await supabase
        .from('dados_fisicos_usuario')
        .select('altura_cm, data_nascimento, sexo')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Buscar última pesagem para calcular progresso
      const { data: ultimaPesagem } = await supabase
        .from('pesagens')
        .select('peso_kg, data_medicao')
        .eq('user_id', profile.id)
        .order('data_medicao', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Dados padrão se não houver perfil
      const altura = dadosFisicos?.altura_cm || 170;
      const sexo = dadosFisicos?.sexo?.toLowerCase() || 'masculino';
      
      // Calcular idade
      let idade = 30; // padrão
      if (dadosFisicos?.data_nascimento) {
        const nascimento = new Date(dadosFisicos.data_nascimento);
        const hoje = new Date();
        idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
      }

      const peso = reading.weight;
      const alturaMetros = altura / 100;

      // Cálculos automáticos
      const imc = peso / (alturaMetros * alturaMetros);
      
      // Gordura corporal usando fórmula específica
      const gorduraCorporal = sexo === 'masculino' 
        ? (1.20 * imc) + (0.23 * idade) - 16.2
        : (1.20 * imc) + (0.23 * idade) - 5.4;

      // Tipo de corpo
      let tipoCorpo = "";
      if (imc < 18.5) {
        tipoCorpo = "Magro";
      } else if (imc >= 18.5 && imc < 25) {
        tipoCorpo = "Normal";
      } else {
        tipoCorpo = "Sobrepeso";
        if (gorduraCorporal > (sexo === 'masculino' ? 22 : 30)) {
          tipoCorpo = "Sobrepeso com gordura alta";
        }
      }

      // Massa magra estimada (peso total - gordura)
      const massaGorduraKg = (peso * gorduraCorporal) / 100;
      const massaMagraKg = peso - massaGorduraKg;

      // Água corporal (73% da massa magra)
      const aguaCorporal = (massaMagraKg * 0.73 / peso) * 100;

      // Gordura visceral (15% da gordura total)
      const gorduraVisceral = gorduraCorporal * 0.15;

      // Massa óssea (3.8% do peso)
      const massaOssea = peso * 0.038;

      // Proteína (20% da massa magra convertida para %)
      const proteina = (massaMagraKg * 0.20 / peso) * 100;

      // Massa muscular = massa magra - ossos - água
      const massaMuscular = massaMagraKg - massaOssea - (peso * aguaCorporal / 100);

      // Metabolismo basal
      const metabolismoBasal = sexo === 'masculino'
        ? 10 * peso + 6.25 * altura - 5 * idade + 5
        : 10 * peso + 6.25 * altura - 5 * idade - 161;

      // Pontuação corporal (começar com 100 e subtrair)
      let pontuacaoCorporal = 100;
      if (imc > 25) pontuacaoCorporal -= 10;
      if (gorduraCorporal > (sexo === 'masculino' ? 22 : 30)) pontuacaoCorporal -= 10;
      if (aguaCorporal < 55) pontuacaoCorporal -= 10;
      if (gorduraVisceral > 10) pontuacaoCorporal -= 10;

      // Progresso em relação à última pesagem
      const progresso = ultimaPesagem ? ultimaPesagem.peso_kg - peso : 0;

      // 🔄 ETAPA 1: Inserir dados completos na tabela pesagens
      const circunferenciaFinal = confirmedData?.circunferencia_abdominal_cm || dadosSaude?.circunferencia_abdominal_cm || 90;
      const metaPesoFinal = confirmedData?.meta_peso_kg || dadosSaude?.meta_peso_kg || peso;
      
      const { error: pesagemError } = await supabase
        .from('pesagens')
        .insert({
          user_id: profile.id,
          peso_kg: peso,
          imc: Math.round(imc * 10) / 10,
          circunferencia_abdominal_cm: circunferenciaFinal,
          gordura_corporal_pct: Math.round(gorduraCorporal * 10) / 10,
          agua_corporal_pct: Math.round(aguaCorporal * 10) / 10,
          massa_muscular_kg: Math.round(massaMuscular * 10) / 10,
          massa_ossea_kg: Math.round(massaOssea * 10) / 10,
          gordura_visceral: Math.round(gorduraVisceral),
          taxa_metabolica_basal: Math.round(metabolismoBasal),
          tipo_corpo: tipoCorpo,
          origem_medicao: 'bioimpedância_bluetooth',
          data_medicao: reading.timestamp.toISOString()
        });

      if (pesagemError) {
        console.error('Erro ao inserir pesagem completa:', pesagemError);
        throw pesagemError;
      }

      // 🔄 ETAPA 2: Atualizar dados de saúde automaticamente com valores da balança
      try {

        // Segundo: Atualizar dados_saude_usuario
        const { error: saudeError } = await supabase
          .from('dados_saude_usuario')
          .upsert({
            user_id: profile.id,
            peso_atual_kg: peso,
            altura_cm: altura,
            circunferencia_abdominal_cm: circunferenciaFinal,
            meta_peso_kg: metaPesoFinal,
            data_atualizacao: new Date().toISOString()
          });
        
        if (saudeError) {
          console.error('Erro ao atualizar dados de saúde:', saudeError);
          throw saudeError;
        }
      } catch (healthError) {
        console.error('Erro no salvamento dos dados:', healthError);
        toast({
          title: "Erro ao salvar dados",
          description: "Não foi possível registrar a pesagem. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Mensagem de sucesso personalizada
      const progressoTexto = progresso !== 0 
        ? ` | Progresso: ${progresso > 0 ? '+' : ''}${progresso.toFixed(1)}kg`
        : '';
      
      const dataUltimaPesagem = ultimaPesagem?.data_medicao 
        ? ` | Última: ${new Date(ultimaPesagem.data_medicao).toLocaleDateString('pt-BR')}`
        : '';

      toast({
        title: "✅ Pesagem registrada e todos os dados corporais atualizados!",
        description: `Peso: ${peso}kg | IMC: ${imc.toFixed(1)} | Tipo: ${tipoCorpo} | Pontuação: ${pontuacaoCorporal}/100${progressoTexto}${dataUltimaPesagem}`,
      });

      // Limpar leitura e fechar modal
      clearReading();
      setShowCircunferenciaInput(false);
      setIsOpen(false);
      
      // Atualizar dados e chamar callback
      await refetch();
      onDataSaved?.();

    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da pesagem",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = () => {
    if (isConnecting) return <Loader className="h-5 w-5 animate-spin text-blue-500" />;
    if (isConnected) return <Wifi className="h-5 w-5 text-green-500" />;
    return <Bluetooth className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusColor = () => {
    if (isConnecting) return 'bg-blue-500';
    if (isConnected) return 'bg-green-500 animate-pulse';
    return 'bg-muted-foreground';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            className="bg-instituto-purple hover:bg-instituto-purple/80 text-white shadow-lg"
            size="lg"
          >
            <Scale className="h-5 w-5 mr-2" />
            ⚖️ Balança Inteligente
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-instituto-purple" />
            Xiaomi Mi Body Composition Scale 2
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status da Conexão */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <p className="font-medium">
                  {isConnected ? `Conectado: ${device?.name || 'Mi Scale 2'}` : 'Não conectado'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {status}
                </p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          </div>

          {/* Instruções */}
          {!isConnected && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                📋 Instruções para Conexão
              </h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li><span className="font-medium">1.</span> Certifique-se que a balança está ligada</li>
                <li><span className="font-medium">2.</span> Coloque em superfície plana e rígida</li>
                <li><span className="font-medium">3.</span> Ative o Bluetooth no seu dispositivo</li>
                <li><span className="font-medium">4.</span> Clique em "Conectar Balança"</li>
                <li><span className="font-medium">5.</span> Selecione sua balança na lista</li>
              </ol>
            </div>
          )}

          {/* Instruções durante pesagem */}
          {isReading && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <Timer className="h-4 w-4 animate-pulse" />
                ⚖️ Processo de Pesagem
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-orange-700">
                  <strong>{status}</strong>
                </p>
                {countdown > 0 && (
                  <div className="bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: countdown <= 5 
                          ? `${((5 - countdown) / 5) * 100}%`
                          : `${((10 - countdown) / 10) * 100}%`
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-orange-600">
                  Mantenha-se parado na balança até a captura automática
                </p>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="space-y-3">
            {!isConnected ? (
              <Button 
                onClick={connectToScale}
                disabled={isConnecting}
                className="w-full bg-instituto-purple hover:bg-instituto-purple/80"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Procurando balança...
                  </>
                ) : (
                  <>
                    <Bluetooth className="h-4 w-4 mr-2" />
                    🔗 Conectar Balança
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-2">
                {!isReading ? (
                  <>
                    <Button 
                      onClick={startWeighing}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      <Scale className="h-4 w-4 mr-2" />
                      ⚖️ Capturar Peso
                    </Button>
                    <Button 
                      onClick={disconnect}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Desconectar
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => {
                      clearReading();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    size="lg"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    ⏹️ Cancelar Pesagem
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Dados Capturados - Processo Automático */}
          {lastReading && !showCircunferenciaInput && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-green-700 flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  🔁 Dados Capturados - Processamento Automático
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Resumo dos dados capturados automaticamente */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h5 className="font-semibold text-blue-800 mb-2">📊 Dados Processados Automaticamente:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>✅ Peso: <strong>{lastReading.weight}kg</strong></div>
                    <div>✅ Gordura: <strong>{lastReading.bodyFat?.toFixed(1)}%</strong></div>
                    <div>✅ Água: <strong>{lastReading.bodyWater?.toFixed(1)}%</strong></div>
                    <div>✅ Massa Muscular: <strong>{lastReading.muscleMass?.toFixed(1)}kg</strong></div>
                    <div>✅ Gordura Visceral: <strong>{lastReading.visceralFat}</strong></div>
                    <div>✅ Metabolismo: <strong>{lastReading.basalMetabolism}</strong></div>
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <h5 className="font-semibold text-orange-800 mb-2">📐 Circunferência Abdominal Necessária</h5>
                  <p className="text-sm text-orange-700 mb-3">
                    Para completar o processo, informe sua circunferência abdominal atual:
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setShowCircunferenciaInput(true);
                      setCircunferenciaAbdominal(dadosSaude?.circunferencia_abdominal_cm || 90);
                    }}
                    className="flex-1 bg-instituto-purple hover:bg-instituto-purple/80"
                    size="lg"
                  >
                    <Ruler className="h-4 w-4 mr-2" />
                    📐 Inserir Circunferência
                  </Button>
                  <Button 
                    onClick={clearReading}
                    variant="outline"
                    size="lg"
                  >
                    🔄 Nova Pesagem
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input da Circunferência Abdominal */}
          {lastReading && showCircunferenciaInput && (
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-orange-700 flex items-center justify-center gap-2">
                  <Ruler className="h-5 w-5" />
                  📐 Circunferência Abdominal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <Label htmlFor="circunferencia" className="text-sm font-medium">
                      Circunferência Abdominal (cm)
                    </Label>
                    <Input
                      id="circunferencia"
                      type="number"
                      value={circunferenciaAbdominal}
                      onChange={(e) => setCircunferenciaAbdominal(Number(e.target.value))}
                      className="mt-2"
                      min="50"
                      max="200"
                      step="0.1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Meça na altura do umbigo, em pé, após expirar
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h6 className="font-medium text-green-800 mb-2">🎯 Dados Finais do Processo:</h6>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Peso: <strong>{lastReading.weight}kg</strong></div>
                      <div>Gordura: <strong>{lastReading.bodyFat?.toFixed(1)}%</strong></div>
                      <div>Água: <strong>{lastReading.bodyWater?.toFixed(1)}%</strong></div>
                      <div>Músculo: <strong>{lastReading.muscleMass?.toFixed(1)}kg</strong></div>
                      <div>Circunf.: <strong>{circunferenciaAbdominal}cm</strong></div>
                      <div>Tipo: <strong>{lastReading.bodyType}</strong></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => processAndSaveScaleData(lastReading, {
                        circunferencia_abdominal_cm: circunferenciaAbdominal,
                        meta_peso_kg: dadosSaude?.meta_peso_kg || lastReading.weight
                      })}
                      disabled={isSaving || circunferenciaAbdominal < 50 || circunferenciaAbdominal > 200}
                      className="flex-1 bg-instituto-green hover:bg-instituto-green/80"
                      size="lg"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Finalizando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          ✅ Finalizar e Atualizar Gráficos
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => setShowCircunferenciaInput(false)}
                      variant="outline"
                      size="lg"
                      disabled={isSaving}
                    >
                      ⬅️ Voltar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
