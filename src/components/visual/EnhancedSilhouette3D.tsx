import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Environment, ContactShadows, Float, Sparkles } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, RotateCcw, Play, Pause, Zap, Heart, Activity, 
  Target, TrendingUp, Sparkles as SparklesIcon, 
  Eye, Settings, Maximize, Camera, Download,
  BarChart3, Ruler, Scale, Flame
} from 'lucide-react';
import * as THREE from 'three';

interface EnhancedSilhouetteProps {
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino';
  imc: number;
  gorduraCorporal?: number;
  massaMuscular?: number;
  aguaCorporal?: number;
  className?: string;
}

const AdvancedBodyModel: React.FC<{
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino';
  imc: number;
  gorduraCorporal?: number;
  massaMuscular?: number;
  aguaCorporal?: number;
  animationMode: 'rotate' | 'breath' | 'pulse' | 'static';
  showMetrics: boolean;
  colorMode: 'imc' | 'composition' | 'health';
}> = ({ 
  peso, 
  altura, 
  sexo, 
  imc, 
  gorduraCorporal = 15, 
  massaMuscular = 30,
  aguaCorporal = 60,
  animationMode,
  showMetrics,
  colorMode
}) => {
  const bodyRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  const { viewport } = useThree();

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

  // Calcular proporções avançadas
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

  // Sistema de cores avançado
  const getAdvancedColors = () => {
    switch (colorMode) {
      case 'imc':
        if (imc < 18.5) return { primary: '#3b82f6', secondary: '#93c5fd' };
        if (imc < 25) return { primary: '#10b981', secondary: '#6ee7b7' };
        if (imc < 30) return { primary: '#f59e0b', secondary: '#fbbf24' };
        return { primary: '#ef4444', secondary: '#f87171' };
      
      case 'composition': {
        const muscleRatio = massaMuscular / 40;
        const fatRatio = gorduraCorporal / 25;
        return {
          primary: `hsl(${120 * muscleRatio}, 70%, 50%)`,
          secondary: `hsl(${60 - 60 * fatRatio}, 70%, 60%)`
        };
      }
      
      case 'health': {
        const healthScore = (100 - gorduraCorporal) * (massaMuscular / 35) * (aguaCorporal / 60);
        const hue = Math.min(120, healthScore * 2);
        return {
          primary: `hsl(${hue}, 70%, 50%)`,
          secondary: `hsl(${hue}, 50%, 70%)`
        };
      }
      
      default:
        return { primary: '#3b82f6', secondary: '#93c5fd' };
    }
  };

  const colors = getAdvancedColors();

  return (
    <group ref={bodyRef} position={[0, 0, 0]}>
      {/* Ambiente de partículas */}
      {colorMode === 'health' && (
        <Sparkles 
          count={50} 
          scale={[8, 8, 8]} 
          size={2} 
          speed={0.5} 
          color={colors.primary}
        />
      )}

      {/* Cabeça com detalhes */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[proportions.headSize, 32, 32]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
      </Float>

      {/* Pescoço */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[proportions.neckWidth, proportions.neckWidth * 0.9, 0.7, 16]} />
        <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Torso com gradiente */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[proportions.torsoWidth, proportions.torsoHeight, proportions.torsoDepth]} />
        <meshStandardMaterial 
          color={colors.primary}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Cintura */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[proportions.waistWidth, proportions.torsoWidth * 0.8, 0.4, 16]} />
        <meshStandardMaterial color={colors.secondary} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Braços com articulações */}
      <group position={[-proportions.shoulderWidth / 2, 0.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[proportions.armWidth * 0.6, 16, 16]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[proportions.armWidth, proportions.armWidth * 0.8, 1.4, 16]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
      
      <group position={[proportions.shoulderWidth / 2, 0.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[proportions.armWidth * 0.6, 16, 16]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[proportions.armWidth, proportions.armWidth * 0.8, 1.4, 16]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* Quadris */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[proportions.hipWidth, 0.9, proportions.torsoDepth]} />
        <meshStandardMaterial color={colors.primary} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Pernas com articulações */}
      <group position={[-proportions.hipWidth / 4, -2.2, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[proportions.legWidth * 0.7, 16, 16]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[proportions.legWidth, proportions.legWidth * 0.8, 2.4, 16]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
      
      <group position={[proportions.hipWidth / 4, -2.2, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[proportions.legWidth * 0.7, 16, 16]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[proportions.legWidth, proportions.legWidth * 0.8, 2.4, 16]} />
          <meshStandardMaterial color="#fdbcb4" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* Pés com detalhes */}
      <mesh position={[-proportions.hipWidth / 4, -3.7, 0.4]}>
        <boxGeometry args={[0.5, 0.3, 1.0]} />
        <meshStandardMaterial color="#8b5a3c" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[proportions.hipWidth / 4, -3.7, 0.4]}>
        <boxGeometry args={[0.5, 0.3, 1.0]} />
        <meshStandardMaterial color="#8b5a3c" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Métricas flutuantes */}
      {showMetrics && (
        <>
          <Text
            position={[-2.5, 1.5, 0]}
            fontSize={0.25}
            color="#3b82f6"
            anchorX="left"
            anchorY="middle"
          >
            {`💪 ${massaMuscular.toFixed(1)}% músculos`}
          </Text>
          <Text
            position={[-2.5, 1.0, 0]}
            fontSize={0.25}
            color="#f59e0b"
            anchorX="left"
            anchorY="middle"
          >
            {`🔥 ${gorduraCorporal.toFixed(1)}% gordura`}
          </Text>
          <Text
            position={[-2.5, 0.5, 0]}
            fontSize={0.25}
            color="#06b6d4"
            anchorX="left"
            anchorY="middle"
          >
            {`💧 ${aguaCorporal.toFixed(1)}% água`}
          </Text>
        </>
      )}

      {/* Sombra do corpo */}
      <ContactShadows
        position={[0, -4, 0]}
        scale={6}
        blur={2}
        far={4}
        opacity={0.3}
      />
    </group>
  );
};

const MetricCard: React.FC<{ 
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  description?: string;
}> = ({ icon, title, value, color, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="glass-card p-4 cursor-pointer"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
  </motion.div>
);

export const EnhancedSilhouette3D: React.FC<EnhancedSilhouetteProps> = ({
  peso,
  altura,
  sexo,
  imc,
  gorduraCorporal = 15,
  massaMuscular = 30,
  aguaCorporal = 60,
  className = ''
}) => {
  const [resetKey, setResetKey] = useState(0);
  const [animationMode, setAnimationMode] = useState<'rotate' | 'breath' | 'pulse' | 'static'>('rotate');
  const [showMetrics, setShowMetrics] = useState(true);
  const [colorMode, setColorMode] = useState<'imc' | 'composition' | 'health'>('imc');
  const [activeTab, setActiveTab] = useState('model');

  const healthScore = useMemo(() => {
    const imcScore = imc >= 18.5 && imc <= 24.9 ? 100 : Math.max(0, 100 - Math.abs(imc - 22) * 10);
    const fatScore = Math.max(0, 100 - Math.abs(gorduraCorporal - 15) * 5);
    const muscleScore = Math.min(100, massaMuscular * 2.5);
    const waterScore = Math.max(0, 100 - Math.abs(aguaCorporal - 60) * 2);
    
    return Math.round((imcScore + fatScore + muscleScore + waterScore) / 4);
  }, [imc, gorduraCorporal, massaMuscular, aguaCorporal]);

  const getImcCategory = () => {
    if (imc < 18.5) return { 
      texto: 'Abaixo do peso', 
      cor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: TrendingUp,
      advice: 'Considere aumentar a ingestão calórica saudável'
    };
    if (imc < 25) return { 
      texto: 'Peso ideal', 
      cor: 'bg-green-100 text-green-800 border-green-200',
      icon: Target,
      advice: 'Mantenha seus hábitos saudáveis atuais'
    };
    if (imc < 30) return { 
      texto: 'Sobrepeso', 
      cor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Activity,
      advice: 'Foque em exercícios e alimentação balanceada'
    };
    return { 
      texto: 'Obesidade', 
      cor: 'bg-red-100 text-red-800 border-red-200',
      icon: Heart,
      advice: 'Recomendamos acompanhamento profissional'
    };
  };

  const categoria = getImcCategory();

  const animationButtons = [
    { mode: 'rotate', icon: RotateCcw, label: 'Rotação' },
    { mode: 'breath', icon: Activity, label: 'Respiração' },
    { mode: 'pulse', icon: Heart, label: 'Pulso' },
    { mode: 'static', icon: Pause, label: 'Parado' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com métricas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-health-primary/20 to-health-secondary/20">
              <User className="w-6 h-6 text-health-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold gradient-text">Avatar 3D Interativo</h3>
              <p className="text-sm text-muted-foreground">Visualização avançada da composição corporal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${categoria.cor} text-sm px-3 py-1`}>
              <categoria.icon className="w-4 h-4 mr-1" />
              {categoria.texto}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Score: {healthScore}%
            </Badge>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Scale className="w-5 h-5 text-health-primary" />}
            title="Peso"
            value={`${peso.toFixed(1)}kg`}
            color="bg-health-primary/20"
          />
          <MetricCard
            icon={<Ruler className="w-5 h-5 text-health-secondary" />}
            title="IMC"
            value={imc.toFixed(1)}
            color="bg-health-secondary/20"
          />
          <MetricCard
            icon={<Flame className="w-5 h-5 text-health-warning" />}
            title="Gordura"
            value={`${gorduraCorporal.toFixed(1)}%`}
            color="bg-health-warning/20"
          />
          <MetricCard
            icon={<Zap className="w-5 h-5 text-health-success" />}
            title="Músculo"
            value={`${massaMuscular.toFixed(1)}%`}
            color="bg-health-success/20"
          />
        </div>
      </motion.div>

      {/* Tabs de visualização */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-card">
          <TabsTrigger value="model">Modelo 3D</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="model" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6"
          >
            {/* Controles de animação */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {animationButtons.map((button) => (
                  <Button
                    key={button.mode}
                    variant={animationMode === button.mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnimationMode(button.mode as any)}
                    className="px-3"
                  >
                    <button.icon className="w-4 h-4 mr-1" />
                    {button.label}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMetrics(!showMetrics)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Métricas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResetKey(prev => prev + 1)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Visualização 3D */}
            <div className="h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-health-primary/5 to-health-secondary/5">
              <Canvas 
                key={resetKey}
                camera={{ position: [0, 0, 8], fov: 45 }}
                style={{ width: '100%', height: '100%' }}
              >
                                 <Environment preset="studio" />
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} />
                <pointLight position={[0, 5, 0]} intensity={0.5} />
                
                <AdvancedBodyModel
                  peso={peso}
                  altura={altura}
                  sexo={sexo}
                  imc={imc}
                  gorduraCorporal={gorduraCorporal}
                  massaMuscular={massaMuscular}
                  aguaCorporal={aguaCorporal}
                  animationMode={animationMode}
                  showMetrics={showMetrics}
                  colorMode={colorMode}
                />
                
                <OrbitControls 
                  enableZoom={true}
                  enablePan={false}
                  maxPolarAngle={Math.PI / 2}
                  minDistance={4}
                  maxDistance={15}
                  autoRotate={animationMode === 'rotate'}
                  autoRotateSpeed={0.5}
                />
              </Canvas>
            </div>

            {/* Instruções */}
            <div className="mt-4 p-4 rounded-xl bg-health-background/50">
              <div className="text-center text-sm text-muted-foreground">
                <p>🖱️ Clique e arraste para rotacionar • 🔄 Scroll para zoom • ⌨️ Use os controles para animações</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h4 className="text-lg font-bold mb-4">Análise Detalhada</h4>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-health-primary/10">
                <h5 className="font-semibold mb-2">Recomendação Personalizada</h5>
                <p className="text-sm text-muted-foreground">{categoria.advice}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-health-success/10">
                  <h5 className="font-semibold mb-2">Pontos Fortes</h5>
                  <ul className="text-sm space-y-1">
                    {massaMuscular > 25 && <li>• Boa massa muscular</li>}
                    {aguaCorporal > 55 && <li>• Hidratação adequada</li>}
                    {imc >= 18.5 && imc <= 24.9 && <li>• IMC ideal</li>}
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl bg-health-warning/10">
                  <h5 className="font-semibold mb-2">Áreas de Melhoria</h5>
                  <ul className="text-sm space-y-1">
                    {gorduraCorporal > 20 && <li>• Reduzir gordura corporal</li>}
                    {massaMuscular < 25 && <li>• Aumentar massa muscular</li>}
                    {aguaCorporal < 55 && <li>• Melhorar hidratação</li>}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h4 className="text-lg font-bold mb-4">Configurações de Visualização</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Modo de Cores</label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={colorMode === 'imc' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setColorMode('imc')}
                  >
                    IMC
                  </Button>
                  <Button
                    variant={colorMode === 'composition' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setColorMode('composition')}
                  >
                    Composição
                  </Button>
                  <Button
                    variant={colorMode === 'health' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setColorMode('health')}
                  >
                    Saúde
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Altura:</span>
                  <span className="ml-2 font-medium">{altura}cm</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sexo:</span>
                  <span className="ml-2 font-medium capitalize">{sexo}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSilhouette3D; 