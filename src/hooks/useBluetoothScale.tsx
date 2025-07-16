
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ScaleReading {
  weight: number;
  impedance?: number;
  bodyFat?: number;
  bodyWater?: number;
  muscleMass?: number;
  visceralFat?: number;
  basalMetabolism?: number;
  bodyAge?: number;
  bodyType?: string;
  timestamp: Date;
}

interface BluetoothScaleState {
  isConnected: boolean;
  isConnecting: boolean;
  isReading: boolean;
  device: BluetoothDevice | null;
  lastReading: ScaleReading | null;
  countdown: number;
  status: string;
}

export const useBluetoothScale = () => {
  const [state, setState] = useState<BluetoothScaleState>({
    isConnected: false,
    isConnecting: false,
    isReading: false,
    device: null,
    lastReading: null,
    countdown: 0,
    status: 'Desconectado'
  });

  const { toast } = useToast();
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateBodyComposition = (weight: number, impedance: number, height: number, age: number, isMale: boolean): Partial<ScaleReading> => {
    // Fórmulas baseadas nos algoritmos da Xiaomi para cálculo de composição corporal
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    // Fórmulas aproximadas para cálculo baseado em impedância
    let bodyFat: number;
    let bodyWater: number;
    let muscleMass: number;
    let visceralFat: number;
    let basalMetabolism: number;
    let bodyAge: number;

    if (isMale) {
      bodyFat = (1.2 * bmi) + (0.23 * age) - (10.8 * 1) - 5.4 + (impedance * 0.01);
      bodyWater = (2.447 - (0.09156 * age) + (0.1074 * height) + (0.3362 * weight)) - (bodyFat * 0.35);
      muscleMass = weight - (weight * bodyFat / 100) - (weight * 0.15);
      basalMetabolism = (13.397 * weight) + (4.799 * height) - (5.677 * age) + 88.362;
    } else {
      bodyFat = (1.2 * bmi) + (0.23 * age) - (10.8 * 0) - 5.4 + (impedance * 0.01);
      bodyWater = (2.097 + (0.1069 * height) + (0.2466 * weight)) - (bodyFat * 0.35);
      muscleMass = weight - (weight * bodyFat / 100) - (weight * 0.12);
      basalMetabolism = (9.247 * weight) + (3.098 * height) - (4.330 * age) + 447.593;
    }

    // Ajustes baseados nos limites normais
    bodyFat = Math.max(5, Math.min(50, bodyFat));
    bodyWater = Math.max(35, Math.min(75, bodyWater));
    muscleMass = Math.max(weight * 0.25, Math.min(weight * 0.6, muscleMass));
    
    visceralFat = Math.max(1, Math.min(30, (bodyFat / 10) + (age / 20)));
    bodyAge = Math.max(18, Math.min(80, age + (bodyFat - 15) * 0.5));

    // Determinar tipo corporal baseado na composição
    let bodyType = 'Normal';
    if (bodyFat < 10) bodyType = 'Atlético';
    else if (bodyFat > 25) bodyType = 'Obesidade';
    else if (muscleMass > weight * 0.4) bodyType = 'Muscular';

    return {
      bodyFat: Math.round(bodyFat * 10) / 10,
      bodyWater: Math.round(bodyWater * 10) / 10,
      muscleMass: Math.round(muscleMass * 10) / 10,
      visceralFat: Math.round(visceralFat),
      basalMetabolism: Math.round(basalMetabolism),
      bodyAge: Math.round(bodyAge),
      bodyType
    };
  };

  const parseScaleData = useCallback((data: DataView, userHeight: number = 170, userAge: number = 30, isMale: boolean = true): ScaleReading | null => {
    try {
      console.log('📊 Dados brutos recebidos:', Array.from(new Uint8Array(data.buffer)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      
      if (data.byteLength < 13) {
        console.log('❌ Dados insuficientes:', data.byteLength, 'bytes');
        return null;
      }

      // Verificar flags de controle (byte 0)
      const controlByte = data.getUint8(0);
      const hasWeight = (controlByte & 0x02) !== 0;
      const isStabilized = (controlByte & 0x20) !== 0;
      const hasImpedance = (controlByte & 0x04) !== 0;

      console.log('🔍 Flags de controle:', {
        controlByte: controlByte.toString(16),
        hasWeight,
        isStabilized,
        hasImpedance
      });

      if (!hasWeight || !isStabilized) {
        console.log('⏳ Aguardando estabilização...');
        return null;
      }

      // Extrair peso dos bytes 11-12 (little endian)
      const rawWeight = data.getUint16(11, true);
      const weight = rawWeight / 200.0; // Divisor correto para Xiaomi Scale 2

      console.log('⚖️ Peso bruto:', rawWeight, '→', weight, 'kg');

      // Validar peso
      if (weight < 5 || weight > 300 || isNaN(weight)) {
        console.log('❌ Peso inválido:', weight);
        return null;
      }

      let impedance: number | undefined;
      let bodyComposition: Partial<ScaleReading> = {};

      // Extrair impedância se disponível (bytes 9-10)
      if (hasImpedance && data.byteLength >= 11) {
        const rawImpedance = data.getUint16(9, true);
        impedance = rawImpedance;
        
        console.log('🔬 Impedância detectada:', impedance);
        
        // Calcular composição corporal
        bodyComposition = calculateBodyComposition(weight, impedance, userHeight, userAge, isMale);
      }

      const reading: ScaleReading = {
        weight: Math.round(weight * 10) / 10,
        impedance,
        ...bodyComposition,
        timestamp: new Date()
      };

      console.log('✅ Leitura completa:', reading);
      return reading;

    } catch (error) {
      console.error('❌ Erro ao processar dados da balança:', error);
      return null;
    }
  }, []);

  const connectToScale = useCallback(async () => {
    if (!('bluetooth' in navigator)) {
      toast({
        title: "Bluetooth não suportado",
        description: "Use Chrome, Edge ou outro navegador compatível",
        variant: "destructive",
      });
      return false;
    }

    setState(prev => ({ ...prev, isConnecting: true, status: 'Procurando balança...' }));

    try {
      console.log('🔍 Iniciando busca por balança Xiaomi...');

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "MIBFS" },
          { namePrefix: "MIBCS" },
          { namePrefix: "MI_SCALE" },
          { namePrefix: "Xiaomi" },
          { namePrefix: "MI" }
        ],
        optionalServices: [
          "0000181d-0000-1000-8000-00805f9b34fb", // Weight Scale Service
          "0000181b-0000-1000-8000-00805f9b34fb", // Body Composition Service  
          "0000fee0-0000-1000-8000-00805f9b34fb", // Xiaomi Service 1
          "0000fee1-0000-1000-8000-00805f9b34fb", // Xiaomi Service 2
          "0000180f-0000-1000-8000-00805f9b34fb"  // Battery Service
        ]
      });

      console.log('📱 Dispositivo selecionado:', device.name);

      const server = await device.gatt!.connect();
      console.log('🔗 GATT conectado');

      // Event listener para desconexão
      device.addEventListener('gattserverdisconnected', () => {
        console.log('⚠️ Balança desconectada');
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          device: null, 
          status: 'Desconectado' 
        }));
        characteristicRef.current = null;
      });

      // Tentar diferentes serviços para encontrar as características
      const services = await server.getPrimaryServices();
      console.log('📡 Serviços encontrados:', services.length);

      for (const service of services) {
        try {
          console.log('🔍 Testando serviço:', service.uuid);
          const characteristics = await service.getCharacteristics();
          
          for (const char of characteristics) {
            console.log('📊 Característica encontrada:', char.uuid);
            
            if (char.properties.notify || char.properties.indicate) {
              try {
                await char.startNotifications();
                char.addEventListener('characteristicvaluechanged', (event) => {
                  const target = event.target as BluetoothRemoteGATTCharacteristic;
                  const reading = parseScaleData(target.value!, 170, 30, true); // Valores padrão, serão ajustados depois
                  
                  if (reading) {
                    setState(prev => ({ 
                      ...prev, 
                      lastReading: reading,
                      status: `Peso capturado: ${reading.weight}kg`
                    }));
                    
                    toast({
                      title: `⚖️ Peso detectado: ${reading.weight}kg`,
                      description: reading.bodyFat ? `Gordura: ${reading.bodyFat}% | Água: ${reading.bodyWater}%` : 'Dados básicos capturados',
                      duration: 5000,
                    });
                  }
                });
                
                characteristicRef.current = char;
                console.log('✅ Notificações configuradas para:', char.uuid);
                break;
              } catch (notifyError) {
                console.warn('⚠️ Erro ao configurar notificação:', notifyError);
              }
            }
          }
          
          if (characteristicRef.current) break;
        } catch (serviceError) {
          console.warn('⚠️ Erro ao acessar serviço:', serviceError);
        }
      }

      if (!characteristicRef.current) {
        throw new Error('Nenhuma característica compatível encontrada');
      }

      setState(prev => ({ 
        ...prev, 
        isConnected: true, 
        isConnecting: false,
        device,
        status: `Conectado: ${device.name || 'Xiaomi Scale 2'}`
      }));

      toast({
        title: "✅ Balança conectada!",
        description: `${device.name || 'Xiaomi Scale 2'} pronta para uso`,
      });

      return true;

    } catch (error: any) {
      console.error('❌ Erro na conexão:', error);
      
      setState(prev => ({ 
        ...prev, 
        isConnecting: false,
        status: 'Erro na conexão'
      }));

      if (error.name !== 'NotFoundError') {
        toast({
          title: "Erro na conexão",
          description: error.message || "Não foi possível conectar com a balança",
          variant: "destructive",
        });
      }
      
      return false;
    }
  }, [toast, parseScaleData]);

  const startWeighing = useCallback(() => {
    if (!state.isConnected) {
      toast({
        title: "Erro",
        description: "Balança não conectada",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isReading: true, 
      countdown: 5,
      status: 'Suba na balança em 5 segundos...',
      lastReading: null
    }));

    // Contagem regressiva para subir na balança (5 segundos)
    let countdown = 5;
    countdownTimerRef.current = setInterval(() => {
      countdown--;
      setState(prev => ({ 
        ...prev, 
        countdown,
        status: countdown > 0 ? `Suba na balança em ${countdown} segundos...` : 'Aguardando estabilização...'
      }));

      if (countdown <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
        }
        
        // Iniciar período de leitura (10 segundos para estabilizar)
        setState(prev => ({ 
          ...prev, 
          countdown: 10,
          status: 'Aguardando estabilização...'
        }));

        let readingCountdown = 10;
        readingTimerRef.current = setInterval(() => {
          readingCountdown--;
          setState(prev => ({ 
            ...prev, 
            countdown: readingCountdown,
            status: `Estabilizando... ${readingCountdown}s`
          }));

          if (readingCountdown <= 0) {
            if (readingTimerRef.current) {
              clearInterval(readingTimerRef.current);
            }
            
            setState(prev => ({ 
              ...prev, 
              isReading: false,
              countdown: 0,
              status: prev.lastReading ? 'Peso capturado com sucesso!' : 'Nenhum peso detectado. Tente novamente.'
            }));

            if (!state.lastReading) {
              toast({
                title: "Nenhum peso detectado",
                description: "Certifique-se de estar na balança e tente novamente",
                variant: "destructive",
              });
            }
          }
        }, 1000);
      }
    }, 1000);

    toast({
      title: "🎯 Pesagem iniciada",
      description: "Siga as instruções na tela",
    });
  }, [state.isConnected, state.lastReading, toast]);

  const disconnect = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    if (readingTimerRef.current) {
      clearInterval(readingTimerRef.current);
    }

    if (state.device?.gatt?.connected) {
      state.device.gatt.disconnect();
    }

    setState({
      isConnected: false,
      isConnecting: false,
      isReading: false,
      device: null,
      lastReading: null,
      countdown: 0,
      status: 'Desconectado'
    });

    characteristicRef.current = null;

    toast({
      title: "🔌 Balança desconectada",
      description: "Conexão encerrada com sucesso",
    });
  }, [state.device, toast]);

  const clearReading = useCallback(() => {
    setState(prev => ({ ...prev, lastReading: null }));
  }, []);

  return {
    ...state,
    connectToScale,
    startWeighing,
    disconnect,
    clearReading
  };
};
