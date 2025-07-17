import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Sparkles, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target,
  Info,
  RotateCcw,
  Play,
  Pause,
  Settings,
  Monitor
} from 'lucide-react';
import * as THREE from 'three';
import { ModernSilhueta3D } from './ModernSilhueta3D';

interface SilhuetaUsuario3DProps {
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino';
  imc: number;
  gorduraCorporal?: number;
  massaMuscular?: number;
  aguaCorporal?: number;
  idadeMetabolica?: number;
  idadeCronologica?: number;
  taxaMetabolicaBasal?: number;
  gorduraVisceral?: number;
  className?: string;
}

// Componente 3D da silhueta
const SilhuetaBody3D: React.FC<{
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino';
  imc: number;
  gorduraCorporal: number;
  massaMuscular: number;
  idadeMetabolica: number;
  taxaMetabolicaBasal: number;
  animationMode: 'rotate' | 'breath' | 'pulse' | 'static';
  showMetrics: boolean;
  colorMode: 'health' | 'composition' | 'metabolic';
}> = ({ 
  peso, 
  altura, 
  sexo, 
  imc, 
  gorduraCorporal, 
  massaMuscular,
  idadeMetabolica,
  taxaMetabolicaBasal,
  animationMode,
  showMetrics,
  colorMode
}) => {
  const bodyRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((state) => {
    setTime(state.clock.getElapsedTime());
    
    if (bodyRef.current) {
      switch (animationMode) {
        case 'rotate':
          bodyRef.current.rotation.y += 0.008;
          break;
        case 'breath': {
          const breathScale = 1 + Math.sin(time * 2) * 0.03;
          bodyRef.current.scale.setScalar(breathScale);
          break;
        }
        case 'pulse': {
          const pulseScale = 1 + Math.sin(time * 4) * 0.05;
          bodyRef.current.scale.setScalar(pulseScale);
          break;
        }
        case 'static':
          break;
      }
    }
  });

  // Calcular proporções baseadas nos dados de saúde
  const getAdvancedProportions = () => {
    const baseScale = altura / 170;
    const weightFactor = Math.max(0.6, Math.min(1.6, peso / 70));
    const imcFactor = Math.max(0.7, Math.min(1.4, imc / 22));
    const muscleFactor = Math.max(0.8, Math.min(1.3, massaMuscular / 30));
    const fatFactor = Math.max(0.8, Math.min(1.4, gorduraCorporal / 15));
    
    return {
      torsoWidth: baseScale * imcFactor * (sexo === 'masculino' ? 1.3 : 1.0),
      torsoDepth: baseScale * fatFactor * 0.9,
      torsoHeight: baseScale * 1.6,
      armWidth: baseScale * muscleFactor * 0.45,
      legWidth: baseScale * muscleFactor * 0.65,
      headSize: baseScale * 0.75,
      shoulderWidth: baseScale * (sexo === 'masculino' ? 1.7 : 1.3) * muscleFactor,
      hipWidth: baseScale * (sexo === 'masculino' ? 1.1 : 1.5) * fatFactor,
      neckWidth: baseScale * 0.35,
      waistWidth: baseScale * imcFactor * (sexo === 'masculino' ? 1.0 : 0.9),
    };
  };

  const proportions = getAdvancedProportions();

  // Sistema de cores baseado no modo selecionado
  const getAdvancedColors = () => {
    switch (colorMode) {
      case 'health': {
        const healthScore = (100 - gorduraCorporal) * (massaMuscular / 35);
        const hue = Math.min(120, healthScore * 2);
        return {
          primary: `hsl(${hue}, 70%, 50%)`,
          secondary: `hsl(${hue}, 50%, 70%)`,
          accent: `hsl(${hue + 30}, 80%, 60%)`
        };
      }
      
      case 'composition': {
        const muscleRatio = massaMuscular / 40;
        const fatRatio = gorduraCorporal / 25;
        return {
          primary: `hsl(${120 * muscleRatio}, 70%, 50%)`,
          secondary: `hsl(${60 - 60 * fatRatio}, 70%, 60%)`,
          accent: `hsl(${180}, 60%, 50%)`
        };
      }
      
      case 'metabolic': {
        // Cor baseada na idade metabólica vs cronológica
        const metabolicRatio = idadeMetabolica / 30; // Assuming 30 as baseline
        const hue = Math.max(0, 120 - (metabolicRatio - 1) * 60);
        return {
          primary: `hsl(${hue}, 80%, 55%)`,
          secondary: `hsl(${hue + 20}, 70%, 65%)`,
          accent: `hsl(${hue - 20}, 90%, 60%)`
        };
      }
      
      default:
        return { 
          primary: '#3b82f6', 
          secondary: '#93c5fd',
          accent: '#1d4ed8'
        };
    }
  };

  const colors = getAdvancedColors();

  return (
    <group ref={bodyRef} position={[0, 0, 0]}>
      {/* Ambiente de partículas para efeito metabólico */}
      <Sparkles 
        count={20} 
        scale={[4, 4, 4]} 
        size={2} 
        speed={0.3}
        opacity={0.4}
        color={colors.accent}
      />

      {/* Cabeça */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[proportions.headSize, 16, 16]} />
        <meshStandardMaterial 
          color={colors.primary} 
          roughness={0.3} 
          metalness={0.1}
          emissive={colors.accent}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Pescoço */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[proportions.neckWidth, proportions.neckWidth, 0.4, 8]} />
        <meshStandardMaterial color={colors.primary} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Torso com highlight metabólico */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[proportions.torsoWidth, proportions.torsoHeight, proportions.torsoDepth]} />
        <meshStandardMaterial 
          color={colors.primary} 
          roughness={0.2} 
          metalness={0.2}
          emissive={colorMode === 'metabolic' ? colors.accent : '#000000'}
          emissiveIntensity={colorMode === 'metabolic' ? 0.2 : 0}
        />
      </mesh>

      {/* Ombros */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[proportions.shoulderWidth, 0.4, 0.6]} />
        <meshStandardMaterial color={colors.secondary} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Braços */}
      <mesh position={[-proportions.shoulderWidth / 2 - 0.3, 0.5, 0]}>
        <cylinderGeometry args={[proportions.armWidth, proportions.armWidth, 1.8, 8]} />
        <meshStandardMaterial color={colors.primary} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[proportions.shoulderWidth / 2 + 0.3, 0.5, 0]}>
        <cylinderGeometry args={[proportions.armWidth, proportions.armWidth, 1.8, 8]} />
        <meshStandardMaterial color={colors.primary} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Cintura (área metabólica destacada) */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[proportions.waistWidth, 0.6, proportions.torsoDepth * 0.9]} />
        <meshStandardMaterial 
          color={colors.secondary} 
          roughness={0.3} 
          metalness={0.2}
          emissive={colorMode === 'metabolic' ? colors.accent : '#000000'}
          emissiveIntensity={colorMode === 'metabolic' ? 0.15 : 0}
        />
      </mesh>

      {/* Quadris */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[proportions.hipWidth, 0.8, proportions.torsoDepth]} />
        <meshStandardMaterial color={colors.primary} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Pernas */}
      <mesh position={[-proportions.hipWidth / 4, -3.0, 0]}>
        <cylinderGeometry args={[proportions.legWidth, proportions.legWidth * 0.7, 2.8, 8]} />
        <meshStandardMaterial color={colors.primary} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[proportions.hipWidth / 4, -3.0, 0]}>
        <cylinderGeometry args={[proportions.legWidth, proportions.legWidth * 0.7, 2.8, 8]} />
        <meshStandardMaterial color={colors.primary} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Pés */}
      <mesh position={[-proportions.hipWidth / 4, -4.5, 0.3]}>
        <boxGeometry args={[0.4, 0.2, 0.8]} />
        <meshStandardMaterial color={colors.secondary} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[proportions.hipWidth / 4, -4.5, 0.3]}>
        <boxGeometry args={[0.4, 0.2, 0.8]} />
        <meshStandardMaterial color={colors.secondary} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Métricas flutuantes */}
      {showMetrics && (
        <>
          {/* Idade Metabólica */}
          <Text
            position={[-3, 2, 0]}
            fontSize={0.3}
            color={colors.accent}
            anchorX="left"
            anchorY="middle"
          >
            {`🧬 Idade Metabólica: ${idadeMetabolica} anos`}
          </Text>
          
          {/* Taxa Metabólica */}
          <Text
            position={[-3, 1.5, 0]}
            fontSize={0.25}
            color={colors.primary}
            anchorX="left"
            anchorY="middle"
          >
            {`🔥 TMB: ${taxaMetabolicaBasal} kcal/dia`}
          </Text>
          
          {/* Composição */}
          <Text
            position={[-3, 1.0, 0]}
            fontSize={0.25}
            color={colors.secondary}
            anchorX="left"
            anchorY="middle"
          >
            {`💪 ${massaMuscular.toFixed(1)}% músculos`}
          </Text>
          
          <Text
            position={[-3, 0.5, 0]}
            fontSize={0.25}
            color="#f59e0b"
            anchorX="left"
            anchorY="middle"
          >
            {`🔥 ${gorduraCorporal.toFixed(1)}% gordura`}
          </Text>

          {/* IMC */}
          <Text
            position={[-3, 0, 0]}
            fontSize={0.25}
            color="#6366f1"
            anchorX="left"
            anchorY="middle"
          >
            {`📊 IMC: ${imc.toFixed(1)}`}
          </Text>
        </>
      )}

      {/* Indicador de batimentos cardíacos (animado) */}
      {animationMode === 'pulse' && (
        <mesh position={[1.5, 0.5, 0]}>
          <sphereGeometry args={[0.1 + Math.sin(time * 8) * 0.05, 8, 8]} />
          <meshStandardMaterial 
            color="#ef4444" 
            emissive="#ef4444"
            emissiveIntensity={0.5 + Math.sin(time * 8) * 0.3}
          />
        </mesh>
      )}
    </group>
  );
};

export const SilhuetaUsuario3D: React.FC<SilhuetaUsuario3DProps> = ({
  peso,
  altura,
  sexo,
  imc,
  gorduraCorporal = 15,
  massaMuscular = 30,
  aguaCorporal = 60,
  idadeMetabolica = 25,
  idadeCronologica = 30,
  taxaMetabolicaBasal = 1800,
  gorduraVisceral = 8,
  className = ''
}) => {
  const [animationMode, setAnimationMode] = useState<'rotate' | 'breath' | 'pulse' | 'static'>('rotate');
  const [showMetrics, setShowMetrics] = useState(true);
  const [colorMode, setColorMode] = useState<'health' | 'composition' | 'metabolic'>('metabolic');
  const [activeTab, setActiveTab] = useState('modern');
  const [hasError, setHasError] = useState(false);

  // Error boundary para capturar erros 3D
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('WebGL') || event.message?.includes('three')) {
        console.warn('3D Error detected:', event.message);
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Calcular score de saúde
  const healthScore = useMemo(() => {
    const imcScore = imc >= 18.5 && imc <= 24.9 ? 100 : Math.max(0, 100 - Math.abs(imc - 22) * 10);
    const fatScore = Math.max(0, 100 - Math.abs(gorduraCorporal - 15) * 5);
    const muscleScore = Math.min(100, massaMuscular * 2.5);
    const waterScore = Math.max(0, 100 - Math.abs(aguaCorporal - 60) * 2);
    const metabolicScore = Math.max(0, 100 - Math.abs(idadeMetabolica - idadeCronologica) * 5);
    
    return Math.round((imcScore + fatScore + muscleScore + waterScore + metabolicScore) / 5);
  }, [imc, gorduraCorporal, massaMuscular, aguaCorporal, idadeMetabolica, idadeCronologica]);

  // Diferença entre idade metabólica e cronológica
  const idadeDiff = idadeMetabolica - idadeCronologica;
  const isMetabolicHealthy = idadeDiff <= 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com métricas principais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Idade Metabólica Destacada */}
        <Card className="relative overflow-hidden border-2 border-instituto-orange/30 bg-gradient-to-br from-instituto-orange/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-instituto-orange" />
              <Badge variant={isMetabolicHealthy ? "default" : "destructive"}>
                {isMetabolicHealthy ? "Saudável" : "Atenção"}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-instituto-orange">
              {idadeMetabolica} anos
            </div>
            <div className="text-sm text-muted-foreground">
              Idade Metabólica
            </div>
            <div className="flex items-center gap-1 mt-2">
              {isMetabolicHealthy ? (
                <TrendingDown className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs ${isMetabolicHealthy ? 'text-green-500' : 'text-red-500'}`}>
                {idadeDiff > 0 ? `+${idadeDiff}` : idadeDiff} anos vs cronológica
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Taxa Metabólica */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {taxaMetabolicaBasal}
            </div>
            <div className="text-sm text-muted-foreground">
              TMB (kcal/dia)
            </div>
          </CardContent>
        </Card>

        {/* Score de Saúde */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <Badge variant={healthScore >= 80 ? "default" : healthScore >= 60 ? "secondary" : "destructive"}>
                {healthScore >= 80 ? "Ótimo" : healthScore >= 60 ? "Bom" : "Melhorar"}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-red-500">
              {healthScore}%
            </div>
            <div className="text-sm text-muted-foreground">
              Score Geral
            </div>
          </CardContent>
        </Card>

        {/* IMC */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-500">
              {imc.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              IMC
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Silhueta 3D e Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Silhueta Inteligente 3D</span>
            <div className="flex gap-2">
              <Button
                variant={animationMode === 'static' ? "default" : "outline"}
                size="sm"
                onClick={() => setAnimationMode(animationMode === 'static' ? 'rotate' : 'static')}
              >
                {animationMode === 'static' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetrics(!showMetrics)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="modern">Moderno</TabsTrigger>
              <TabsTrigger value="model">Modelo 3D</TabsTrigger>
              <TabsTrigger value="analysis">Análise</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="modern" className="space-y-4">
              <ModernSilhueta3D
                className="w-full"
                initialColor={colorMode === 'metabolic' ? '#8b5cf6' : '#f97316'}
                showControls={true}
                showMetrics={showMetrics}
                userData={{
                  peso,
                  altura,
                  imc,
                  gorduraCorporal,
                  massaMuscular,
                  idadeMetabolica
                }}
              />
            </TabsContent>

            <TabsContent value="model" className="space-y-4">
              {/* Canvas 3D com fallback */}
              {!hasError ? (
                <div className="h-[500px] w-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden canvas-3d-container">
                  <Canvas
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    style={{ background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)' }}
                    onCreated={({ gl }) => {
                      gl.setClearColor('#f8fafc');
                    }}
                    fallback={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instituto-orange mx-auto mb-4"></div>
                          <p className="text-gray-600">Carregando visualização 3D...</p>
                        </div>
                      </div>
                    }
                  >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={0.8} />
                    <pointLight position={[-10, -10, -5]} intensity={0.3} />
                    
                    <React.Suspense fallback={null}>
                      <SilhuetaBody3D
                        peso={peso}
                        altura={altura}
                        sexo={sexo}
                        imc={imc}
                        gorduraCorporal={gorduraCorporal}
                        massaMuscular={massaMuscular}
                        idadeMetabolica={idadeMetabolica}
                        taxaMetabolicaBasal={taxaMetabolicaBasal}
                        animationMode={animationMode}
                        showMetrics={showMetrics}
                        colorMode={colorMode}
                      />
                      <Environment preset="studio" />
                    </React.Suspense>
                    
                    <OrbitControls 
                      enableZoom={true}
                      enablePan={false}
                      maxPolarAngle={Math.PI / 2}
                      minDistance={4}
                      maxDistance={12}
                    />
                  </Canvas>
                </div>
              ) : (
                // Fallback 2D quando 3D falha
                <div className="h-[500px] w-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-48 h-96 mx-auto bg-gradient-to-b from-instituto-orange/20 to-instituto-orange/40 rounded-full relative">
                      {/* Silhueta 2D simplificada */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-instituto-orange/60 rounded-full"></div>
                      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-32 bg-instituto-orange/50 rounded-lg"></div>
                      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-instituto-orange/40 rounded-lg"></div>
                      <div className="absolute bottom-4 left-1/3 transform -translate-x-1/2 w-6 h-16 bg-instituto-orange/50 rounded-lg"></div>
                      <div className="absolute bottom-4 right-1/3 transform translate-x-1/2 w-6 h-16 bg-instituto-orange/50 rounded-lg"></div>
                      
                      {/* Métricas overlay */}
                      <div className="absolute -right-24 top-8 text-sm space-y-2">
                        <div className="bg-white/90 p-2 rounded shadow">
                          <span className="font-bold text-instituto-orange">{idadeMetabolica}</span> anos
                        </div>
                        <div className="bg-white/90 p-2 rounded shadow">
                          <span className="font-bold text-blue-500">{taxaMetabolicaBasal}</span> kcal
                        </div>
                        <div className="bg-white/90 p-2 rounded shadow">
                          <span className="font-bold text-green-500">{massaMuscular.toFixed(1)}</span>% músc.
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">Visualização 2D (WebGL não disponível)</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setHasError(false)}
                      className="mt-2"
                    >
                      Tentar 3D novamente
                    </Button>
                  </div>
                </div>
              )}

              {/* Controles de Animação */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { mode: 'rotate', icon: RotateCcw, label: 'Rotação' },
                  { mode: 'breath', icon: Activity, label: 'Respiração' },
                  { mode: 'pulse', icon: Heart, label: 'Pulso' },
                  { mode: 'static', icon: Pause, label: 'Parado' }
                ].map(({ mode, icon: Icon, label }) => (
                  <Button
                    key={mode}
                    variant={animationMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnimationMode(mode as any)}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>

              {/* Modos de Cor */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { mode: 'metabolic', label: 'Metabólico', color: 'bg-instituto-orange' },
                  { mode: 'composition', label: 'Composição', color: 'bg-blue-500' },
                  { mode: 'health', label: 'Saúde', color: 'bg-green-500' }
                ].map(({ mode, label, color }) => (
                  <Button
                    key={mode}
                    variant={colorMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setColorMode(mode as any)}
                  >
                    <div className={`w-3 h-3 rounded-full ${color} mr-2`} />
                    {label}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {/* Comparação de Idades */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Comparação de Idades</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Idade Cronológica</span>
                      <span className="font-bold">{idadeCronologica} anos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Idade Metabólica</span>
                      <span className={`font-bold ${isMetabolicHealthy ? 'text-green-500' : 'text-red-500'}`}>
                        {idadeMetabolica} anos
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, Math.max(0, (idadeCronologica / idadeMetabolica) * 100))} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {isMetabolicHealthy 
                        ? "Seu metabolismo está funcionando melhor que sua idade!" 
                        : "Há espaço para melhorar seu metabolismo"}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Composição Corporal</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Gordura Corporal</span>
                        <span>{gorduraCorporal.toFixed(1)}%</span>
                      </div>
                      <Progress value={gorduraCorporal} max={50} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Massa Muscular</span>
                        <span>{massaMuscular.toFixed(1)}%</span>
                      </div>
                      <Progress value={massaMuscular} max={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Água Corporal</span>
                        <span>{aguaCorporal.toFixed(1)}%</span>
                      </div>
                      <Progress value={aguaCorporal} max={80} className="h-2" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Insights e Recomendações */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Insights e Recomendações</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                    <h5 className="font-semibold mb-2 text-green-800">Pontos Fortes</h5>
                    <ul className="text-sm space-y-1 text-green-700">
                      {massaMuscular > 25 && <li>• Boa massa muscular</li>}
                      {aguaCorporal > 55 && <li>• Hidratação adequada</li>}
                      {imc >= 18.5 && imc <= 24.9 && <li>• IMC ideal</li>}
                      {isMetabolicHealthy && <li>• Metabolismo eficiente</li>}
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <h5 className="font-semibold mb-2 text-orange-800">Áreas de Melhoria</h5>
                    <ul className="text-sm space-y-1 text-orange-700">
                      {gorduraCorporal > 20 && <li>• Reduzir gordura corporal</li>}
                      {massaMuscular < 25 && <li>• Aumentar massa muscular</li>}
                      {aguaCorporal < 55 && <li>• Melhorar hidratação</li>}
                      {!isMetabolicHealthy && <li>• Otimizar metabolismo</li>}
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Preferências de Visualização</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showMetrics}
                        onChange={(e) => setShowMetrics(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Mostrar métricas no modelo</span>
                    </label>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Dados Atuais</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Peso:</span>
                      <span>{peso.toFixed(1)}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Altura:</span>
                      <span>{altura}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sexo:</span>
                      <span className="capitalize">{sexo}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SilhuetaUsuario3D;
