import { useEffect } from 'react';
import { useCallStore } from '../model/callStore';
import { useUserStore } from '@features/auth';
import { useAuthenticatedSocket } from '@features/socket';
import { IncomingCallModal } from './IncomingCallModal';
import { ActiveCallModal } from './ActiveCallModal';

export const GlobalCallHandler = () => {
  const socket = useAuthenticatedSocket();
  const user = useUserStore((state) => state.user);

  const {
    isCallActive,
    isIncomingCall,
    callerName,
    callerId,
    incomingOffer,
    peerConnection,
    setIncomingCall,
    addIceCandidate,
    resetCallState,
    applyPendingCandidates,
  } = useCallStore();

  useEffect(() => {
    if (!socket || !user?.id) return;

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
      setIncomingCall(true, from, fromName, offer);
    };

    // Обработка ICE кандидатов
    const handleIceCandidate = ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      addIceCandidate(candidate);
    };

    // Обработка принятия звонка
    const handleCallAccepted = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      console.log('Звонок принят, получен ответ');
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          await applyPendingCandidates();
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
      resetCallState();
    };

    // Обработка завершения звонка
    const handleCallEnded = () => {
      console.log('Звонок завершен другой стороной');
      resetCallState();
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-declined', handleCallDeclined);
    socket.on('call-ended', handleCallEnded);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-declined', handleCallDeclined);
      socket.off('call-ended', handleCallEnded);
    };
  }, [socket, user, peerConnection]);

  return (
    <>
      {isIncomingCall && !isCallActive && (
        <IncomingCallModal
          callerName={callerName}
          callerId={callerId}
          incomingOffer={incomingOffer}
        />
      )}

      {isCallActive && <ActiveCallModal />}
    </>
  );
};
