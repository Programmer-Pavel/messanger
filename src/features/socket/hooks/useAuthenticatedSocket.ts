import { useUserStore } from '@features/auth';
import { getSocketInstance } from '@shared/lib/socket';
import { emitUserOnline } from '../lib/userStatus';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export const useAuthenticatedSocket = () => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const user = useUserStore((state) => state.user);

  const socket = getSocketInstance();

  useEffect(() => {
    if (!socketInstance) {
      setSocketInstance(socket);
    }

    if (user) {
      emitUserOnline(user.id);

      const handleConnect = () => {
        emitUserOnline(user.id);
      };

      socket.on('connect', handleConnect);

      return () => {
        socket.off('connect', handleConnect);
      };
    }
  }, [user]);

  return socketInstance;
};
