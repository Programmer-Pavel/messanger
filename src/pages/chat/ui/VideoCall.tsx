import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@shared/ui/Button';
import { PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { useSocket } from '@shared/hooks/useSocket';
import { User } from '@features/auth';

interface VideoCallProps {
  selectedUser: User | null;
  currentUser: User | null;
}

export const VideoCall: React.FC<VideoCallProps> = ({ selectedUser, currentUser }) => {
  const socket = useSocket();

  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [callerId, setCallerId] = useState('');
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // Функция для применения накопленных ICE кандидатов
  const applyPendingIceCandidates = useCallback(async () => {
    if (!peerConnectionRef.current || !peerConnectionRef.current.remoteDescription) {
      console.log('Невозможно применить ICE кандидаты: remoteDescription не установлен');
      return;
    }

    if (pendingCandidatesRef.current.length > 0) {
      for (const candidate of pendingCandidatesRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Ошибка при добавлении накопленного ICE кандидата:', error);
        }
      }

      pendingCandidatesRef.current = [];
    }
  }, []);

  // Инициализация медиа потока
  const initializeMedia = async () => {
    try {
      console.log('Получение медиа-потока...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // Сохраняем поток в ref
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      } else {
        console.error('localVideoRef не инициализирован');
      }
      return stream;
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'NotFoundError') {
          console.error('Ошибка: Камера или микрофон не найдены.');
          alert('Для видеозвонка требуется камера и микрофон. Пожалуйста, подключите устройства и разрешите доступ.');
        } else if (error.name === 'NotAllowedError') {
          console.error('Ошибка: Доступ к камере/микрофону запрещен пользователем.');
          alert('Для видеозвонка требуется разрешение на использование камеры и микрофона.');
        } else if (error.name === 'NotReadableError') {
          console.error('Ошибка: Устройства заняты другим приложением.');
          alert('Камера или микрофон уже используются другим приложением. Закройте его и попробуйте снова.');
        } else {
          console.error('Ошибка доступа к медиа устройствам:', error.name, error.message);
          alert('Произошла ошибка при подключении к камере/микрофону.');
        }
      } else {
        console.error('Неизвестная ошибка при доступе к медиа устройствам:', error);
        alert('Произошла неизвестная ошибка при подготовке к видеозвонку.');
      }
      return null;
    }
  };

  // Создание RTCPeerConnection
  const createPeerConnection = (stream: MediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Добавляем треки из локального потока в peer connection
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Обработка входящих треков
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        // Сохраняем поток в ref
        remoteStreamRef.current = event.streams[0];

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        } else {
          console.error('remoteVideoRef не инициализирован');
        }
      } else {
        console.error('Нет потоков в событии ontrack');
      }
    };

    // Добавляем логирование состояния соединения
    pc.oniceconnectionstatechange = () => {
      console.log('ICE состояние изменилось:', pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log('Состояние соединения изменилось:', pc.connectionState);
    };

    // Обработка ICE кандидатов
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: selectedUser?.id,
        });
      }
    };

    // Сохраняем в ref
    peerConnectionRef.current = pc;

    return pc;
  };

  // Инициирование звонка
  const initiateCall = async () => {
    if (!selectedUser || !socket || !currentUser) return;

    setIsCallActive(true);

    try {
      const stream = await initializeMedia();
      if (!stream) {
        console.error('Не удалось получить медиапоток');
        setIsCallActive(false);
        return;
      }

      const pc = createPeerConnection(stream);

      // Создаем предложение (offer)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Отправляем предложение выбранному пользователю
      socket.emit('call-user', {
        offer,
        to: selectedUser.id,
        from: currentUser.id,
        fromName: currentUser.name,
      });
    } catch (error) {
      console.error('Ошибка при инициировании звонка:', error);
      setIsCallActive(false);
    }
  };

  // Принятие входящего звонка
  const acceptCall = async () => {
    if (!callerId || !socket || !incomingOffer) return;

    setIsCallActive(true);

    try {
      const stream = await initializeMedia();
      if (!stream) {
        console.error('Не удалось получить медиапоток');
        setIsCallActive(false);
        setIsIncomingCall(false);
        return;
      }

      const pc = createPeerConnection(stream);

      // Устанавливаем удаленное описание (remote description)
      await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));

      // Применяем накопленные ICE кандидаты после установки удаленного описания
      await applyPendingIceCandidates();

      // Создаем ответ (answer)
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Отправляем ответ звонящему
      socket.emit('call-accept', {
        answer,
        to: callerId,
      });

      setIsIncomingCall(false);
      setIncomingOffer(null); // Очищаем offer
    } catch (error) {
      console.error('Ошибка при принятии звонка:', error);
      setIsCallActive(false);
      setIsIncomingCall(false);
    }
  };

  // Отклонение звонка
  const declineCall = () => {
    if (socket && callerId) {
      socket.emit('decline-call', {
        to: callerId,
      });
    }
    setIsIncomingCall(false);
  };

  // Завершение звонка (оборачиваем в useCallback)
  const endCall = useCallback(() => {
    // Исправляем логику определения ID пользователя, которому отправляем сигнал завершения
    const targetUserId = selectedUser?.id || callerId;

    if (socket && targetUserId) {
      socket.emit('end-call', {
        to: targetUserId,
      });
      console.log('Отправлен сигнал о завершении звонка пользователю:', targetUserId);
    } else {
      console.log('Не удалось отправить сигнал о завершении звонка: сокет или ID пользователя не определены.', {
        hasSocket: !!socket,
        targetUserId,
      });
    }

    // Останавливаем все треки
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      console.log('Локальные треки остановлены');
      localStreamRef.current = null;
    }

    // Очищаем удаленный поток
    if (remoteStreamRef.current) {
      remoteStreamRef.current = null;
    }

    // Закрываем peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      console.log('Peer connection закрыт');
    }

    // Очищаем видео элементы
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsCallActive(false);
    setIsIncomingCall(false); // Также сбрасываем флаг входящего звонка
    setCallerId(''); // Сбрасываем ID звонящего
    setCallerName(''); // Сбрасываем имя звонящего
    setIncomingOffer(null); // Сбрасываем offer
  }, [
    socket,
    selectedUser,
    callerId,
    isCallActive,
    setIsCallActive,
    setIsIncomingCall,
    setCallerId,
    setCallerName,
    setIncomingOffer,
  ]); // Добавляем зависимости useCallback

  useEffect(() => {
    if (!socket || !currentUser?.id) return;

    socket.emit('joinRoom', { userId: currentUser.id }); // Используем currentUser.id

    // Обработка входящего звонка
    const handleIncomingCall = ({
      offer,
      from,
      fromName,
    }: {
      offer: RTCSessionDescriptionInit;
      from: string;
      fromName: string;
    }) => {
      console.log('incoming-call от', fromName);
      // Проверяем, не идет ли уже активный звонок
      if (isCallActive) {
        console.log('Отклоняем входящий звонок, так как уже идет другой звонок.');
        // Опционально: отправить сигнал отклонения звонящему
        socket.emit('decline-call', { to: from });
        return;
      }
      setIsIncomingCall(true);
      setIncomingOffer(offer);
      setCallerId(from);
      setCallerName(fromName);
    };

    // Обработка состояния "пользователь занят"
    const handleUserBusy = ({ userId }: { userId: string }) => {
      console.log(`Пользователь ${userId} занят в другом звонке`);
      alert(`Пользователь сейчас занят в другом звонке. Попробуйте позже.`);
      endCall(); // Завершаем наш звонок и очищаем ресурсы
    };

    // Обработка принятия звонка
    const handleCallAccepted = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          await applyPendingIceCandidates();
        } catch (error) {
          console.error('Ошибка при установке удаленного описания:', error);
        }
      } else {
        console.error('peerConnection не инициализирован при получении ответа');
      }
    };

    // Обработка отклонения звонка
    const handleCallDeclined = () => {
      console.log('Звонок отклонен');
      endCall();
    };

    // Обработка завершения звонка
    const handleCallEnded = () => {
      console.log('Звонок завершен другой стороной');
      endCall();
    };

    // Обработка ICE кандидатов
    const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Ошибка при добавлении ICE кандидата:', error);
        }
      } else {
        console.log(
          'peerConnection не инициализирован или remoteDescription не установлен, сохраняем кандидата в буфер',
        );
        pendingCandidatesRef.current.push(candidate);
      }
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-declined', handleCallDeclined);
    socket.on('call-ended', handleCallEnded);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('user-busy', handleUserBusy);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-declined', handleCallDeclined);
      socket.off('call-ended', handleCallEnded);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('user-busy', handleUserBusy);
    };
    // Добавляем endCall в зависимости, так как он используется в обработчиках
    // Добавляем isCallActive для проверки в handleIncomingCall
  }, [socket, currentUser, endCall, isCallActive, applyPendingIceCandidates]);

  // Эффект для очистки при размонтировании
  useEffect(() => {
    return () => {
      // Вызываем endCall при размонтировании, если был активен звонок или медиа/peer ресурсы
      if (isCallActive || localStreamRef.current || peerConnectionRef.current) {
        console.log('Компонент VideoCall размонтируется, вызываем endCall...');
        endCall();
      }
    };
  }, [endCall, isCallActive]); // Зависим от endCall и isCallActive

  return (
    <>
      {/* Кнопка инициации звонка */}
      <Button
        onClick={initiateCall}
        disabled={!selectedUser}
        className="px-6"
      >
        <VideoCameraIcon className="h-5 w-5" />
      </Button>

      {/* Уведомление о входящем звонке */}
      {isIncomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Входящий звонок от {callerName}</h3>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={acceptCall}
                className="bg-green-500 hover:bg-green-600"
              >
                Принять
              </Button>
              <Button
                onClick={declineCall}
                className="bg-red-500 hover:bg-red-600"
              >
                Отклонить
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Интерфейс активного звонка */}
      {isCallActive && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Видеозвонок с {selectedUser?.name}</h2>
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
                  {selectedUser?.name}
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
      )}
    </>
  );
};
