import { create } from 'zustand';

export interface MessageNotification {
  fromUserId: string;
  messagePreview: string;
  roomId: string;
  timestamp: Date;
}

interface NotificationsState {
  notifications: MessageNotification[];
  addNotification: (notification: MessageNotification) => void;
  removeNotification: (notification: MessageNotification) => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  removeNotification: (notificationToRemove) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (n) =>
          !(
            n.roomId === notificationToRemove.roomId &&
            n.fromUserId === notificationToRemove.fromUserId &&
            n.timestamp === notificationToRemove.timestamp
          ),
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
