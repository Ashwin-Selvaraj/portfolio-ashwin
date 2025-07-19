import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';

interface ChainConnector3DProps {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  isActive: boolean;
}

export const ChainConnector3D: React.FC<ChainConnector3DProps> = ({
  startPosition,
  endPosition,
  isActive
}) => {
  const groupRef = useRef<Group>(null);

  const { distance, midPosition, numLinks } = useMemo(() => {
    const start = new Vector3(...startPosition);
    const end = new Vector3(...endPosition);
    const distance = start.distanceTo(end) - 4; // Account for block sizes
    const midPosition = start.clone().add(end).multiplyScalar(0.5);
    const numLinks = Math.max(1, Math.floor(distance / 2));
    
    return {
      distance,
      midPosition: midPosition.toArray() as [number, number, number],
      numLinks
    };
  }, [startPosition, endPosition]);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      // Gentle pulse effect for active connections
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Chain Cable */}
      <mesh position={midPosition}>
        <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
        <meshStandardMaterial
          color={isActive ? "#00ff88" : "#333366"}
          emissive={isActive ? "#002211" : "#000"}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Chain Links */}
      {Array.from({ length: numLinks }, (_, i) => {
        const t = (i + 1) / (numLinks + 1);
        const start = new Vector3(...startPosition);
        const end = new Vector3(...endPosition);
        const linkPosition = start.lerp(end, t);

        return (
          <group key={i} position={linkPosition.toArray()}>
            {/* First torus ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.15, 0.03, 8, 16]} />
              <meshStandardMaterial
                color={isActive ? "#00ff88" : "#444477"}
                emissive={isActive ? "#001111" : "#000"}
                roughness={0.3}
                metalness={0.9}
              />
            </mesh>
            {/* Second torus ring perpendicular */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.15, 0.03, 8, 16]} />
              <meshStandardMaterial
                color={isActive ? "#00ff88" : "#444477"}
                emissive={isActive ? "#001111" : "#000"}
                roughness={0.3}
                metalness={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {/* Data Flow Particles */}
      {isActive && (
        <DataFlowParticles
          startPosition={startPosition}
          endPosition={endPosition}
        />
      )}
    </group>
  );
};

// Animated data flow particles
const DataFlowParticles: React.FC<{
  startPosition: [number, number, number];
  endPosition: [number, number, number];
}> = ({ startPosition, endPosition }) => {
  const particleRef = useRef<Group>(null);

  useFrame((state) => {
    if (particleRef.current) {
      const t = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2;
      const start = new Vector3(...startPosition);
      const end = new Vector3(...endPosition);
      const position = start.lerp(end, t);
      particleRef.current.position.copy(position);
    }
  });

  return (
    <group ref={particleRef}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};