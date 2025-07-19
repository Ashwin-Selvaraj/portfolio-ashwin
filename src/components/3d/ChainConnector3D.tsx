import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Torus } from '@react-three/drei';
import { Group, Vector3, Quaternion, Euler } from 'three';

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

  const { distance, direction, midPosition } = useMemo(() => {
    const start = new Vector3(...startPosition);
    const end = new Vector3(...endPosition);
    const direction = end.clone().sub(start).normalize();
    const distance = start.distanceTo(end);
    const midPosition = start.clone().add(end).multiplyScalar(0.5);
    
    return {
      distance: distance - 4, // Account for block sizes
      direction,
      midPosition: midPosition.toArray() as [number, number, number]
    };
  }, [startPosition, endPosition]);

  const rotation = useMemo(() => {
    const start = new Vector3(...startPosition);
    const end = new Vector3(...endPosition);
    const direction = end.clone().sub(start).normalize();
    
    // Calculate rotation to align cylinder with direction
    const up = new Vector3(0, 1, 0);
    const quaternion = new Quaternion();
    quaternion.setFromUnitVectors(up, direction);
    const euler = new Euler().setFromQuaternion(quaternion);
    
    return [euler.x, euler.y, euler.z] as [number, number, number];
  }, [startPosition, endPosition]);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      // Pulse effect for active connections
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  const numLinks = Math.floor(distance / 1.5);

  return (
    <group ref={groupRef}>
      {/* Main Chain Cable */}
      <Cylinder
        args={[0.05, 0.05, distance, 8]}
        position={midPosition}
        rotation={rotation}
      >
        <meshStandardMaterial
          color={isActive ? "#00ff88" : "#333366"}
          emissive={isActive ? "#002211" : "#000"}
          roughness={0.4}
          metalness={0.8}
        />
      </Cylinder>

      {/* Chain Links */}
      {Array.from({ length: numLinks }, (_, i) => {
        const t = (i + 1) / (numLinks + 1);
        const linkPosition = new Vector3()
          .copy(new Vector3(...startPosition))
          .lerp(new Vector3(...endPosition), t);

        return (
          <group key={i} position={linkPosition.toArray()}>
            <Torus args={[0.15, 0.03, 8, 16]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial
                color={isActive ? "#00ff88" : "#444477"}
                emissive={isActive ? "#001111" : "#000"}
                roughness={0.3}
                metalness={0.9}
              />
            </Torus>
            <Torus args={[0.15, 0.03, 8, 16]} rotation={[0, Math.PI / 2, 0]}>
              <meshStandardMaterial
                color={isActive ? "#00ff88" : "#444477"}
                emissive={isActive ? "#001111" : "#000"}
                roughness={0.3}
                metalness={0.9}
              />
            </Torus>
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
      <Cylinder args={[0.02, 0.02, 0.3, 6]}>
        <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
      </Cylinder>
      <Cylinder args={[0.01, 0.01, 0.1, 6]} position={[0, 0.2, 0]}>
        <meshBasicMaterial color="#ffffff" />
      </Cylinder>
    </group>
  );
};