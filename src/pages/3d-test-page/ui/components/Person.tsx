import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody, RigidBodyOptions } from '@react-three/rapier';
import * as THREE from 'three';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';

interface ControlledBoxProps {
  ballRef: React.RefObject<RapierRigidBody | null>;
  position?: RigidBodyOptions['position'];
}

export const Person = ({ ballRef, position = [0, 0, 0] }: ControlledBoxProps) => {
  const playerRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const keys = useKeyboardControls();
  const [canKick, setCanKick] = useState(false);
  const [kickCooldown, setKickCooldown] = useState(false);
  const lastKickTime = useRef(0);

  // Создаем векторы один раз вне useFrame
  const cameraDirection = useRef(new THREE.Vector3());
  const cameraRight = useRef(new THREE.Vector3());
  const kickDirection = useRef(new THREE.Vector3());
  const movementDirection = useRef(new THREE.Vector3(0, 0, 0));
  const currentVelocity = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (!playerRef.current) return;

    // === Получаем текущую скорость для определения направления движения ===
    const velocity = playerRef.current.linvel();
    currentVelocity.current.set(velocity.x, velocity.y, velocity.z);

    // Сбрасываем вектор направления движения
    movementDirection.current.set(0, 0, 0);

    // === Проверка расстояния до мяча ===
    if (ballRef.current) {
      const playerPos = playerRef.current.translation();
      const ballPos = ballRef.current.translation();

      const distance = Math.sqrt(
        Math.pow(playerPos.x - ballPos.x, 2) +
          Math.pow(playerPos.y - ballPos.y, 2) +
          Math.pow(playerPos.z - ballPos.z, 2),
      );

      const newCanKick = distance < 1;
      if (newCanKick !== canKick) {
        setCanKick(newCanKick);
      }
    }

    // === Обработка пинания мяча при нажатии X ===
    const currentTime = performance.now();
    if (keys.kick && canKick && !kickCooldown && ballRef.current && currentTime - lastKickTime.current > 500) {
      const playerPos = playerRef.current.translation();
      const ballPos = ballRef.current.translation();

      kickDirection.current.set(ballPos.x - playerPos.x, 0, ballPos.z - playerPos.z).normalize();

      const kickForce = 3;

      ballRef.current.applyImpulse(
        {
          x: kickDirection.current.x * kickForce,
          y: 0.2,
          z: kickDirection.current.z * kickForce,
        },
        true,
      );

      lastKickTime.current = currentTime;
      setKickCooldown(true);
      setTimeout(() => setKickCooldown(false), 500);
    }

    // === Обработка движения персонажа ===
    camera.getWorldDirection(cameraDirection.current);
    cameraDirection.current.y = 0;
    cameraDirection.current.normalize();

    cameraRight.current.set(-cameraDirection.current.z, 0, cameraDirection.current.x);

    const movementForce = 10;
    let isMoving = false;

    if (keys.forward) {
      movementDirection.current.add(cameraDirection.current);
      isMoving = true;
      playerRef.current.applyImpulse(
        {
          x: cameraDirection.current.x * movementForce * 0.016,
          y: 0,
          z: cameraDirection.current.z * movementForce * 0.016,
        },
        true,
      );
    }
    if (keys.backward) {
      movementDirection.current.sub(cameraDirection.current);
      isMoving = true;
      playerRef.current.applyImpulse(
        {
          x: -cameraDirection.current.x * movementForce * 0.016,
          y: 0,
          z: -cameraDirection.current.z * movementForce * 0.016,
        },
        true,
      );
    }
    if (keys.left) {
      movementDirection.current.sub(cameraRight.current);
      isMoving = true;
      playerRef.current.applyImpulse(
        {
          x: -cameraRight.current.x * movementForce * 0.016,
          y: 0,
          z: -cameraRight.current.z * movementForce * 0.016,
        },
        true,
      );
    }
    if (keys.right) {
      movementDirection.current.add(cameraRight.current);
      isMoving = true;
      playerRef.current.applyImpulse(
        {
          x: cameraRight.current.x * movementForce * 0.016,
          y: 0,
          z: cameraRight.current.z * movementForce * 0.016,
        },
        true,
      );
    }

    // === Поворот персонажа в направлении движения ===
    if (isMoving && movementDirection.current.length() > 0) {
      // Нормализуем вектор направления
      movementDirection.current.normalize();

      // Вычисляем угол поворота (в радианах) на основе направления движения
      const targetRotation = Math.atan2(movementDirection.current.x, movementDirection.current.z);

      // Создаем кватернион для нового поворота (вокруг оси Y)
      const newRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation);

      // Применяем поворот к персонажу
      playerRef.current.setRotation(
        {
          x: 0,
          y: newRotation.y,
          z: 0,
          w: newRotation.w,
        },
        true,
      );
    } else if (Math.abs(currentVelocity.current.x) > 0.1 || Math.abs(currentVelocity.current.z) > 0.1) {
      // Если персонаж движется по инерции, поворачиваем его в направлении движения
      const horizontalVelocity = new THREE.Vector2(currentVelocity.current.x, currentVelocity.current.z);

      if (horizontalVelocity.length() > 0.5) {
        const targetRotation = Math.atan2(currentVelocity.current.x, currentVelocity.current.z);

        const newRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation);

        playerRef.current.setRotation(
          {
            x: 0,
            y: newRotation.y,
            z: 0,
            w: newRotation.w,
          },
          true,
        );
      }
    }

    // Ограничиваем угловую скорость для предотвращения нежелательного вращения
    playerRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

    if (keys.jump) {
      const pos = playerRef.current.translation();
      if (pos.y < -1) {
        playerRef.current.applyImpulse({ x: 0, y: 0.18, z: 0 }, true);
      }
    }
  });

  // Базовые цвета для фигуры
  const bodyColor = canKick ? '#ff6b9d' : '#3ca5dd';
  const headColor = canKick ? '#ff4f8b' : '#2b98d0';
  const limbColor = canKick ? '#ff85af' : '#4fb2e5';

  return (
    <RigidBody
      ref={playerRef}
      position={position}
      restitution={0.4}
      friction={0.7}
      linearDamping={2.5} // Увеличиваем затухание линейного движения
      angularDamping={5} // Увеличиваем затухание углового движения
      lockRotations={false} // Разрешаем вращение для поворота персонажа
      canSleep={false} // Объект никогда не засыпает (всегда активен)
      mass={5}
      colliders={false} // Отключаем автоматическое создание коллайдера
    >
      {/* Используем только один коллайдер типа капсула для всего тела */}
      <CapsuleCollider
        args={[0.5, 0.3]}
        position={[0, 1, 0]}
      />

      {/* Визуальные элементы персонажа */}
      <group castShadow>
        {/* Голова */}
        <mesh
          position={[0, 1.6, 0]}
          castShadow
        >
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color={headColor} />
        </mesh>

        {/* Тело */}
        <mesh
          position={[0, 1.05, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.2, 0.3, 0.6, 16]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>

        {/* Левая рука */}
        <group position={[-0.3, 1.1, 0]}>
          <mesh
            rotation={[0, 0, -Math.PI / 4]}
            position={[-0.15, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
            <meshStandardMaterial color={limbColor} />
          </mesh>
        </group>

        {/* Правая рука */}
        <group position={[0.3, 1.1, 0]}>
          <mesh
            rotation={[0, 0, Math.PI / 4]}
            position={[0.15, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
            <meshStandardMaterial color={limbColor} />
          </mesh>
        </group>

        {/* Левая нога */}
        <group position={[-0.15, 0.65, 0]}>
          <mesh
            position={[0, -0.2, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial color={limbColor} />
          </mesh>
        </group>

        {/* Правая нога */}
        <group position={[0.15, 0.65, 0]}>
          <mesh
            position={[0, -0.2, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial color={limbColor} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
};
