import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows,
  Text,
  Html,
  PresentationControls,
  Stage
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  RotateCcw, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut,
  Download,
  Settings,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import * as THREE from 'three';

// Interface para as props do modelo 3D
interface SilhuetaModelProps {
  modelPath: string;
  color: string;
  autoRotate: boolean;
  scale?: number;
  position?: [number, number, number];
  userData?: {
    peso?: number;
    altura?: number;
    imc?: number;
    gorduraCorporal?: number;
    massaMuscular?: number;
    idadeMetabolica?: number;
  };
}

// Interface para as props do componente principal
interface ModernSilhueta3DProps {
  className?: string;
  initialColor?: string;
  showControls?: boolean;
  showMetrics?: boolean;
  userData?: {
    peso?: number;
    altura?: number;
    imc?: number;
    gorduraCorporal?: number;
    massaMuscular?: number;
    idadeMetabolica?: number;
  };
}

// Componente do modelo 3D da silhueta
const SilhuetaModel: React.FC<SilhuetaModelProps> = ({ 
  modelPath, 
  color, 
  autoRotate, 
  scale = 1,
  position = [0, 0, 0],
  userData 
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  
  // Clone da cena para evitar conflitos
  const clonedScene = scene.clone();

  // Aplicar cor ao material
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.color.set(color);
              mat.roughness = 0.4;
              mat.metalness = 0.1;
              mat.emissive.set(color);
              mat.emissiveIntensity = 0.1;
            }
          });
        } else if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.set(color);
          child.material.roughness = 0.4;
          child.material.metalness = 0.1;
          child.material.emissive.set(color);
          child.material.emissiveIntensity = 0.1;
        }
      }
    });
  }, [color, clonedScene]);

  // Animação de rotação automática
  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.01;
    }
    
    // Animação sutil de respiração
    if (meshRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.setScalar(scale + breathe);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <primitive object={clonedScene} scale={scale} />
      
      {/* Métricas flutuantes */}
      {userData && (
        <>
          <Html position={[-2, 1.5, 0]} distanceFactor={8}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border text-xs min-w-[120px]">
              <div className="font-semibold text-orange-600 mb-1">Métricas</div>
              {userData.peso && (
                <div className="flex justify-between">
                  <span>Peso:</span>
                  <span className="font-medium">{userData.peso}kg</span>
                </div>
              )}
              {userData.altura && (
                <div className="flex justify-between">
                  <span>Altura:</span>
                  <span className="font-medium">{userData.altura}cm</span>
                </div>
              )}
              {userData.imc && (
                <div className="flex justify-between">
                  <span>IMC:</span>
                  <span className="font-medium">{userData.imc.toFixed(1)}</span>
                </div>
              )}
            </div>
          </Html>

          <Html position={[2, 1.5, 0]} distanceFactor={8}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border text-xs min-w-[120px]">
              <div className="font-semibold text-blue-600 mb-1">Composição</div>
              {userData.gorduraCorporal && (
                <div className="flex justify-between">
                  <span>Gordura:</span>
                  <span className="font-medium">{userData.gorduraCorporal.toFixed(1)}%</span>
                </div>
              )}
              {userData.massaMuscular && (
                <div className="flex justify-between">
                  <span>Músculo:</span>
                  <span className="font-medium">{userData.massaMuscular.toFixed(1)}%</span>
                </div>
              )}
              {userData.idadeMetabolica && (
                <div className="flex justify-between">
                  <span>Idade Met:</span>
                  <span className="font-medium text-purple-600">{userData.idadeMetabolica} anos</span>
                </div>
              )}
            </div>
          </Html>
        </>
      )}
    </group>
  );
};

// Componente de loading personalizado
const LoadingFallback: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mb-4"></div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">Carregando Silhueta 3D</p>
        <p className="text-sm text-gray-500">Preparando modelo...</p>
      </div>
    </div>
  </Html>
);

// Componente de erro fallback
const ErrorFallback: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
    <div className="text-center p-8">
      <div className="text-6xl mb-4">🏗️</div>
      <h3 className="text-lg font-semibold mb-2">Modelo Indisponível</h3>
      <p className="text-gray-600 mb-4">Não foi possível carregar o modelo 3D</p>
      <div className="space-y-2">
        <Button onClick={onRetry} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
        <p className="text-xs text-gray-500">Verifique sua conexão ou tente mais tarde</p>
      </div>
    </div>
  </div>
);

// Paleta de cores predefinidas com nova identidade visual
const COLOR_PALETTE = [
  { name: 'Instituto', value: '#ee7318', description: 'Laranja Institucional' },
  { name: 'Wellness', value: '#22c55e', description: 'Verde Saúde' },
  { name: 'Mindful', value: '#8b5cf6', description: 'Roxo Mindfulness' },
  { name: 'Ocean', value: '#0ea5e9', description: 'Azul Oceano' },
  { name: 'Energy', value: '#f59e0b', description: 'Amarelo Energia' },
  { name: 'Sunset', value: '#ef4444', description: 'Vermelho Sunset' },
  { name: 'Nature', value: '#16a34a', description: 'Verde Natureza' },
  { name: 'Deep Sea', value: '#0369a1', description: 'Azul Profundo' }
];

// Componente principal da Silhueta 3D Moderna
export const ModernSilhueta3D: React.FC<ModernSilhueta3DProps> = ({
  className = '',
  initialColor = '#ee7318', // Nova cor padrão laranja institucional
  showControls = true,
  showMetrics = true,
  userData = {
    peso: 70,
    altura: 170,
    imc: 24.2,
    gorduraCorporal: 15.5,
    massaMuscular: 42.3,
    idadeMetabolica: 28
  }
}) => {
  // Estados do componente
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Caminho para o modelo
  const modelPath = '/models/silhueta.glb';

  // Função para lidar com erros
  const handleError = () => {
    console.warn('Erro ao carregar modelo 3D');
    setHasError(true);
    setIsLoading(false);
  };

  // Função para tentar novamente
  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
  };

  // Função para download da visualização
  const handleDownload = () => {
    // Implementar captura de screenshot aqui
    console.log('Download da visualização solicitado');
  };

  // Configurações de câmera baseadas no modo de visualização
  const getCameraConfig = () => {
    switch (viewMode) {
      case 'mobile':
        return { position: [0, 0, 6] as [number, number, number], fov: 60 };
      case 'tablet':
        return { position: [0, 0, 8] as [number, number, number], fov: 50 };
      default:
        return { position: [0, 0, 10] as [number, number, number], fov: 45 };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com informações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Silhueta Inteligente 3D
          </h2>
          <p className="text-gray-600">
            Visualização avançada com métricas em tempo real
          </p>
        </div>
        
        {showControls && (
          <div className="flex items-center gap-2">
            {/* Controles de visualização */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { mode: 'desktop', icon: Monitor },
                { mode: 'tablet', icon: Tablet },
                { mode: 'mobile', icon: Smartphone }
              ].map(({ mode, icon: Icon }) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode as any)}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Controles de animação */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            {/* Download */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}
      </motion.div>

      {/* Container principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Visualizador 3D */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="h-[600px] w-full rounded-lg overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
              {!hasError ? (
                <Canvas
                  camera={getCameraConfig()}
                  shadows
                  onError={handleError}
                  onCreated={() => setIsLoading(false)}
                >
                  {/* Iluminação otimizada */}
                  <ambientLight intensity={0.4} />
                  <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={0.8} 
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                  />
                  <pointLight position={[-10, -10, -5]} intensity={0.3} />
                  
                  {/* Suspense para carregamento assíncrono */}
                  <Suspense fallback={<LoadingFallback />}>
                    <Stage environment="city" intensity={0.6}>
                      <SilhuetaModel
                        modelPath={modelPath}
                        color={currentColor}
                        autoRotate={autoRotate}
                        scale={1.2}
                        position={[0, -1, 0]}
                        userData={showMetrics ? userData : undefined}
                      />
                    </Stage>
                  </Suspense>

                  {/* Controles de órbita */}
                  <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    enableRotate={true}
                    maxDistance={15}
                    minDistance={3}
                    maxPolarAngle={Math.PI / 2}
                    autoRotate={autoRotate}
                    autoRotateSpeed={1}
                  />

                  {/* Ambiente e sombras */}
                  <Environment preset="studio" />
                  <ContactShadows 
                    position={[0, -1.5, 0]} 
                    opacity={0.4} 
                    scale={10} 
                    blur={2.5} 
                  />
                </Canvas>
              ) : (
                <ErrorFallback onRetry={handleRetry} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Painel de controles */}
        <div className="space-y-4">
          {/* Paleta de cores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Palette className="w-4 h-4" />
                Cores da Silhueta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PALETTE.map((color) => (
                  <Button
                    key={color.value}
                    variant={currentColor === color.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentColor(color.value)}
                    className="justify-start"
                  >
                    <div 
                      className="w-4 h-4 rounded-full mr-2 border border-gray-200"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </Button>
                ))}
              </div>
              
              {/* Cor personalizada */}
              <div className="pt-2 border-t">
                <label className="block text-xs font-medium mb-1">Cor Personalizada</label>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-full h-8 rounded border border-gray-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Métricas */}
          {showMetrics && userData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Métricas Corporais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Peso</span>
                    <Badge variant="outline">{userData.peso}kg</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Altura</span>
                    <Badge variant="outline">{userData.altura}cm</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">IMC</span>
                    <Badge variant="outline">{userData.imc?.toFixed(1)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Gordura</span>
                    <Badge variant="secondary">{userData.gorduraCorporal?.toFixed(1)}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Músculo</span>
                    <Badge variant="secondary">{userData.massaMuscular?.toFixed(1)}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Idade Metab.</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {userData.idadeMetabolica} anos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Settings className="w-4 h-4" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs">Rotação Automática</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRotate(!autoRotate)}
                >
                  {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs">Métricas Visíveis</span>
                <Badge variant={showMetrics ? "default" : "outline"}>
                  {showMetrics ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              <div className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="w-full"
                >
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Recarregar Modelo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg p-3"
      >
        <div className="flex items-center gap-4">
          <span>Modelo: silhueta.glb</span>
          <span>•</span>
          <span>Cor: {currentColor}</span>
          <span>•</span>
          <span>Modo: {viewMode}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-400' : 'bg-green-400'}`} />
          <span>{hasError ? 'Erro' : 'Ativo'}</span>
        </div>
      </motion.div>
    </div>
  );
};

// Preload do modelo para melhor performance
useGLTF.preload('/models/silhueta.glb');

export default ModernSilhueta3D;
