import { useState, useCallback } from 'react';

// Tipos Web Bluetooth
interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRemoteGATTServer {
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  value?: DataView;
  properties?: {
    notify: boolean;
    read: boolean;
    write: boolean;
  };
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener(event: string, listener: (event: any) => void): void;
  removeEventListener(event: string, listener: (event: any) => void): void;
}

declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: any): Promise<BluetoothDevice>;
    };
  }
}

export interface ScaleReading {
  weight: number;
  timestamp: Date;
  bodyFat?: number;
  bodyWater?: number;
  muscleMass?: number;
  visceralFat?: number;
  basalMetabolism?: number;
  bodyType?: string;
}

export const useBluetoothScale = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [lastReading, setLastReading] = useState<ScaleReading | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [status, setStatus] = useState('Desconectado');

  const connectToScale = useCallback(async () => {
    if (!navigator.bluetooth) {
      setStatus('Web Bluetooth não suportado neste navegador');
      return;
    }

    setIsConnecting(true);
    setStatus('Procurando balança...');

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "MIBFS" },
          { namePrefix: "MIBCS" },
          { namePrefix: "MI_SCALE" },
          { namePrefix: "Xiaomi" }
        ],
        optionalServices: [
          "0000181d-0000-1000-8000-00805f9b34fb",
          "0000181b-0000-1000-8000-00805f9b34fb",
          "0000fee0-0000-1000-8000-00805f9b34fb",
          "0000fee1-0000-1000-8000-00805f9b34fb"
        ]
      });

      setDevice(device);
      setStatus('Conectando...');
      
      const server = await device.gatt!.connect();
      setIsConnected(true);
      setStatus(`Conectado: ${device.name || 'Mi Scale 2'}`);
      
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setStatus('Erro na conexão. Tente novamente.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const startWeighing = useCallback(async () => {
    if (!device || !device.gatt?.connected) {
      setStatus('Balança não conectada');
      return;
    }

    setIsReading(true);
    setStatus('Suba na balança em 5 segundos...');
    setCountdown(5);

    // Contagem regressiva inicial
    const initialCountdown = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(initialCountdown);
          setStatus('Aguardando estabilização...');
          setCountdown(10);
          
          // Contagem de estabilização
          const stabilizeCountdown = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(stabilizeCountdown);
                startReading();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [device]);

  const startReading = useCallback(async () => {
    if (!device || !device.gatt?.connected) return;

    try {
      setStatus('Descobrindo serviços da balança...');
      
      // Lista de serviços possíveis para Xiaomi Mi Scale
      const possibleServices = [
        "0000181b-0000-1000-8000-00805f9b34fb", // Body Composition Service
        "0000181d-0000-1000-8000-00805f9b34fb", // Weight Scale Service
        "0000fee0-0000-1000-8000-00805f9b34fb", // Xiaomi Custom Service
        "0000fee1-0000-1000-8000-00805f9b34fb"  // Xiaomi Custom Service 2
      ];

      // Lista de características possíveis
      const possibleCharacteristics = [
        "00002a9d-0000-1000-8000-00805f9b34fb", // Weight Measurement
        "00002a98-0000-1000-8000-00805f9b34fb", // Weight Feature
        "00002a9c-0000-1000-8000-00805f9b34fb", // Body Composition Measurement
        "00002a9e-0000-1000-8000-00805f9b34fb", // Weight Scale Feature
        "0000fee1-0000-1000-8000-00805f9b34fb", // Xiaomi notification characteristic
        "0000fee2-0000-1000-8000-00805f9b34fb"  // Xiaomi write characteristic
      ];

      let service = null;
      let characteristic = null;

      // Tentar encontrar um serviço válido
      for (const serviceUuid of possibleServices) {
        try {
          service = await device.gatt!.getPrimaryService(serviceUuid);
          setStatus(`Serviço encontrado: ${serviceUuid}`);
          console.log(`Serviço conectado: ${serviceUuid}`);
          break;
        } catch (err) {
          console.log(`Serviço ${serviceUuid} não encontrado:`, err);
        }
      }

      if (!service) {
        setStatus('Nenhum serviço compatível encontrado');
        setIsReading(false);
        return;
      }

      // Tentar encontrar uma característica válida
      for (const charUuid of possibleCharacteristics) {
        try {
          characteristic = await service.getCharacteristic(charUuid);
          setStatus(`Característica encontrada: ${charUuid}`);
          console.log(`Característica conectada: ${charUuid}`);
          break;
        } catch (err) {
          console.log(`Característica ${charUuid} não encontrada:`, err);
        }
      }

      if (!characteristic) {
        setStatus('Nenhuma característica compatível encontrada');
        setIsReading(false);
        return;
      }

      setStatus('Aguardando dados da balança...');

      const handleWeightData = (event: any) => {
        console.log('=== EVENTO DE DADOS RECEBIDO ===');
        const value = event.target.value as DataView;
        
        if (!value) {
          console.log('Nenhum valor recebido');
          return;
        }
        
        console.log('Bytes recebidos:', value.byteLength);
        console.log('Dados hex:', Array.from(new Uint8Array(value.buffer)).map(b => b.toString(16).padStart(2, '0')).join(' '));
        console.log('Dados decimais:', Array.from(new Uint8Array(value.buffer)));
        
        if (value.byteLength < 4) {
          console.log('Dados insuficientes recebidos - mínimo 4 bytes necessários');
          return;
        }
        
        // Verificar flags de estabilização - Mi Scale 2 usa byte específico para indicar dados estáveis
        const statusByte = value.getUint8(0);
        const hasBodyComposition = value.byteLength >= 13;
        
        // Para Mi Scale 2, verificar se é uma medição estabilizada
        // Status byte indica diferentes estados da medição
        const isStabilized = hasBodyComposition ? 
          (statusByte === 0x02 || statusByte === 0x22) : // Dados finais com composição corporal
          (statusByte === 0x03 || statusByte === 0x23);   // Dados finais apenas peso
        
        if (!isStabilized) {
          console.log('Dados temporários detectados (não estabilizados), byte status:', statusByte.toString(16));
          setStatus('Aguardando estabilização da medição...');
          return;
        }
        
        console.log('Medição estabilizada detectada, byte status:', statusByte.toString(16));
        
        // Tentar diferentes formatos de interpretação dos dados
        let weight = 0;
        let isValid = false;

        // Formato principal: Mi Scale 2 armazena peso nos bytes 11-12
        if (hasBodyComposition) {
          try {
            const rawWeight = value.getUint16(11, true);
            weight = rawWeight / 200.0;
            if (weight >= 5 && weight <= 300) {
              isValid = true;
              console.log('Formato Mi Scale 2 (bytes 11-12):', weight);
            }
          } catch (e) {
            console.log('Formato Mi Scale 2 falhou:', e);
          }
        }

        // Formato alternativo: bytes 1-2 (Mi Scale padrão/older models)
        if (!isValid) {
          try {
            const rawWeight1 = value.getUint16(1, true);
            weight = rawWeight1 / 200.0;
            if (weight >= 5 && weight <= 300) {
              isValid = true;
              console.log('Formato Mi Scale padrão (bytes 1-2):', weight);
            }
          } catch (e) {
            console.log('Formato padrão falhou:', e);
          }
        }

        // Formato secundário: bytes 0-1 
        if (!isValid) {
          try {
            const rawWeight2 = value.getUint16(0, true);
            weight = rawWeight2 / 200.0;
            if (weight >= 5 && weight <= 300) {
              isValid = true;
              console.log('Formato alternativo (bytes 0-1):', weight);
            }
          } catch (e) {
            console.log('Formato alternativo falhou:', e);
          }
        }

        if (!isValid) {
          console.log('Peso inválido ou fora do range para todos os formatos');
          setStatus('Erro na leitura - tente novamente');
          return;
        }

        console.log('Peso estabilizado capturado:', weight, 'kg');

        const reading: ScaleReading = {
          weight: Math.round(weight * 10) / 10,
          timestamp: new Date()
        };
        
        // Tentar extrair dados de composição corporal se disponível
        if (value.byteLength >= 20) {
          try {
            const impedance = value.getUint16(9, true);
            if (impedance > 0 && impedance < 10000) {
              reading.bodyFat = Math.round((15 + (impedance / 200)) * 10) / 10;
              reading.bodyWater = Math.round((55 - (impedance / 400)) * 10) / 10;
              reading.muscleMass = Math.round((weight * 0.4) * 10) / 10;
              reading.visceralFat = Math.round(impedance / 1000);
              reading.basalMetabolism = Math.round(weight * 24);
              reading.bodyType = "Normal";
            }
          } catch (e) {
            console.log('Erro ao extrair dados de composição:', e);
          }
        }
        
        setLastReading(reading);
        setStatus('Peso capturado com sucesso!');
        setIsReading(false);
        
        characteristic.removeEventListener('characteristicvaluechanged', handleWeightData);
      };
      
      characteristic.addEventListener('characteristicvaluechanged', handleWeightData);
      
      // Verificar se a característica suporta notificações
      console.log('Propriedades da característica:', characteristic.properties);
      
      try {
        await characteristic.startNotifications();
        setStatus('Notificações ativadas. Suba na balança agora!');
        console.log('Notificações Bluetooth ativadas com sucesso');
      } catch (notifyError) {
        console.log('Erro ao ativar notificações:', notifyError);
        setStatus('Aguardando dados... Suba na balança!');
        
        // Tentar ler dados periodicamente se notificações falharem
        const readInterval = setInterval(async () => {
          try {
            if (!isReading) {
              clearInterval(readInterval);
              return;
            }
            const value = characteristic.value;
            if (value) {
              handleWeightData({ target: { value } });
            }
          } catch (readError) {
            console.log('Erro na leitura periódica:', readError);
          }
        }, 1000);
        
        setTimeout(() => clearInterval(readInterval), 60000);
      }
      
      // Timeout após 60 segundos
      setTimeout(() => {
        if (isReading) {
          setStatus('Timeout - tente novamente');
          setIsReading(false);
          try {
            characteristic.removeEventListener('characteristicvaluechanged', handleWeightData);
          } catch (e) {
            console.log('Erro ao remover listener:', e);
          }
        }
      }, 60000);
      
    } catch (error) {
      console.error('Erro ao ler dados:', error);
      setStatus(`Erro: ${error.message || 'Falha na comunicação'}`);
      setIsReading(false);
    }
  }, [device, isReading]);

  const disconnect = useCallback(() => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }
    setDevice(null);
    setIsConnected(false);
    setStatus('Desconectado');
    setLastReading(null);
  }, [device]);

  const clearReading = useCallback(() => {
    setLastReading(null);
    setStatus(isConnected ? `Conectado: ${device?.name || 'Mi Scale 2'}` : 'Desconectado');
  }, [isConnected, device]);

  return {
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
  };
};