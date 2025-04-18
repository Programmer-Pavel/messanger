import { create } from 'zustand';
import { User } from '@features/auth';

export interface CallState {
  // Состояние звонка
  isCallActive: boolean;
  isIncomingCall: boolean;
  callerName: string;
  callerId: string;
  incomingOffer: RTCSessionDescriptionInit | null;
  selectedUser: User | null;

  // WebRTC состояние
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  pendingCandidates: RTCIceCandidateInit[];

  // Методы для управления звонком
  setCallActive: (active: boolean) => void;
  setIncomingCall: (
    incoming: boolean,
    callerId?: string,
    callerName?: string,
    offer?: RTCSessionDescriptionInit | null,
  ) => void;
  setSelectedUser: (user: User | null) => void;

  // Методы для управления WebRTC
  initializeMedia: () => Promise<MediaStream | null>;
  createPeerConnection: (targetUserId: string | number) => RTCPeerConnection;
  applyPendingCandidates: () => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => void;
  cleanupResources: () => void;

  // Сброс состояния
  resetCallState: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  // Начальные значения состояния
  isCallActive: false,
  isIncomingCall: false,
  callerName: '',
  callerId: '',
  incomingOffer: null,
  selectedUser: null,

  // WebRTC состояние
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  pendingCandidates: [],

  // Методы управления звонком
  setCallActive: (active) => set({ isCallActive: active }),

  setIncomingCall: (incoming, callerId = '', callerName = '', offer = null) =>
    set((state) => ({
      isIncomingCall: incoming,
      callerId: incoming ? callerId : state.callerId,
      callerName: incoming ? callerName : state.callerName,
      incomingOffer: incoming ? offer : state.incomingOffer,
    })),

  setSelectedUser: (user) => set({ selectedUser: user }),

  // Методы для управления WebRTC
  initializeMedia: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      set({ localStream: stream });
      return stream;
    } catch (error) {
      console.error('Ошибка при доступе к медиа устройствам:', error);
      return null;
    }
  },

  createPeerConnection: () => {
    // Закрываем существующее соединение, если оно есть
    const currentPeerConnection = get().peerConnection;
    if (currentPeerConnection) {
      currentPeerConnection.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Добавляем локальные треки
    const { localStream } = get();
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // Обработка входящих треков
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        set({ remoteStream: event.streams[0] });
      }
    };

    // Логирование изменений состояния
    pc.oniceconnectionstatechange = () => {
      console.log('ICE состояние изменилось:', pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log('Состояние соединения изменилось:', pc.connectionState);
    };

    set({ peerConnection: pc });
    return pc;
  },

  applyPendingCandidates: async () => {
    const { peerConnection, pendingCandidates } = get();

    if (!peerConnection || !peerConnection.remoteDescription) {
      console.log('Невозможно применить ICE кандидаты: remoteDescription не установлен');
      return;
    }

    if (pendingCandidates.length > 0) {
      for (const candidate of pendingCandidates) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Ошибка при добавлении накопленного ICE кандидата:', error);
        }
      }

      set({ pendingCandidates: [] });
    }
  },

  addIceCandidate: (candidate) => {
    const { peerConnection } = get();

    if (peerConnection && peerConnection.remoteDescription) {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((err) => console.error('Ошибка при добавлении ICE кандидата:', err));
    } else {
      set((state) => ({
        pendingCandidates: [...state.pendingCandidates, candidate],
      }));
    }
  },

  cleanupResources: () => {
    const { localStream, peerConnection } = get();

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    set({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      pendingCandidates: [],
    });
  },

  // Сброс всего состояния
  resetCallState: () => {
    get().cleanupResources();

    set({
      isCallActive: false,
      isIncomingCall: false,
      callerName: '',
      callerId: '',
      incomingOffer: null,
      selectedUser: null,
    });
  },
}));
