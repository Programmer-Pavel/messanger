import { ENV, isDevelopment } from '@shared/config/env';
import { io, Socket } from 'socket.io-client';

class SocketService {
  private static instance: Socket;
  private static isOffline: boolean = false;
  private static pendingMessages: Array<{ event: string; data: any }> = [];

  public static getInstance(): Socket {
    if (!SocketService.instance) {
      const development = isDevelopment();

      // Создаем экземпляр сокета
      // В разработке используем относительный путь для прокси
      // В продакшне используем полный URL API сервера
      SocketService.instance = development
        ? io({
            path: ENV.SOCKET_PATH,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
          })
        : io(ENV.API_URL, {
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
          });

      // Настройка обнаружения офлайн-режима
      SocketService.instance.on('connect_error', (error) => {
        SocketService.isOffline = true;
        console.log('Ошибка соединения сокета:', error.message);
        console.log('Приложение может быть офлайн');
      });

      SocketService.instance.on('connect', () => {
        console.log('Сокет успешно подключен');
        SocketService.isOffline = false;
        // Отправка отложенных сообщений при восстановлении соединения
        SocketService.sendPendingMessages();
      });
    }
    return SocketService.instance;
  }

  public static closeConnection(): void {
    if (SocketService.instance) {
      SocketService.instance.close();
      SocketService.instance = null as unknown as Socket;
    }
  }

  public static emit(event: string, data: any): void {
    if (SocketService.isOffline) {
      // Сохраняем сообщения для последующей отправки, если офлайн
      SocketService.pendingMessages.push({ event, data });
      return;
    }

    SocketService.getInstance().emit(event, data);
  }

  private static sendPendingMessages(): void {
    while (SocketService.pendingMessages.length > 0) {
      const msg = SocketService.pendingMessages.shift();
      if (msg) {
        SocketService.getInstance().emit(msg.event, msg.data);
      }
    }
  }
}
export const socket = SocketService.getInstance();
export const closeSocket = SocketService.closeConnection;
