import { useState, useEffect } from 'react';

export interface KeyState {
  forward: boolean; // ArrowUp (стрелка вверх)
  backward: boolean; // ArrowDown (стрелка вниз)
  left: boolean; // ArrowLeft (стрелка влево)
  right: boolean; // ArrowRight (стрелка вправо)
  jump: boolean; // Space (пробел)
  kick: boolean; // X - для пинания
}

export const useKeyboardControls = () => {
  const [keys, setKeys] = useState<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    kick: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      switch (e.code) {
        case 'ArrowUp':
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case 'ArrowDown':
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case 'ArrowLeft':
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
          setKeys((prev) => ({ ...prev, right: true }));
          break;
        case 'Space':
          setKeys((prev) => ({ ...prev, jump: true }));
          break;
        case 'KeyX': // Клавиша X для пинания
          setKeys((prev) => ({ ...prev, kick: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case 'ArrowDown':
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case 'ArrowLeft':
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
          setKeys((prev) => ({ ...prev, right: false }));
          break;
        case 'Space':
          setKeys((prev) => ({ ...prev, jump: false }));
          break;
        case 'KeyX':
          setKeys((prev) => ({ ...prev, kick: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};
