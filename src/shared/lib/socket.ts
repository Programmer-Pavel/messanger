import { io, Socket } from 'socket.io-client';

class SocketService {
  private static instance: Socket;

  public static getInstance(): Socket {
    if (!SocketService.instance) {
      SocketService.instance = io('http://localhost:3000');
    }
    return SocketService.instance;
  }

  public static closeConnection(): void {
    if (SocketService.instance) {
      SocketService.instance.close();
      SocketService.instance = null as unknown as Socket;
    }
  }
}

export const socket = SocketService.getInstance();
export const closeSocket = SocketService.closeConnection;
