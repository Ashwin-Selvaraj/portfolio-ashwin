import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, RoundedBox } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { BlockData } from '@/types/blockchain';

interface BlockchainBlock3DProps {
  block: BlockData;
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}

export const BlockchainBlock3D: React.FC<BlockchainBlock3DProps> = ({
  block,
  position,
  isActive,
  onClick
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
      
      // Rotation for active/hovered state
      if (isActive || hovered) {
        meshRef.current.rotation.y += 0.01;
      }
      
      // Scale animation
      const targetScale = isActive ? 1.2 : hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Main Block */}
      <RoundedBox
        ref={meshRef}
        args={[2, 2, 2]}
        radius={0.1}
        smoothness={4}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isActive ? "#00ff88" : hovered ? "#0066ff" : "#1a1a2e"}
          emissive={isActive ? "#003322" : hovered ? "#001122" : "#000"}
          roughness={0.3}
          metalness={0.7}
        />
      </RoundedBox>

      {/* Block Number */}
      <Text
        position={[0, 1.5, 1.1]}
        fontSize={0.3}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
        font="/fonts/JetBrainsMono-Regular.woff"
      >
        #{block.blockNumber}
      </Text>

      {/* Block Title */}
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        textAlign="center"
        font="/fonts/JetBrainsMono-Regular.woff"
      >
        {block.title}
      </Text>

      {/* Hash */}
      <Text
        position={[0, -1.5, 1.1]}
        fontSize={0.1}
        color="#888888"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        textAlign="center"
        font="/fonts/JetBrainsMono-Regular.woff"
      >
        {block.hash.substring(0, 12)}...
      </Text>

      {/* Glowing edges for active block */}
      {isActive && (
        <Box args={[2.1, 2.1, 2.1]}>
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={0.1}
            wireframe
          />
        </Box>
      )}
    </group>
  );
};