import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, PerspectiveCamera } from '@react-three/drei';
import { BlockchainBlock3D } from './BlockchainBlock3D';
import { ChainConnector3D } from './ChainConnector3D';
import { blockchainData } from '@/data/blockchainData';
import { BlockModal } from '../BlockModal';

export const Blockchain3DScene: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState(0);
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const cameraRef = useRef();

  const handleBlockClick = (blockId: string, index: number) => {
    setActiveBlock(index);
    setExpandedBlock(blockId);
  };

  // Generate positions for blocks in a chain formation
  const getBlockPosition = (index: number): [number, number, number] => {
    const spacing = 6;
    const x = index * spacing;
    const y = Math.sin(index * 0.5) * 2; // Slight wave pattern
    const z = Math.cos(index * 0.3) * 1; // Subtle depth variation
    return [x, y, z];
  };

  return (
    <>
      <div className="w-full h-screen bg-background">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Camera with smooth controls */}
          <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 8]} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />

          {/* Lighting Setup */}
          <ambientLight intensity={0.2} color="#1a1a2e" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#00ff88" />
          <pointLight position={[-10, 0, 10]} intensity={0.3} color="#0066ff" />

          {/* Environment and Background */}
          <Environment preset="night" />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          {/* Blockchain Blocks */}
          {blockchainData.map((block, index) => (
            <BlockchainBlock3D
              key={block.id}
              block={block}
              position={getBlockPosition(index)}
              isActive={activeBlock === index}
              onClick={() => handleBlockClick(block.id, index)}
            />
          ))}

          {/* Chain Connectors */}
          {blockchainData.slice(0, -1).map((block, index) => (
            <ChainConnector3D
              key={`connector-${index}`}
              startPosition={getBlockPosition(index)}
              endPosition={getBlockPosition(index + 1)}
              isActive={activeBlock >= index}
            />
          ))}

          {/* Floating Hash Particles */}
          <HashParticles />
        </Canvas>
      </div>

      {/* Block Details Modal */}
      {expandedBlock && (
        <BlockModal
          block={blockchainData.find(b => b.id === expandedBlock)!}
          onClose={() => setExpandedBlock(null)}
        />
      )}

      {/* Navigation UI */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
        {blockchainData.map((block, index) => (
          <button
            key={block.id}
            onClick={() => setActiveBlock(index)}
            className={`w-3 h-3 rounded-full border transition-all duration-300 ${
              activeBlock === index
                ? 'bg-primary border-primary shadow-[0_0_10px_hsl(var(--primary))]'
                : 'bg-transparent border-muted-foreground hover:border-primary'
            }`}
            title={`Block ${block.blockNumber}: ${block.title}`}
          />
        ))}
      </div>

      {/* Current Block Info */}
      <div className="fixed bottom-4 left-4 z-40 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 max-w-sm">
        <div className="text-sm text-muted-foreground font-mono">
          Block #{blockchainData[activeBlock]?.blockNumber}
        </div>
        <div className="text-primary font-cyber font-bold text-base">
          {blockchainData[activeBlock]?.title}
        </div>
        <div className="text-xs text-muted-foreground">
          Hash: {blockchainData[activeBlock]?.hash.substring(0, 12)}...
        </div>
      </div>
    </>
  );
};

// Floating hash particles in the background
const HashParticles: React.FC = () => {
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <HashParticle key={i} index={i} />
      ))}
    </group>
  );
};

const HashParticle: React.FC<{ index: number }> = ({ index }) => {
  const meshRef = useRef();
  
  return null; // Simplified for now - can add floating text particles later
};