import { Button } from '@shared/ui/Button';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { useCallStore } from '../model/callStore';
import { useAuthenticatedSocket } from '@features/socket';
import { useEffect, useRef } from 'react';

export const ActiveCallModal = () => {
  const socket = useAuthenticatedSocket();
  const { selectedUser, callerId, resetCallState, localStream, remoteStream } = useCallStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Обновляем видео-элементы при изменении потоков
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Завершение звонка
  const endCall = () => {
    const targetUserId = selectedUser?.id || callerId;

    if (socket && targetUserId) {
      socket.emit('end-call', {
        to: targetUserId,
      });
    }

    resetCallState();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Видеозвонок с {selectedUser?.name || 'пользователем'}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative w-full aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 object-cover bg-gray-200 rounded-lg"
            />
            <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">Вы</div>
          </div>

          <div className="relative w-full aspect-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover bg-gray-200 rounded-lg"
            />
            <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
              {selectedUser?.name || 'Собеседник'}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <Button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 rounded-full px-3.5 py-3.5"
          >
            <PhoneIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
