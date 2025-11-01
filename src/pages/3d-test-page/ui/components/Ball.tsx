import { RapierRigidBody, RigidBody, RigidBodyOptions } from '@react-three/rapier';

interface BallProps {
  ballRef: React.RefObject<RapierRigidBody | null>;
  position: RigidBodyOptions['position'];
}

export const Ball = ({ ballRef, position }: BallProps) => {
  return (
    <RigidBody
      ref={ballRef}
      position={position}
      restitution={0.8} // Высокий отскок
      friction={0.2} // Низкое трение
      linearDamping={0.1} // Меньшее затухание
      colliders="ball" // Сферический коллайдер
      mass={1} // Небольшая масса
      name="ball" // имя для идентификации
    >
      <mesh
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
};
