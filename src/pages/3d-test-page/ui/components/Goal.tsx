import { useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Html } from '@react-three/drei';

interface GoalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  color?: string;
  onGoal?: () => void;
}

export const Goal = ({
  position,
  rotation = [0, 0, 0],
  width = 3,
  height = 2,
  color = '#e21b1b',
  onGoal,
}: GoalProps) => {
  const [showGoalText, setShowGoalText] = useState(false);

  // Обработчик попадания мяча в ворота
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleIntersectionEnter = (e: any) => {
    // Проверяем, что пересечение вызвал именно мяч
    if (e.other.rigidBodyObject.name === 'ball') {
      setShowGoalText(true);

      // Вызываем коллбэк для увеличения счета
      if (onGoal) onGoal();

      // Скрываем текст ГОЛ через 3 секунды
      setTimeout(() => setShowGoalText(false), 3000);
    }
  };

  return (
    <>
      {/* Рамка ворот */}
      <group
        position={position}
        rotation={rotation}
      >
        {/* Верхняя перекладина */}
        <RigidBody
          type="fixed"
          position={[0, height, 0]}
        >
          <mesh>
            <boxGeometry args={[width, 0.1, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </RigidBody>

        {/* Левая стойка */}
        <RigidBody
          type="fixed"
          position={[-width / 2, height / 2, 0]}
        >
          <mesh>
            <boxGeometry args={[0.1, height, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </RigidBody>

        {/* Правая стойка */}
        <RigidBody
          type="fixed"
          position={[width / 2, height / 2, 0]}
        >
          <mesh>
            <boxGeometry args={[0.1, height, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </RigidBody>

        {/* Сетка (визуальная, без физики) */}
        {/* <mesh
          position={[0, height / 2, -0.2]}
          receiveShadow
        >
          <planeGeometry args={[width - 0.1, height - 0.1]} />
          <meshStandardMaterial
            color="#ffffff"
            opacity={0.3}
            transparent
            wireframe
          />
        </mesh> */}

        {/* Сенсор для определения гола */}
        <RigidBody
          type="fixed"
          sensor
          position={[0, height / 2, -0.4]}
        >
          <CuboidCollider
            args={[width / 2 - 0.1, height / 2 - 0.1, 0.1]}
            onIntersectionEnter={handleIntersectionEnter}
          />
        </RigidBody>
      </group>

      {/* Текст "ГОЛ!!!" */}
      {showGoalText && (
        <Html
          position={[0, 3, 0]}
          center
        >
          <div
            style={{
              color: 'red',
              fontSize: '60px',
              fontWeight: 'bold',
              textShadow: '0 0 10px black',
              whiteSpace: 'nowrap',
            }}
          >
            ГОЛ!!!
          </div>
        </Html>
      )}
    </>
  );
};
