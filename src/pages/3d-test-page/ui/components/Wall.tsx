import { RigidBody } from '@react-three/rapier';
import { ReactNode } from 'react';

interface WallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  children?: ReactNode;
  args?: number[];
}

export const Wall = ({ position, rotation = [0, 0, 0], color = '#404040', args = [20, 5, 0.5] }: WallProps) => {
  return (
    <RigidBody
      type="fixed"
      position={position}
      rotation={rotation}
      restitution={0.4}
    >
      <mesh
        receiveShadow
        castShadow
      >
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.7}
        />
      </mesh>
    </RigidBody>
  );
};
