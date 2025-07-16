import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

interface SilhuetaProps {
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino';
  imc: number;
  gorduraCorporal?: number;
  className?: string;
}

const BodyModel: React.FC<{
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino';
  imc: number;
  gorduraCorporal?: number;
}> = ({ peso, altura, sexo, imc, gorduraCorporal = 15 }) => {
  const bodyRef = useRef<THREE.Group>(null);
  const [isRotating, setIsRotating] = React.useState(true);

  useFrame((state) => {
    if (bodyRef.current && isRotating) {
      bodyRef.current.rotation.y += 0.005;
    }
  });

  // Calcular proporções baseadas no IMC
  const getBodyProportions = () => {
    const baseScale = altura / 170; // Normalizar para altura média
    const weightFactor = Math.max(0.7, Math.min(1.4, peso / 70)); // Fator de peso
    const imcFactor = Math.max(0.8, Math.min(1.3, imc / 22)); // Fator IMC
    
    return {
      torsoWidth: baseScale * imcFactor * (sexo === 'masculino' ? 1.2 : 1.0),
      torsoDepth: baseScale * imcFactor * 0.8,
      torsoHeight: baseScale * 1.5,
      armWidth: baseScale * imcFactor * 0.4,
      legWidth: baseScale * imcFactor * 0.6,
      headSize: baseScale * 0.8,
      shoulderWidth: baseScale * (sexo === 'masculino' ? 1.6 : 1.3),
      hipWidth: baseScale * (sexo === 'masculino' ? 1.2 : 1.4) * imcFactor,
    };
  };

  const proportions = getBodyProportions();

  // Cor baseada no IMC
  const getBodyColor = () => {
    if (imc < 18.5) return '#3b82f6'; // Azul para abaixo do peso
    if (imc < 25) return '#10b981'; // Verde para normal
    if (imc < 30) return '#f59e0b'; // Amarelo para sobrepeso
    return '#ef4444'; // Vermelho para obesidade
  };

  return (
    <group 
      ref={bodyRef} 
      position={[0, 0, 0]}
      onClick={() => setIsRotating(!isRotating)}
    >
      {/* Cabeça */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[proportions.headSize, 16, 16]} />
        <meshLambertMaterial color="#fdbcb4" />
      </mesh>

      {/* Pescoço */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 8]} />
        <meshLambertMaterial color="#fdbcb4" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[proportions.torsoWidth, proportions.torsoHeight, proportions.torsoDepth]} />
        <meshLambertMaterial color={getBodyColor()} />
      </mesh>

      {/* Braços */}
      <mesh position={[-proportions.shoulderWidth / 2, 0.8, 0]}>
        <cylinderGeometry args={[proportions.armWidth, proportions.armWidth, 1.5, 8]} />
        <meshLambertMaterial color="#fdbcb4" />
      </mesh>
      <mesh position={[proportions.shoulderWidth / 2, 0.8, 0]}>
        <cylinderGeometry args={[proportions.armWidth, proportions.armWidth, 1.5, 8]} />
        <meshLambertMaterial color="#fdbcb4" />
      </mesh>

      {/* Quadris */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[proportions.hipWidth, 0.8, proportions.torsoDepth]} />
        <meshLambertMaterial color={getBodyColor()} />
      </mesh>

      {/* Pernas */}
      <mesh position={[-proportions.hipWidth / 4, -2.2, 0]}>
        <cylinderGeometry args={[proportions.legWidth, proportions.legWidth, 2.5, 8]} />
        <meshLambertMaterial color="#fdbcb4" />
      </mesh>
      <mesh position={[proportions.hipWidth / 4, -2.2, 0]}>
        <cylinderGeometry args={[proportions.legWidth, proportions.legWidth, 2.5, 8]} />
        <meshLambertMaterial color="#fdbcb4" />
      </mesh>

      {/* Pés */}
      <mesh position={[-proportions.hipWidth / 4, -3.6, 0.3]}>
        <boxGeometry args={[0.4, 0.2, 0.8]} />
        <meshLambertMaterial color="#8b5a3c" />
      </mesh>
      <mesh position={[proportions.hipWidth / 4, -3.6, 0.3]}>
        <boxGeometry args={[0.4, 0.2, 0.8]} />
        <meshLambertMaterial color="#8b5a3c" />
      </mesh>

      {/* Texto informativo */}
      <Text
        position={[0, -4.5, 0]}
        fontSize={0.3}
        color="#666"
        anchorX="center"
        anchorY="middle"
      >
        {`${peso.toFixed(1)}kg - IMC: ${imc.toFixed(1)}`}
      </Text>
    </group>
  );
};

export const Silhueta3D: React.FC<SilhuetaProps> = ({
  peso,
  altura,
  sexo,
  imc,
  gorduraCorporal,
  className = ''
}) => {
  const [resetKey, setResetKey] = React.useState(0);

  const getImcCategory = () => {
    if (imc < 18.5) return { texto: 'Abaixo do peso', cor: 'bg-blue-100 text-blue-800' };
    if (imc < 25) return { texto: 'Peso normal', cor: 'bg-green-100 text-green-800' };
    if (imc < 30) return { texto: 'Sobrepeso', cor: 'bg-yellow-100 text-yellow-800' };
    return { texto: 'Obesidade', cor: 'bg-red-100 text-red-800' };
  };

  const categoria = getImcCategory();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-instituto-orange" />
            <span>Silhueta 3D Personalizada</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={categoria.cor}>
              {categoria.texto}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetKey(prev => prev + 1)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Dados do usuário */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-instituto-dark/60">Peso:</span>
              <span className="ml-2 font-medium">{peso.toFixed(1)}kg</span>
            </div>
            <div>
              <span className="text-instituto-dark/60">Altura:</span>
              <span className="ml-2 font-medium">{altura}cm</span>
            </div>
            <div>
              <span className="text-instituto-dark/60">IMC:</span>
              <span className="ml-2 font-medium">{imc.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-instituto-dark/60">Sexo:</span>
              <span className="ml-2 font-medium capitalize">{sexo}</span>
            </div>
          </div>

          {/* Visualização 3D */}
          <div className="h-96 bg-gradient-to-b from-blue-50 to-white rounded-lg overflow-hidden">
            <Canvas 
              key={resetKey}
              camera={{ position: [0, 0, 8], fov: 50 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
              <pointLight position={[-10, -10, -5]} intensity={0.3} />
              
              <BodyModel
                peso={peso}
                altura={altura}
                sexo={sexo}
                imc={imc}
                gorduraCorporal={gorduraCorporal}
              />
              
              <OrbitControls 
                enableZoom={true}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minDistance={4}
                maxDistance={12}
              />
            </Canvas>
          </div>

          {/* Instruções */}
          <div className="text-center text-sm text-instituto-dark/60">
            <p>🖱️ Clique e arraste para rotacionar • 🔄 Scroll para zoom</p>
            <p className="mt-1">💡 Clique na silhueta para pausar/continuar rotação</p>
          </div>

          {/* Legenda de cores */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Abaixo do peso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Peso normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Sobrepeso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Obesidade</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Silhueta3D;