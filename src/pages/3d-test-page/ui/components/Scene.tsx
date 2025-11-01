import { OrbitControls } from '@react-three/drei';
import { Physics, type RapierRigidBody } from '@react-three/rapier';
import { Floor } from './Floor';
import { Wall } from './Wall';
import { Person } from './Person';
import { Ball } from './Ball';
import { Goal } from './Goal';
import { useRef } from 'react';

interface Scene {
  setScore1: (score: unknown) => void;
  setScore2: (score: unknown) => void;
}

export const Scene = ({ setScore1, setScore2 }: Scene) => {
  const ballRef = useRef<RapierRigidBody | null>(null);

  const handleGoal1 = () => {
    setScore1((prevScore: number) => prevScore + 1);
  };

  const handleGoal2 = () => {
    setScore2((prevScore: number) => prevScore + 1);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight
        position={[10, 10, 10]}
        castShadow
      />
      <directionalLight
        position={[0, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <Physics
        gravity={[0, -9.81, 0]}
        // debug
      >
        <Person
          ballRef={ballRef}
          position={[0, 2, 0]}
        />
        <Ball
          ballRef={ballRef}
          position={[3, 0, 3]}
        />
        <Floor />

        {/* Видимые стены */}
        <Wall
          position={[0, 0.5, -15]}
          color="#66a1cc"
        />
        <Wall
          position={[0, 0.5, 15]}
          color="#66a1cc"
        />
        <Wall
          position={[-10, 0.5, 0]}
          rotation={[0, Math.PI / 2, 0]}
          color="#cc6666"
          args={[30, 5, 0.5]}
        />
        <Wall
          position={[10, 0.5, 0]}
          rotation={[0, Math.PI / 2, 0]}
          color="#cc6666"
          args={[30, 5, 0.5]}
        />

        {/* Ворота */}
        <Goal
          position={[0, -1.7, -14.4]}
          width={5}
          height={3}
          onGoal={handleGoal1}
        />

        {/* Ворота */}
        <Goal
          position={[0, -1.7, 14.4]}
          rotation={[0, 3.14, 0]}
          width={5}
          height={3}
          onGoal={handleGoal2}
        />
      </Physics>

      <OrbitControls makeDefault />
    </>
  );
};
