import { Button } from '@shared/ui/Button';
import { Video } from 'lucide-react';
import { User, useUserStore } from '@features/auth';
import { useAuthenticatedSocket } from '@features/socket';
import { useCallStore } from '@features/call';

interface VideoCallProps {
  selectedUser?: User;
}

export const VideoCall = ({ selectedUser }: VideoCallProps) => {
  const user = useUserStore((state) => state.user);
  const { setCallActive, setSelectedUser, initializeMedia, createPeerConnection } = useCallStore();

  const socket = useAuthenticatedSocket();

  // Инициирование звонка
  const initiateCall = async () => {
    if (!selectedUser || !socket || !user) return;

    try {
      // Инициализируем медиа поток
      const stream = await initializeMedia();
      if (!stream) {
        console.error('Не удалось получить медиапоток');
        return;
      }

      // Создаем соединение
      const pc = createPeerConnection(selectedUser.id);

      // Настраиваем обработчик ICE кандидатов
      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            to: selectedUser.id,
          });
        }
      };

      // Создаем предложение (offer)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Отправляем предложение выбранному пользователю
      socket.emit('call-user', {
        offer,
        to: selectedUser.id,
        from: user.id,
        fromName: user.name,
      });

      // Устанавливаем активное состояние звонка и выбранного пользователя
      setSelectedUser(selectedUser);
      setCallActive(true);
    } catch (error) {
      console.error('Ошибка при инициировании звонка:', error);
    }
  };

  return (
    <Button
      onClick={initiateCall}
      disabled={!selectedUser}
      className="px-6"
    >
      <Video className="h-5 w-5" />
    </Button>
  );
};
