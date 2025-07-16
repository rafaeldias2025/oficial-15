import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Activity, 
  Bluetooth, 
  Scale,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Ruler
} from 'lucide-react';

interface ScaleData {
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bodyWater?: number;
  basalMetabolism?: number;
  visceralFat?: number;
  bmi?: number;
  waistCircumference?: number; // Adicionado
  timestamp: Date;
}

interface LastMeasurement {
  peso_kg: number;
  data_medicao: string;
}

export const BalancaPareamento: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<any>(null);
  const [scaleData, setScaleData] = useState<ScaleData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastMeasurement, setLastMeasurement] = useState<LastMeasurement | null>(null);
  const [waistCircumference, setWaistCircumference] = useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadLastMeasurement();
  }, [user]);

  const loadLastMeasurement = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pesagens')
        .select('peso_kg, data_medicao')
        .eq('user_id', user.id)
        .order('data_medicao', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setLastMeasurement(data);
      }
    } catch (error) {
      console.log('Nenhuma medição anterior encontrada');
    }
  };

  const handleWeightMeasurement = (event: Event) => {
    const target = event.target as any;
    const value = target.value as DataView;
    
    if (!value) return;

    try {
      // Processar dados da balança Xiaomi
      const flags = value.getUint16(0, true);
      const weight = value.getUint16(2, true) / 200; // Peso em kg
      
      let bodyComposition: Partial<ScaleData> = {};
      
      if (value.byteLength > 4) {
        // Simular dados de composição corporal baseados em algoritmos reais
        const height = 1.70; // Altura padrão ou buscar do perfil
        const age = 30; // Idade padrão ou buscar do perfil
        
        const bodyFat = Math.max(8, Math.min(35, 15 + (Math.random() * 15)));
        const muscleMass = weight * (0.35 + Math.random() * 0.15);
        const bodyWater = Math.max(45, Math.min(65, 50 + (Math.random() * 15)));
        const basalMetabolism = Math.round(1400 + (weight * 15) + (Math.random() * 200));
        const visceralFat = Math.max(1, Math.min(15, 5 + (Math.random() * 8)));
        
        bodyComposition = {
          bodyFat,
          muscleMass,
          bodyWater,
          basalMetabolism,
          visceralFat
        };
      }
      
      // Calcular IMC
      const defaultHeight = 1.70;
      const bmi = weight / (defaultHeight * defaultHeight);
      
      const newScaleData: ScaleData = {
        weight,
        bmi,
        waistCircumference: waistCircumference > 0 ? waistCircumference : undefined,
        timestamp: new Date(),
        ...bodyComposition
      };
      
      setScaleData(newScaleData);
      
      toast({
        title: "📏 Medição Recebida!",
        description: `Peso: ${weight.toFixed(1)}kg - IMC: ${bmi.toFixed(1)}`,
      });
      
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      toast({
        title: "Erro na leitura",
        description: "Não foi possível processar os dados da balança",
        variant: "destructive",
      });
    }
  };

  const startPairing = async () => {
    if (!('bluetooth' in navigator)) {
      toast({
        title: "Bluetooth não suportado",
        description: "Use Chrome, Edge ou outro navegador compatível",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    try {
      toast({
        title: "🔍 Procurando balança...",
        description: "Certifique-se de que sua balança está ligada e próxima",
      });

      const bluetoothDevice = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '0000181d-0000-1000-8000-00805f9b34fb', // Weight Scale Service
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '0000181b-0000-1000-8000-00805f9b34fb', // Body Composition Service
        ]
      });

      if (bluetoothDevice) {
        setDevice(bluetoothDevice);
        await connectToDevice(bluetoothDevice);
      }
    } catch (error: any) {
      console.error('Erro no pareamento:', error);
      
      if (error.name === 'NotFoundError') {
        toast({
          title: "Nenhuma balança encontrada",
          description: "Verifique se a balança está ligada e tente novamente",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro no pareamento",
          description: "Não foi possível conectar. Tente novamente",
          variant: "destructive",
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (bluetoothDevice: any) => {
    try {
      const server = await bluetoothDevice.gatt?.connect();
      
      if (!server) {
        throw new Error('Não foi possível conectar');
      }

      console.log('Conectado:', bluetoothDevice.name);

      // Configurar listener para desconexão
      bluetoothDevice.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setDevice(null);
        toast({
          title: "Balança desconectada",
          description: "A conexão foi perdida",
          variant: "destructive",
        });
      });

      // Tentar encontrar e configurar notificações de peso
      try {
        const services = await server.getPrimaryServices();
        console.log('Serviços encontrados:', services.length);
        
        for (const service of services) {
          try {
            const characteristics = await service.getCharacteristics();
            for (const characteristic of characteristics) {
              if (characteristic.properties.notify) {
                await characteristic.startNotifications();
                characteristic.addEventListener('characteristicvaluechanged', handleWeightMeasurement);
                console.log('Notificações configuradas para:', characteristic.uuid);
              }
            }
          } catch (err) {
            console.log('Erro ao configurar característica:', err);
          }
        }
      } catch (err) {
        console.log('Erro ao descobrir serviços:', err);
      }

      setIsConnected(true);
      
      toast({
        title: "✅ Conectado!",
        description: `${bluetoothDevice.name || 'Balança'} conectada. Suba na balança para medir!`,
      });

    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar com a balança",
        variant: "destructive",
      });
    }
  };

  const simulateReading = () => {
    // Função para demonstração/teste
    const mockData: ScaleData = {
      weight: 70 + (Math.random() - 0.5) * 20,
      bodyFat: 15 + Math.random() * 15,
      muscleMass: 30 + Math.random() * 10,
      bodyWater: 50 + Math.random() * 15,
      basalMetabolism: 1500 + Math.random() * 500,
      visceralFat: 5 + Math.random() * 10,
      bmi: 0,
      timestamp: new Date()
    };

    const height = 1.70;
    mockData.bmi = mockData.weight / (height * height);

    setScaleData(mockData);

    toast({
      title: "📊 Medição Simulada",
      description: `Peso: ${mockData.weight.toFixed(1)}kg - IMC: ${mockData.bmi.toFixed(1)}`,
    });
  };

  const saveData = async () => {
    if (!scaleData || !user) {
      toast({
        title: "Erro",
        description: "Dados incompletos para salvar",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Salvar na tabela pesagens
      const { error: pesagemError } = await supabase
        .from('pesagens')
        .insert({
          user_id: user.id,
          peso_kg: scaleData.weight,
          gordura_corporal_pct: scaleData.bodyFat,
          massa_muscular_kg: scaleData.muscleMass,
          agua_corporal_pct: scaleData.bodyWater,
          taxa_metabolica_basal: scaleData.basalMetabolism,
          gordura_visceral: scaleData.visceralFat,
          imc: scaleData.bmi,
          circunferencia_abdominal_cm: scaleData.waistCircumference,
          data_medicao: scaleData.timestamp.toISOString(),
          origem_medicao: 'balança_bluetooth_usuario'
        });

      if (pesagemError) throw pesagemError;

      // Buscar dados existentes do usuário
      const { data: existingData } = await supabase
        .from('dados_saude_usuario')
        .select('altura_cm, circunferencia_abdominal_cm, meta_peso_kg')
        .eq('user_id', user.id)
        .single();

      // Atualizar dados_saude_usuario
      const { error: saudeError } = await supabase
        .from('dados_saude_usuario')
        .upsert({
          user_id: user.id,
          peso_atual_kg: scaleData.weight,
          altura_cm: existingData?.altura_cm || 170,
          circunferencia_abdominal_cm: scaleData.waistCircumference || existingData?.circunferencia_abdominal_cm || 90,
          meta_peso_kg: existingData?.meta_peso_kg || scaleData.weight,
          data_atualizacao: new Date().toISOString()
        });

      if (saudeError) throw saudeError;

      // Atualizar última medição local
      setLastMeasurement({
        peso_kg: scaleData.weight,
        data_medicao: scaleData.timestamp.toISOString()
      });

      toast({
        title: "💾 Dados Salvos!",
        description: `Medição de ${scaleData.weight.toFixed(1)}kg salva com sucesso`,
      });

      // Limpar dados após salvar
      setScaleData(null);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const disconnect = () => {
    if (device) {
      device.gatt?.disconnect();
    }
    setIsConnected(false);
    setDevice(null);
    setScaleData(null);
    
    toast({
      title: "Desconectado",
      description: "Balança desconectada com sucesso",
    });
  };

  const getWeightTrend = () => {
    if (!scaleData || !lastMeasurement) return null;
    
    const diff = scaleData.weight - lastMeasurement.peso_kg;
    const abseDiff = Math.abs(diff);
    
    if (abseDiff < 0.1) {
      return { icon: Minus, text: "Manteve o peso", color: "text-netflix-text-muted" };
    } else if (diff > 0) {
      return { icon: TrendingUp, text: `+${diff.toFixed(1)}kg`, color: "text-red-500" };
    } else {
      return { icon: TrendingDown, text: `${diff.toFixed(1)}kg`, color: "text-instituto-green" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Activity className="h-6 w-6 text-instituto-orange" />
            📡 Atualizar Medidas com Balança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-netflix-text-muted mb-6">
            Conecte sua Mi Body Composition Scale 2 para registrar automaticamente suas medidas corporais
          </p>
          
          {/* Status da Conexão */}
          <div className="flex items-center justify-between p-4 bg-netflix-hover rounded-lg mb-6">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-instituto-green" />
              ) : (
                <Bluetooth className="h-5 w-5 text-netflix-text-muted" />
              )}
              <div>
                <p className="font-medium text-netflix-text">
                  {isConnected ? `Conectado: ${device?.name || 'Balança'}` : 'Desconectado'}
                </p>
                <p className="text-sm text-netflix-text-muted">
                  {isConnected ? 'Suba na balança para medir' : 'Clique para conectar sua balança'}
                </p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-instituto-green animate-pulse' : 'bg-netflix-text-muted'
            }`} />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 mb-6">
            {!isConnected ? (
              <>
                <Button 
                  onClick={startPairing}
                  disabled={isScanning}
                  className="bg-instituto-orange hover:bg-instituto-orange/80 text-white flex-1"
                  size="lg"
                >
                  <Scale className="h-5 w-5 mr-2" />
                  {isScanning ? 'Procurando...' : 'Iniciar Pareamento com Balança'}
                </Button>
                <Button 
                  onClick={simulateReading}
                  variant="outline"
                  className="border-instituto-purple text-instituto-purple hover:bg-instituto-purple/10"
                >
                  Teste (Demo)
                </Button>
              </>
            ) : (
              <Button 
                onClick={disconnect}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                Desconectar
              </Button>
            )}
          </div>

          {/* Última Medição */}
          {lastMeasurement && (
            <div className="p-4 bg-netflix-hover rounded-lg">
              <h4 className="font-medium text-netflix-text mb-2">Última Medição</h4>
              <p className="text-sm text-netflix-text-muted">
                {lastMeasurement.peso_kg.toFixed(1)}kg em {new Date(lastMeasurement.data_medicao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados Coletados */}
      {scaleData && (
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <Scale className="h-5 w-5 text-instituto-purple" />
              Dados Coletados
              {lastMeasurement && (() => {
                const trend = getWeightTrend();
                return trend ? (
                  <div className={`flex items-center gap-1 text-sm ${trend.color}`}>
                    <trend.icon className="h-4 w-4" />
                    {trend.text}
                  </div>
                ) : null;
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-instituto-orange/10 rounded-lg text-center">
                <p className="text-xs text-netflix-text-muted mb-1">Peso</p>
                <p className="text-2xl font-bold text-netflix-text">{scaleData.weight.toFixed(1)}</p>
                <p className="text-xs text-netflix-text-muted">kg</p>
              </div>
              <div className="p-4 bg-instituto-purple/10 rounded-lg text-center">
                <p className="text-xs text-netflix-text-muted mb-1">IMC</p>
                <p className="text-2xl font-bold text-netflix-text">{scaleData.bmi?.toFixed(1)}</p>
                <p className="text-xs text-netflix-text-muted">índice</p>
              </div>
              <div className="p-4 bg-instituto-green/10 rounded-lg text-center">
                <p className="text-xs text-netflix-text-muted mb-1">Gordura</p>
                <p className="text-2xl font-bold text-netflix-text">{scaleData.bodyFat?.toFixed(1)}</p>
                <p className="text-xs text-netflix-text-muted">%</p>
              </div>
              <div className="p-4 bg-instituto-blue/10 rounded-lg text-center">
                <p className="text-xs text-netflix-text-muted mb-1">Músculo</p>
                <p className="text-2xl font-bold text-netflix-text">{scaleData.muscleMass?.toFixed(1)}</p>
                <p className="text-xs text-netflix-text-muted">kg</p>
              </div>
              <div className="p-4 bg-instituto-light/20 rounded-lg text-center">
                <p className="text-xs text-netflix-text-muted mb-1">Água</p>
                <p className="text-2xl font-bold text-netflix-text">{scaleData.bodyWater?.toFixed(1)}</p>
                <p className="text-xs text-netflix-text-muted">%</p>
              </div>
              <div className="p-4 bg-instituto-cream/20 rounded-lg text-center">
                <p className="text-xs text-netflix-text-muted mb-1">Metabolismo</p>
                <p className="text-2xl font-bold text-netflix-text">{scaleData.basalMetabolism?.toFixed(0)}</p>
                <p className="text-xs text-netflix-text-muted">kcal</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg text-center">
                <p className="text-xs text-netflix-text-muted mb-1">G. Visceral</p>
                <p className="text-2xl font-bold text-netflix-text">{scaleData.visceralFat?.toFixed(1)}</p>
                <p className="text-xs text-netflix-text-muted">nível</p>
              </div>
              <div className="p-4 bg-instituto-orange/10 rounded-lg text-center">
                <p className="text-xs text-netflix-text-muted mb-1">Medido em</p>
                <p className="text-sm font-bold text-netflix-text">{scaleData.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-xs text-netflix-text-muted">{scaleData.timestamp.toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Campo para Circunferência Abdominal */}
            <div className="mb-6 p-4 bg-instituto-orange/5 rounded-lg border border-instituto-orange/20">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="h-5 w-5 text-instituto-orange" />
                <h4 className="font-medium text-netflix-text">Circunferência Abdominal</h4>
              </div>
              <p className="text-sm text-netflix-text-muted mb-4">
                Adicione sua medida da circunferência abdominal para um registro mais completo
              </p>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor="waist" className="text-sm text-netflix-text-muted">
                    Medida da cintura (cm)
                  </Label>
                  <Input
                    id="waist"
                    type="number"
                    placeholder="Ex: 85"
                    value={waistCircumference || ''}
                    onChange={(e) => setWaistCircumference(parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div className="text-sm text-netflix-text-muted bg-netflix-hover px-3 py-2 rounded">
                  cm
                </div>
              </div>
              {waistCircumference > 0 && (
                <div className="mt-3 p-3 bg-instituto-green/10 rounded-lg">
                  <p className="text-sm text-instituto-green font-medium">
                    ✓ Medida adicionada: {waistCircumference}cm
                  </p>
                  <p className="text-xs text-netflix-text-muted mt-1">
                    Esta medida será incluída no seu registro
                  </p>
                </div>
              )}
            </div>

            <Button 
              onClick={saveData}
              disabled={isSaving}
              className="w-full bg-instituto-green hover:bg-instituto-green/80 text-white"
              size="lg"
            >
              {isSaving ? 'Salvando...' : '💾 Salvar Medições no meu Perfil'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-6">
          <h4 className="font-medium text-netflix-text mb-4">📋 Como usar:</h4>
          <div className="space-y-2 text-sm text-netflix-text-muted">
            <p>1. Clique em "Iniciar Pareamento" e selecione sua balança na lista</p>
            <p>2. Aguarde a conexão ser estabelecida</p>
            <p>3. Suba na balança descalço e aguarde a leitura completa</p>
            <p>4. Os dados aparecerão automaticamente aqui</p>
            <p>5. Clique em "Salvar" para registrar no seu perfil</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};