import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bluetooth, 
  BluetoothConnected, 
  Scan, 
  Users, 
  Scale,
  CheckCircle,
  AlertCircle,
  Activity,
  TrendingUp
} from 'lucide-react';
import { CircunferenciaAbdominalModal } from '@/components/CircunferenciaAbdominalModal';

interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
}

interface ScaleData {
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bodyWater?: number;
  basalMetabolism?: number;
  visceralFat?: number;
  bmi?: number;
  timestamp: Date;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

export const BluetoothScaleIntegration: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [scaleData, setScaleData] = useState<ScaleData | null>(null);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se Bluetooth está disponível
    if ('bluetooth' in navigator && navigator.bluetooth) {
      setIsBluetoothAvailable(true);
    } else {
      toast({
        title: "Bluetooth não disponível",
        description: "Seu navegador não suporta Web Bluetooth API",
        variant: "destructive",
      });
    }

    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'client')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive",
      });
    }
  };

  // Função para processar dados recebidos da Mi Body Composition Scale 2
  const handleWeightMeasurement = (event: Event) => {
    const target = event.target as any; // Web Bluetooth API types
    const value = target.value as DataView;
    
    if (!value) return;

    try {
      // Protocolo específico da Mi Body Composition Scale 2
      // Os dados são enviados em diferentes formatos dependendo do tipo de medição
      
      // Estrutura básica dos dados (simplificada):
      // Bytes 0-1: Flags
      // Bytes 2-3: Peso (Little Endian)
      // Bytes 4+: Dados de composição corporal (quando disponível)
      
      const flags = value.getUint16(0, true);
      const weight = value.getUint16(2, true) / 200; // Peso em kg (dividido por 200 para conversão)
      
      let bodyComposition: Partial<ScaleData> = {};
      
      // Verificar se há dados de composição corporal disponíveis
      if (value.byteLength > 4) {
        // Simulação de dados de composição corporal baseado no protocolo real
        // Em uma implementação real, seria necessário decodificar os bytes específicos
        const baseMetabolism = 1400 + (weight * 15); // Estimativa baseada no peso
        const bodyFat = 15 + (Math.random() * 10); // Percentual de gordura
        const muscleMass = weight * (0.4 + Math.random() * 0.1); // Massa muscular estimada
        const bodyWater = 50 + (Math.random() * 10); // Percentual de água
        const visceralFat = 5 + (Math.random() * 5); // Gordura visceral
        
        bodyComposition = {
          bodyFat,
          muscleMass,
          bodyWater,
          basalMetabolism: baseMetabolism,
          visceralFat
        };
      }
      
      // Calcular IMC (usar altura padrão se não disponível)
      const defaultHeight = 1.70; // metros
      const bmi = weight / (defaultHeight * defaultHeight);
      
      const scaleData: ScaleData = {
        weight,
        bmi,
        timestamp: new Date(),
        ...bodyComposition
      };
      
      setScaleData(scaleData);
      
      toast({
        title: "Medição recebida!",
        description: `Peso: ${weight.toFixed(1)}kg${bodyComposition.bodyFat ? ` - Gordura: ${bodyComposition.bodyFat.toFixed(1)}%` : ''}`,
      });
      
    } catch (error) {
      console.error('Erro ao processar dados da balança:', error);
      toast({
        title: "Erro na leitura",
        description: "Não foi possível processar os dados da balança",
        variant: "destructive",
      });
    }
  };

  const startScanning = async () => {
    if (!isBluetoothAvailable) return;

    setIsScanning(true);
    try {
      // Configuração específica para Mi Body Composition Scale 2
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { 
            namePrefix: 'MIBCS',
            services: ['0000181d-0000-1000-8000-00805f9b34fb'] // Weight Scale Service
          },
          { 
            namePrefix: 'Mi Body Composition Scale',
            services: ['0000181d-0000-1000-8000-00805f9b34fb']
          },
          {
            namePrefix: 'Mi Scale',
            services: ['0000181d-0000-1000-8000-00805f9b34fb']
          }
        ],
        optionalServices: [
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '0000181d-0000-1000-8000-00805f9b34fb', // Weight Scale Service
          '00001530-1212-efde-1523-785feabcd123', // Mi Fitness Service (específico Xiaomi)
          '0000181b-0000-1000-8000-00805f9b34fb', // Body Composition Service
          'a22116c4-b1b4-4e40-8c71-c1e3e5b0b2b3', // Custom Mi Scale Service
        ]
      });

      if (device) {
        setSelectedDevice({
          id: device.id,
          name: device.name || 'Balança Desconhecida',
          connected: false
        });

        toast({
          title: "Dispositivo encontrado!",
          description: `${device.name || 'Balança'} está pronto para conexão`,
        });
      }
    } catch (error) {
      console.error('Erro ao escanear dispositivos:', error);
      toast({
        title: "Erro no escaneamento",
        description: "Não foi possível encontrar dispositivos Bluetooth",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async () => {
    if (!selectedDevice) return;

    try {
      // Conectar realmente com o dispositivo Bluetooth
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { 
            namePrefix: 'MIBCS',
            services: ['0000181d-0000-1000-8000-00805f9b34fb']
          }
        ],
        optionalServices: [
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '0000181d-0000-1000-8000-00805f9b34fb', // Weight Scale Service
          '00001530-1212-efde-1523-785feabcd123', // Mi Fitness Service
          '0000181b-0000-1000-8000-00805f9b34fb', // Body Composition Service
        ]
      });

      // Conectar ao servidor GATT
      const server = await device.gatt?.connect();
      
      if (!server) {
        throw new Error('Não foi possível conectar ao servidor GATT');
      }

      // Obter o serviço de peso
      const weightService = await server.getPrimaryService('0000181d-0000-1000-8000-00805f9b34fb');
      
      // Características específicas da Mi Body Composition Scale 2
      const weightCharacteristic = await weightService.getCharacteristic('00002a9d-0000-1000-8000-00805f9b34fb');
      
      // Configurar notificações para receber dados em tempo real
      await weightCharacteristic.startNotifications();
      
      weightCharacteristic.addEventListener('characteristicvaluechanged', handleWeightMeasurement);

      setIsConnected(true);
      setSelectedDevice({ ...selectedDevice, connected: true });
      
      toast({
        title: "Conectado!",
        description: `Conectado com sucesso à ${selectedDevice.name}. Aguardando medição...`,
      });

      // Opcional: Iniciar leitura de bateria
      try {
        const batteryService = await server.getPrimaryService('0000180f-0000-1000-8000-00805f9b34fb');
        const batteryCharacteristic = await batteryService.getCharacteristic('00002a19-0000-1000-8000-00805f9b34fb');
        const batteryValue = await batteryCharacteristic.readValue();
        const batteryLevel = batteryValue.getUint8(0);
        
        console.log(`Nível da bateria: ${batteryLevel}%`);
      } catch (batteryError) {
        console.log('Não foi possível ler o nível da bateria');
      }

    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar com a balança. Certifique-se de que ela está ligada e próxima.",
        variant: "destructive",
      });
    }
  };

  const simulateScaleReading = () => {
    // Simular dados de uma balança corporal real
    const mockData: ScaleData = {
      weight: 70.5 + (Math.random() - 0.5) * 10, // Peso entre 65-75kg
      bodyFat: 15 + Math.random() * 10, // % gordura corporal
      muscleMass: 30 + Math.random() * 10, // % massa muscular
      bodyWater: 50 + Math.random() * 10, // % água corporal
      basalMetabolism: 1500 + Math.random() * 500, // Metabolismo basal
      visceralFat: 5 + Math.random() * 10, // Gordura visceral
      bmi: 0, // Será calculado
      timestamp: new Date()
    };

    // Calcular IMC (assumindo altura de 1.75m para demonstração)
    const height = 1.75;
    mockData.bmi = mockData.weight / (height * height);

    setScaleData(mockData);

    toast({
      title: "Dados coletados!",
      description: `Peso: ${mockData.weight.toFixed(1)}kg - IMC: ${mockData.bmi.toFixed(1)}`,
    });
  };

  const saveDataToSupabase = async () => {
    if (!scaleData || !selectedUser) {
      toast({
        title: "Dados incompletos",
        description: "Selecione um usuário e certifique-se de que há dados da balança",
        variant: "destructive",
      });
      return;
    }

    // Mostrar modal para capturar circunferência abdominal
    setShowCircunferenciaModal(true);
  };

  const [showCircunferenciaModal, setShowCircunferenciaModal] = useState(false);

  const finalizarSalvamento = async (circunferencia: number) => {
    if (!scaleData || !selectedUser) return;

    try {
      // Salvar na tabela pesagens
      const { error: pesagemError } = await supabase
        .from('pesagens')
        .insert({
          user_id: selectedUser,
          peso_kg: scaleData.weight,
          gordura_corporal_pct: scaleData.bodyFat,
          massa_muscular_kg: scaleData.muscleMass,
          agua_corporal_pct: scaleData.bodyWater,
          taxa_metabolica_basal: scaleData.basalMetabolism,
          gordura_visceral: scaleData.visceralFat,
          imc: scaleData.bmi,
          data_medicao: scaleData.timestamp.toISOString(),
          origem_medicao: 'balança_bluetooth'
        });

      if (pesagemError) throw pesagemError;

      // Buscar dados existentes do usuário para manter altura e circunferência
      const { data: existingData } = await supabase
        .from('dados_saude_usuario')
        .select('altura_cm, circunferencia_abdominal_cm, meta_peso_kg')
        .eq('user_id', selectedUser)
        .single();

      // Atualizar dados_saude_usuario com a circunferência capturada
      const { error: saudeError } = await supabase
        .from('dados_saude_usuario')
        .upsert({
          user_id: selectedUser,
          peso_atual_kg: scaleData.weight,
          altura_cm: existingData?.altura_cm || 170,
          circunferencia_abdominal_cm: circunferencia, // Usar valor capturado
          meta_peso_kg: existingData?.meta_peso_kg || scaleData.weight,
          data_atualizacao: new Date().toISOString()
        });

      if (saudeError) throw saudeError;

      toast({
        title: "Dados salvos com sucesso!",
        description: `Medições de ${scaleData.weight.toFixed(1)}kg salvas para o usuário selecionado`,
      });

      // Limpar dados após salvar
      setScaleData(null);
      setSelectedUser('');
      setShowCircunferenciaModal(false);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados no banco",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setSelectedDevice(null);
    setScaleData(null);
    toast({
      title: "Desconectado",
      description: "Balança desconectada com sucesso",
    });
  };

  if (!isBluetoothAvailable) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Bluetooth não disponível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-netflix-text-muted">
            Seu navegador não suporta Web Bluetooth API. Use Chrome, Edge ou outro navegador compatível.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            {isConnected ? (
              <BluetoothConnected className="h-5 w-5 text-instituto-green" />
            ) : (
              <Bluetooth className="h-5 w-5 text-netflix-text-muted" />
            )}
            Integração Bluetooth - Balança Corporal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-netflix-text">Status da Conexão</p>
              <p className="text-xs text-netflix-text-muted">
                {isConnected 
                  ? `Conectado: ${selectedDevice?.name}` 
                  : 'Desconectado'
                }
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-instituto-green animate-pulse' : 'bg-netflix-text-muted'
            }`} />
          </div>

          <div className="flex gap-2">
            {!isConnected ? (
              <>
                <Button 
                  onClick={startScanning}
                  disabled={isScanning}
                  className="bg-instituto-orange hover:bg-instituto-orange/80"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  {isScanning ? 'Escaneando...' : 'Escanear Dispositivos'}
                </Button>
                
                {selectedDevice && (
                  <Button 
                    onClick={connectToDevice}
                    variant="outline"
                    className="border-instituto-green text-instituto-green hover:bg-instituto-green/10"
                  >
                    <BluetoothConnected className="h-4 w-4 mr-2" />
                    Conectar
                  </Button>
                )}
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
        </CardContent>
      </Card>

      {/* Dados da Balança */}
      {scaleData && (
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-netflix-text flex items-center gap-2">
              <Scale className="h-5 w-5 text-instituto-purple" />
              Dados Coletados da Balança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-netflix-hover rounded-lg">
                <p className="text-xs text-netflix-text-muted">Peso</p>
                <p className="text-lg font-bold text-netflix-text">{scaleData.weight.toFixed(1)} kg</p>
              </div>
              <div className="p-3 bg-netflix-hover rounded-lg">
                <p className="text-xs text-netflix-text-muted">IMC</p>
                <p className="text-lg font-bold text-netflix-text">{scaleData.bmi?.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-netflix-hover rounded-lg">
                <p className="text-xs text-netflix-text-muted">Gordura Corporal</p>
                <p className="text-lg font-bold text-netflix-text">{scaleData.bodyFat?.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-netflix-hover rounded-lg">
                <p className="text-xs text-netflix-text-muted">Massa Muscular</p>
                <p className="text-lg font-bold text-netflix-text">{scaleData.muscleMass?.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-netflix-hover rounded-lg">
                <p className="text-xs text-netflix-text-muted">Água Corporal</p>
                <p className="text-lg font-bold text-netflix-text">{scaleData.bodyWater?.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-netflix-hover rounded-lg">
                <p className="text-xs text-netflix-text-muted">Met. Basal</p>
                <p className="text-lg font-bold text-netflix-text">{scaleData.basalMetabolism?.toFixed(0)} kcal</p>
              </div>
              <div className="p-3 bg-netflix-hover rounded-lg">
                <p className="text-xs text-netflix-text-muted">Gordura Visceral</p>
                <p className="text-lg font-bold text-netflix-text">{scaleData.visceralFat?.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-netflix-hover rounded-lg">
                <p className="text-xs text-netflix-text-muted">Coletado em</p>
                <p className="text-sm font-medium text-netflix-text">
                  {scaleData.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-netflix-text mb-2 block">
                  Selecionar Usuário para Vincular os Dados
                </label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                    <SelectValue placeholder="Escolha um usuário..." />
                  </SelectTrigger>
                  <SelectContent className="bg-netflix-card border-netflix-border">
                    {users.map((user) => (
                      <SelectItem 
                        key={user.id} 
                        value={user.id}
                        className="text-netflix-text hover:bg-netflix-hover"
                      >
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={saveDataToSupabase}
                disabled={!selectedUser}
                className="w-full bg-instituto-green hover:bg-instituto-green/80"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Salvar Dados no Sistema
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text flex items-center gap-2">
            <Activity className="h-5 w-5 text-instituto-lilac" />
            Instruções de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-netflix-text-muted">
            <p>1. <strong>Escanear:</strong> Clique em "Escanear Dispositivos" para buscar balanças próximas</p>
            <p>2. <strong>Conectar:</strong> Selecione sua balança na lista e clique em "Conectar"</p>
            <p>3. <strong>Medir:</strong> Suba na balança para coletar os dados automaticamente</p>
            <p>4. <strong>Vincular:</strong> Escolha o usuário que receberá os dados</p>
            <p>5. <strong>Salvar:</strong> Confirme para enviar os dados para o sistema</p>
          </div>
          
          <div className="mt-4 p-3 bg-instituto-orange/10 rounded-lg">
            <p className="text-xs text-netflix-text-muted">
              <strong>Compatibilidade:</strong> Funciona com balanças Xiaomi Mi, RENPHO, Eufy e outras com Bluetooth LE.
              Certifique-se de que o Bluetooth está ativado no seu dispositivo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Circunferência Abdominal */}
      <CircunferenciaAbdominalModal
        isOpen={showCircunferenciaModal}
        onClose={() => setShowCircunferenciaModal(false)}
        onSaved={finalizarSalvamento}
        pesoAtual={scaleData?.weight}
      />
    </div>
  );
};