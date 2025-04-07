import { RigidBody } from '@react-three/rapier';

export const Floor = () => {
  return (
    <RigidBody
      type="fixed"
      position={[0, -2, 0]}
      restitution={0.4}
    >
      <mesh receiveShadow>
        <boxGeometry args={[20, 0.5, 30]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </RigidBody>
  );
};
