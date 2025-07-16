import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  Bluetooth, 
  Scan, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface MiScalePairingButtonProps {
  onDeviceFound?: (device: any) => void;
  onConnected?: (device: any) => void;
  className?: string;
}

export const MiScalePairingButton: React.FC<MiScalePairingButtonProps> = ({
  onDeviceFound,
  onConnected,
  className = ""
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [foundDevice, setFoundDevice] = useState<any>(null);
  const { toast } = useToast();

  const startPairing = async () => {
    // Verificar se o Bluetooth está disponível
    if (!('bluetooth' in navigator)) {
      toast({
        title: "Bluetooth não suportado",
        description: "Seu navegador não suporta Web Bluetooth API. Use Chrome ou Edge.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    try {
      toast({
        title: "Iniciando pareamento...",
        description: "Certifique-se de que sua balança está ligada e próxima.",
      });

      // Configuração mais ampla para detectar diferentes modelos de balanças
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '0000181d-0000-1000-8000-00805f9b34fb', // Weight Scale Service
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '0000181b-0000-1000-8000-00805f9b34fb', // Body Composition Service
          '00001530-1212-efde-1523-785feabcd123', // Mi Fitness Service
          'a22116c4-b1b4-4e40-8c71-c1e3e5b0b2b3', // Custom Mi Scale Service
        ]
      });

      if (device) {
        setFoundDevice(device);
        onDeviceFound?.(device);
        
        toast({
          title: "Balança encontrada!",
          description: `${device.name || 'Mi Body Composition Scale'} detectada. Conectando...`,
        });

        // Conectar automaticamente após encontrar
        await connectToDevice(device);
      }
    } catch (error: any) {
      console.error('Erro no pareamento:', error);
      
      if (error.name === 'NotFoundError') {
        toast({
          title: "Nenhuma balança encontrada",
          description: "Certifique-se de que sua balança está ligada e em modo de pareamento.",
          variant: "destructive",
        });
      } else if (error.name === 'SecurityError') {
        toast({
          title: "Permissão negada",
          description: "É necessário permitir o acesso ao Bluetooth para continuar.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro no pareamento",
          description: "Não foi possível conectar com a balança. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: any) => {
    setIsConnecting(true);
    
    try {
      // Conectar ao servidor GATT
      const server = await device.gatt?.connect();
      
      if (!server) {
        throw new Error('Não foi possível conectar ao servidor GATT');
      }

      console.log('Conectado ao GATT server:', device.name);
      console.log('Device ID:', device.id);

      // Configurar listeners para desconexão
      device.addEventListener('gattserverdisconnected', () => {
        console.log('Dispositivo desconectado');
        toast({
          title: "Balança desconectada",
          description: "A conexão com a balança foi perdida.",
          variant: "destructive",
        });
        setFoundDevice(null);
      });

      // Tentar descobrir serviços disponíveis
      try {
        const services = await server.getPrimaryServices();
        console.log('Serviços encontrados:', services.map(s => s.uuid));
        
        // Procurar pelo serviço de peso
        for (const service of services) {
          try {
            const characteristics = await service.getCharacteristics();
            console.log(`Serviço ${service.uuid} tem características:`, characteristics.map(c => c.uuid));
          } catch (err) {
            console.log(`Erro ao ler características do serviço ${service.uuid}:`, err);
          }
        }
      } catch (err) {
        console.log('Erro ao descobrir serviços:', err);
      }

      onConnected?.(device);
      
      toast({
        title: "Pareamento concluído!",
        description: `Conectado com sucesso à ${device.name || 'Mi Body Composition Scale'}. Pronto para uso!`,
      });

    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível estabelecer conexão com a balança.",
        variant: "destructive",
      });
      setFoundDevice(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const getButtonContent = () => {
    if (isScanning) {
      return (
        <>
          <Scan className="h-5 w-5 mr-2 animate-spin" />
          Procurando Balança...
        </>
      );
    }
    
    if (isConnecting) {
      return (
        <>
          <Bluetooth className="h-5 w-5 mr-2 animate-pulse" />
          Conectando...
        </>
      );
    }
    
    if (foundDevice) {
      return (
        <>
          <CheckCircle className="h-5 w-5 mr-2" />
          Conectado - {foundDevice.name || 'Mi Scale'}
        </>
      );
    }
    
    return (
      <>
        <Activity className="h-5 w-5 mr-2" />
        Parear Balança
      </>
    );
  };

  const getButtonVariant = (): "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" => {
    return "default";
  };

  const getButtonClassName = () => {
    const baseClass = "text-white px-8 py-3 text-lg font-semibold transition-all duration-300";
    
    if (foundDevice) {
      return `${baseClass} bg-instituto-green hover:bg-instituto-green/80 ${className}`;
    }
    
    if (isScanning || isConnecting) {
      return `${baseClass} bg-instituto-purple hover:bg-instituto-purple/80 ${className}`;
    }
    
    return `${baseClass} bg-instituto-orange hover:bg-instituto-orange/80 pulse-glow ${className}`;
  };

  return (
    <Button 
      size="lg"
      variant={getButtonVariant()}
      className={getButtonClassName()}
      onClick={startPairing}
      disabled={isScanning || isConnecting}
    >
      {getButtonContent()}
    </Button>
  );
};