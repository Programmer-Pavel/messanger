import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { useEffect, useState } from 'react';
import { User } from '../model/User';
import { useGetUsers } from '../api/useGetAllUsers';
import cn from 'classnames';
import { useSocket } from '@shared/hooks/useSocket';

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

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [userData] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [roomId, setRoomId] = useState('room1'); // Default room or can be passed as prop
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: allUsers = [] } = useGetUsers();

  const socket = useSocket();

  useEffect(() => {
    if (allUsers.length > 0) {
      const filtered = allUsers.filter((user) => user.id !== userData?.id);
      setUsers(filtered);
    }
  }, [allUsers]);

  useEffect(() => {
    if (!socket) return;

    // Join room on connection
    socket.emit('joinRoom', roomId);

    // Handle received messages
    socket.on('onMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Handle initial room messages
    socket.on('joinRoom', ({ messages }) => {
      if (messages) setMessages(messages);
    });

    socket.on('userStatusChange', ({ userId, isOnline }) => {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isOnline } : user)),
      );
    });

    // Handle private chat initialization
    socket.on('privateChat', ({ roomId, messages }) => {
      setRoomId(roomId);
      setMessages(messages);
    });

    // Handle private messages
    socket.on('onPrivateMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('onMessage');
      socket.off('joinRoom');
      socket.off('usersList');
      socket.off('userStatusChange');
      socket.off('privateChat');
      socket.off('onPrivateMessage');
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (!socket || !messageInput.trim()) return;

    if (selectedUser) {
      // Send private message
      const messageData = {
        fromUserId: userData.id.toString(),
        toUserId: selectedUser.id.toString(),
        message: messageInput,
      };
      socket.emit('sendPrivateMessage', messageData);
    } else {
      // Existing group message logic
      const messageData = {
        roomId,
        message: messageInput,
        userId: userData?.id,
      };
      socket.emit('newMessage', messageData);
    }

    setMessageInput('');
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);

    // Initiate private chat
    if (socket) {
      socket.emit('startPrivateChat', {
        fromUserId: userData.id.toString(),
        toUserId: user.id.toString(),
      });
    }
  };
  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex h-[600px]">
          {/* Users Panel */}
          <div className="w-64 border-r border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Users
              </h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={cn(
                      'flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100',
                      {
                        'bg-gray-300': selectedUser?.id === user.id,
                      },
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn('w-2 h-2 rounded-full', {
                          'bg-green-500': user.isOnline,
                          'bg-red-400': !user.isOnline,
                        })}
                      />
                      <span className="font-medium text-gray-500">
                        {user.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Chat Room: {roomId}
              </h2>
            </div>
            <div className="h-[400px] overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn('mb-4', {
                    'text-right': message.userId === userData?.id,
                    'text-left': message.userId !== userData?.id,
                  })}
                >
                  <div className="mb-1 text-sm text-gray-500">
                    {message.userId === userData?.id
                      ? 'You'
                      : message.user.name}
                    <span className="mx-2">•</span>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div
                    className={cn('inline-block p-3 rounded-lg max-w-[70%]', {
                      'bg-blue-500 text-white': message.userId === userData?.id,
                      'bg-gray-100 text-gray-800':
                        message.userId !== userData?.id,
                    })}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1"
                containerClassName="w-full"
              />
              <Button
                onClick={sendMessage}
                disabled={!messageInput.trim()}
                className="px-6"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
