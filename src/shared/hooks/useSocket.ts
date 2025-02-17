import { socket } from '@shared/lib/socket';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  useEffect(() => {
    setSocketInstance(socket);
    return () => {
      // Отписываемся от событий, но не закрываем соединение
      socket.removeAllListeners();
    };
  }, []);
  return socketInstance;
};
