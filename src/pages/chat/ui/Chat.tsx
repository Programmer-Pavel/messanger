import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { useEffect, useMemo, useState } from 'react';
import { useGetUsers } from '../api/useGetAllUsers';
import { User, useUserStore } from '@features/auth';
import { VideoCall } from './VideoCall';
import { useAuthenticatedSocket } from '@features/socket';
import { cn } from '@/shared/lib/utils';
import { MessagesSquare } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  userId: number;
  roomId: string;
  createdAt: number;
  user: {
    id: number;
    name: string;
  };
}

interface MessageNotification {
  fromUserId: string;
  messagePreview: string;
  roomId: string;
  timestamp: Date;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [unreadMessages, setUnreadMessages] = useState<number[]>([]);

  const currentUser = useUserStore((state) => state.user);

  const { data: allUsers = [] } = useGetUsers();

  const socket = useAuthenticatedSocket();

  useEffect(() => {
    if (!socket) return;

    // Обработчик приватных сообщений (входящих)
    const handlePrivateMessage = ({ message, fromUserId }: { message: Message; fromUserId: string }) => {
      if (
        (currentUser && message.userId === currentUser.id) ||
        (selectedUser && parseInt(fromUserId) === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // Обработчик уведомлений о новых сообщениях
    const handleNewMessageNotification = (notification: MessageNotification) => {
      const fromUserId = parseInt(notification.fromUserId);

      if (!selectedUser || selectedUser.id !== fromUserId) {
        setUnreadMessages((prev) => (prev.includes(fromUserId) ? prev : [...prev, fromUserId]));
      }
    };

    // Обработчик истории сообщений при подключении к приватному чату
    const handlePrivateChat = (data: { roomId: string; messages: Message[] }) => {
      setMessages(data.messages || []);
    };

    socket.on('onPrivateMessage', handlePrivateMessage);
    socket.on('newMessageNotification', handleNewMessageNotification);
    socket.on('privateChat', handlePrivateChat);

    return () => {
      socket.off('onPrivateMessage', handlePrivateMessage);
      socket.off('newMessageNotification', handleNewMessageNotification);
      socket.off('privateChat', handlePrivateChat);
    };
  }, [socket, selectedUser]);

  const users = useMemo(() => {
    if (allUsers.length > 0) {
      return allUsers.filter((el) => el.id !== currentUser?.id);
    }

    return [];
  }, [allUsers]);

  const sendMessage = () => {
    if (!socket || !currentUser || !messageInput.trim() || !selectedUser) return;

    const messageData = {
      fromUserId: currentUser.id,
      toUserId: selectedUser.id,
      message: messageInput,
    };
    socket.emit('sendPrivateMessage', messageData);
    setMessageInput('');
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);

    // Очищаем сообщения перед загрузкой новых
    setMessages([]);

    // Очищаем уведомление для выбранного пользователя
    setUnreadMessages((prev) => prev.filter((id) => id !== user.id));

    // Инициализация приватного чата
    if (socket && currentUser) {
      socket.emit('startPrivateChat', {
        fromUserId: currentUser.id,
        toUserId: user.id,
      });
    }
  };

  const getUserItemClasses = (user: User) => {
    const isActiveUser = selectedUser?.id === user.id;
    const hasUnreadMessages = unreadMessages.includes(user.id);

    return cn('flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200', {
      // Активное состояние - синий фон
      'bg-blue-100 border-l-4 border-blue-500': isActiveUser,

      // Неактивное состояние с непрочитанными сообщениями
      'bg-yellow-50 hover:bg-yellow-100': hasUnreadMessages && !isActiveUser,

      // Обычное неактивное состояние (Вариант 3)
      'bg-indigo-50 hover:bg-indigo-100': !hasUnreadMessages && !isActiveUser,
    });
  };

  const getUserNameClasses = (user: User) => {
    const isActiveUser = selectedUser?.id === user.id;
    const hasUnreadMessages = unreadMessages.includes(user.id);

    return cn('font-medium', {
      'text-blue-700': isActiveUser,
      'text-yellow-700 font-semibold': hasUnreadMessages && !isActiveUser,
      'text-indigo-700': !hasUnreadMessages && !isActiveUser,
    });
  };

  // const getOnlineStatusClasses = (isOnline: boolean) => {
  //   return cn('w-2 h-2 rounded-full', {
  //     'bg-green-500': isOnline,
  //     'bg-red-400': !isOnline,
  //   });
  // };

  const getMessageClasses = (messageUserId: number) => {
    return cn('mb-4', {
      'text-right': messageUserId === currentUser?.id,
      'text-left': messageUserId !== currentUser?.id,
    });
  };

  const getMessageTextClasses = (messageUserId: number) => {
    return cn('inline-block p-3 rounded-lg max-w-[70%]', {
      'bg-blue-500 text-white': messageUserId === currentUser?.id,
      'bg-gray-100 text-gray-800': messageUserId !== currentUser?.id,
    });
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex h-[600px]">
          {/* Users Panel */}
          <div className="w-64 border-r border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Пользователи</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={getUserItemClasses(user)}
                  >
                    <div className="flex items-center space-x-3">
                      {/* <div className={getOnlineStatusClasses(user.isOnline)} /> */}
                      <span className={getUserNameClasses(user)}>{user.name}</span>
                    </div>

                    {/* Индикатор нового сообщения */}
                    {unreadMessages.includes(user.id) && (
                      <div className="flex items-center">
                        <span className="text-xs font-semibold text-yellow-600 mr-2">Новое</span>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6">
            {selectedUser ? (
              // Область чата, когда пользователь выбран
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Чат с {selectedUser.name}</h2>
                </div>
                <div className="h-[400px] overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={getMessageClasses(message.userId)}
                    >
                      <div className="mb-1 text-sm text-gray-500">
                        {message.userId === currentUser?.id ? 'Вы' : message.user.name}
                        <span className="mx-2">•</span>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className={getMessageTextClasses(message.userId)}>{message.content}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Введите сообщение..."
                    className="flex-1"
                    containerClassName="w-full"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!messageInput.trim()}
                    className="px-6"
                  >
                    Отправить
                  </Button>

                  <VideoCall selectedUser={selectedUser} />
                </div>
              </>
            ) : (
              // Пустое состояние чата - когда пользователь не выбран
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <MessagesSquare className="w-20 h-20 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Выберите пользователя для начала чата</h3>
                <p className="text-gray-500 max-w-md">
                  Выберите пользователя из списка слева, чтобы начать общение или продолжить существующий диалог.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
