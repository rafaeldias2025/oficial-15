import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows,
  Html,
  Stage
} from '@react-three/drei';
import * as THREE from 'three';

/**
 * Componente do modelo glTF da silhueta
 * Carrega o modelo de /src/models/silhueta.glb e aplica materiais dinâmicos
 */
interface SilhuetaGLTFProps {
  color: string;
  autoRotate: boolean;
}

const SilhuetaGLTF: React.FC<SilhuetaGLTFProps> = ({ color, autoRotate }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Carregar o modelo glTF
  const { scene } = useGLTF('/models/silhueta.glb');
  
  // Clone da cena para evitar conflitos de materiais
  const clonedScene = scene.clone();

  // Aplicar cor dinâmica ao material
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          // Material múltiplo
          child.material.forEach(mat => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.color.set(color);
              mat.roughness = 0.4;
              mat.metalness = 0.2;
              mat.emissive.set(color);
              mat.emissiveIntensity = 0.1;
            }
          });
        } else if (child.material instanceof THREE.MeshStandardMaterial) {
          // Material único
          child.material.color.set(color);
          child.material.roughness = 0.4;
          child.material.metalness = 0.2;
          child.material.emissive.set(color);
          child.material.emissiveIntensity = 0.1;
        }
      }
    });
  }, [color, clonedScene]);

  // Animação de rotação automática contínua
  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      // Rotação suave em torno do eixo Y
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 0]}>
      <primitive object={clonedScene} scale={1.5} />
    </group>
  );
};

/**
 * Componente de Loading personalizado
 */
const LoadingComponent: React.FC = () => (
  <Html center>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #f97316',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '10px'
      }} />
      <p style={{ margin: 0, color: '#666' }}>Carregando modelo 3D...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </Html>
);

/**
 * Componente principal App
 * Demonstra o uso completo da silhueta 3D com controles
 */
const App: React.FC = () => {
  // Estado para cor do material (controle dinâmico)
  const [materialColor, setMaterialColor] = useState('#f97316');
  
  // Estado para rotação automática
  const [autoRotate, setAutoRotate] = useState(true);

  // Paleta de cores predefinidas
  const colorPalette = [
    { name: 'Laranja', value: '#f97316' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Vermelho', value: '#ef4444' }
  ];

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Painel de Controles */}
      <div style={{
        width: '300px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#1f2937' 
          }}>
            Silhueta 3D
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#6b7280', 
            fontSize: '14px' 
          }}>
            Demonstração com React + TypeScript + Three.js
          </p>
        </div>

        {/* Controle de Rotação */}
        <div>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#374151'
          }}>
            Animação
          </h3>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              padding: '8px 16px',
              backgroundColor: autoRotate ? '#f97316' : '#e5e7eb',
              color: autoRotate ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {autoRotate ? '⏸️ Pausar Rotação' : '▶️ Iniciar Rotação'}
          </button>
        </div>

        {/* Seletor de Cores */}
        <div>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#374151'
          }}>
            Cor do Material
          </h3>
          
          {/* Paleta de cores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '15px'
          }}>
            {colorPalette.map((color) => (
              <button
                key={color.value}
                onClick={() => setMaterialColor(color.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: materialColor === color.value ? color.value : 'white',
                  color: materialColor === color.value ? 'white' : '#374151',
                  border: `2px solid ${color.value}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: color.value,
                  borderRadius: '50%',
                  border: '1px solid rgba(0,0,0,0.1)'
                }} />
                {color.name}
              </button>
            ))}
          </div>

          {/* Seletor de cor personalizada */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontSize: '12px', 
              fontWeight: '500',
              color: '#6b7280'
            }}>
              Cor Personalizada:
            </label>
            <input
              type="color"
              value={materialColor}
              onChange={(e) => setMaterialColor(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        {/* Informações */}
        <div style={{
          padding: '15px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#0c4a6e'
          }}>
            Funcionalidades:
          </h4>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '16px', 
            fontSize: '12px',
            color: '#0f172a'
          }}>
            <li>✅ Carregamento de modelo glTF</li>
            <li>✅ Rotação automática contínua</li>
            <li>✅ Troca dinâmica de cores</li>
            <li>✅ Zoom e controles de órbita</li>
            <li>✅ Iluminação realista</li>
            <li>✅ Loading state</li>
          </ul>
        </div>
      </div>

      {/* Visualizador 3D */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          shadows
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {/* Configuração de iluminação */}
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
          <Suspense fallback={<LoadingComponent />}>
            <Stage environment="city" intensity={0.6}>
              <SilhuetaGLTF 
                color={materialColor}
                autoRotate={autoRotate}
              />
            </Stage>
          </Suspense>

          {/* OrbitControls: zoom habilitado, pan restrito */}
          <OrbitControls
            enableZoom={true}          // Habilita zoom
            enablePan={false}          // Restringe pan
            enableRotate={true}        // Permite rotação manual
            maxDistance={15}           // Limite máximo de zoom out
            minDistance={3}            // Limite mínimo de zoom in
            maxPolarAngle={Math.PI / 2} // Restringe rotação vertical
          />

          {/* Ambiente e sombras */}
          <Environment preset="studio" />
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
          />
        </Canvas>

        {/* Overlay com informações da cor atual */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Cor Atual: <span style={{ color: materialColor }}>{materialColor}</span>
        </div>

        {/* Instruções de uso */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          fontSize: '12px',
          maxWidth: '300px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <strong>Controles da Câmera:</strong><br />
          • Clique e arraste para rotacionar<br />
          • Scroll para zoom in/out<br />
          • Rotação automática ativa
        </div>
      </div>
    </div>
  );
};

// Preload do modelo para melhor performance
useGLTF.preload('/models/silhueta.glb');

export default App;
