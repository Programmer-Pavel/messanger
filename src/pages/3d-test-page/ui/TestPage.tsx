import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { useState } from 'react';

export const TestPage = () => {
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 45 }}
      >
        <Scene
          setScore1={setScore1}
          setScore2={setScore2}
        />
      </Canvas>
      <div className="absolute top-2.5 left-2.5 text-white bg-black/70 p-2.5 rounded">
        <h2 className="text-xl font-semibold mb-2">Счет:</h2>
        <p>Игрок 1: {score1}</p>
        <p>Игрок 2: {score2}</p>

        {/* <h2 className="text-xl font-semibold mb-2">3D Футбол с физикой</h2>
        <p className="mb-1">
          Используйте <span className="font-bold">клавиши со стрелками</span> для передвижения куба
        </p>
        <p className="mb-1">
          <span className="font-bold">Пробел</span> - прыжок
        </p>
        <p className="mb-1">
          Нажмите <span className="font-bold">X</span> чтобы пнуть мяч, когда куб рядом с ним
        </p>
        <p>Удерживайте правую кнопку мыши для вращения камеры</p> */}
      </div>
    </div>
  );
};
